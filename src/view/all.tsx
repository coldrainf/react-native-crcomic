import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { Button, Icon } from 'react-native-elements'
import Modal from 'react-native-modal'

import Top from '../component/top'
import SearchBar from '../component/searchBar'
import Item from '../component/item'

interface Props {
    theme: string
}

const filterIcon = () => <Icon name='caretdown' type='antdesign' color='#fff' size={10} />


const res = { "code": 0, "data": [{ "id": 41700, "name": "只要可爱即使是变态你也会喜欢我吧", "cover": "shttps://images.dmzj.com/webpic/13/zykajssbtnyhxhwbV1.jpg", "lastChapterId": 104543, "lastChapterName": "第27话" }, { "id": 20926, "name": "妖神记", "cover": "https://images.dmzj.com/img/webpic/4/1447215436.jpg", "lastChapterId": 76532, "lastChapterName": "第174话 回归（下）" }, { "id": 40135, "name": "别当欧尼酱了！", "cover": "https://images.dmzj.com/webpic/18/200829bdonjl.jpg", "lastChapterId": 107317, "lastChapterName": "第42话" }, { "id": 20844, "name": "我家大师兄脑子有坑", "cover": "https://images.dmzj.com/img/webpic/7/1002475871439187470.jpg", "lastChapterId": 77290, "lastChapterName": "第307话" }, { "id": 45854, "name": "看得见的女孩", "cover": "https://images.dmzj.com/webpic/4/200307kdjdnh.jpg", "lastChapterId": 101926, "lastChapterName": "连载27" }, { "id": 29973, "name": "再见龙生你好人生", "cover": "https://images.dmzj.com/webpic/18/zaijianrenshengnihaolongsheng.jpg", "lastChapterId": 101372, "lastChapterName": "第50话" }, { "id": 14841, "name": "狂赌之渊", "cover": "https://images.dmzj.com/webpic/18/200612kdzy.jpg", "lastChapterId": 106879, "lastChapterName": "第77话" }, { "id": 46745, "name": "身为暗杀者的我明显比勇者还强", "cover": "https://images.dmzj.com/webpic/17/181212anshazhe.jpg", "lastChapterId": 107250, "lastChapterName": "第18话" }, { "id": 50758, "name": "久保同学不放过我", "cover": "https://images.dmzj.com/webpic/19/jiubaotongxue0821.jpg", "lastChapterId": 102341, "lastChapterName": "第38话" }, { "id": 46505, "name": "我家女友可不止可爱呢", "cover": "https://images.dmzj.com/webpic/13/nvyou20200618.jpg", "lastChapterId": 107110, "lastChapterName": "连载63" }, { "id": 33322, "name": "完全没有恋爱感情的青梅竹马", "cover": "https://images.dmzj.com/webpic/8/wqmylagqdqmzm6893l.jpg", "lastChapterId": 106263, "lastChapterName": "出张篇" }, { "id": 38191, "name": "为了女儿击倒魔王", "cover": "https://images.dmzj.com/webpic/14/weilenverjidaomowang.jpg", "lastChapterId": 106329, "lastChapterName": "第31话" }, { "id": 43534, "name": "不熟练的两人", "cover": "https://images.dmzj.com/webpic/13/bsldlr190620.jpg", "lastChapterId": 99322, "lastChapterName": "第39话" }, { "id": 47139, "name": "社畜女梦魔的故事", "cover": "https://images.dmzj.com/webpic/4/scnmydgs20190807.jpg", "lastChapterId": 94135, "lastChapterName": "新年祝福2" }, { "id": 27708, "name": "崩坏3rd", "cover": "https://images.dmzj.com/img/webpic/16/1017039361514025908.jpg", "lastChapterId": 102426, "lastChapterName": "异乡篇 第六话 袭击" }] }


const All = (props: Props) => {
    let [kw, setKw] = useState('')
    let [filter, setFilter] = useState([
        {
            title: '漫源',
        },
        {
            title: '题材'
        },
        {
            title: '进度'
        },
        {
            title: '地区'
        },
    ])
    let [filterIndex, setFilterIndex] = useState(0)
    return (
        <>
            <Top></Top>
            <View>
                <SearchBar onChangeText={setKw} value={kw} placeholder='搜索' style={styles.searchBar} />
                <View style={{ ...styles.filterContainer, backgroundColor: props.theme }}>
                    {
                        filter.map((f, i) =>
                            <Button
                                key={i}
                                title={f.title}
                                buttonStyle={{ backgroundColor: props.theme }}
                                containerStyle={styles.filterBtnContainer}
                                iconRight={true}
                                icon={React.createElement(filterIcon)}
                            />
                        )
                    }

                </View>
                <FlatList
                    data={res.data}
                    renderItem={Item}
                    keyExtractor={(item,k) => k.toString()}
                    horizontal={false}
                    numColumns={3}
                    columnWrapperStyle={styles.itemContainer}
                />
                {/* {
                    filter.map((f, i) =>
                        <Modal isVisible={i == filterIndex} key={i} coverScreen={false}>
                            <View style={{ flex: 1 }}>
                                <Text>I am the modal content!{f.title}</Text>
                            </View>
                        </Modal>
                    )
                } */}
            </View>
        </>
    )
}

export default connect((state: Theme) => ({ theme: state.theme }))(All)

const styles = StyleSheet.create({
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
    overlay: {
        marginTop: 99
    }
})
