/**
 * 全部漫画浏览页面
 */
import React, { useState, useEffect, useRef } from 'react'
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Pressable
} from 'react-native'
import { connect } from 'react-redux'
import { Button, Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import { fromJS, is } from 'immutable'

import api from '../../config/api'
import Top from '../component/top'
import SearchBar from '../component/searchBar'
import Item from '../component/listItem'

interface Filter {
    origin: number,
    [propName: string]: number,
}
interface FilterText {
    [propName: string]: string,
}

const filterIcon = () => <Icon name='caretdown' type='antdesign' color='#fff' size={10} />

let renderCount = 0

const All = (props: BaseProps) => {
    console.log(++renderCount)
    
    //所有过滤数据
    const [filterData, setFilterData] = useState<FilterData>([[]])
    //当前所在源的过滤数据
    const [filter, setFilter] = useState<Filter>({ 'origin': 0 })
    //当前选择的过滤属性的id
    const [filterSelect, setFilterSelect] = useState('')
    //当前所在源所有过滤属性的名称
    const [filterSelectText, setFilterSelectText] = useState<FilterText>({})
    const [filterLoading, setFilterLoading] = useState(true)

    useEffect(() => {
        //请求获取所有过滤数据
        api('/all/filter').then((res: FilterRes) => {
            setFilterLoading(false)
            if (res.code) return
            setFilterData(res.data)
            let f: Filter = { 'origin': 0 }
            let ft: FilterText = {}
            for (let i in res.data[filter.origin]) {
                let k = res.data[filter.origin][i].id
                f[k] = 0
                ft[k] = res.data[filter.origin][i].name
            }
            setFilter(f)
            setFilterSelectText(ft)
        })
    }, [])

    useEffect(() => {
        //更换源时初始化数据
        let f: Filter = { 'origin': filter.origin }
        let ft: FilterText = {}
        for (let i in filterData[filter.origin]) {
            let k = filterData[filter.origin][i].id
            if (k != 'origin') f[k] = 0
            ft[k] = filterData[filter.origin][i].name
        }
        setFilter(f)
        setFilterSelectText(ft)
        setLast(false)
    }, [filter.origin])
    //漫画列表数据
    const [list, setList] = useState<ListData>([])
    //下拉刷新状态
    const [refreshing, setRefreshing] = useState(true)
    //上划加载状态
    const [footerRefreshing, setFooterRefreshing] = useState(false)
    //页数
    const page = useRef(1)
    //后面是否无数据
    const [last, setLast] = useState(false)
    //上一页数据，若与当前页数据相同则后面无数据
    const lastData = useRef<ListData>([])
    //FlatList ref
    const listRef = useRef<any>(null)

    //获取当前过滤条件的漫画数据
    const load = (refresh?: boolean) => {
        if (!filterData[0][0]) return
        let query = `page=${page.current + 1}`
        Object.keys(filter).forEach(k => {
            if (k == 'origin') return
            let tmp = (filterData[filter.origin] as BaseData[]).filter(item => item.id == k)
            if (!tmp.length) return
            query += '&' + k + '=' + (tmp[0].data as BaseData[])[filter[k]].id
        })
        if (refresh) setRefreshing(true)
        else {
            if (refreshing || last) return
            setFooterRefreshing(true)
        }
        const url = `/${(filterData[0][0].data as BaseData[])[filter.origin].id}/all?${query}`
        api(url).then((res: ListRes) => {
            if (refresh) setRefreshing(false)
            else setFooterRefreshing(false)
            if (res.code) return page.current = page.current == 1 ? 1 : page.current - 1
            if (!res.data.length || (!refresh && is(fromJS(lastData.current), fromJS(res.data)))) {
                if (refresh) setList([])
                return setLast(true)
            }
            setLast(false)
            lastData.current = res.data
            if (refresh) setList(res.data)
            else if (!refreshing) {
                list.push(...res.data)
                setList(list)
            }
        })
    }

    //下拉刷新
    const onRefresh = () => {
        try {
            listRef.current?.scrollToIndex({ index: 0, viewPosition: 0 })
        } catch (err) { }
        page.current = 1
        load(true)
    }
    useEffect(onRefresh, [filter])

    //上拉加载
    const onEndReached = () => {
        page.current ++
        load()
    }

    //设置排序规则
    const setOrder = (index: number) => {
        setFilter({
            ...filter,
            order: index
        })
    }

    //更改过滤条件
    const filterSelectFunc = (d: BaseData, index: number) => {
        setFilter({
            ...filter,
            [filterSelect]: index
        })
        filterSelectText[filterSelect] = d.name
        setFilterSelectText(filterSelectText)
        setFilterSelect('')
    }

    const RenderItem = (itemProps: any) => <Item {...itemProps} navigation={props.navigation} />

    return (
        <>
            <Top />
            <View style={styles.flex}>
                <SearchBar
                    placeholder='搜索'
                    disabled
                    style={styles.searchBar}
                    onPress={() => { props.navigation.push('Search') }}
                />
                <View style={{ ...styles.filterContainer, backgroundColor: props.theme }}>
                    {
                        filterData[filter.origin].filter(f => f.id != 'order').map((f, i) =>
                            <Button
                                key={i}
                                title={filterSelectText[f.id]}
                                buttonStyle={{ backgroundColor: props.theme }}
                                containerStyle={{ ...styles.filterBtnContainer, borderWidth: filterSelect == f.id ? 1 : 0 }}
                                iconRight={true}
                                loading={filterLoading}
                                icon={React.createElement(filterIcon)}
                                onPress={() => setFilterSelect(f.id)}
                            />
                        )
                    }
                </View>
                <View style={styles.flex}>
                    <View style={styles.orderContainer}>
                        {
                            typeof filter.order != 'undefined' && filterData[filter.origin].filter(item => item.id == 'order')[0].data?.map((item, index) =>
                                <Pressable onPress={() => setOrder(index)} key={index}>
                                    <View style={styles.orderItemContainer}>
                                        <Text
                                            style={{
                                                ...styles.orderItem,
                                                color: filter.order == index ? props.theme : '#444'
                                            }}
                                        >
                                            {item.name}
                                        </Text>
                                        <Icon
                                            name='sort'
                                            type='font-awesome'
                                            color={filter.order == index ? props.theme : '#777'}
                                            containerStyle={styles.orderItemIcon}
                                            size={13}
                                        />
                                    </View>
                                </Pressable>
                            )
                        }
                    </View>
                    <FlatList
                        ref={listRef}
                        refreshing={true}
                        data={list}
                        renderItem={RenderItem}
                        keyExtractor={(item, k) => k.toString()}
                        horizontal={false}
                        numColumns={3}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                style={{ zIndex: 10 }}
                                refreshing={refreshing}
                                colors={[props.theme]}
                                progressBackgroundColor={"#fff"}
                                onRefresh={onRefresh}
                            />
                        }
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
                    <Modal
                        isVisible={filterSelect != ''}
                        coverScreen={false}
                        onBackdropPress={() => setFilterSelect('')}
                        animationIn='lightSpeedIn'
                        animationOut='lightSpeedOut'
                        animationInTiming={200}
                        animationOutTiming={10}
                        backdropTransitionInTiming={0}
                        backdropTransitionOutTiming={0}
                        style={styles.modal}
                    >
                        <View style={styles.modalContainer}>
                            {
                                filterSelect != '' && (filterData[filter.origin].filter(item => item.id == filterSelect)[0].data as BaseData[]).map((d, index) => (
                                    <Pressable onPress={() => filterSelectFunc(d, index)} key={index}>
                                        <View style={styles.modalView}>
                                            <Text
                                                style={{
                                                    ...styles.text,
                                                    color: filter[filterSelect] == index ? props.theme : '#666'
                                                }}
                                            >
                                                {d.name}
                                            </Text>
                                        </View>
                                    </Pressable>
                                ))
                            }
                        </View>
                    </Modal>
                </View>

            </View>
        </>
    )
}

export default connect((state: BaseProps) => ({ theme: state.theme }))(All)

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    text: {
        textAlign: 'center'
    },
    searchBar: {
        paddingHorizontal: 40
    },
    filterContainer: {
        height: 40,
        flexDirection: 'row',
        zIndex: 100
    },
    filterBtnContainer: {
        flex: 1,
        height: 40,
        borderColor: '#fff'
    },
    orderContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderBottomColor: '#eee',
        borderBottomWidth: 1
    },
    orderItemContainer: {
        width: 50,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    orderItem: {
        textAlign: 'center',
        fontSize: 15
    },
    orderItemIcon: {
        flex: 1,
        justifyContent: 'center'
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-start'
    },
    modalView: {
        height: 30,
        width: 60,
        justifyContent: 'center'
    },
    modalContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        paddingVertical: 4
    },
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
})
