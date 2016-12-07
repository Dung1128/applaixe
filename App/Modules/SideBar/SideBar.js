import React, { Component, PropTypes } from 'react';
import { AppRegistry, StyleSheet, Dimensions, Platform, Image, AsyncStorage } from 'react-native';
import {
   Container,
   Header,
   Title,
   Content,
   Footer,
   FooterTab,
   Button,
   Text,
   View,
   Icon,
   List,
   ListItem
} from 'native-base';

import { Actions } from 'react-native-router-flux';

import sidebarTheme from './theme-sidebar';
import styles from './style';

const logo = require('../../Skin/Images/logo.png');

class SideBar extends Component {

   constructor(props) {
      super(props);
      this.state = {
         checkLogin: false
      };
   }

   _onPressLogout() {
      AsyncStorage.removeItem('infoAdm');
		this.setState({
			checkLogin: false
		});
		Actions.welcome({type: 'reset'});
   }

   render() {
      return(
         <Container>
            <Content theme={sidebarTheme} style={styles.sidebar}>
               <Header style={styles.drawerCover}>
						<Image
						  square
						  style={{resizeMode: 'contain', height: 30, marginTop: -15}}
						  source={logo}
						/>
               </Header>

              <List>

                <ListItem button iconLeft onPress={() => {this.props.closeDrawer(); this._onPressLogout();}}>
                  <View style={styles.listItemContainer}>
                    <View style={[styles.iconContainer]}>
                      <Icon name="ios-contact" style={styles.sidebarIcon} />
                    </View>
                    <Text style={styles.text}>Đăng Xuất</Text>
                  </View>
               </ListItem>

              </List>
            </Content>
         </Container>
      );
   }
}

export default SideBar
