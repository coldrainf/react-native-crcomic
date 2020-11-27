/**
 * 漫画详情页
 */
import React, { useState, useLayoutEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import { Icon, Image } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'

import api from '../../config/api'
import storage from '../storage'
import CustomButton from '../component/button'
import Loading from '../component/loading'
import Top from '../component/top'
import Footer from '../component/item/footer'
import ChapterList from '../component/item/chapterList'


const Item = (props: BaseProps) => {
    const item: ItemData = props.route.params
    //漫画详细数据
    let [data, setData] = useState<ItemData>(item)
    let [loading, setLoading] = useState(true)
    //历史数据
    let [history, setHistory] = useState<any>(false)

    const getHistory = () => {
        storage.load({ key: 'history', id: data.originId + '-' + data.id }).then(res => {
            if (res) setHistory(history = res)
        })
    }

    //获取漫画详细数据
    useLayoutEffect(() => {
        api(`/${item.originId}/item?id=${item.id}`).then((res: ItemRes) => {
            if (res.code != 0) return
            setLoading(false)
            setData(res.data)
            getHistory()
        })
    }, [])

    useFocusEffect(React.useCallback(getHistory, []))

    return (
        <View style={[styles.flex, { backgroundColor: props.theme }]}>
            <Top />
            <View style={[styles.headerContainer, { backgroundColor: props.theme }]}>
                <Text
                    style={styles.headerText}
                    numberOfLines={1}
                >
                    {item.name}
                </Text>
                <View style={styles.headerBackOuterContainer}>
                    <CustomButton onPress={() => props.navigation.goBack()}>
                        <View style={styles.headerBackContainer} >
                            <Icon name='arrowleft' type='antdesign' color='#fff' size={30} />
                        </View>
                    </CustomButton>
                </View>
            </View>
            {
                loading && <Loading />
            }
            {
                !loading && <View style={styles.flex}>
                    <View style={[styles.detailOuterContainer, { backgroundColor: props.theme }]}>
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
                    <View style={[styles.detailBottom, { backgroundColor: props.theme }]}>
                        <Text style={styles.text}>{data.status}</Text>
                        <Text style={styles.text}>{data.updateTime}</Text>
                    </View>
                    <View style={styles.flex}>
                        {
                            typeof data.chapters != 'undefined' &&
                            <ChapterList
                                item={item}
                                data={data}
                                navigation={props.navigation}
                                history={history}
                            />
                        }
                    </View>
                    <Footer
                        item={item}
                        data={data}
                        navigation={props.navigation}
                        history={history}
                    />
                </View>

            }
        </View>
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
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 60,
        position: 'relative'
    },
    headerText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#fff'
    },
    headerBackOuterContainer: {
        position: 'absolute',
        left: 6,
        bottom: 0,
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden'
    },
    headerBackContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center'
    },
    detailOuterContainer: {
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
        flex: 1,
        marginLeft: 14
    },
    text: {
        color: '#fff',
        marginBottom: 4
    },
    detailBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        paddingVertical: 8,
    },
})