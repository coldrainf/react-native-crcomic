import React, { useLayoutEffect, useRef } from 'react'
import { View, ViewStyle, Pressable } from 'react-native'
import { SearchBar, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { fromJS, is } from 'immutable'

interface Props extends BaseProps {
    placeholder?: string
    value?: string,
    onChangeText?: (text: string) => void,
    onSubmit?: () => void
    style?: ViewStyle,
    searchInputContainer?: ViewStyle,
    disabled?: boolean,
    showLoading?: boolean,
    onPress?: () => void
}

const CustomSearchBar = (props: Props) => {
    const SearchIcon = () => <Icon name='search' type='evilIcons' color={props.disabled ? '#fff' : '#aaa'} />
    const searchRef = useRef<SearchBar>(null)
    useLayoutEffect(() => {
        if (!props.disabled) {
            setTimeout(() => {
                searchRef.current?.focus()
            }, 0);
        }
    }, [])
    return (
        <View
            style={{
                backgroundColor: props.theme,
                ...props.style
            }}
        >
            <Pressable
                pointerEvents={props.disabled ? 'auto' : 'box-none'}
                onPress={props.onPress}
            >
                <SearchBar
                    ref={searchRef}
                    selectionColor='#aaa'
                    containerStyle={{
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        backgroundColor: props.theme
                    }}
                    inputContainerStyle={{
                        backgroundColor: 'rgba(0,0,0,.1)',
                        height: 36,
                        ...props.searchInputContainer
                    }}
                    inputStyle={{
                        fontSize: 15,
                        color: props.disabled ? '#fff' : '#000'
                    }}
                    placeholderTextColor='#fff'
                    round={true}
                    searchIcon={React.createElement(SearchIcon)}
                    value={props.value}
                    placeholder={props.placeholder}
                    onChangeText={props.onChangeText}
                    disabled={props.disabled}
                    onSubmitEditing={props.onSubmit}
                    showLoading={props.showLoading}
                    loadingProps={{ color: props.theme }}
                />
            </Pressable>
        </View>
    )
}

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(CustomSearchBar, (prevProps: Props, nextProps: Props) => is(fromJS(prevProps), fromJS(nextProps))))
