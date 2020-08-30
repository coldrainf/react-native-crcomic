import React from 'react'
import {View} from 'react-native'
import { connect } from 'react-redux'

const Top = (props: Theme) => (
    <View style={{ height: 36, backgroundColor: props.theme }}></View>
)

export default connect((state: Theme) => ({theme: state.theme}))(Top)