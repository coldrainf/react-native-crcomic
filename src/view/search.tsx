import React, { useState, useEffect, useRef } from 'react'
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'

import Top from '../component/top'
import SearchBar from '../component/searchBar'
import api from '../../config/api'
import Item from '../component/item'
import storage from '../storage'

const Search = (props: BaseProps) => {
    let [kw, setKw] = useState('')
    let [showHistory, setShowHistory] = useState(true)
    let [searchHistory, setSearchHistory] = useState([] as Array<string>)

    useEffect(() => {
        if (kw == '') setShowHistory(true)
    }, [kw])
    useEffect(() => {
        storage.load({key: 'searchHistory'}).then(res => setSearchHistory(res))
    },[])

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
            if (!res.data.length || is(fromJS(lastData), fromJS(res.data))) return setLast(true)
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

    let onSubmit = () => {
        if (kw == '') return

        setShowHistory(false)
        let tmp = [...new Set([kw, ...searchHistory])].slice(0, 7)
        setSearchHistory(tmp)
        storage.save({
            key: 'searchHistory',
            data: tmp
        })

        try {
            (listRef.current as any).scrollToIndex({ index: 0, viewPosition: 0 })
        } catch (err) { }
        setPage(page = 1)
        load(true)
    }

    let jumpHistory = (h: string) => {
        setKw(kw=h)
        onSubmit()
    }


    return (
        <>
            <Top />
            <View style={styles.flex}>
                <View style={styles.flexRow}>
                    <SearchBar value={kw} onChangeText={setKw} onSubmit={onSubmit} showLoading={refreshing} style={styles.searchBar} searchInputContainer={styles.searchBarContainer} />
                    <View style={[styles.cancelContainer, { backgroundColor: props.theme }]} onTouchEnd={() => props.navigation.goBack()}>
                        <Text style={styles.cancelText}>取消</Text>
                    </View>
                </View>
                <View style={styles.flex}>
                    {
                        showHistory && <View style={styles.historyContainer}>
                            <Text>搜索历史</Text>
                            <View>
                                {
                                    searchHistory.map((h, i) => (
                                        <View onTouchEnd={()=>jumpHistory(h)} key={i} style={styles.historyItemContainer}>
                                            <Text style={styles.historyItem}>{h}</Text>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    }
                    {
                        !showHistory && <View>
                            <FlatList
                                data={list}
                                renderItem={props => <Item {...props} />}
                                keyExtractor={(item, k) => k.toString()}
                                horizontal={false}
                                numColumns={3}
                                showsVerticalScrollIndicator={false}
                                columnWrapperStyle={styles.itemContainer}
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
    historyContainer: {
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    historyItemContainer: {
        height: 30,
        margin: 6,
        paddingHorizontal: 6,
        backgroundColor: '#ddd',
        borderRadius: 5
    },
    historyItem: {
        lineHeight: 30,
        textAlign: 'center'
    },
    itemContainer: {
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
})