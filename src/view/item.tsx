import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { Icon, Image } from 'react-native-elements'

import CustomButton from '../component/button'
import Loading from '../component/loading'
import api from '../../config/api'


const Item = (props: BaseProps) => {
    const item = props.route.params
    let [data, setData] = useState(item)
    let [loading, setLoading] = useState(true)
    useEffect(() => {
        api(`/${item.originId}/item?id=${item.id}`).then(res => {
            if(res.code != 0) return
            setLoading(false)
            setData(res.data)
        })
    }, [])
    return (
        <>
        {
            loading && <Loading />
        }
        {
            !loading && <View style={{ backgroundColor: props.theme }}>
                <View style={styles.headerContainer}>
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
                        <Text style={styles.detail}>{data.originName}</Text>
                        <Text style={styles.detail}>{data.author?.join(' ')}</Text>
                        <Text style={styles.detail}>{data.type?.join(' ')}</Text>
                        <Text style={styles.detail}>{data.area}</Text>
                        <Text style={styles.detail}>{data.desc}</Text>
                    </View>
                </View>
                <View>
                    
                </View>
            </View>
        }
        </>
    )
}

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(Item))

const styles = StyleSheet.create({
    white: {
       color: '#fff', 
    },
    marginB: {
        marginBottom: 4,
    },

    headerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 6,
        paddingVertical: 12,
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
    detail: {
        color: '#fff',
        marginBottom: 4
    }
})