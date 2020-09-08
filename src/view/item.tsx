import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { Icon, Image } from 'react-native-elements'

import CustomButton from '../component/button'
import Loading from '../component/loading'
import api from '../../config/api'

const chapterItem = (props: any) => {
    return (
        <View>
            <Text>{props.item.name}</Text>
        </View>
    )
}

const Item = (props: BaseProps) => {
    const item = props.route.params
    let [data, setData] = useState(item)
    let [loading, setLoading] = useState(true)
    useEffect(() => {
        api(`/${item.originId}/item?id=${item.id}`).then(res => {
            if(res.code != 0) return
            setLoading(false)
            setData(res.data)
        })
    }, [])

    let [select, setSelect] = useState(0)
    return (
        <>
        {
            loading && <Loading />
        }
        {
            !loading && <View>
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
                        <Text style={styles.detail}>{data.originName}</Text>
                        <Text style={styles.detail}>{data.author?.join(' ')}</Text>
                        <Text style={styles.detail}>{data.type?.join(' ')}</Text>
                        <Text style={styles.detail}>{data.area}</Text>
                        <Text style={styles.detail} numberOfLines={6}>{data.desc}</Text>
                    </View>
                </View>
                <View style={[styles.headerBottom, { backgroundColor: props.theme }]}>
                    <Text style={styles.detail}>{data.status}</Text>
                    <Text style={styles.detail}>{data.updateTime}</Text>
                </View>
                <View style={[styles.headerBottom, { backgroundColor: props.theme }]}>
                    <View>
                        {
                            data?.chapters?.map((c: any, i: number) => (
                                <View key={i}>
                                    <Text>{c.title}</Text>
                                </View>
                            ))
                        }
                    </View>
                    <View>
                        <Text>正序</Text>
                    </View>
                </View>
                {/* <FlatList
                        refreshing={true}
                        data={list}
                        renderItem={itemProps => <Item {...itemProps} navigation={props.navigation} />}
                        keyExtractor={(item, k) => k.toString()}
                        horizontal={false}
                        numColumns={3}
                        showsVerticalScrollIndicator = {false}
                        onEndReached={onEndReached}
                        ListFooterComponent={<>
                            {
                                last && <View style={styles.footer}>
                                    <Text>没有更多啦~</Text>
                                </View>
                            }
                            {
                                footerRefreshing && <View style={styles.footer}>
                                    <ActivityIndicator
                                        animating={true}
                                        color={props.theme}
                                        size="small"
                                    />
                                </View>
                            }
                        </>}
                    /> */}
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
    marginB: {
        marginBottom: 4,
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
    detail: {
        color: '#fff',
        marginBottom: 4
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        paddingVertical: 4
    },
    chapterHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4
    }
})