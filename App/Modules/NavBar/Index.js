import React, { Component, PropTypes } from 'react';
import { AppRegistry, StyleSheet, Platform, Animated, Image, Text, View, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base';
import {Actions} from 'react-native-router-flux';
import GetInfoDevice from '../../Components/GetInfoDevice';
const logo = require('../../Skin/Images/logo.png');

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: '#0A0A0A',
    fontSize: 18,
    width: 180,
    alignSelf: 'center',
  },
  titleWrapper: {
    marginTop: 10,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 20,
      },
      android: {
        top: 5,
      },
    }),
    left: 0,
    right: 0,
  },
  header: {
    backgroundColor: 'rgba(255, 220, 66, 1)',
    paddingTop: 0,
    top: 0,
    ...Platform.select({
      ios: {
        height: 64,
      },
      android: {
        height: 54,
      },
    }),
    right: 0,
    left: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#828287',
    position: 'absolute',
  },
  backButton: {
    width: 100,
    height: 40,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 11,
      },
      android: {
        top: 10,
      },
    }),
    left: 2,
    padding: 8,
    flexDirection: 'row',
  },
  rightButton: {
	 width: 40,
	 height: 37,
	 position: 'absolute',
	 ...Platform.select({
		ios: {
		  top: 11,
		},
		android: {
		  top: 10,
		},
	 }),
	 right: 2,
	 padding: 8,
	 alignItems: 'center'
 },
  leftButton: {
    width: 100,
    height: 37,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 20,
      },
      android: {
        top: 8,
      },
    }),
    left: 2,
    padding: 8,
  },
  barRightButtonText: {
    color: 'rgb(0, 122, 255)',
    textAlign: 'right',
    fontSize: 17,
  },
  barBackButtonText: {
    color: 'rgb(0, 122, 255)',
    textAlign: 'left',
    fontSize: 17,
    paddingLeft: 6,
  },
  barLeftButtonText: {
    color: 'rgb(0, 122, 255)',
    textAlign: 'left',
    fontSize: 17,
  },
  backButtonImage: {
    width: 13,
    height: 21,
  },
  rightButtonIconStyle: {

  },
  defaultImageStyle: {
    height: 24,
    resizeMode: 'contain',
  },
});

const propTypes = {
  navigationState: PropTypes.object,
  backButtonImage: Image.propTypes.source,
  wrapBy: PropTypes.any,
  component: PropTypes.any,
  backButtonTextStyle: Text.propTypes.style,
  leftButtonStyle: View.propTypes.style,
  leftButtonIconStyle: Image.propTypes.style,
  getTitle: PropTypes.func,
  titleWrapperStyle: Text.propTypes.style,
  titleStyle: Text.propTypes.style,
  titleOpacity: PropTypes.number,
  titleProps: PropTypes.any,
  position: PropTypes.object,
  navigationBarStyle: View.propTypes.style,
  navigationBarBackgroundImage: Image.propTypes.source,
  renderTitle: PropTypes.any,
};

const contextTypes = {
  drawer: PropTypes.object,
};

const defaultProps = {
  titleOpacity: 1,
};

class NavBar extends React.Component {

  constructor(props) {
    super(props);

    this.renderRightButton = this.renderRightButton.bind(this);
    this.renderBackButton = this.renderBackButton.bind(this);
    this.renderLeftButton = this.renderLeftButton.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
	 GetInfoDevice();
  }

  _onPressBackButton() {
	  const state = this.props.navigationState;
	  const childState = state.children[state.index];
	  const BackButton = (childState.component && childState.component.backButton) || state.backButton
		 || childState.backButton;
	  const textButtonStyle = [
		 styles.barBackButtonText,
		 this.props.backButtonTextStyle,
		 state.backButtonTextStyle,
		 childState.backButtonTextStyle,
	  ];
	  const style = [
		 styles.backButton,
		 this.props.leftButtonStyle,
		 state.leftButtonStyle,
		 childState.leftButtonStyle,
	  ];
	   let onPress = childState.onBack || childState.component.onBack;

	   if(this.props.sceneKey == 'ViewSoDoGiuong') {
			  Actions.home({title: 'Trang Chủ', data: {adm_name: this.props.data.adm_name, last_login: this.props.data.last_login, adm_id: this.props.data.adm_id, notId: this.props.data.notId, day: this.props.data.day}});
	  	}else {
		  if (onPress) {
			 onPress.bind(null, state);
		  } else {
			 Actions.pop();
		  }
	  }
  }

