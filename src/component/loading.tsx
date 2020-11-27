import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

interface Props extends BaseProps {
    image?: boolean
}

const Loading = (props: Props) => (
    <View
        style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: props.image ? '#212121' : '#f2f2f2'
        }}>
        <ActivityIndicator
            color={props.image ? '#fff' : props.theme}
            size='large'
        />
    </View>
)

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(Loading))