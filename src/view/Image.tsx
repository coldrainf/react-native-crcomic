import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, BackHandler, StatusBar, Dimensions, ActivityIndicator, Pressable, GestureResponderEvent, Animated } from 'react-native'
import { connect } from 'react-redux'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Icon, Image, Slider } from 'react-native-elements'
import SystemSetting from 'react-native-system-setting'

import Top from '../component/top'
import Loading from '../component/loading'
import CustomButton from '../component/button'
import api from '../../config/api'
import { PanResponder, Image as RNImage } from 'react-native'
import { Switch } from 'react-native'
import storage from '../storage'
import { useRef } from 'react'

import NetInfo from "@react-native-community/netinfo"

const ImageItem = React.memo((props: any) => {
  let [imageHeight, setImageHeight] = useState(Dimensions.get('window').width/891*1280)
  const uri = props.item ? encodeURI(props.item) : props.source.uri
  RNImage.getSizeWithHeaders(uri, {Referer: uri}, (width, height) => {
    setImageHeight(Dimensions.get('window').width/width*height)
  })
  return (
      <Image
        source={{ 
          uri,
          headers: { Referer: uri } 
        }} 
        PlaceholderContent={<ActivityIndicator color='#fff' size='large' />}
        placeholderStyle={styles.placeholderStyle}
        containerStyle={[styles.imageContainer, { height: imageHeight }]}
        resizeMode='contain'
      />
  );
})

const RenderImageItem = (props: any) => <ImageItem {...props} />

const LongList = React.memo((props: any) => {
  let listRef = useRef(null as any)
  const onViewableItemsChanged = (info: any) => {
    let p = info?.viewableItems?.pop()?.index
    if(!p) return
    props.setPage(p)
  }
  useEffect(() => {
    
    setTimeout(() => {
      if(!listRef?.current?.scrollToIndex) return
      listRef.current.scrollToIndex({ index: props.page })
    }, 0)
  }, [props.image])
  return (
    <FlatList
      ref={listRef}
      data={props.images}
      renderItem={RenderImageItem}
      keyExtractor={(item, k) => item.toString()}
      showsVerticalScrollIndicator = {false}
      getItemLayout={(item, index) => ({ length: Dimensions.get('window').width/891*1280, offset: Dimensions.get('window').width/891*1280*index, index  })}
      onViewableItemsChanged={onViewableItemsChanged}
      onTouchStart={props.onTouchStart}
      onTouchMove={props.onTouchMove}
      onTouchEnd={props.onTouchEnd}
    />
  )
}, (prevProps: any, nextProps: any) => prevProps.images === nextProps.images)



