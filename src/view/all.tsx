import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { Button, Icon, ButtonGroup } from 'react-native-elements'
import Modal from 'react-native-modal'

import api from '../../config/api'
import Top from '../component/top'
import SearchBar from '../component/searchBar'
import Item from '../component/item'

interface Props {
    theme: string
}

const filterIcon = () => <Icon name='caretdown' type='antdesign' color='#fff' size={10} />

const All = (props: Props) => {
    let [filterData, setFilterData] = useState([[]] as ResData)
    let [filter, setFilter] = useState([0])
    let [filterSelect, setFilterSelect] = useState(-1)
    let [filterLoading, setFilterLoading] = useState(true)

    useEffect(() => {
        api('/all/filter').then(res => {
            setFilterLoading(false)
            if(res.code) return
            setFilterData(res.data)
            setFilter(Array(res.data.length).fill(0))
        })
    }, [])


    let [list, setList] = useState([] as ResData)
    useEffect(() => {
        if(!filterData[0][0]) return
        api(`/${(filterData[0][0].data as Array<BaseData>)[filter[0]].id}/all`).then(res => {
            if(res.code) return
            setList(res.data)
        })
    }, [filter])
    return (
        <>
            <Top></Top>
            <View style={styles.flex}>
                <SearchBar placeholder='搜索' disabled style={styles.searchBar} />
                <View style={{ ...styles.filterContainer, backgroundColor: props.theme }}>
                    {
                        filterData[filter[0]].filter(f => f.id != 'order').map((f, i) =>
                            <Button
                                key={i}
                                title={f.name}
                                buttonStyle={{ backgroundColor: props.theme }}
                                containerStyle={{ ...styles.filterBtnContainer, borderColor: '#fff', borderWidth: filterSelect == i ? 1 : 0 }}
                                iconRight={true}
                                loading={filterLoading}
                                icon={React.createElement(filterIcon)}
                                onPress={() => { setFilterSelect(i) }}
                            />
                        )
                    }
                </View>
                <View style={styles.flex}>
                    <FlatList
                        data={list}
                        renderItem={Item}
                        keyExtractor={(item, k) => k.toString()}
                        horizontal={false}
                        numColumns={3}
                        columnWrapperStyle={styles.itemContainer}
                    />
                    {
                        filterData[filter[0]].filter(f => f.id != 'order').map((f, i) =>
                            <Modal
                                isVisible={i == filterSelect}
                                key={i}
                                coverScreen={false}
                                onBackdropPress={() => setFilterSelect(-1)}
                                animationIn='lightSpeedIn'
                                animationOut='lightSpeedOut'
                                animationInTiming={200}
                                animationOutTiming={10}
                                backdropTransitionInTiming={0}
                                backdropTransitionOutTiming={0}
                                style={styles.modal}
                            >
                                <View style={styles.modalView}>
                                    {
                                        (filterData[filter[0]][i].data as Array<BaseData>).map((d, index) => (
                                            <Button
                                                type='outline'
                                                title={d.name}
                                                containerStyle={styles.modalBtnContainer}
                                                buttonStyle={styles.modalBtn}
                                                titleStyle={styles.modalBtnTitle}
                                                onPress={() => {let tmp = [...filter];tmp[i]=index;setFilter(tmp);setFilterSelect(-1) }}
                                            />
                                        ))
                                    }
                                </View>
                            </Modal>
                        )
                    }
                </View>

            </View>
        </>
    )
}

export default connect((state: Theme) => ({ theme: state.theme }))(All)

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    searchBar: {
        paddingHorizontal: 40
    },
    filterContainer: {
        height: 40,
        flexDirection: 'row'
    },
    filterBtnContainer: {
        flex: 1,
        height: 40
    },
    itemContainer: {
        justifyContent: 'space-evenly'
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-start'
    },
    modalView: {  
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
    },
    modalBtnContainer: {
        marginVertical: 4,
        marginHorizontal: 6,
        width: 70
    },
    modalBtn: {
        height: 30
    },
    modalBtnTitle: {
        fontSize: 13,
        color: '#777'
    }
})
