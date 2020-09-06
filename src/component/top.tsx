import React from 'react'
import { View, StatusBar } from 'react-native'
import { connect } from 'react-redux'

const Top = (props: BaseProps) => (
    // <View style={{ height: 36, backgroundColor: props.theme }}>
        <StatusBar barStyle='light-content' backgroundColor={props.theme}></StatusBar>
    // </View>
)

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(Top))