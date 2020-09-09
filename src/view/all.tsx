import React, { useState, useEffect, useRef } from 'react'
import { Text, View, StyleSheet, FlatList, RefreshControl,ActivityIndicator, Pressable } from 'react-native'
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

const All = (props: BaseProps) => {
    let [filterData, setFilterData] = useState([[]] as ListData)
    let [filter, setFilter] = useState({'origin':0} as Filter)
    let [filterSelect, setFilterSelect] = useState('')
    let [filterSelectText, setFilterSelectText] = useState({} as FilterText)
    let [filterLoading, setFilterLoading] = useState(true)

    useEffect(() => {
        api('/all/filter').then((res: ListRes) => {
            setFilterLoading(false)
            if(res.code) return
            setFilterData(res.data)
            let f: Filter = {'origin':0}
            let ft: FilterText = {}
            for(let i in res.data[filter.origin]) {
                let k = res.data[filter.origin][i].id
                f[k] = 0
                ft[k] = res.data[filter.origin][i].name
            }
            setFilter(f)
            setFilterSelectText(ft)
        })
    }, [])

    useEffect(() => {
        let f: Filter = {'origin':filter.origin}
        let ft: FilterText = {}
        for(let i in filterData[filter.origin]) {
            let k = filterData[filter.origin][i].id
            if(k != 'origin') f[k] = 0
            ft[k] = filterData[filter.origin][i].name
        }
        setFilter(f)
        setFilterSelectText(ft)
        setLast(false)
    }, [filter.origin])

    let [list, setList] = useState([] as ListData)
    let [refreshing, setRefreshing] = useState(true)
    let [footerRefreshing, setFooterRefreshing] = useState(false)
    let [page, setPage] = useState(1)
    let [last, setLast] = useState(false)
    let listRef = useRef(null)
    let [lastData, setLastData] = useState([] as ListData)
    let load = (refresh?: boolean) => {
        if(!filterData[0][0]) return
        let query = `page=${page+1}`
        Object.keys(filter).forEach(k => {
            if(k == 'origin') return
            let tmp = (filterData[filter.origin] as Array<BaseData>).filter(item => item.id==k)
            if(!tmp.length) return
            query += '&' + k + '=' + (tmp[0].data as Array<BaseData>)[filter[k]].id
        })
        if(refresh) setRefreshing(true)
        else {
            if(refreshing || last) return
            setFooterRefreshing(true)
        }
        let url = `/${(filterData[0][0].data as Array<BaseData>)[filter.origin].id}/all?${query}`
        api(url).then(res => {
            if(refresh) setRefreshing(false)
            else setFooterRefreshing(false)  
            if(res.code) return setPage(page = page==1 ? 1 : page-1)
            if (!res.data.length || (!refresh && is(fromJS(lastData), fromJS(res.data)))) {
                if(refresh) setList([])
                return setLast(true)
            }
            setLast(false)
            setLastData(res.data)
            if(refresh) setList(res.data)
            else if(!refreshing) {
                list.push(...res.data)
                setList(list)
            }
        })
    }
    let onRefresh = () => {
        try {
            (listRef.current as any).scrollToIndex({ index:0, viewPosition: 0 })
        }catch(err){}
        setPage(page=1)
        load(true)
    }
    useEffect(onRefresh, [filter])

    let onEndReached = () => {
        setPage(++page)
        load()
    }
    let setOrder = (index: number) => {
        setFilter({
            ...filter,
            order: index
        })
    }
    let filterSelectFunc = (d: BaseData, index: number) => {
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
                <SearchBar placeholder='搜索' disabled style={styles.searchBar} onPress={()=>{props.navigation.push('Search')}} />
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
                                onPress={() => { setFilterSelect(f.id) }}
                            />
                        )
                    }
                </View>
                <View style={styles.flex}>
                    <View style={styles.orderContainer}>
                        {
                            typeof filter.order != 'undefined' && filterData[filter.origin].filter(item=>item.id=='order')[0].data?.map((item, index)=>
                                <Pressable onPress={()=>setOrder(index)} key={index}>
                                    <View style={styles.orderItemContainer}>
                                        <Text style={{...styles.orderItem, color: filter.order==index ? props.theme : '#444'}}>{item.name}</Text>
                                        <Icon name='sort' type='font-awesome' color={filter.order==index ? props.theme : '#777'} containerStyle={styles.orderItemIcon} size={13} />
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
                        showsVerticalScrollIndicator = {false}
                        refreshControl={
                            <RefreshControl
                                style={{zIndex:10}}
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
                                
                                filterSelect != '' && (filterData[filter.origin].filter(item=>item.id==filterSelect)[0].data as Array<BaseData>).map((d, index) => (
                                    <Pressable onPress={()=>filterSelectFunc(d, index)} key={index}>
                                        <View style={styles.modalView}>
                                            <Text style={{...styles.text, color: filter[filterSelect]== index ? props.theme: '#666'}}>{d.name}</Text>
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
    footer:{
        flexDirection:'row',
        height:24,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
    },
})
