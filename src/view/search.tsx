import React, { useState, useEffect, useRef } from 'react'
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Keyboard } from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'

import Top from '../component/top'
import SearchBar from '../component/searchBar'
import api from '../../config/api'
import Item from '../component/listItem'
import Button from '../component/button'
import storage from '../storage'

const Search = (props: BaseProps) => {
    let [kw, setKw] = useState('')
    let [showHistory, setShowHistory] = useState(true)
    let [searchHistory, setSearchHistory] = useState([] as Array<string>)
    let [historyDel, setHistoryDel] = useState(Array(10).fill(false))
    useEffect(() => {
        if (kw == '') setShowHistory(true)
    }, [kw])
    useEffect(() => {
        storage.load({ key: 'searchHistory' }).then(res => setSearchHistory(res))
    }, [])

    let [list, setList] = useState([] as ResData)
    let [refreshing, setRefreshing] = useState(false)
    let [footerRefreshing, setFooterRefreshing] = useState(false)
    let [page, setPage] = useState(1)
    let [last, setLast] = useState(false)
    let listRef = useRef(null)
    let [lastData, setLastData] = useState([] as ResData)
    let load = (refresh?: boolean) => {
        if (kw == '') return
        if (refresh) setRefreshing(true)
        else {
            if (refreshing || last) return
            setFooterRefreshing(true)
        }
        let url = `/all/search?kw=${kw}&page=${page}`
        console.log(url)
        if (refresh) setList([])
        api(url).then(res => {
            if (refresh) setRefreshing(false)
            else setFooterRefreshing(false)
            if (res.code) return setPage(page = page == 1 ? 1 : page - 1)
            if (!res.data.length || (!refresh && is(fromJS(lastData), fromJS(res.data)))) return setLast(true)
            setLast(false)
            setLastData(res.data)
            if (refresh) setList(res.data)
            else if (!refreshing) {
                list.push(...res.data)
                setList(list)
            }
        })
    }
    let onEndReached = () => {
        setPage(++page)
        load()
    }

    let resetSearchHistory = (tmp: Array<string>) => {
        tmp = tmp.slice(0, 9)
        setSearchHistory(tmp)
        storage.save({
            key: 'searchHistory',
            data: tmp
        })
    }
    let onSubmit = () => {
        if (kw == '') return
        Keyboard.dismiss()
        setShowHistory(false)
        let tmp = [...new Set([kw, ...searchHistory])]
        resetSearchHistory(tmp)
        setHistoryDel(Array(10).fill(false))
        try {
            (listRef.current as any).scrollToIndex({ index: 0, viewPosition: 0 })
        } catch (err) { }
        setPage(page = 1)
        load(true)
    }

    let [delStatus, setDelStatus] = useState(false)
    let jumpHistory = (h: string, i: number) => {
        setTimeout(() => {
            if (delStatus) return setDelStatus(delStatus = false)
            setKw(kw = h)
            onSubmit()
        }, 0);
    }
    let showHistoryDel = (i: number) => {
        let tmp = [...historyDel]
        tmp[i] = true
        setHistoryDel(tmp)
    }
    let delHistory = (i: number) => {
        setDelStatus(delStatus = true)
        let tmp = [...searchHistory]
        tmp.splice(i, 1)
        let tmp2 = [...historyDel]
        tmp2.splice(i, 1)
        resetSearchHistory(tmp)
        setHistoryDel(tmp2)
    }
    let clearHistory = () => {
        resetSearchHistory([])
        setHistoryDel(historyDel = Array(10).fill(false))
    }
    return (
        <>
            <Top />
            <View style={styles.flex}>
                <View style={styles.flexRow}>
                    <SearchBar value={kw} onChangeText={k => setKw(k.slice(0, 23))} onSubmit={onSubmit} showLoading={refreshing} style={styles.searchBar} searchInputContainer={styles.searchBarContainer} />
                    <View style={[styles.cancelContainer, { backgroundColor: props.theme }]} onTouchEnd={() => props.navigation.goBack()}>
                        <Text style={styles.cancelText}>取消</Text>
                    </View>
                </View>
                <View style={styles.flex}>
                    {
                        showHistory && <View style={styles.historyOuterContainer}>
                            <Text>搜索历史</Text>
                            <View style={styles.historyContainer}>
                                {
                                    searchHistory.map((h, i) => (
                                        <Button onPress={() => jumpHistory(h, i)} onLongPress={() => showHistoryDel(i)} key={i}>
                                            <View key={i} style={styles.historyItemContainer}>
                                                <Text style={styles.historyItem}>{h}</Text>
                                                {
                                                    historyDel[i] && <View style={styles.historyDelContainer} onTouchEnd={() => { delHistory(i) }}>
                                                        <Text style={styles.historyDel}>X</Text>
                                                    </View>
                                                }
                                            </View>
                                        </Button>

                                    ))
                                }
                            </View>
                            {
                                searchHistory.length > 0 && <View style={styles.clearOuterContainer}>
                                    <View style={styles.clearContainer} onTouchEnd={clearHistory}>
                                        <Icon name='delete' type='antdesign' color='#444' size={14} />
                                        <Text style={styles.clear}>清空搜索历史</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    }
                    {
                        (!showHistory && !refreshing) && <View>
                            <FlatList
                                data={list}
                                renderItem={itemProps => <Item {...itemProps} navigation={props.navigation} />}
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
        flexDirection: 'column',
    },
    cancelText: {
        flex: 1,
        lineHeight: 50,
        color: '#fff',
        fontSize: 15,
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
        width: 16,
        height: 16,
        borderRadius: 8,
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