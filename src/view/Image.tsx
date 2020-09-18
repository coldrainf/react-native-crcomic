import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet, BackHandler, StatusBar, Dimensions, ActivityIndicator, Pressable, GestureResponderEvent, Animated } from 'react-native'
import { connect } from 'react-redux'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Icon, Image, Slider } from 'react-native-elements'
import SystemSetting from 'react-native-system-setting'

import Top from '../component/top'
import Loading from '../component/loading'
import CustomButton from '../component/button'
import api from '../../config/api'
import { PanResponder } from 'react-native'
import { Switch } from 'react-native'

const ImageItem = (props: any) => {
  return (
      <Image
        source={{ 
          uri: props.source.uri,
          headers: { Referer: props.source.uri } 
        }} 
        PlaceholderContent={<ActivityIndicator color='#fff' size='large' />}
        placeholderStyle={styles.placeholderStyle}
        containerStyle={styles.imageContainer}
        resizeMode='contain'
      />
  );
}


const ImageView = (props: BaseProps) => {
  const item: ItemData = props.route.params.item
  const chapter: ItemBaseData = props.route.params.chapter
  
  let [data, setData] = useState({} as ImageData)
  let [loading, setLoading] = useState(true)
  let [page, setPage] = useState(0)
  useLayoutEffect(() => {
    api(`/${item.originId}/image?id=${item.id}&chapterId=${chapter.id}`).then((res: ImageRes) => {
        if(res.code) return
        setData(res.data)
        setLoading(false)
        
    })
  }, [])

  const hardwareBack = () => {
    StatusBar.setHidden(false)
    console.log(SystemSetting.restoreBrightness())
    SystemSetting.setAppBrightness(SystemSetting.restoreBrightness())
  }
  useEffect(() => {
    let backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      hardwareBack()
      return false
    })
    return () => backHandler.remove()
  })

  let [click, setClick] = useState(false)
  let [showMenu, setShowMenu] = useState(false)
  let [menuTop, setMenuTop] = useState(new Animated.Value(-50))
  let [menuBottom, setMenuBottom] = useState(new Animated.Value(100))
  const switchShowMenu = () => {
    Animated.timing(menuTop, {
      toValue: showMenu ? 0 : -50,
      duration: 200,
      useNativeDriver: true
    }).start()
    Animated.timing(menuBottom, {
      toValue: showMenu ? 0 : 100,
      duration: 200,
      useNativeDriver: true
    }).start()
  }
  const closeShowMenu = () => {
    if(!showMenu) return false
    setShowMenu(showMenu=false)
    switchShowMenu()
    return true
  }
  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: (evt, gestureState) => {
      let x = evt.nativeEvent.pageX
      setTimeout(() => {
        if(!click) return
        setClick(click=false)
        let percentX = x / Dimensions.get('window').width
        if(percentX <  1/3) {
          if(closeShowMenu()) return
          if(page == 0) return
          setPage(--page)
        }else if(percentX > 2/3) {
          if(closeShowMenu()) return
          if(page == data.images.length - 1) return
          setPage(++page)
        }else {
          setShowMenu(showMenu=!showMenu)
          switchShowMenu()
        }
      }, 90)
      return false
    },
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      closeShowMenu()
      return false
    },
  });
  
  let [brightness, setBrightness] = useState(0.7)
  let [defaultBrightness, setDefaultBrightness] = useState(true)
  useEffect(() => {
    SystemSetting.saveBrightness()
  }, [])
  const changeBrightness = (b: number) => {
    setBrightness(brightness=b)
  }
  return (
    <View style={{backgroundColor:'#000',flex:1}}>
      <Top hidden={true} />
        {
          loading && <Loading image />
        }
        {
          !loading && 
          <View style={styles.main}>
            <View style={styles.flex} {..._panResponder.panHandlers}>
                <ImageViewer
                  index={page}
                  onChange={index=>setTimeout(() => {
                    setPage(index as number)
                  }, 160)}
                  onClick={()=>setClick(click=true)}
                  pageAnimateTime={160}
                  saveToLocalByLongPress={false}
                  renderIndicator={()=><></>}
                  backgroundColor='#212121'
                  doubleClickInterval={0}
                  enablePreload={true}
                  renderImage={ImageItem}
                  style={styles.flex}
                  useNativeDriver={true}
                  imageUrls={data.images.map(url => ({
                      url: encodeURI(url),
                      width: Dimensions.get('window').width,
                      height: Dimensions.get('window').height,
                    }))
                  }
                />
            </View>      

            <Animated.View style={[styles.headerContainer, { transform: [{ translateY: menuTop }] } ]}>
              <Text style={styles.headerText} numberOfLines={1}>{chapter.name}</Text>
              <View style={styles.headerBackOuterContainer}>
                  <Pressable onPress={()=>{hardwareBack();props.navigation.goBack()}}>
                      <View style={styles.headerBackContainer} >
                          <Icon name='arrowleft' type='antdesign' color='#fff' size={30} />
                      </View>
                  </Pressable>
              </View>
            </Animated.View>

            <Animated.View style={[styles.menuContainer, { transform: [{ translateY: menuBottom }] } ]}>
              <View style={[styles.menuItem, styles.sliderContainer]}>
                <Slider
                  value={page}
                  onSlidingComplete={setPage}
                  maximumValue={data.images.length-1}
                  step={1}
                  minimumValue={0}
                  maximumTrackTintColor='#464950'
                  minimumTrackTintColor='#32aaff'
                  allowTouchTrack={true}
                  thumbTintColor='#32aaff'
                  thumbStyle={styles.thumbStyle}
                />
                <Pressable onPress={()=>props.navigation.goBack()}  style={styles.prevContainer} >
                    <View>
                      <Text style={styles.prevNextText}>上一话</Text>
                    </View>
                </Pressable>
                <Pressable onPress={()=>props.navigation.goBack()}  style={styles.nextContainer} >
                    <View>
                      <Text style={styles.prevNextText}>下一话</Text>
                    </View>
                </Pressable>
              </View>
              <View style={[styles.menuItem, styles.flexRow]}>
                <View style={styles.flexRow}>
                  <View style={{ height: 30 }}>
                    <Text style={[styles.text, { lineHeight: 30 }]}>使用系统亮度</Text>
                  </View>
                  <Switch
                    trackColor={{ false: "#fff", true: props.theme }}
                    thumbColor={defaultBrightness ? props.theme : "#ccc"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={setDefaultBrightness}
                    value={defaultBrightness}
                  />
                </View>
                <View style={[styles.flex, styles.sliderContainer, { justifyContent: 'center', position: 'relative' }]}>
                  <Slider
                    value={brightness}
                    onSlidingComplete={changeBrightness}
                    onValueChange={SystemSetting.setAppBrightness}
                    maximumValue={1}
                    step={0.01}
                    minimumValue={0}
                    maximumTrackTintColor='#464950'
                    minimumTrackTintColor='#32aaff'
                    allowTouchTrack={true}
                    thumbTintColor='#32aaff'
                    thumbStyle={styles.thumbStyle}
                  />
                  <View>
                    {/* <Icon /> */}
                  </View>
                </View>
              </View>
            </Animated.View>

          </View>
        }
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  flexRow: {
    flexDirection: 'row'
  },
  flexCenter: {
    justifyContent: 'center'
  },
  text: {
    color: '#fff',
    textAlign: 'center'
  },
  imageContainer: {
    flex: 1,
  },
  placeholderStyle: {
    flex: 1,
    backgroundColor: '#212121'
  },
  main: {
    backgroundColor:'#212121',
    flex:1,
    position: 'relative',
    paddingTop: StatusBar.currentHeight
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 50,
    backgroundColor: '#1e202c',
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
  headerText: {
    fontSize: 18,
    color: '#fff'
  },
  headerBackOuterContainer: {
      position:'absolute',
      left: 6,
      bottom:0,
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: 'hidden'
  },
  headerBackContainer: {
      width: 50,
      height: 50,
      // backgroundColor:'#000',
      justifyContent: 'center'
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#1e202c',
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  menuItem: {
    height: 30,
    justifyContent: 'center',
    // backgroundColor: '#aaa',
    position: 'relative',
    marginVertical: 5
  },
  sliderContainer: {
    paddingHorizontal: 70,
  },
  thumbStyle: {
    width:  14,
    height: 14
  },
  prevContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 30,
    justifyContent: 'center',
  },
  nextContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 30,
    justifyContent: 'center',
  },
  prevNextText: {
    color: '#fff',
    textAlign: 'center',
  },
  pressArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0,0,0,.5)'
  }
})

export default connect((state: BaseProps) => ({ theme: state.theme }))(ImageView)