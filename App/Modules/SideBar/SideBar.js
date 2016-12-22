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
import {domain} from '../../Config/common';
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
		// fetch(domain+'/api/api_adm_dang_nhap.php?adm_id='+this.props.data.adm_id)
		// .then((response) => response.json())
		// .then((responseJson) => {
		// 	if(responseJson.status == 200) {
				AsyncStorage.removeItem('infoAdm');
				this.setState({
					checkLogin: false
				});
				Actions.welcome({type: 'reset'});
		// 	}
		// })
		// .catch((error) => {
		// 	Console.log(error);
		// });
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

				  <ListItem button iconLeft onPress={() => { Actions.welcome({title: 'Trang Chủ'}); this.props.closeDrawer(); }}>
					  <View style={styles.listItemContainer}>
						  <View style={[styles.iconContainer]}>
							  <Icon name="ios-heart" style={styles.sidebarIcon} />
						  </View>
						  <Text style={styles.text}>Danh sách chuyến đi</Text>
					  </View>
				  </ListItem>

				  <ListItem button iconLeft onPress={() => { Actions.HuongDanSuDung({title: 'Hướng dẫn sử dụng'}); this.props.closeDrawer(); }}>
					  <View style={styles.listItemContainer}>
						  <View style={[styles.iconContainer]}>
							  <Icon name="ios-heart" style={styles.sidebarIcon} />
						  </View>
						  <Text style={styles.text}>Hướng dẫn sử dụng</Text>
					  </View>
				  </ListItem>

                <ListItem button iconLeft onPress={() => {this.props.closeDrawer(); this._onPressLogout();}}>
                  <View style={styles.listItemContainer}>
                    <View style={[styles.iconContainer]}>
                      <Icon name="ios-contact" style={styles.sidebarIcon} />
                    </View>
                    <Text style={styles.text}>Đăng Xuất</Text>
                  </View>
               </ListItem>
              </List>
				  <View style={{flex: 1, alignItems: 'center'}}>
				  	<Text style={[styles.text, {color: '#ccc'}]}>Version: 1.1</Text>
				  </View>
            </Content>
         </Container>
      );
   }
}

export default SideBar
