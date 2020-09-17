import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet, BackHandler, StatusBar, Dimensions, ActivityIndicator, Pressable,TouchableNativeFeedback, GestureResponderEvent } from 'react-native'
import { connect } from 'react-redux'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Icon, Image, Slider } from 'react-native-elements'

import Top from '../component/top'
import Loading from '../component/loading'
import CustomButton from '../component/button'
import api from '../../config/api'

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
        // console.log(res.data.images[0])
        
    })
  }, [])

  useEffect(() => {
    let backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      StatusBar.setHidden(false)
      return false
    })
    return () => backHandler.remove()
  })


  let onPress = (e: GestureResponderEvent) => {
    let touchPointX = e.nativeEvent.pageX
    console.log(touchPointX)
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
            <CustomButton onPress={onPress}>
              <View style={{width: 300,height: 700,backgroundColor: '#fff'}}>
                <ImageViewer
                  index={page}
                  onChange={index=>setTimeout(() => {
                    setPage(index as number)
                  }, 160)}
                  pageAnimateTime={160}
                  saveToLocalByLongPress={false}
                  renderIndicator={()=><></>}
                  backgroundColor='#212121'
                  doubleClickInterval={200}
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

            </CustomButton>      

            <View style={styles.headerContainer}>
              <Text style={styles.headerText} numberOfLines={1}>{chapter.name}</Text>
              <View style={styles.headerBackOuterContainer}>
                  <Pressable onPress={()=>props.navigation.goBack()}>
                      <View style={styles.headerBackContainer} >
                          <Icon name='arrowleft' type='antdesign' color='#fff' size={30} />
                      </View>
                  </Pressable>
              </View>
            </View>

            <View style={styles.menuContainer}>
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
            </View>

          </View>
        }
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
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
    position: 'relative'
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