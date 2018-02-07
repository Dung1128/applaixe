import React, { Component, PropTypes } from 'react';
import { AppRegistry, StyleSheet, Dimensions, Platform, Image, AsyncStorage, TouchableOpacity } from 'react-native';
import {
	Container, Header, Title, Content, Footer, FooterTab,
	Button, Text, View, Icon, List, ListItem
} from 'native-base';
import { domain, cache } from '../../Config/common';
import { Actions } from 'react-native-router-flux';
import StorageHelper from '../../Components/StorageHelper';
import sidebarTheme from './theme-sidebar';
import styles from './style';
import DeviceInfo from 'react-native-device-info';
import fetchData from '../../Components/FetchData';

const logo = require('../../Skin/Images/logo.png');

class SideBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			checkLogin: false,
			dataXe: [],
			arrMenu: [],
		};
	}

	_onPressLogout() {
		AsyncStorage.removeItem('infoAdm');
		this.setState({
			checkLogin: false
		});
		Actions.welcome({ type: 'reset' });
	}

	async componentWillMount() {
		try {
			let results = await StorageHelper.getStore('ma_xe');
			results = JSON.parse(results);

			let info = await StorageHelper.getStore('infoAdm');
			info = JSON.parse(info);
			let arrMenu = [];
			if (info) {
				let admId = info.adm_id;
				let token = info.token;
				let params = {
					token: token,
					adm_id: admId
				};
				let data = await fetchData('api_get_permision', params, 'GET');
				if (data.status == 200) {
					arrMenu = data.arrMenu;
				}
			}

			this.setState({
				dataXe: results,
				// arrMenu: arrMenu,
			});

		} catch (e) {
			console.error(e);
		}
	}

	async componentWillUpdate() {
		// let results = await StorageHelper.getStore('ma_xe');
		// results = JSON.parse(results);
		// this.setState({
		// 	dataXe: results
		// });
		try {
			let results = await StorageHelper.getStore('ma_xe');
			results = JSON.parse(results);

			let info = await StorageHelper.getStore('infoAdm');
			info = JSON.parse(info);
			let arrMenu = [];
			if (info) {
				let admId = info.adm_id;
				let token = info.token;
				let params = {
					token: token,
					adm_id: admId
				};
				let data = await fetchData('api_get_permision', params, 'GET');
				if (data.status == 200) {
					arrMenu = data.arrMenu;
				}
			}

			this.setState({
				dataXe: results,
				arrMenu: arrMenu,
			});

		} catch (e) {
			console.error(e);
		}
	}

	render() {
		let bks = '';
		let arrMenu = this.state.arrMenu;
		let length = arrMenu.length;
		if (this.state.dataXe) {
			bks = this.state.dataXe.xe_bien_kiem_soat;
		}

		return (
			<Container>
				<Content theme={sidebarTheme} style={styles.sidebar}>
					<Header style={styles.drawerCover}>
						<Image
							square
							style={{ resizeMode: 'contain', height: 50, marginTop: -15 }}
							source={logo}
						/>
					</Header>
					{(length > 0) && (arrMenu[0].status == 1) && bks != '' &&
						<View style={{ alignItems: 'center' }}>
							<TouchableOpacity onPress={() => { this.props.closeDrawer(); }}>
								<Text style={{ color: '#fff' }}>BKS: <Text style={{ color: 'orange' }}>{bks}</Text></Text>
							</TouchableOpacity>
						</View>
					}
					<List>
						{(length > 0) && (arrMenu[1].status == 1) &&
							<ListItem button iconLeft onPress={() => { Actions.welcome({ title: 'Trang Chủ' }); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-heart" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Chuyến đi của bạn</Text>
								</View>
							</ListItem>
						}

						{(length > 0) && (arrMenu[2].status == 1) &&
							<ListItem button iconLeft onPress={() => { Actions.BangDieuDo({ title: 'Bảng điều độ' }); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="md-calendar" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Bảng điều độ</Text>
								</View>
							</ListItem>
						}

						{(length > 0) && (arrMenu[3].status == 1) &&
							<ListItem button iconLeft onPress={() => { Actions.ScheduleTrip({ title: 'Lịch điều hành' }); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-heart" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Lịch điều hành</Text>
								</View>
							</ListItem>
						}

						{(length > 0) && (arrMenu[4].status == 1) &&
							<ListItem button iconLeft onPress={() => { Actions.HuongDanSuDung({ title: 'Hướng dẫn sử dụng' }); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-heart" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Hướng dẫn sử dụng</Text>
								</View>
							</ListItem>
						}

						{(length > 0) && (arrMenu[5].status == 1) &&
							<ListItem button iconLeft onPress={() => { Actions.MaXe({ title: 'Mã Xe' }); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-compass" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Nhập mã xe</Text>
								</View>
							</ListItem>
						}

						{(length > 0) && (arrMenu[6].status == 1) &&
							<ListItem button iconLeft onPress={() => { Actions.changePass({ title: 'Đổi mật khẩu' }); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-unlock" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Đổi mật khẩu</Text>
								</View>
							</ListItem>
						}

						{(length > 0) && (arrMenu[7].status == 1) &&
							<ListItem button iconLeft onPress={() => { this.props.closeDrawer(); this._onPressLogout(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-contact" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Đăng Xuất</Text>
								</View>
							</ListItem>
						}
					</List>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<Text style={[styles.text, { color: '#ccc' }]}>{'Version: ' + DeviceInfo.getVersion()}</Text>
					</View>
				</Content>
			</Container>
		);
	}
}

export default SideBar
