import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

const Loading = (props: BaseProps) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={props.theme} size='large' />
    </View>
)

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(Loading))