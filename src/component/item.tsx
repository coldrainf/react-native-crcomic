import React, { Props } from 'react'
import { View, Text,ActivityIndicator, StyleSheet} from 'react-native'
import { Image } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { fromJS, is } from 'immutable'

import Button from '../component/button'

const Item = (props: any) => {
    let index = props.index
    let item = props.item

    return (<View style={[styles.container, props.style]} >
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
export default React.memo(Item, (prevProps: any, nextProps: any) => is(fromJS(prevProps), fromJS(nextProps)))

const styles = StyleSheet.create({
    container: {
        width: 111,
        marginVertical: 10
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
        backgroundColor: '#ccc'
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
        fontSize: 13,
    },
    lastChapter: {
        fontSize: 11,
        color: '#444'
    },
    origin: {
        position: 'absolute',
        bottom: 6,
        left: 8,
        fontSize: 10,
        color: '#fff'
    }
})