import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { SearchBar, Icon } from 'react-native-elements'
import { connect } from 'react-redux'


interface Props {
    theme: string,
    placeholder?: string
    value?: string,
    onChangeText?: (text: string) => void,
    style?: ViewStyle,
    disabled?: boolean,
    onTouchEnd?: ()=> void
}


const SearchIcon = () => (
    <Icon name='search' type='evilIcons' color='#fff' />
)

const CustomSearchBar = (props: Props) => {
    return (
        <View pointerEvents={props.disabled ? 'auto': 'box-none'} onTouchEnd={props.onTouchEnd} style={{ backgroundColor: props.theme, ...props.style }}>
            <SearchBar
                selectionColor={'#fff'}
                containerStyle={{ ...styles.searchContainer, backgroundColor: props.theme }}
                inputContainerStyle={{ ...styles.searchInputContainer }}
                inputStyle={styles.search}
                placeholderTextColor='#fff'
                round={true}
                searchIcon={React.createElement(SearchIcon)}
                value={props.value}
                placeholder={props.placeholder}
                onChangeText={props.onChangeText}
                disabled={props.disabled}
            />
        </View>

    )
}

export default connect((state: Theme) => ({ theme: state.theme }))(React.memo(CustomSearchBar))

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
        color: '#fff',
        fontSize: 15,
    },
})
