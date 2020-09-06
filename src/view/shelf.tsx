import React from 'react'
import { View, StyleSheet } from 'react-native'
import TabView from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'

import TabBar from '../component/tabBar'
import Collection from '../component/collection'
import History from '../component/history'
import Top from '../component/top'


const Shelf = (props: BaseProps) => {
  return (
    <>
      <Top />
      <TabView renderTabBar={props1 => (
        <View style={{backgroundColor: props.theme}}>
          <TabBar {...props1} tabUnderlineDefaultWidth={20} activeColor={"#fff"} inactiveColor={"#eee"} style={{ ...styles.tabBar, backgroundColor: props.theme }} />
        </View>
      )}>
        <Collection tabLabel='收藏' />
        <History tabLabel='历史' />
      </TabView>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    width: 200,
    alignSelf: 'center',
    borderWidth: 0
  }
})

export default connect((state: BaseProps) => ({ theme: state.theme }))(Shelf)