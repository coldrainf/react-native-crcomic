import React from 'react'
import { TouchableNativeFeedback, TouchableOpacity, Platform, TouchableNativeFeedbackProps, TouchableOpacityProps } from 'react-native'

interface TouchableNativeFeedbackProps0 extends TouchableNativeFeedbackProps {
    children?: any,
}
interface TouchableOpacityProps0 extends TouchableOpacityProps {
    children?: any,
}

const ButtonAndroid = (props: TouchableNativeFeedbackProps0) => (
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

const ButtonIos = (props: TouchableOpacityProps0) => (<TouchableOpacity {...props}  accessible={true}  accessibilityTraits='button'>
    {props.children}
</TouchableOpacity>)

export default Platform.OS == 'ios' ? ButtonIos : ButtonAndroid