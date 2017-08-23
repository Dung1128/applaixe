import React, { Component, PropTypes } from 'react';
import {
	AppRegistry, StyleSheet, Dimensions, NetInfo,
	TextInput, View, ScrollView, TouchableOpacity, AsyncStorage
} from 'react-native';
import { domain, cache } from '../../Config/common';
import { Text, Button, Card, CardItem, Spinner, Icon, Thumbnail } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modalbox';
import StorageHelper from '../../Components/StorageHelper';
import fetchData from '../../Components/FetchData';
import Common from '../../Components/Common';
import GetInfoDevice from '../../Components/GetInfoDevice';
const heightDevice = Dimensions.get('window').height;


class HomeIOS extends Component {
	constructor(props) {
		super(props);
		let date = new Date();
		this.state = {
			date: date,
			day: date.getDate(),
			month: (date.getMonth() + 1),
			year: date.getFullYear(),
			fullDate: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear(),
			WEEKDAYS: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
			MONTHS: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7',
				'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
			results: [],
			showDatePicker: false,
			optionSelect: '',
			arrSoDoGiuong: [],
			loading: true,
			isDisabled: false,
			currentId: 1,
			tabActive: 1,
			token: '',
			admInfo: [],
			sttInternet: false
		};
	}

	async componentWillMount() {
		let sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet
		});


		let results = await StorageHelper.getStore('infoAdm');
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;

		this.setState({
			//sttInternet: true,
			admInfo: results,
			token: token,
			loading: true
		});
		var so_do_giuong = [];
		var nameStorelistChuyen = 'storelistChuyen' + this.state.fullDate;
		//AsyncStorage.removeItem(nameStorelistChuyen);
		//Lay du lieu neu ko co mang
		console.log(this.state.sttInternet);
		if (this.state.sttInternet == false) {
			let listChuyen = await AsyncStorage.getItem(nameStorelistChuyen);
			let jsonlistChuyen = JSON.parse(listChuyen);
			if (jsonlistChuyen != null) {
				so_do_giuong = jsonlistChuyen.so_do_giuong;
			}
		} else {
			try {
				let params = {
					token: token,
					day: this.state.fullDate,
					adm_id: admId
				};
				let data = await fetchData('api_list_chuyen', params, 'GET');
				if (data.status == 200) {
					so_do_giuong = data.so_do_giuong;
					let result = JSON.stringify(data);
					AsyncStorage.removeItem(nameStorelistChuyen);
					AsyncStorage.setItem(nameStorelistChuyen, result);
					this.delStoreDay(this.state.fullDate);
				}

			} catch (e) {
				console.error(e);
			}
			GetInfoDevice();
		}
		this.setState({
			results: so_do_giuong,
			loading: false
		});
	}


	render() {
		let activeTab1 = 'activeTab',
			activeTab2 = '',
			activeTab3 = '';
		let tabActive = this.state.tabActive;
		if (tabActive == 1) {
			activeTab1 = 'activeTab';
			activeTab2 = '';
			activeTab3 = '';
		} else if (tabActive == 2) {
			activeTab1 = '';
			activeTab2 = 'activeTab';
			activeTab3 = '';
		} else if (tabActive == 3) {
			activeTab1 = '';
			activeTab2 = '';
			activeTab3 = 'activeTab';
		}
		console.log(this.state.sttInternet);

		return (
			<View style={[styles.container]}>
				<View style={{ flexDirection: 'row', margin: 10, height: 40, alignItems: 'center', borderWidth: 1, borderColor: '#ccc', }}>
					<Text style={{ flex: 3, paddingLeft: 10, textAlignVertical: 'center', }} onPress={() => this._setDatePickerShow()}>{this.state.fullDate}</Text>
					<TouchableOpacity style={{ flex: 1, borderRadius: 0, height: 40, backgroundColor: '#1e90ff', alignItems: 'center', justifyContent: 'center' }} onPress={() => { this._getListChuyenDi() }}>
						<Icon name="ios-search" style={{ color: '#fff' }} />
					</TouchableOpacity>
				</View>
				{!this.state.sttInternet && <View style={styles.no_internet}>
					<Text style={styles.no_internet_txt}>Không có kết nối mạng...</Text>
				</View>}

				<View style={{ backgroundColor: '#777' }}>
					<View style={{ flexDirection: 'row' }}>
						<View style={[styles[activeTab1], { flex: 3, alignItems: 'center', justifyContent: 'center' }]}>
							<TouchableOpacity style={{ flex: 4, padding: 15, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ tabActive: 1 })}>
								<Text style={{ color: '#fff' }}>Chiều đi</Text>
							</TouchableOpacity>
						</View>
						<View style={[styles[activeTab2], { flex: 3 }]}>
							<TouchableOpacity style={{ padding: 15, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ tabActive: 2 })}>
								<Text style={{ color: '#fff' }}>Chiều về</Text>
							</TouchableOpacity>
						</View>
						{/* <View style={[styles[activeTab3], {flex: 3}]}>
							<TouchableOpacity style={{padding: 15, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.setState({tabActive: 3})}>
								<Text style={{color: '#fff'}}>Của tôi</Text>
							</TouchableOpacity>
						</View> */}
					</View>
				</View>
				<ScrollView keyboardShouldPersistTaps="always">
					{this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
					{!this.state.loading && this._renderListChuyenDi(this.state.tabActive)}
				</ScrollView>

				<Modal style={[styles.modal, styles.modalPopup, { paddingTop: 50 }]} position={"top"} ref={"modal3"} isDisabled={this.state.isDisabled}>
					<TouchableOpacity onPress={() => this.closeModal()} style={{ width: 50, height: 40, position: 'absolute', right: 0, top: 0, padding: 10 }}>
						<Icon name="ios-close-circle" />
					</TouchableOpacity>
					{this._renderDatePicker()}
				</Modal>
			</View>
		);
	}

	onDateChange(date) {
		let currentSelectDate = date.date;
		this.setState({
			date: currentSelectDate,
			day: currentSelectDate.getDate(),
			month: (currentSelectDate.getMonth() + 1),
			year: currentSelectDate.getFullYear(),
			fullDate: currentSelectDate.getDate() + '-' + (currentSelectDate.getMonth() + 1) + '-' + currentSelectDate.getFullYear()
		});
		this.closeModal();
	}

	_renderListChuyenDi(tabActive) {
		let countData = this.state.results.length,
			results = this.state.results,
			html = [],
			htmlChild = [];

		if (countData < 1) {
			htmlChild.push(
				<CardItem key="data_null">
					<View>
						<Text>Chưa có chuyến nào!</Text>
					</View>
				</CardItem>
			);
		}
		for (var i = 0; i < countData; i++) {
			let dataNot = results[i];
			let did_id = dataNot.did_id;
			let currentId = dataNot.currentId;
			let not_chieu_di = dataNot.not_chieu_di;
			let dataParam = {
				did_id: did_id,
				chuyenVaoCho: false
			};
			let showData = 0;
			if (tabActive == 1 || tabActive == 2) {
				if ((not_chieu_di == tabActive) && (currentId == 1)) {
					showData = 1;
				}
			} else {
				if (currentId == 1) {
					showData = 1;
				}
			}

			if (showData == 1) {
				htmlChild.push(
					<CardItem key={i} style={{ shadowOpacity: 0, shadowColor: 'red' }} onPress={() => Actions.ViewSoDoGiuong({ title: 'Trên Xe', dataParam })}>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<View style={{ flex: 3 }}>

								<Text style={{ fontWeight: 'bold' }}>{dataNot.did_gio_dieu_hanh + ' ← ' + dataNot.did_gio_xuat_ben_that}</Text>
								{dataNot.bien_kiem_soat != '' && dataNot.bien_kiem_soat != null &&
									<Text>Biển kiểm soát: <Text style={{ fontWeight: 'bold' }}>{dataNot.bien_kiem_soat}</Text></Text>
								}
								<Text>{dataNot.tuy_ten}</Text>
								<Text>Lái Xe 1: <Text style={{ fontWeight: 'bold' }}>{dataNot.laixe1}</Text></Text>
								<Text>Lái Xe 2: <Text style={{ fontWeight: 'bold' }}>{dataNot.laixe2}</Text></Text>
								<Text>Tiếp viên: <Text style={{ fontWeight: 'bold' }}>{dataNot.tiepvien}</Text></Text>
							</View>
							<View style={{ flex: 1 }}>
								{dataNot.did_loai_xe == 1 &&
									<Thumbnail size={60} source={require('../../Skin/Images/vip.png')} />
								}
							</View>

						</View>
					</CardItem>
				);
			}

		}

		html.push(<Card key="group_card" style={{ marginTop: 0 }}>{htmlChild}</Card>);
		return html;
	}

	async _getListChuyenDi() {
		let sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet
		});

		this.setState({
			loading: true
		});
		let params = {
			token: this.state.token,
			day: this.state.fullDate,
			adm_id: this.state.admInfo.adm_id,
		}
		var nameStorelistChuyen = 'storelistChuyen' + this.state.fullDate;
		//Lay du lieu neu ko co mang
		if (this.state.sttInternet == false) {
			let listChuyen = await AsyncStorage.getItem(nameStorelistChuyen);
			let jsonlistChuyen = JSON.parse(listChuyen);
			var so_do_giuong = [];
			if (jsonlistChuyen != null) {
				so_do_giuong = jsonlistChuyen.so_do_giuong;
			}
			this.setState({
				results: so_do_giuong
			});
		} else {
			try {
				let data = await fetchData('api_list_chuyen', params, 'GET');
				if (data.status == 200) {
					this.setState({
						results: data.so_do_giuong
					});
					this.delStoreDay(this.state.fullDate);
				}
				let result = JSON.stringify(data);
				AsyncStorage.removeItem(nameStorelistChuyen);
				AsyncStorage.setItem(nameStorelistChuyen, result);
			} catch (e) {
				console.error(e);
			}
		}
		this.setState({
			loading: false
		});

	}

	async delStoreDay(new_day) {
		//Danh sach luu store
		var dataStore = [];
		var listStoreDay = await StorageHelper.getStore('listStoreDay');
		listStoreDay = JSON.parse(listStoreDay);
		if (listStoreDay != null && listStoreDay != undefined) {
			dataStore = listStoreDay;
		}

		var countStore = dataStore.length;
		var dataStoreNew = dataStore;
		var countStoreNew = countStore;
		//Neu nhieu qua thi xoa bot

		if (countStore > 300) {
			countStoreNew = 0;
			for (i = 0; i < countStore; i++) {
				var day_del = dataStore[i];
				//Xoa store
				if (i < countStore - 300) {
					var nameStorelistChuyenDel = 'storelistChuyen' + day_del;
					AsyncStorage.removeItem(nameStorelistChuyenDel);
				} else {
					dataStoreNew[countStoreNew] = day_del;
					countStoreNew++;
				}

			}

		}
		dataStoreNew[countStoreNew] = new_day;
		var result = JSON.stringify(dataStoreNew);
		AsyncStorage.removeItem('listStoreDay');
		AsyncStorage.setItem('listStoreDay', result);
	}

	_setDatePickerShow() {
		this.setState({
			showDatePicker: true
		});
		this.openModal();
	}

	_renderDatePicker() {
		return (
			<CalendarPicker
				selectedDate={this.state.date}
				onDateChange={(date) => this.onDateChange({ date })}
				months={this.state.MONTHS}
				weekdays={this.state.WEEKDAYS}
				previousTitle='Tháng trước'
				nextTitle='Tháng sau'
				screenWidth={Dimensions.get('window').width}
				selectedBackgroundColor={'#5ce600'} />
		);
	}

	openModal(id) {
		this.refs.modal3.open();
	}

	closeModal(id) {
		this.refs.modal3.close();
	}

	setDropdown() {
		if (this.state.dropdown) {
			this.setState({ dropdown: false });
		} else {
			this.setState({ dropdown: true });
		}
	}

}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 64,
		position: 'relative'
	},
	contentAbsolute: {
		position: 'absolute',
		top: 0
	},
	selectedDate: {
		backgroundColor: 'rgba(0,0,0,0)',
		color: '#000',
	},
	modal: {
		alignItems: 'center',
		top: 80,
		paddingRight: 20,
		paddingLeft: 20
	},
	modalPopup: {
	},
	activeTab: {
		backgroundColor: '#ffca6b'
	},
	activeDiVe: {
		color: '#55afff'
	},
	noActiveDiVe: {
		color: '#fff'
	},
	no_internet: {
		backgroundColor: '#000',
		height: 30,
		position: 'absolute',
		bottom: 0,
		left: 0,
		flex: 1,
		width: Dimensions.get('window').width
	},
	no_internet_txt: {
		color: '#ffffff',
		paddingLeft: 10
	}
});

export default HomeIOS;


async function checkServerAlive() {
	try {
		let response = await fetch('http://hasonhaivan.vn/api/ping.php');
		let responseJson = await response.json();
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}

}
