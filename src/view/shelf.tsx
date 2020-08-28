import React from 'react'
import { View, StyleSheet } from 'react-native'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'

import TabBar from '../component/tabbar'
import Collection from '../component/collection'
import History from '../component/history'


export default () => {
    return       <ScrollableTabView
    renderTabBar={() => (<TabBar
    // containerWidth={20}
    backgroundColor={'#f4f4f4'}
    tabUnderlineDefaultWidth={20} // default containerWidth / (numberOfTabs * 4)
    tabUnderlineScaleX={3} // default 3
    activeColor={"#0af"}
    inactiveColor={"#333"}
    style={{width:200,alignSelf:'center'}}
    />)}> 
        <Collection tabLabel='收藏'></Collection>
        <History tabLabel='历史'></History>
  </ScrollableTabView>;
}

const styles = StyleSheet.create({
  tabBar: {
    width: 100,
    alignSelf: 'center'
  },
  tabBarUnderline: {
    width: 30,
    height: 2,
    alignSelf: 'center'
    // justifyContent: 'cnt',
  }
})