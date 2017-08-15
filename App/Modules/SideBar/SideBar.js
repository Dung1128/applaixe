import React, { Component, PropTypes } from 'react';
import { AppRegistry, StyleSheet, Dimensions, Platform, Image, AsyncStorage, TouchableOpacity } from 'react-native';
import {
   Container,Header,Title,Content,Footer,FooterTab,
   Button,Text,View,Icon,List,ListItem
} from 'native-base';
import {domain,cache} from '../../Config/common';
import { Actions } from 'react-native-router-flux';
import StorageHelper from '../../Components/StorageHelper';
import sidebarTheme from './theme-sidebar';
import styles from './style';
const logo = require('../../Skin/Images/logo.png');

class SideBar extends Component {

   constructor(props) {
      super(props);
      this.state = {
         checkLogin: false,
			dataXe: []
      };
   }

   _onPressLogout() {
		AsyncStorage.removeItem('infoAdm');
		this.setState({
			checkLogin: false
		});
		Actions.welcome({type: 'reset'});
   }

	async componentWillMount() {
		let results = await StorageHelper.getStore('ma_xe');
		results = JSON.parse(results);
		this.setState({
			dataXe: results
		});
	}

	async componentWillUpdate() {
		let results = await StorageHelper.getStore('ma_xe');
		results = JSON.parse(results);
		this.setState({
			dataXe: results
		});
	}

   render() {
		let bks = '';
		if(this.state.dataXe) {
			bks = this.state.dataXe.xe_bien_kiem_soat;
		}

      return(
         <Container>
            <Content theme={sidebarTheme} style={styles.sidebar}>
               <Header style={styles.drawerCover}>
						<Image
						  square
						  style={{resizeMode: 'contain', height: 50, marginTop: -15}}
						  source={logo}
						/>
               </Header>
					{bks != '' &&
					<View style={{alignItems: 'center'}}>
						<TouchableOpacity onPress={() => { this.props.closeDrawer(); } }>
							<Text style={{color: '#fff'}}>BKS: <Text style={{color: 'orange'}}>{bks}</Text></Text>
						</TouchableOpacity>
					</View>
					}
              <List>

					  <ListItem button iconLeft onPress={() => { Actions.welcome({title: 'Trang Chủ'}); this.props.closeDrawer(); }}>
						  <View style={styles.listItemContainer}>
							  <View style={[styles.iconContainer]}>
								  <Icon name="ios-heart" style={styles.sidebarIcon} />
							  </View>
							  <Text style={styles.text}>Danh sách chuyến đi</Text>
						  </View>
					  </ListItem>

					  {/* <ListItem button iconLeft onPress={() => { Actions.ReportSales({title: 'Báo cáo doanh thu'}); this.props.closeDrawer(); }}>
						  <View style={styles.listItemContainer}>
							  <View style={[styles.iconContainer]}>
								  <Icon name="ios-heart" style={styles.sidebarIcon} />
							  </View>
							  <Text style={styles.text}>Báo cáo doanh thu</Text>
						  </View>
					  </ListItem> */}

					  <ListItem button iconLeft onPress={() => { Actions.HuongDanSuDung({title: 'Hướng dẫn sử dụng'}); this.props.closeDrawer(); }}>
						  <View style={styles.listItemContainer}>
							  <View style={[styles.iconContainer]}>
								  <Icon name="ios-heart" style={styles.sidebarIcon} />
							  </View>
							  <Text style={styles.text}>Hướng dẫn sử dụng</Text>
						  </View>
					  </ListItem>

					  <ListItem button iconLeft onPress={() => { Actions.MaXe({title: 'Mã Xe'}); this.props.closeDrawer(); }}>
						  <View style={styles.listItemContainer}>
							  <View style={[styles.iconContainer]}>
								  <Icon name="ios-compass" style={styles.sidebarIcon} />
							  </View>
							  <Text style={styles.text}>Nhập mã xe</Text>
						  </View>
					  </ListItem>

					  <ListItem button iconLeft onPress={() => { Actions.changePass({title: 'Đổi mật khẩu'}); this.props.closeDrawer(); }}>
						  <View style={styles.listItemContainer}>
							<View style={[styles.iconContainer]}>
							  <Icon name="ios-unlock" style={styles.sidebarIcon} />
							</View>
							<Text style={styles.text}>Đổi mật khẩu</Text>
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
				  	<Text style={[styles.text, {color: '#ccc'}]}>Version: 1.8</Text>
				  </View>
            </Content>
         </Container>
      );
   }
}

export default SideBar
