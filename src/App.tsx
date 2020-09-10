import 'react-native-gesture-handler'
import React, {useEffect} from 'react'
import { Text, View, BackHandler,ToastAndroid, Platform, StatusBar } from 'react-native'
import { Icon } from 'react-native-elements'
import { Provider, connect } from 'react-redux'
import { NavigationContainer, StackActions, CommonActions } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets, TransitionSpecs } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { enableScreens } from 'react-native-screens'
// enableScreens()

import store from './store/'

import Shelf from './view/shelf'
import Search from './view/search'
import All from './view/all'
import Button from './component/button'
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

const CustomTabBar = (props: any) => {
  return (
    <View style={{ flexDirection: 'row', borderTopColor: '#eee', borderTopWidth: 1, height: 50 }}>
      {
        props.state.routes.map((element: any, index: number) => (
            <Button key={element.key} onPress={()=>props.navigation.navigate(element.name)}>
              <View style={{ flex: 1, paddingTop: 4 }}>
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

const Root = (props: BaseProps) => {
  let lastBackPressed = 0
  let  onBackButtonPress = () => {
    if (props.navigation.isFocused()) {
      if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
        if(props.route.state) {
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
      return true; 
    }
  }

  useEffect(() => {
    let backHandler = BackHandler.addEventListener('hardwareBackPress',onBackButtonPress);
    return () => backHandler.remove()
  })
  
  return (
    <Tab.Navigator tabBar={props => <ThemeTabBar {...props} />} initialRouteName='Shelf'  >
      <Tab.Screen name="Shelf" component={Shelf} />
      <Tab.Screen name="All" component={All} />
    </Tab.Navigator>
  )
}

const Router = (props: BaseProps) => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerTitle:'', 
        headerStatusBarHeight: 0,
        headerStyle:{
          backgroundColor: props.theme
        },
        headerTintColor:'#fff',
        headerTitleStyle: {
          fontSize: 18
        },
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
      <Stack.Screen name="Root" component={Root} options={{animationEnabled:false}} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Item" component={Item} options={({ route }) => ({ headerShown:true,headerTitle: (route.params as any)?.name })} />
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