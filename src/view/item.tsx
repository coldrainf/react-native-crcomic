import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { Image } from 'react-native-elements'

import CustomButton from '../component/button'
import Loading from '../component/loading'
import api from '../../config/api'
import storage from '../storage'
import Top from '../component/top'
import Footer from '../component/item/footer'
import ChapterList from '../component/item/chapterList'
import { useFocusEffect } from '@react-navigation/native'

const Item = (props: BaseProps) => {
    const item = props.route.params
    let [data, setData] = useState(item as ItemData)
    let [loading, setLoading] = useState(true)
    let [history, setHistory] = useState(false as any)
    useEffect(() => {
        api(`/${item.originId}/item?id=${item.id}`).then((res: ItemRes) => {
            if(res.code != 0) return
            setLoading(false)
            setData(res.data)
            storage.load({ key: 'history', id: res.data.originId+'-'+res.data.id }).then(res => {
                if(res) setHistory(history=res)
            })
        })
    }, [])
    // useFocusEffect(React.useCallback(() => {
    //     StatusBar.setHidden(false)
    // }, []))
    return (
        <>
        <Top />
        {
            loading && <Loading />
        }
        {
            !loading && <View style={styles.flex}>
                <View style={[styles.headerContainer, { backgroundColor: props.theme }]}>
                    <Image
                        source={{ 
                            uri: data.cover,
                            headers: { Referer: data.cover } 
                        }} 
                        style={styles.image}
                        PlaceholderContent={<ActivityIndicator color={props.theme} size='large' />}
                        placeholderStyle={styles.placeholderStyle}
                        containerStyle={styles.imageContainer}
                    />
                    <View style={styles.detailContainer}>
                        <Text style={styles.text}>{data.originName}</Text>
                        <Text style={styles.text}>{data.author?.join(' ')}</Text>
                        <Text style={styles.text}>{data.type?.join(' ')}</Text>
                        <Text style={styles.text}>{data.area}</Text>
                        <Text style={styles.text} numberOfLines={6}>{data.desc}</Text>
                    </View>
                </View>
                <View style={[styles.headerBottom, { backgroundColor: props.theme}]}>
                    <Text style={styles.text}>{data.status}</Text>
                    <Text style={styles.text}>{data.updateTime}</Text>
                </View>
                <View style={styles.flex}>
                    {
                        typeof data.chapters != 'undefined' && <ChapterList item={item} data={data} navigation={props.navigation} history={history} />
                    }
                </View>
                <Footer item={item} data={data} navigation={props.navigation} history={history} />
            </View>

        }
        </>
    )
}

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(Item))

const styles = StyleSheet.create({
    white: {
       color: '#fff', 
    },
    flex: {
        flex: 1
    },
    flexRow: {
        flexDirection: 'row'
    },

    headerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 6,
        paddingTop: 8
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
    detailContainer: {
        flex:1,
        marginLeft: 14
    },
    text: {
        color: '#fff',
        marginBottom: 4
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        paddingVertical: 8,
    },
})