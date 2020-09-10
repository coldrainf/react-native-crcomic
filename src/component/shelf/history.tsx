import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'

interface Props extends BaseProps {
    tabLabel: any,
}

const History = (props: Props) => {

    return (
        <>
        <View style={{ flex:1 }}>
            <Text>这里是history</Text>
        </View>
        </>
    )
}

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(History))