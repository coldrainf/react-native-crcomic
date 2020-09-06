// import React from 'react'
// import {Text, View, StatusBar} from 'react-native'
// import { Icon } from 'react-native-elements'
// import { Router, Scene, Tabs } from 'react-native-router-flux'
// import {Provider, connect} from 'react-redux'
// import store from './store/'

// import Shelf from './view/shelf'
// import Search from './view/search'
// import All from './view/all'
// import Button from './component/button'
// import { Actions } from 'react-native-router-flux';

// const TabIcon = (props: any) => {
//   return (
//     <Button useForeground={true} onPress={()=>{Actions[props.navigation.state.key]()}} style={{flex:1,flexDirection:'row'}}>
//       <View style={{flex:1}}>
//         <Icon {...props.iconData} color={props.focused ? props.theme: '#555'}></Icon>
//         <Text style = {{ color: props.focused ? props.theme: '#555', fontSize: 10, marginLeft: 2 }}>{props.title}</Text>
//       </View>
//       </Button>

//   )
// }
// const ThemeTabIcon = connect((state: Theme) => ({theme: state.theme}))(TabIcon)


// const tabData = [
//   {
//     title: '书架',
//     iconData: { name:'book', type:'entypo' }
//   },
//   {
//     title: '发现',
//     iconData: { name:'find', type:'antdesign' }
//   },
// ]
// const CustomTabBar = (props: any) => {

//   return (
//     <View style={{flexDirection: 'row',borderTopColor: '#eee', borderTopWidth:1, height: 56 }}>
//       {
//         props.navigation.state.routes.map((element: any, index: number) => {
//           return(
//             <Button key={element.key} onPress={() => Actions[element.key]()}>
//               <View style={{flex:1, paddingTop: 8}}>
//                 <Icon {...tabData[index].iconData} color={props.navigation.state.index == index ? props.theme: '#555'}></Icon>
//                 <Text style = {{ color: props.navigation.state.index == index ? props.theme: '#555', fontSize: 11, textAlign: 'center' }}>{tabData[index].title}</Text>
//               </View>
//             </Button>
//           )
//         })
//       }
//     </View>
//   );
// }
// const ThemeTabBar = connect((state: Theme) => ({theme: state.theme}))(CustomTabBar)

// export default () => {
//   return (
//     <Provider store={ store }>
//       <StatusBar barStyle='light-content' backgroundColor='rgba(0,0,0,0)' translucent={true}></StatusBar>
//       <Router>
//         <Scene hideNavBar tabBarPosition="bottom">
//           <Tabs
//             key="tabbar"
//             swipeEnabled
//             wrap={false}
//             showLabel={false}
//             tabBarComponent={ThemeTabBar}
//           >
//             <Scene
//               key="shelf"
//               component={Shelf}
//               title="书架"
//               // icon={ThemeTabIcon}
//               iconData ={{ name:'book', type:'entypo' }}
//             />

//             <Scene
//               key="all"
//               component={All}
//               title="发现"
//               // icon={ThemeTabIcon}
//               iconData ={{ name:'find', type:'antdesign' }}
//             />
//           </Tabs>
//           <Scene key="search" component={Search} title="搜索" />
//         </Scene>
//       </Router>
//     </Provider>
//   )
// }