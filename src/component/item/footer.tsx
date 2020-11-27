import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'

import CustomButton from '../button'
import storage from '../../storage'

interface Props extends BaseProps {
    item: ItemData,
    data: ItemData,
    history: any
}

const Footer = (props: Props) => {
    const item = props.item
    let [star, setStar] = useState(false)
    useEffect(() => {
        storage.load({ key: 'star', id: item.originId + '-' + item.id }).then(res => {
            if (res) setStar(star = true)
        })
    }, [])
    let changeStar = () => {
        if (star) {
            storage.remove({
                key: 'star',
                id: item.originId + '-' + item.id,
            }).then(() => {
                setStar(star = false)
            })
        } else {
            storage.save({
                key: 'star',
                id: item.originId + '-' + item.id,
                data: item,
            }).then(() => {
                setStar(star = true)
            })
        }
    }

    let jump = () => {
        if (!props.data.chapters) return
        let len = props.data.chapters[0].data.length
        props.navigation.navigate('Image', {
            item,
            chapter: props.history ? props.history.chapter : props.data.chapters[0].data[len - 1],
            page: props.history ? props.history.page : 0
        })
    }

    return (
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
                <CustomButton onPress={jump}  >
                    <View style={[styles.footerRightContainer, { backgroundColor: props.theme }]}>
                        <Text style={styles.footerRightText} numberOfLines={1}>{props.history ? '续读' + props.history?.chapter?.name : '开始阅读'}</Text>
                    </View>
                </CustomButton>
            </View>
        </View>
    )
}

export default connect((state: Props) => ({ theme: state.theme }))(React.memo(Footer))

const styles = StyleSheet.create({
    footerContainer: {
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#f2f2f2'
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