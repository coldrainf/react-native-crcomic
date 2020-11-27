import React from 'react'
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Dimensions
} from 'react-native'
import { Image } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { fromJS, is } from 'immutable'

import Button from './button'
import { connect } from 'react-redux'

const ListItem = (props: any) => {
    const item = props.item

    return (
        <View style={[styles.container, props.style]} >
            <Image
                source={{
                    uri: item.cover,
                    headers: { Referer: item.cover }
                }}
                style={styles.image}
                PlaceholderContent={<ActivityIndicator color={props.theme} size='large' />}
                placeholderStyle={styles.placeholderStyle}
                containerStyle={styles.imageContainer}
            />
            <Button
                onPress={() => props.navigation.navigate('Item', item)}
                hitSlop={{ bottom: 50 }}
            >
                <LinearGradient
                    colors={["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,.1)", "rgba(0,0,0,.6)"]}
                    style={styles.btn}
                >
                    <Text style={styles.origin}>{item.originName}</Text>
                </LinearGradient>
            </Button>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.lastChapter}>更新至：{item.lastChapterName}</Text>
        </View>
    )
}
export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(ListItem, (prevProps: any, nextProps: any) => is(fromJS(prevProps), fromJS(nextProps))))

const space = 10
const width = Dimensions.get('window').width / 3 - space * 2
const imageHeight = width * 4 / 3

const styles = StyleSheet.create({
    container: {
        width,
        marginVertical: 6,
        marginHorizontal: space
    },
    imageContainer: {
        borderRadius: 4,
        zIndex: 0,
    },
    image: {
        width,
        height: imageHeight,
    },
    placeholderStyle: {
        backgroundColor: '#ccc'
    },
    btn: {
        zIndex: 100,
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height: imageHeight
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