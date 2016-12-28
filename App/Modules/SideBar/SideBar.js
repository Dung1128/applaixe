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
import {domain,cache} from '../../Config/common';
import { Actions } from 'react-native-router-flux';

import sidebarTheme from './theme-sidebar';
import styles from './style';

const logo = require('../../Skin/Images/logo.png');
import * as base64 from '../../Components/base64/Index';

class SideBar extends Component {

   constructor(props) {
      super(props);
      this.state = {
         checkLogin: false
      };
   }

   _onPressLogout() {
		let that = this;
		AsyncStorage.getItem('infoAdm').then((data) => {
         let results = JSON.parse(data);
         if(results != null) {
				fetch(domain+'/api/api_adm_dang_nhap.php?type=logout&adm_id='+results.adm_id, {
					headers: {
						'Cache-Control': cache
					}
				})
				.then((response) => response.json())
				.then((responseJson) => {
					let token = base64.encodeBase64(results.adm_name)+'.'+base64.encodeBase64(results.last_login)+'.'+base64.encodeBase64(results.adm_id);
					AsyncStorage.removeItem('infoAdm');
					AsyncStorage.removeItem(token);
					that.setState({
						checkLogin: false
					});
					Actions.welcome({type: 'reset'});
				})
				.catch((error) => {
					that.setState({
						loading: false,
						error: 'true',
						messageError: [{username: 'Lỗi hệ thống. Vui lòng liên hệ với bộ phận Kỹ Thuật.'}]
					});
					Console.log(error);
				});
         }
      }).done();
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
				  	<Text style={[styles.text, {color: '#ccc'}]}>Version: 1.3</Text>
				  </View>
            </Content>
         </Container>
      );
   }
}

export default SideBar
