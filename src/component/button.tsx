import React from 'react'
import {
    TouchableNativeFeedback,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedbackProps,
    TouchableOpacityProps
} from 'react-native'
import { fromJS, is } from 'immutable'

interface Props0 extends TouchableNativeFeedbackProps {
    children?: React.ReactNode
}
interface Props1 extends TouchableOpacityProps {
    children?: React.ReactNode
}

const ButtonAndroid = (props: Props0) => (
    <TouchableNativeFeedback
        delayPressIn={0}
        background={TouchableNativeFeedback.SelectableBackground()}
        accessible={true}
        accessibilityTraits='button'
        {...props}
    >
        {props.children}
    </TouchableNativeFeedback>
)

const ButtonIos = (props: Props1) => (
    <TouchableOpacity {...props}
        accessible={true}
        accessibilityTraits='button'
        {...props}
    >
        {props.children}
    </TouchableOpacity>
)

const Button = Platform.OS == 'ios' ? ButtonIos : ButtonAndroid
export default React.memo(Button, (prevProps: any, nextProps: any) => is(fromJS(prevProps), fromJS(nextProps)))