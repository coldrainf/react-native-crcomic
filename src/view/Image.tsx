import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, BackHandler, StatusBar, ActivityIndicator,Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { Image } from 'react-native-elements'
import Carousel from 'react-native-snap-carousel'
import ImageViewer from 'react-native-image-zoom-viewer'

import Top from '../component/top'
import api from '../../config/api'

const windowWidth = Dimensions.get('window').width

const ImageItem = (props: any) => {
  console.log(props.source.uri)
  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ 
          uri: props.source.uri,
          headers: { Referer: props.source.uri } 
        }} 
        style={styles.image}
        width={windowWidth}
        PlaceholderContent={<ActivityIndicator color='#fff' size='large' />}
        placeholderStyle={styles.placeholderStyle}
        containerStyle={styles.imageContainer}
        resizeMode='contain'
      />
    </View>
  );
}

const ImageView = (props: BaseProps) => {
  const item: ItemData = props.route.params.item
  const chapter: ItemBaseData = props.route.params.chapter
  
  let [data, setData] = useState({} as ImageData)
  let [loading, setLoading] = useState(true)
  let [page, setPage] = useState(0)
  useEffect(() => {
    api(`/${item.originId}/image?id=${item.id}&chapterId=${chapter.id}`).then((res: ImageRes) => {
        if(res.code) return
        setLoading(false)
        setData(res.data)
        // console.log(res.data.images[0])
        
    })
  }, [])
  let onBackButtonPress = () => {
    StatusBar.setHidden(false)
    return false
  }
  
  useEffect(() => {
    let backHandler = BackHandler.addEventListener('hardwareBackPress',onBackButtonPress);
    return () => backHandler.remove()
  })
  return (
    <View style={{backgroundColor:'#000',flex:1, zIndex: 1000}}>
      <Top hidden={true} />
      <View style={{backgroundColor:'#000',flex:1}}>
      {
        !!data.images && 
        <ImageViewer 
          renderImage={ImageItem}
          failImageSource={{
            url: 'https://user-images.githubusercontent.com/5962998/48658581-f4170a00-ea1a-11e8-866c-df4f42f21947.gif' 
          }}
          imageUrls={data.images.map(url => ({
            url: encodeURI(url),
            props: {
              headers: { Referer: encodeURI(url) } 
            }
          }))}
        />
      }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  imageContainer: {
    width: windowWidth,
    flex: 1,
    flexDirection: 'row',
  },
  placeholderStyle: {
    flex: 1,
    backgroundColor: '#000'
  },
  image: {
    // flex: 1
    
  }
})

export default connect((state: BaseProps) => ({ theme: state.theme }))(ImageView)