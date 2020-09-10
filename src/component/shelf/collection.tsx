import React, { useState, useEffect } from 'react'
import { Text, View, FlatList, Button, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import storage from '../../storage'

import Item from '../listItem'
import { useFocusEffect } from '@react-navigation/native'

interface Props extends BaseProps {
    tabLabel: any,
}

const Shelf = (props: Props) => {
    let [list, setList] = useState([] as ListData)
    let getStar = () => {
        storage.getAllDataForKey('star').then(res => {
            if(res) setList(res.reverse())
        })
    }
    useFocusEffect(React.useCallback(getStar, []))

    const RenderItem = (itemProps: any) => <Item {...itemProps} navigation={props.navigation} />

    let [status, setStatus] = useState(true)
    let setStatusBar = () => {
        StatusBar.setHidden(status)
        setStatus(!status)
    }

    return (
        <>
        <Button title='切换' onPress={setStatusBar}></Button>
            <FlatList
                data={list}
                renderItem={RenderItem}
                keyExtractor={(item, k) => k.toString()}
                horizontal={false}
                numColumns={3}
                showsVerticalScrollIndicator={false}
            />
        </>
    )
}

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(Shelf))