import React, { useLayoutEffect, useRef } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
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
    onTouchEnd?: ()=> void
}

const CustomSearchBar = (props: Props) => {
    const SearchIcon = () => <Icon name='search' type='evilIcons' color={props.disabled ? '#fff': '#aaa'} />
    let searchRef = useRef(null as any)
    useLayoutEffect(()=>{
        if(!props.disabled) {
            setTimeout(() => {
                searchRef.current.focus()
            }, 0);
        }
    },[])
    return (
        <View pointerEvents={props.disabled ? 'auto': 'box-none'} onTouchEnd={props.onTouchEnd} style={{ backgroundColor: props.theme, ...props.style }}>
            <SearchBar
                ref={searchRef}
                selectionColor='#aaa'
                containerStyle={{ ...styles.searchContainer, backgroundColor: props.theme }}
                inputContainerStyle={[styles.searchInputContainer, props.searchInputContainer]}
                inputStyle={[styles.search, {color: props.disabled ? '#fff' : '#000' }]}
                placeholderTextColor='#fff'
                round={true}
                searchIcon={React.createElement(SearchIcon)}
                value={props.value}
                placeholder={props.placeholder}
                onChangeText={props.onChangeText}
                disabled={props.disabled}
                onSubmitEditing={props.onSubmit}
                showLoading={props.showLoading}
                loadingProps={{color:props.theme}}
            />
        </View>

    )
}

export default connect((state: BaseProps) => ({ theme: state.theme }))(React.memo(CustomSearchBar, (prevProps: any, nextProps: any) => is(fromJS(prevProps), fromJS(nextProps))))

const styles = StyleSheet.create({
    searchContainer: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    searchInputContainer: {
        backgroundColor: 'rgba(0,0,0,.1)',
        height: 36,
    },
    search: {
        fontSize: 15,
    },
})
