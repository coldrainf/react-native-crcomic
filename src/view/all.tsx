import React from 'react'
import { Text, View } from 'react-native'

export default (props: { s: React.ReactNode }) => {

    return (
        <>
        <View style={{ backgroundColor: 'blue',flex:1 }}>
            <Text>这里是all</Text>
            <Text>{props.s}</Text>
        </View>
        </>
    )
}