const ImageView = (props: BaseProps) => {
  const item: ItemData = props.route.params.item
  const chapter: ItemBaseData = props.route.params.chapter
  const defaultPage: number = props.route.params.page ? props.route.params.page : 0

  let [data, setData] = useState({} as ImageData)
  let [loading, setLoading] = useState(true)
  let [page, setPage] = useState(defaultPage)
  useLayoutEffect(() => {
    api(`/${item.originId}/image?id=${item.id}&chapterId=${chapter.id}`).then((res: ImageRes) => {
        if(res.code) return
        setData(res.data)
        setLoading(false)
        
    })
  }, [])

  //记录历史
  useEffect(() => {
    storage.save({
      key: 'history',
      id: item.originId+'-'+item.id,
      data: {
        id: item.id,
        name: item.name,
        cover: item.cover,
        originId: item.originId,
        originName: item.originName,
        chapter,
        page,
        time: Date.now()
      },
    }).then()
  }, [page])


  const hardwareBack = () => {
    StatusBar.setHidden(false)
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
  const bottomHeight = 40 + 40 * 3
  let [menuBottom, setMenuBottom] = useState(new Animated.Value(bottomHeight))
  const switchShowMenu = () => {
    Animated.timing(menuTop, {
      toValue: showMenu ? 0 : -50,
      duration: 200,
      useNativeDriver: true
    }).start()
    Animated.timing(menuBottom, {
      toValue: showMenu ? 0 : bottomHeight,
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
      if(upDown) return false
      let x = evt.nativeEvent.pageX
      const touchFunc = () => {
        if(!click) return
        setClick(click=false)
        let percentX = x / Dimensions.get('window').width
        if(percentX <  1/3 && !upDown) {
          if(closeShowMenu()) return
          if(page == 0) return
          setPage(--page)
        }else if(percentX > 2/3 && !upDown) {
          if(closeShowMenu()) return
          if(page == data.images.length - 1) return
          setPage(++page)
        }else {
          setShowMenu(showMenu=!showMenu)
          switchShowMenu()
        }
      }
      setTimeout(touchFunc, 80)
      return false
    },
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      if(!upDown) closeShowMenu()
      return false
    },
  });
  
  let [brightness, setBrightness] = useState(0.7)
  let [defaultBrightness, setDefaultBrightness] = useState(true)
  useEffect(() => {
    SystemSetting.saveBrightness()
  }, [])
  const changeBrightness = (b: number) => {
    SystemSetting.setAppBrightness(b)
    if(defaultBrightness) setDefaultBrightness(false)
  }
  const changeDefaultBrightness = (v: boolean) => {
    setDefaultBrightness(defaultBrightness=v)
    let b = v ? SystemSetting.restoreBrightness() : brightness
    SystemSetting.setAppBrightness(brightness=b)
  }

  let [upDown, setUpDown] = useState(false)

  const onTouchEnd = () => {
    if(!click) return
    setClick(click=false)
    setShowMenu(showMenu=!showMenu)
    switchShowMenu()
  }

  let [net, setNet] = useState('')
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if(!state.isConnected) setNet(net='')
      else setNet(net=state.type)
      console.log(state.isInternetReachable);
      return unsubscribe
    })
  })

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
              {
                upDown && <LongList 
                  images={data.images} 
                  page={page} 
                  setPage={setPage}
                  onTouchStart={()=>setClick(click=true)}
                  onTouchMove={()=>{setClick(click=false);closeShowMenu()}}
                  onTouchEnd={onTouchEnd}
                />
              }
              {
                !upDown && <ImageViewer
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
                  renderImage={RenderImageItem}
                  style={styles.flex}
                  useNativeDriver={true}
                  imageUrls={data.images.map(url => ({
                      url: encodeURI(url),
                      width: Dimensions.get('window').width,
                      height: Dimensions.get('window').height,
                    }))
                  }
                />
              }
            </View>

            <View style={styles.infoContainer}>
              <Text>{chapter.name}</Text>
              <Text>{page+1+'/'+data?.images.length}</Text>
              <Text>{net}</Text>
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
                <Pressable onPress={()=>props.navigation.goBack()} style={styles.prevContainer} >
                    <View>
                      <Text style={styles.prevNextText}>上一话</Text>
                    </View>
                </Pressable>
                <Pressable onPress={()=>props.navigation.goBack()} style={styles.nextContainer} >
                    <View>
                      <Text style={styles.prevNextText}>下一话</Text>
                    </View>
                </Pressable>
              </View>
              <View style={styles.menuItem}>
                <View style={styles.flexRow}>
                  <View style={{ height: 30 }}>
                    <Text style={[styles.text, { lineHeight: 30 }]}>使用系统亮度</Text>
                  </View>
                  <Switch
                    trackColor={{ false: "#fff", true: props.theme }}
                    thumbColor={defaultBrightness ? props.theme : "#ccc"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={changeDefaultBrightness}
                    value={defaultBrightness}
                  />
                </View>
                <View style={[styles.flex, styles.brightnessSliderContainer]}>
                  <Slider
                    value={brightness}
                    onSlidingComplete={setBrightness}
                    onValueChange={changeBrightness}
                    maximumValue={1}
                    step={0.01}
                    minimumValue={0}
                    maximumTrackTintColor='#464950'
                    minimumTrackTintColor='#32aaff'
                    allowTouchTrack={true}
                    thumbTintColor='#32aaff'
                    thumbStyle={styles.thumbStyle}
                    disabled={defaultBrightness}
                  />
                  <View style={styles.prevContainer}>
                    <Icon name='moon-o' type='font-awesome' color='#fff' size={18} />
                  </View>
                  <View style={styles.nextContainer}>
                    <Icon name='sun' type='feather' color='#fff' size={18} />
                  </View>
                </View>
              </View>
              <View style={styles.menuItem}>
                <View style={styles.menuItemLeftContainer}>
                  <Text style={styles.menuItemLeftText}>阅读模式</Text>
                </View>
                <View style={styles.flexRow}>
                  <CustomButton onPress={()=>setUpDown(false)}>
                    <View style={[styles.menuItemRightContainer, { borderColor: upDown ? '#fff' : '#2196F3' } ]}>
                      <Text style={[styles.menuItemRightText, { color: upDown ? '#fff' : '#2196F3' } ]}>翻页模式</Text>
                    </View>
                  </CustomButton>
                  <CustomButton onPress={()=>setUpDown(true)}>
                    <View style={[styles.menuItemRightContainer, { borderColor: !upDown ? '#fff' : '#2196F3' } ]}>
                      <Text style={[styles.menuItemRightText, { color: !upDown ? '#fff' : '#2196F3' } ]}>滚动模式</Text>
                    </View>
                  </CustomButton>
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
    // height: 600
  },
  placeholderStyle: {
    flex: 1,
    backgroundColor: '#212121'
  },
  main: {
    backgroundColor:'#212121',
    flex:1,
    position: 'relative',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 30,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    flexDirection: 'row'
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
    justifyContent: 'space-between',
    // backgroundColor: '#aaa',
    position: 'relative',
    marginVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row'
  },
  sliderContainer: {
    flexDirection: 'column',
    paddingHorizontal: 80,
  },
  brightnessSliderContainer: {
    paddingHorizontal: 50,
    justifyContent: 'center',
    position: 'relative'
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
  menuItemLeftContainer: {
    height: 30,
    justifyContent: 'center',
  },
  menuItemLeftText: {
    color: '#fff',
  },
  menuItemRightContainer: {
    marginHorizontal: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#fff',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuItemRightText: {
    fontSize: 12,
    color: '#fff'
  }
})

export default connect((state: BaseProps) => ({ theme: state.theme }))(ImageView)