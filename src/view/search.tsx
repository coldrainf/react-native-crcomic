import React from 'react'
import { Text, View } from 'react-native'

import Top from '../component/top'

export default () => {

    return (
        <>
        <Top></Top>
        <View style={{ backgroundColor: 'red',flex:1 }}>
            <Text>这里是all</Text>
        </View>
        </>
    )
}
