import React, { useEffect } from 'react'
import {
  Text,
  View,
  BackHandler,
  ToastAndroid
} from 'react-native'
import { Icon } from 'react-native-elements'
import { Provider, connect } from 'react-redux'
import { NavigationContainer, CommonActions } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets, TransitionSpecs } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { enableScreens } from 'react-native-screens'
// enableScreens()

import store from './store/'
import Button from './component/button'
import Shelf from './view/shelf'
import Search from './view/search'
import All from './view/all'
import Item from './view/item'
import Image from './view/Image'

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

//自定义tabbar
const CustomTabBar = (props: BaseProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderTopColor: '#eee',
        borderTopWidth: 1,
        height: 50
      }}
    >
      {
        props.state.routes.map((element: any, index: number) => (
          <Button key={element.key} onPress={() => props.navigation.navigate(element.name)}>
            <View style={{ flex: 1, paddingTop: 4 }}>
              <Icon
                color={props.state.index == index ? props.theme : '#555'}
                {...tabData[index].iconData}
              >
              </Icon>
              <Text
                style={{
                  color: props.state.index == index ? props.theme : '#555',
                  fontSize: 11,
                  textAlign: 'center'
                }}
              >
                {tabData[index].title}
              </Text>
            </View>
          </Button>
        ))
      }
    </View>
  );
}
const ThemeTabBar = connect((state: BaseProps) => ({ theme: state.theme }))(CustomTabBar)

//初始页
const Root = (props: BaseProps) => {
  //返回两次才退出
  let lastBackPressed = 0
  const onBackButtonPress = () => {
    if(!props.navigation.isFocused()) return false
    if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
      if (props.route.state) {
        props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              props.route.state.routes.pop(),
            ],
          })
        )
      }
      return false
    }

    lastBackPressed = Date.now()
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT)
    return true
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackButtonPress);
    return () => backHandler.remove()
  })

  return (
    <Tab.Navigator tabBar={props => <ThemeTabBar {...props} />} initialRouteName='All'  >
      <Tab.Screen name="Shelf" component={Shelf} />
      <Tab.Screen name="All" component={All} />
    </Tab.Navigator>
  )
}

//总路由
const Router = (props: BaseProps) => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerTitle: '',
        headerStyle: {
          backgroundColor: props.theme
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize: 18
        },
        ...TransitionPresets.SlideFromRightIOS,
        transitionSpec: {
          open: TransitionSpecs.FadeInFromBottomAndroidSpec,
          close: TransitionSpecs.FadeInFromBottomAndroidSpec
        }
      }}
    >
      <Stack.Screen name="Root" component={Root} options={{ animationEnabled: false }} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Item" component={Item} />
      <Stack.Screen name="Image" component={Image} />
    </Stack.Navigator>
  </NavigationContainer>
)
const ThemeRouter = connect((state: BaseProps) => ({ theme: state.theme }))(Router)

export default () => {
  return (
    <Provider store={store}>
      <ThemeRouter />
    </Provider>
  )
}