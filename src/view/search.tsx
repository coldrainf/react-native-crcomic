/**
 * 搜索界面
 */
import React, { useState, useEffect, useRef } from 'react'
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Keyboard,
    Pressable
} from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'

import storage from '../storage'
import api from '../../config/api'
import Top from '../component/top'
import SearchBar from '../component/searchBar'
import Item from '../component/listItem'
import Button from '../component/button'


const Search = (props: BaseProps) => {
    //搜索关键词
    const [kw, setKw] = useState('')
    //是否显示搜索历史
    const [showHistory, setShowHistory] = useState(true)
    //搜索历史
    const [searchHistory, setSearchHistory] = useState<string[]>([])
    //搜索历史删除按钮显示
    const [historyDel, setHistoryDel] = useState(Array(10).fill(false))
    useEffect(() => {
        if (kw == '') setShowHistory(true)
    }, [kw])
    useEffect(() => {
        storage.load({ key: 'searchHistory' }).then(res => setSearchHistory(res))
    }, [])

    //漫画列表数据
    const [list, setList] = useState<ListData>([])
    //下拉状态
    const [refreshing, setRefreshing] = useState(false)
    //上划状态
    const [footerRefreshing, setFooterRefreshing] = useState(false)
    //页数
    const [page, setPage] = useState(1)
    //后面是否无数据
    const [last, setLast] = useState(false)
    //上一页数据，若与当前页数据相同则后面无数据
    const lastData = useRef<ListData>([])
    //FlatList ref
    const listRef = useRef<any>(null)

    //获取当前搜索条件的漫画数据
    const load = (refresh?: boolean) => {
        if (kw == '') return
        if (refresh) setRefreshing(true)
        else {
            if (refreshing || last) return
            setFooterRefreshing(true)
        }
        const url = `/all/search?kw=${kw}&page=${page}`
        console.log(url)
        if (refresh) setList([])
        api(url).then((res: ListRes) => {
            if (refresh) setRefreshing(false)
            else setFooterRefreshing(false)
            if (res.code) return setPage(page == 1 ? 1 : page - 1)
            if (!res.data.length || (!refresh && is(fromJS(lastData.current), fromJS(res.data)))) return setLast(true)
            setLast(false)
            lastData.current = res.data
            if (refresh) setList(res.data)
            else if (!refreshing) {
                list.push(...res.data)
                setList(list)
            }
        })
    }

    //下拉加载
    const onEndReached = () => {
        setPage(page + 1)
        load()
    }

    //限制搜索结果数量
    const resetSearchHistory = (tmp: string[]) => {
        tmp = tmp.slice(0, 9)
        setSearchHistory(tmp)
        storage.save({
            key: 'searchHistory',
            data: tmp
        })
    }

    //显示搜索结果
    const onSubmit = () => {
        if (kw == '') return
        Keyboard.dismiss()
        setShowHistory(false)
        let tmp = [...new Set([kw, ...searchHistory])]
        resetSearchHistory(tmp)
        setHistoryDel(Array(10).fill(false))
        try {
            listRef.current?.scrollToIndex({ index: 0, viewPosition: 0 })
        } catch (err) { }
        setPage(1)
        load(true)
    }

    //点击搜索历史时跳转
    const jumpHistory = (h: string, i: number) => {
        setKw(h)
        onSubmit()
    }
    //显示搜索历史删除按钮
    const showHistoryDel = (i: number) => {
        let tmp = [...historyDel]
        tmp[i] = true
        setHistoryDel(tmp)
    }
    //删除某个搜索历史
    const delHistory = (i: number) => {
        let tmp = [...searchHistory]
        tmp.splice(i, 1)
        let tmp2 = [...historyDel]
        tmp2.splice(i, 1)
        resetSearchHistory(tmp)
        setHistoryDel(tmp2)
    }
    //清空搜索历史
    const clearHistory = () => {
        resetSearchHistory([])
        setHistoryDel(Array(10).fill(false))
    }

    const RenderItem = (itemProps: any) => <Item {...itemProps} navigation={props.navigation} />

    return (
        <>
            <Top />
            <View style={styles.flex}>
                <View style={styles.flexRow}>
                    <SearchBar
                        value={kw}
                        onChangeText={k => setKw(k.slice(0, 23))}
                        onSubmit={onSubmit}
                        showLoading={refreshing}
                        style={styles.searchBar}
                        searchInputContainer={styles.searchBarContainer}
                    />
                    <Pressable
                        onPress={() => props.navigation.goBack()}
                        style={{ backgroundColor: props.theme }}
                    >
                        <View style={[styles.cancelContainer, { backgroundColor: props.theme }]} >
                            <Text style={styles.cancelText}>取消</Text>
                        </View>
                    </Pressable>

                </View>
                <View style={styles.flex}>
                    {
                        showHistory && <View style={styles.historyOuterContainer}>
                            <Text>搜索历史</Text>
                            <View style={styles.historyContainer}>
                                {
                                    searchHistory.map((h, i) => (
                                        <Button
                                            onPress={() => jumpHistory(h, i)}
                                            onLongPress={() => showHistoryDel(i)}
                                            key={i}
                                            hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
                                        >
                                            <View key={i} style={styles.historyItemContainer}>
                                                <Text style={styles.historyItem}>{h}</Text>
                                                {
                                                    historyDel[i] &&
                                                    <Pressable
                                                        onPress={() => { delHistory(i) }}
                                                        style={styles.historyDelContainer}
                                                        hitSlop={{ top: 4, bottom: 6, left: 4, right: 4 }}
                                                    >
                                                        <Text style={styles.historyDel}>X</Text>
                                                    </Pressable>
                                                }
                                            </View>
                                        </Button>

                                    ))
                                }
                            </View>
                            {
                                searchHistory.length > 0 && <View style={styles.clearOuterContainer}>
                                    <Pressable onPress={clearHistory}>
                                        <View style={styles.clearContainer} >
                                            <Icon
                                                name='delete'
                                                type='antdesign'
                                                color='#444'
                                                size={14}
                                            />
                                            <Text style={styles.clear}>清空搜索历史</Text>
                                        </View>
                                    </Pressable>

                                </View>
                            }
                        </View>
                    }
                    {
                        (!showHistory && !refreshing) && <View>
                            <FlatList
                                data={list}
                                renderItem={RenderItem}
                                keyExtractor={(item, k) => k.toString()}
                                horizontal={false}
                                numColumns={3}
                                showsVerticalScrollIndicator={false}
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
                            />
                        </View>
                    }
                </View>
            </View>
        </>
    )
}

export default connect((state: BaseProps) => ({ theme: state.theme }))(Search)

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    flexRow: {
        flexDirection: 'row'
    },
    searchBar: {
        flex: 1,
    },
    searchBarContainer: {
        backgroundColor: '#fff',
    },
    cancelContainer: {
        width: 50,
    },
    cancelText: {
        lineHeight: 50,
        color: '#fff',
        fontSize: 16,
        marginLeft: 6
    },
    historyOuterContainer: {
        padding: 10,
    },
    historyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    historyItemContainer: {
        height: 30,
        margin: 6,
        paddingHorizontal: 14,
        backgroundColor: '#ddd',
        borderRadius: 5,
        position: 'relative'
    },
    historyItem: {
        lineHeight: 30,
        textAlign: 'center'
    },
    historyDelContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: '#bbb',
        width: 14,
        height: 14,
        borderRadius: 7,
        justifyContent: 'center'
    },
    historyDel: {
        textAlign: 'center',
        color: '#333',
        fontSize: 10
    },
    clearOuterContainer: {
        marginTop: 20,
        alignItems: 'center'
    },
    clearContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 130,
        paddingVertical: 4
    },
    clear: {
        fontSize: 14,
        marginLeft: 6,
        color: '#666'
    },
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
})