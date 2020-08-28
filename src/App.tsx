import React from 'react'
import {Text, View} from 'react-native'
import { Icon } from 'react-native-elements'
import { Router, Scene, Tabs } from 'react-native-router-flux'

import Shelf from './view/shelf'
import Search from './view/search'
import All from './view/all'



const TabIcon = ({ title, focused, iconData }: any) => {
  return (
    <View>
      <Icon {...iconData} color={focused ? '#0366d6': '#555'}></Icon>
      <Text style = {{ color: focused ? '#0366d6': '#555', fontSize: 10 }}>{title}</Text>
    </View>
    
  );
};

export default () => {
  return (<Router>
    <Scene hideNavBar tabBarPosition="bottom">
      <Tabs
        key="tabbar"
        swipeEnabled
        wrap={false}
        showLabel={false}
      >
        <Scene
          key="shelf"
          component={Shelf}
          title="书架"
          icon={TabIcon}
          iconData ={{ name:'book', type:'entypo' }}
        />

        <Scene
          key="all"
          component={All}
          title="发现"
          icon={TabIcon}
          iconData ={{ name:'find', type:'antdesign' }}
        />
      </Tabs>
      <Scene key="search" component={Search} title="搜索" />
    </Scene>

  </Router>)
}