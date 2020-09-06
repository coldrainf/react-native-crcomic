import React,{PureComponent} from 'react'
import {StyleSheet,
    Text,
    View,
    Animated,
} from 'react-native'

import Button from './button'

export default class TabBar extends PureComponent<any> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeDefaultColor: '#08086b',
            inactiveDefaultColor: '#666666'
        }
    }
    
    _renderTab(name: string, page: number, isTabActive: boolean, onPressHandler: Function) {
        const textColor = isTabActive ? this.props.activeColor : this.props.inactiveColor;
        
        const fontWeight = isTabActive ? 'bold' : 'normal';
        
        return (<Button
                    style={{flex: 1}}
                    key={name}
                    accessibilityLabel={name}
                    onPress={() => onPressHandler(page)}
                >
                    <View style={styles.tab}>
                        <Text style={[{color: textColor, fontWeight, fontSize: isTabActive ? 17: 16 } ]}>
                            {name}
                        </Text>
                    </View>
                </Button>);
      }

      _renderUnderline() {
        // const containerWidth = this.props.containerWidth;
        const containerWidth = 200;
        const numberOfTabs = this.props.tabs.length;
        const underlineWidth = this.props.tabUnderlineDefaultWidth ? this.props.tabUnderlineDefaultWidth : containerWidth / (numberOfTabs * 2);
        const scale = this.props.tabUnderlineScaleX ? this.props.tabUnderlineScaleX : 3;
        const deLen = (containerWidth / numberOfTabs - underlineWidth ) / 2;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: underlineWidth,
            height: 2,
            borderRadius: 2,
            backgroundColor: this.props.activeColor,
            bottom: 0,
            left: deLen
        };

        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0,  containerWidth / numberOfTabs],
        });

        const scaleValue = (defaultScale: number) => {
            let arr = new Array(numberOfTabs * 2);
            return arr.fill(0).reduce(function(pre, cur, idx){
                idx == 0 ? pre.inputRange.push(cur) : pre.inputRange.push(pre.inputRange[idx-1] + 0.5);
                idx%2 ? pre.outputRange.push(defaultScale) : pre.outputRange.push(1)
                return pre
                }, {inputRange: [], outputRange: []})
        }

        const scaleX = this.props.scrollValue.interpolate(scaleValue(scale));

        return(
            <Animated.View
              style={[
                tabUnderlineStyle,
                {
                    transform: [
                        { translateX },
                        { scaleX },
                    ],
                },
                this.props.underlineStyle,
              ]}
            />
        )
      }

      render() {
        return (
            <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor}, this.props.style]}>
                {this.props.tabs.map((name: string, page: number) => {
                const isTabActive = this.props.activeTab === page;
                return this._renderTab(name, page, isTabActive, this.props.goToPage)
                })}
                {
                    this._renderUnderline()
                }
            </View>
        );
    };
}

const styles = StyleSheet.create({
  tab: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#f4f4f4',
  },
});