  renderBackButton() {


	  const state = this.props.navigationState;
	  const childState = state.children[state.index];
	  const BackButton = (childState.component && childState.component.backButton) || state.backButton
		 || childState.backButton;
	  const textButtonStyle = [
		 styles.barBackButtonText,
		 this.props.backButtonTextStyle,
		 state.backButtonTextStyle,
		 childState.backButtonTextStyle,
	  ];
	  const style = [
		 styles.backButton,
		 this.props.leftButtonStyle,
		 state.leftButtonStyle,
		 childState.leftButtonStyle,
	  ];

	  if (state.index === 0 && (!state.parentIndex || state.parentIndex === 0)) {
		 return null;
	  }

	  if (BackButton) {
		 return (
			<BackButton
			  testID="backNavButton"
			  textButtonStyle={textButtonStyle}
			  {...childState}
			  style={style}
			/>
		 );
	  }
	  let buttonImage = childState.backButtonImage ||
		 state.backButtonImage || this.props.backButtonImage;



    return (
      <TouchableOpacity
        testID="backNavButton"
        style={style}
        onPress={() => this._onPressBackButton()}
      >
        {buttonImage && !childState.hideBackImage &&
          <Icon name="ios-arrow-back" />
        }
        <Icon name="ios-arrow-back" />
      </TouchableOpacity>
    );
  }

  renderRightButton(navProps) {
    const self = this;
   //  function tryRender(state, wrapBy) {
   //    if (!state) {
   //      return null;
   //    }
   //    const rightTitle = state.getRightTitle ? state.getRightTitle(navProps) : state.rightTitle;
	 //
   //    const textStyle = [styles.barRightButtonText, self.props.rightButtonTextStyle,
   //      state.rightButtonTextStyle];
   //    const style = [styles.rightButton, self.props.rightButtonStyle, state.rightButtonStyle];
   //    if (state.rightButton) {
   //      let Button = state.rightButton;
   //      if (wrapBy) {
   //        Button = wrapBy(Button);
   //      }
   //      return (
   //        <Button
   //          {...self.props}
   //          {...state}
   //          key={'rightNavBarBtn'}
   //          testID="rightNavButton"
   //          style={style}
   //          textButtonStyle={textStyle}
   //        />
   //      );
   //    }
   //    if (state.onRight && (rightTitle || state.rightButtonImage)) {
   //      const onPress = state.onRight.bind(null, state);
   //      return (
   //        <TouchableOpacity
   //          key={'rightNavBarBtn'}
   //          testID="rightNavButton"
   //          style={style}
   //          onPress={onPress}
   //        >
   //          {rightTitle &&
   //            <Text style={textStyle}>
   //              {rightTitle}
   //            </Text>
   //          }
   //          {state.rightButtonImage &&
   //            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
   //              <Image
   //                source={state.rightButtonImage}
   //                style={state.rightButtonIconStyle}
   //              />
   //            </View>
   //          }
   //        </TouchableOpacity>
   //      );
   //    }
   //    if ((!!state.onRight ^ !!(typeof(rightTitle) !== 'undefined'
   //      || typeof(state.rightButtonImage) !== 'undefined'))) {
   //      console.warn(
   //        `Both onRight and rightTitle/rightButtonImage
   //          must be specified for the scene: ${state.name}`
   //      );
   //    }
   //    return null;
   //  }
   //  return tryRender(this.props.component, this.props.wrapBy) || tryRender(this.props);
	return (
		<TouchableOpacity style={styles.rightButton} onPress={this.context.drawer.open}>
			<Icon name="md-menu" />
		</TouchableOpacity>
	);
  }

