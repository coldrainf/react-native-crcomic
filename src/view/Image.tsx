import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, BackHandler, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import Swiper from 'react-native-swiper'

import Top from '../component/top'
import api from '../../config/api'
import { useFocusEffect } from '@react-navigation/native'

const Image = (props: BaseProps) => {
    const item: ItemData = props.route.params.item
    const chapter: ItemBaseData = props.route.params.chapter
    
    let [data, setData] = useState({} as ImageData)
    let [loading, setLoading] = useState(true)
  //   useEffect(() => {
  //     api(`/${item.originId}/image?id=${item.id}&chapterId=${chapter.id}`).then((res: ImageRes) => {
          
  //         if(res.code) return
  //         setLoading(false)
  //         setData(res.data)
          
  //     })
  // }, [])
  let onBackButtonPress = () => {
    StatusBar.setHidden(false)
    return false
  }
  useEffect(() => {
    let backHandler = BackHandler.addEventListener('hardwareBackPress',onBackButtonPress);
    return () => backHandler.remove()
  })
  return (
    <>
    <Top hidden={true} />
      <View style={{backgroundColor:'#000',flex:1}}>
        {/* <Text>{chapter.name}</Text> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  text: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold'
  }
})

export default connect((state: BaseProps) => ({ theme: state.theme }))(Image)