import React from 'react'
import { Text, View } from 'react-native'

interface Props {
    tabLabel: any,
    
}

export default (props: Props) => {

    return (
        <>
        <View style={{ flex:1 }}>
            <Text>这里是collection</Text>
        </View>
        </>
    )
}