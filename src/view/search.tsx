import React from 'react'
import { Text, View, StatusBar } from 'react-native'
import { connect } from 'react-redux'

import Top from '../component/top'

const Search = (props: BaseProps) => {

    return (
        <>
        <Top />
        <View style={{ backgroundColor: props.theme,flex:1 }}>
            <Text>这里是all</Text>
        </View>
        </>
    )
}

export default connect((state: BaseProps) => ({ theme: state.theme }))(Search)