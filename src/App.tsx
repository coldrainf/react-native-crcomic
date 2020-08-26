import React from 'react';
import { Text } from 'react-native'
import { Router, Stack, Scene, Tabs } from 'react-native-router-flux'

import Home from './view/home'
import All from './view/all'
import Search from './view/search'
const TabIcon = ({focused , title}) => {
    return (
      <Text style={{color: focused  ? 'blue' : 'black'}}>{title}</Text>
    );
  };
export default () => {
    return(<Router>
        {/*tabBarPosition设置tab是在top还是bottom */}
        <Scene hideNavBar tabBarPosition="bottom">
          <Tabs
            key="tabbar"
            swipeEnabled={true}
            // wrap={false}
            // 是否显示标签栏文字
            showLabel={false}
            tabBarStyle={{backgroundColor: "#eee"}}
            //tab选中的颜色
            activeBackgroundColor="white"
            //tab没选中的颜色
            inactiveBackgroundColor="black"
          >
            <Scene
              key="one"
              icon={TabIcon}
              component={Home}
              title="PageOne"
            />
     
            <Scene
              key="two"
              component={All}
              title="PageTwo"
              icon={TabIcon}
            />
     
            <Scene
              key="three"
              component={Search}
              title="PageThree"
              icon={TabIcon}
            />
          </Tabs>
        </Scene>
      </Router>)
}