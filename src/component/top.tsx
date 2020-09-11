import React from 'react'
import { View, StatusBar } from 'react-native'
import { connect } from 'react-redux'

interface Props extends BaseProps {
    hidden?: boolean,
    height?: number
}

const Top = (props: Props) => (
    <View style={{backgroundColor: props.hidden ? '#000' : props.theme, height: StatusBar.currentHeight}}>
        <StatusBar barStyle='light-content' backgroundColor={'rgba(0,0,0,0)'} translucent hidden={props.hidden}></StatusBar>
    </View>  
)

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(Top))