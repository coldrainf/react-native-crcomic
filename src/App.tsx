import 'react-native-gesture-handler'
import React from 'react'
import { Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { Provider, connect } from 'react-redux'
import { NavigationContainer, StackActions,TabActions } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { enableScreens } from 'react-native-screens'
// enableScreens()

import store from './store/'

import Shelf from './view/shelf'
import Search from './view/search'
import All from './view/all'
import Button from './component/button'
import Top from './component/top'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const tabData = [
  {
    title: '书架',
    iconData: { name: 'book', type: 'entypo' }
  },
  {
    title: '发现',
    iconData: { name: 'find', type: 'antdesign' }
  },
]

const CustomTabBar = (props: any) => {
  return (
    <View style={{ flexDirection: 'row', borderTopColor: '#eee', borderTopWidth: 1, height: 56 }}>
      {
        props.state.routes.map((element: any, index: number) => (
            <Button key={element.key} onPress={()=>props.navigation.navigate(element.name)}>
              <View style={{ flex: 1, paddingTop: 8 }}>
                <Icon {...tabData[index].iconData} color={props.state.index == index ? props.theme : '#555'}></Icon>
                <Text style={{ color: props.state.index == index ? props.theme : '#555', fontSize: 11, textAlign: 'center' }}>{tabData[index].title}</Text>
              </View>
            </Button>
          )
        )
      }
    </View>
  );
}
const ThemeTabBar = connect((state: BaseProps) => ({ theme: state.theme }))(CustomTabBar)

const Root = () => (
  <Tab.Navigator tabBar={props => <ThemeTabBar {...props} />} initialRouteName='All'  >
    <Tab.Screen name="Shelf" component={Shelf} />
    <Tab.Screen name="All" component={All} />
  </Tab.Navigator>
)

export default () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Root"
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        >
          <Stack.Screen name="Root" component={Root} />
          <Stack.Screen name="Search" component={Search} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}