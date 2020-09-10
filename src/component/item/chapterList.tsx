import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions, Pressable, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import { fromJS, is } from 'immutable'

const ITEM_HEIGHT = 36

interface Props extends BaseProps {
    item: ItemData,
    data: ItemData
    history: any
}

const ChapterList = (props: Props) => {
    const item = props.item
    let [data, setData] = useState(JSON.parse(JSON.stringify(props.data)) as ItemData)

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
        let jump = () => {
            // StatusBar.setHidden(true)
            props.navigation.navigate('Image', {item, chapter: chapterProps.item})
        }
        return (
            <View onTouchEnd={jump} style={[styles.chapterContainer, { backgroundColor: props.history?.chapterId==chapterProps.item.id ? props.theme : '#fff' } ]}>
                <Text style={[styles.chapterText, { color: props.history?.chapterId==chapterProps.item.id ? '#fff' : '#555' } ]} numberOfLines={2} >{chapterProps.item.name}</Text>
            </View>
        )
    })

    const RenderChapter = (chapterProps: any) => <ChapterItem  { ...chapterProps } />

    return (
        <View style={styles.flex}>
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
                        getItemLayout={(data, index) => ({length: ITEM_HEIGHT+8, offset: (ITEM_HEIGHT+8) * index, index})}
                    />
                }
            </View>
        </View>
    )
}

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(ChapterList, (prevProps: any, nextProps: any) => is(fromJS(prevProps), fromJS(nextProps))))

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

        marginVertical: 4,
        marginHorizontal: space,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    chapterText: {
        borderWidth: 0,
        textAlign: 'center',
        fontSize: 13
    },
})