  renderLeftButton(navProps) {
    const self = this;
    const drawer = this.context.drawer;
    function tryRender(state, wrapBy) {
      let onPress = state.onLeft;
      let buttonImage = state.leftButtonImage;
      let menuIcon = state.drawerIcon;
      const style = [styles.leftButton, self.props.leftButtonStyle, state.leftButtonStyle];
      const textStyle = [styles.barLeftButtonText, self.props.leftButtonTextStyle,
        state.leftButtonTextStyle];
      const leftButtonStyle = [styles.defaultImageStyle, state.leftButtonIconStyle];
      const leftTitle = state.getLeftTitle ? state.getLeftTitle(navProps) : state.leftTitle;

      if (state.leftButton) {
        let Button = state.leftButton;
        if (wrapBy) {
          Button = wrapBy(Button);
        }
        return (
          <Button
            {...self.props}
            {...state}
            key={'leftNavBarBtn'}
            testID="leftNavButton"
            style={style}
            textStyle={textStyle}
          />
        );
      }

      if (!onPress && !!drawer && typeof drawer.toggle === 'function') {
        buttonImage = state.drawerImage;
        if (buttonImage || menuIcon) {
          onPress = drawer.toggle;
        }
        if (!menuIcon) {
          menuIcon = (
            <Image
              source={buttonImage}
              style={leftButtonStyle}
            />
          );
        }
      }

      if (onPress && (leftTitle || buttonImage)) {
        onPress = onPress.bind(null, state);
        return (
          <TouchableOpacity
            key={'leftNavBarBtn'}
            testID="leftNavButton"
            style={style}
            onPress={onPress}
          >
            {leftTitle &&
              <Text style={textStyle}>
                {leftTitle}
              </Text>
            }
            {buttonImage &&
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                {menuIcon || <Image
                  source={buttonImage}
                  style={state.leftButtonIconStyle || styles.defaultImageStyle}
                />
                }
              </View>
            }
          </TouchableOpacity>
        );
      }
      if ((!!state.onLeft ^ !!(leftTitle || buttonImage))) {
        console.warn(
          `Both onLeft and leftTitle/leftButtonImage
            must be specified for the scene: ${state.name}`
        );
      }
      return null;
    }
    return tryRender(this.props.component, this.props.wrapBy) || tryRender(this.props);
  }

  renderTitle(childState, index:number) {
    let title = this.props.getTitle ? this.props.getTitle(childState) : childState.title;
    if (title === undefined && childState.component && childState.component.title) {
      title = childState.component.title;
    }
    if (typeof(title) === 'function') {
      title = title(childState);
    }
    return (
		 <Animated.View
         key={childState.key}
         style={[
           styles.titleWrapper,
           this.props.titleWrapperStyle,
 			 {alignItems: 'center', justifyContent: 'center'}
         ]}
       >
		 	<TouchableOpacity onPress={() => Actions.welcome({title: 'Trang Chủ'})}>
         <Animated.Text
           lineBreakMode="tail"
           numberOfLines={1}
           {...this.props.titleProps}
           style={{alignItems: 'stretch', justifyContent: 'center'}}
         >
 			  <Image
 				 square
 				 style={{resizeMode: 'contain', height: 30, marginTop: -15}}
 				 source={logo}
 			  />
         </Animated.Text>
			</TouchableOpacity>
       </Animated.View>
    );
  }

  render() {
    let state = this.props.navigationState;
    let selected = state.children[state.index];
    while (selected.hasOwnProperty('children')) {
      state = selected;
      selected = selected.children[selected.index];
    }
    const navProps = { ...this.props, ...selected };

    const wrapByStyle = (component, wrapStyle) => {
      if (!component) { return null; }
      return (props) => <View style={wrapStyle}>{component(props)}</View>;
    };

    const leftButtonStyle = [styles.leftButton, { alignItems: 'flex-start' }];
    const rightButtonStyle = [styles.rightButton, { alignItems: 'flex-end' }];

    const renderLeftButton = wrapByStyle(selected.renderLeftButton, leftButtonStyle) ||
      wrapByStyle(selected.component.renderLeftButton, leftButtonStyle) ||
      this.renderLeftButton;
    const renderRightButton = this.renderRightButton;
    const renderBackButton = wrapByStyle(selected.renderBackButton, leftButtonStyle) ||
      wrapByStyle(selected.component.renderBackButton, leftButtonStyle) ||
      this.renderBackButton;
    const renderTitle = selected.renderTitle ||
      selected.component.renderTitle ||
      this.props.renderTitle;
    const navigationBarBackgroundImage = this.props.navigationBarBackgroundImage ||
      state.navigationBarBackgroundImage;
    const contents = (
      <View>
        {renderTitle ? renderTitle(navProps) : state.children.map(this.renderTitle, this)}
        {renderBackButton(navProps) || renderLeftButton(navProps)}
        {renderRightButton(navProps)}
      </View>
    );
    return (

      <Animated.View
        style={[
          styles.header,
          this.props.navigationBarStyle,
          state.navigationBarStyle,
          selected.navigationBarStyle,
        ]}
      >
        {navigationBarBackgroundImage ? (
          <Image source={navigationBarBackgroundImage}>
            {contents}
          </Image>
        ) : contents}
      </Animated.View>
    );
  }
}

NavBar.propTypes = propTypes;
NavBar.contextTypes = contextTypes;
NavBar.defaultProps = defaultProps;
export default NavBar
