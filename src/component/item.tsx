import React from 'react'
import { View, Text,ActivityIndicator, StyleSheet,UIManager,findNodeHandle } from 'react-native'
import { Image } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'

import Button from '../component/button'

const Item = (props: any) => {
    let index = props.index,
        item = props.item

    return (<View style={styles.container} >
        <Image
            source={{ 
                uri: item.cover, 
                headers: { Referer: item.cover } 
            }} 
            style={styles.image}
            PlaceholderContent={<ActivityIndicator color='#2196F3' size='large' />}
            placeholderStyle={styles.placeholderStyle}
            containerStyle={styles.imageContainer}
        >
        </Image>
        <Button onPress={()=>{}} hitSlop={{bottom: 50}}>
            <LinearGradient colors={["rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,0)","rgba(0,0,0,.1)","rgba(0,0,0,.6)"]} style={styles.btn}>
                <Text style={styles.origin}>{item.originName}</Text>
            </LinearGradient>
        </Button>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastChapter}>更新至：{item.lastChapterName}</Text>
    </View>)
}
export default Item

const styles = StyleSheet.create({
    container: {
        width: 111,
        marginVertical: 10,
    },
    imageContainer: {
        borderRadius: 4,
        zIndex: 0,
    },
    image: {
        width: 111,
        height: 148,
    },
    placeholderStyle: {
        backgroundColor: '#eee'
    },
    btn: {
        zIndex: 100,
        position: 'absolute',
        top:0,
        left:0, 
        width: 111, 
        height: 148
    },
    name: {
        fontSize: 13
    },
    lastChapter: {
        fontSize: 12,
        color: '#777'
    },
    origin: {
        position: 'absolute',
        bottom: 6,
        left: 8,
        fontSize: 10,
        color: '#fff'
    }
})