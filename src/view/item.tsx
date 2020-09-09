import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Dimensions, ToastAndroid, Pressable } from 'react-native'
import { connect } from 'react-redux'
import { Icon, Image } from 'react-native-elements'

import CustomButton from '../component/button'
import Loading from '../component/loading'
import api from '../../config/api'
import storage from '../storage'


const ITEM_HEIGHT = 36

const Item = (props: BaseProps) => {
    const item = props.route.params
    let [data, setData] = useState(item as ItemData)
    let [loading, setLoading] = useState(true)
    let [star, setStar] = useState(false)
    let [history, setHistory] = useState(false as any)
    useEffect(() => {
        api(`/${item.originId}/item?id=${item.id}`).then((res: ItemRes) => {
            if(res.code != 0) return
            setLoading(false)
            setData(res.data)
            storage.load({ key: 'star', id: res.data.originId+'-'+res.data.id }).then(res => {
                if(res) setStar(star=true)
            })
            storage.load({ key: 'history', id: res.data.originId+'-'+res.data.id }).then(res => {
                if(res) setHistory(history=res)
            })
        })
    }, [])
    let changeStar = () => {
        if(star) {
            storage.remove({
                key: 'star',
                id: data.originId+'-'+data.id,
            }).then(() => {
                setStar(star=false)
            })
        }else {
            storage.save({
                key: 'star',
                id: data.originId+'-'+data.id,
                data: item,
                expires: 1000 * 60,
            }).then(()=> {
                setStar(star=true)
            })
        }
    }


    let [select, setSelect] = useState(0)
    let [sort, setSort] = useState(true)
    let listRef = useRef(null)
    let changeSort = () => {
        if(!data.chapters) return
        try {
            (listRef.current as any).scrollToIndex({ index: 0, viewPosition: 0 })
        } catch (err) { }
        data.chapters.map((d: any) => d.data.reverse())
        data = { ...data }
        setSort(sort = !sort)
        setData(data)
    }

    const ChapterItem = React.memo((chapterProps: any) => {
        return (
            <View style={styles.chapterOuterContainer}>
                <CustomButton onPress={()=>{}} hitSlop={{top: 3, bottom: 3, left: 5, right: 5 }} >
                    <View style={[styles.chapterContainer, { backgroundColor: history?.chapterId==chapterProps.item.id ? props.theme : '#fff' } ]}>
                        <Text style={[styles.chapterText, { color: history?.chapterId==chapterProps.item.id ? '#fff' : '#555' } ]} numberOfLines={2} >{chapterProps.item.name}</Text>
                    </View>
                </CustomButton>
            </View>
        )
    })

    const RenderChapter = (chapterProps: any) => <ChapterItem  { ...chapterProps } />

    return (
        <>
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
                <View style={[styles.headerBottom, { backgroundColor: props.theme }]}>
                    <Text style={styles.text}>{data.status}</Text>
                    <Text style={styles.text}>{data.updateTime}</Text>
                </View>
                <View style={[styles.chapterHeaderContainer, { backgroundColor: props.theme }]}>
                    <View style={styles.flexRow}>
                        {
                            data?.chapters?.map((c: any, i: number) => (
                                <Pressable key={i} onPress={()=>setSelect(i)}>
                                    <View style={[styles.chapterHeader, select==i && { backgroundColor: '#eee' }]} >
                                        <Text style={[styles.chapterHeaderText, select==i && { color: props.theme } ]}>{c.title}</Text>
                                    </View>
                                </Pressable>
                            ))
                        }
                    </View>
                    <Pressable onPress={changeSort}>
                        <View style={styles.sortContainer}>
                            <Text style={styles.sortText}>{sort ? '倒序' : '正序'}</Text>
                            <Icon name={sort ? 'sort-amount-down' : 'sort-amount-up-alt'} type='font-awesome-5' color='#fff' size={14} />
                        </View>
                    </Pressable>

                </View>
                <View style={styles.flex}>
                    {
                        typeof data.chapters != 'undefined' && <FlatList
                            ref={listRef}
                            data={data.chapters[select].data}
                            renderItem={RenderChapter}
                            keyExtractor={(item, k) => item.id.toString()}
                            horizontal={false}
                            numColumns={3}
                            showsVerticalScrollIndicator = {false}
                            ListFooterComponent={
                                <View style={{height: 30}}></View>
                            }
                            getItemLayout={(data, index) => (
                                {length: ITEM_HEIGHT+8, offset: (ITEM_HEIGHT+8) * index, index}
                              )}
                        />
                    }
                </View>
                <View style={styles.footerContainer}>
                    <View>
                        <CustomButton onPress={changeStar}>
                            <View style={styles.footerLeftContainer}>
                                <Icon name={star ? 'star' : 'staro'} type='antdesign' color={star ? '#faa016' : '#000'} />
                                <Text style={styles.footerLeftText}>{star ? '已追' : '追漫'}</Text>
                            </View>
                        </CustomButton>
                    </View>
                    <View style={styles.footerRight}>
                        <CustomButton onPress={()=>{}}>
                            <View style={[styles.footerRightContainer, { backgroundColor: props.theme } ]}>
                                <Text style={styles.footerRightText} numberOfLines={1}>{history ? '续读'+ history?.chapterName : '开始阅读'}</Text>
                            </View>
                        </CustomButton>
                    </View>

                </View>
            </View>

        }
        </>
    )
}

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(Item))

const space = 10
const width = Dimensions.get('window').width/3 - space * 2

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
        paddingVertical: 8
    },
    chapterHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 34,
        alignItems: 'center',
        paddingHorizontal: 6,
        marginBottom: 6
    },
    chapterHeader: {
        height: 34,
        paddingHorizontal: 12,
        justifyContent: 'center',
        borderRadius: 2
    },
    chapterHeaderText: {
        color: '#fff',
        fontSize: 15
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 36
    },
    sortText: {
        color: '#fff',
        fontSize: 16,
        marginRight: 2
    },
    chapterOuterContainer: {
        width,
        height: ITEM_HEIGHT,
        marginVertical: 4,
        marginHorizontal: space,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden'
    },
    chapterContainer: {
        width,
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    chapterText: {
        borderWidth: 0,
        textAlign: 'center',
        fontSize: 13
    },
    footerContainer: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    footerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 14,
    },
    footerLeftText: {
        marginLeft: 2
    },    
    footerRight: {
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: 50,
        height: 44,
        width: 176,
    },    
    footerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        width: 176,
        paddingHorizontal: 14,
    },
    footerRightText: {
        color: '#fff',
        fontSize: 16
    },
})