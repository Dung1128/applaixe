import React, { Component, PropTypes } from 'react';
import {
	AppRegistry, StyleSheet, Dimensions, TextInput, TouchableOpacity,
	AsyncStorage, TabBarIOS, View, ScrollView, NetInfo, Picker
} from 'react-native';
import {
	Container, Content, Header, Title, Text, Icon, Input, InputGroup,
	Button, Card, CardItem, Spinner, Thumbnail
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from 'react-native-modalbox';
import ModalPicker from 'react-native-modal-picker';
import CheckBox from 'react-native-checkbox';

import { domain, cache, net } from '../../Config/common';
import Common from '../../Components/Common';

import StorageHelper from '../../Components/StorageHelper';
import fetchData from '../../Components/FetchData';
import isConnected from '../../Components/CheckNet';
import ComSDGInfo from './ComSDGInfo';
import ComSDGFooter from './ComSDGFooter';

const heightDevice = Dimensions.get('window').height;
const { width, height } = Dimensions.get('window');

class ViewSoDoGiuong extends Component {

	constructor(props) {
		super(props);
		this.state = {
			layout: {
				height: height,
				width: width
			},
			timeSync: 20000, sttInternet: false, arrVeNumber: [], arrVeHuy: [], arrVeXuongXe: [],
			arrInfo: [], arrChoTang: [], arrBen: [], arrBenTen: [], arrBenMa: [],
			arrGiaVe: [], arrGiaVeVip: [], arrDMVe: [], arrDMVeTen: [], arrDMVeTien: [],
			showDropdown: false, did_id: 0, bvv_id: 0,
			fullName: '', phone: '', diem_don: '', diem_tra: '', ghi_chu: '', loading: true,
			trung_chuyen_don: false, trung_chuyen_tra: false, tre_em: false, seri: '', danh_muc: '', key_danh_muc: 0,
			isOpen: false, isDisabled: false, nameDiemDi: '', nameDiemDen: '', nameDMVe: '',
			keyDiemDi: '', keyDiemDen: '', results: [],
			resultsBen: [], resultsDMVe: [], currentIdGiuong: 0, ve_price: 0,
			bvv_id_can_chuyen: 0, bvv_bvn_id_muon_chuyen: 0, bvv_number_muon_chuyen: 0,
			type: '', infoAdm: [], notifiCountDanhSachCho: 0, chuyenVaoCho: false,
			themVe: false, arrThemve: [], token: '', clearTimeout: '', clearSync: '', benActive: 0, benActiveType: 1,
			promotions: 'KM', promotionsKey: 0, key_KM: 0, nameKM: '', decreasePrice: '', rootPrice: 0, key_codeKM: '',
			// arrKM: [{ key: 4, value: 'Trẻ em' }, { key: 3, value: 'Trực tiếp' }, { key: 6, value: 'Mã khuyến mại' }, { key: 7, value: 'Giá vé linh hoạt' }],
			arrKM: [{ key: 4, value: 'Trẻ em' }, { key: 3, value: 'Trực tiếp' }, { key: 6, value: 'Mã khuyến mại' }],
			codeKM: '', keyCodeDiscount: '', arrCodeDiscount: [], id_km: '', priceAllTrips: 0, mesKM: '', newrootPrive: 0,
			uri: '',
		};
	}

	async componentWillMount() {
		var that = this;
		let results = await StorageHelper.getStore('infoAdm');
		let infoAdm = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;
		let did_id = that.props.dataParam.did_id;
		let data = [];

		//Kiem tra mang
		var sttInternet = await checkServerAlive();
		// this.setState({
		// 	sttInternet: sttInternet
		// });


		this.setState({
			//sttInternet: false,
			sttInternet: sttInternet,
			infoAdm: results,
			token: token,
			did_id: that.props.dataParam.did_id,
			uri: this.props.dataParam.uri,
			loading: true
		});

		var timeSync = 20000;
		var dataVeNumber = [];
		var dataVeHuy = [];
		var dataVeXuongXe = [];
		var dataInfo = [];
		var dataChoTang = [];
		var dataBen = [];
		var dataBenTen = [];
		var dataBenMa = [];
		var dataGiaVe = [];
		var dataGiaVeVip = [];
		var dataVe = [];
		var dataDMVe = [];
		var dataDMVeTen = [];
		var dataDMVeTien = [];
		var nameStoreArrVeNumber = 'arrVeNumber' + did_id;
		var nameStoreArrVeHuy = 'arrVeHuy' + did_id;
		var nameStoreArrVeXuongXe = 'arrVeXuongXe' + did_id;
		var nameStoreArrInfo = 'arrInfo' + did_id;
		var nameStoreArrChoTang = 'arrChoTang' + did_id;
		var nameStoreArrBen = 'arrBen' + did_id;
		var nameStoreArrBenTen = 'arrBenTen';
		var nameStoreArrBenMa = 'arrBenMa';

		var nameStoreVe = 'arrVe' + did_id;
		var nameStoreArrDMVe = 'arrDMVe' + did_id;
		var nameStoreArrDMVeTen = 'arrDMVeTen' + did_id;
		var nameStoreArrDMVeTien = 'arrDMVeTien' + did_id;

		var nameStoreArrGiaVe = 'arrGiaVe';
		var nameStoreArrGiaVeVip = 'arrGiaVeVip';
		//AsyncStorage.removeItem(nameStorelistChuyen);
		//Lay du lieu neu ko co mang
		if (this.state.sttInternet == false) {
			let storeArrVeNumber = await AsyncStorage.getItem(nameStoreArrVeNumber);
			let storeArrVeHuy = await AsyncStorage.getItem(nameStoreArrVeHuy);
			let storeArrVeXuongXe = await AsyncStorage.getItem(nameStoreArrVeXuongXe);
			let storeArrInfo = await AsyncStorage.getItem(nameStoreArrInfo);
			let storeArrChoTang = await AsyncStorage.getItem(nameStoreArrChoTang);
			let storeArrBen = await AsyncStorage.getItem(nameStoreArrBen);
			let storeArrBenTen = await AsyncStorage.getItem(nameStoreArrBenTen);
			let storeArrBenMa = await AsyncStorage.getItem(nameStoreArrBenMa);
			let storeArrDMVe = await AsyncStorage.getItem(nameStoreArrDMVe);
			let storeArrVe = await AsyncStorage.getItem(nameStoreVe);
			let storeArrDMVeTen = await AsyncStorage.getItem(nameStoreArrDMVeTen);
			let storeArrDMVeTien = await AsyncStorage.getItem(nameStoreArrDMVeTien);
			let storeArrGiaVe = await AsyncStorage.getItem(nameStoreArrGiaVe);
			let storeArrGiaVeVip = await AsyncStorage.getItem(nameStoreArrGiaVeVip);
			let storetimeSync = await AsyncStorage.getItem('time_sync');

			timeSync = JSON.parse(storetimeSync);
			dataVeNumber = JSON.parse(storeArrVeNumber);
			dataVeHuy = JSON.parse(storeArrVeHuy);
			dataVeXuongXe = JSON.parse(storeArrVeXuongXe);

			dataInfo = JSON.parse(storeArrInfo);
			dataChoTang = JSON.parse(storeArrChoTang);
			dataBen = JSON.parse(storeArrBen);
			dataBenTen = JSON.parse(storeArrBenTen);
			dataBenMa = JSON.parse(storeArrBenMa);
			dataVe = JSON.parse(storeArrVe);
			dataDMVe = JSON.parse(storeArrDMVe);
			dataDMVeTen = JSON.parse(storeArrDMVeTen);
			dataDMVeTien = JSON.parse(storeArrDMVeTien);
			dataGiaVe = JSON.parse(storeArrGiaVe);
			dataGiaVeVip = JSON.parse(storeArrGiaVeVip);

		} else {
			//Dong bo du lieu store
			let storeArrVeNumber = await AsyncStorage.getItem(nameStoreArrVeNumber);
			dataVeNumber = JSON.parse(storeArrVeNumber);
			let storeArrVeHuy = await AsyncStorage.getItem(nameStoreArrVeHuy);
			dataVeHuy = JSON.parse(storeArrVeHuy);
			let storeArrVeXuongXe = await AsyncStorage.getItem(nameStoreArrVeXuongXe);
			dataVeXuongXe = JSON.parse(storeArrVeXuongXe);
			try {
				let params = {
					token: infoAdm.token,
					adm_id: infoAdm.adm_id,
					did_id: did_id,
					dataVe: storeArrVeNumber,
					dataVeHuy: storeArrVeHuy,
					dataVeXuongXe: storeArrVeXuongXe
				}

				dataCapnhat = await fetchData('api_cap_nhat_khi_co_mang', params, 'POST');
			} catch (e) {
				// this.setState({
				// 	loading: false
				// });
				alert('Hệ thống lỗi cập nhật khi có mạng!');
				Actions.welcome({ type: 'reset' });
			}

			//Lay du lieu
			try {
				let params = {
					token: infoAdm.token,
					adm_id: infoAdm.adm_id,
					did_id: did_id
				}
				data = await fetchData('api_so_do_giuong', params, 'GET');
				if (data.status == 404) {
					alert(data.mes);
					Actions.welcome({ type: 'reset' });
				} else if (data.status == 200) {
					//Luu vao danh sach store
					//Danh sach luu store
					var dataStore = [];
					var listStoreDid = await StorageHelper.getStore('listStoreDid');
					listStoreDid = JSON.parse(listStoreDid);
					if (listStoreDid != null && listStoreDid != undefined) {
						dataStore = listStoreDid;
					}
					var countStore = dataStore.length;
					var dataStoreNew = dataStore;
					var countStoreNew = countStore;
					//Neu nhieu qua thi xoa bot

					if (countStore > 200) {
						countStoreNew = 0;
						for (i = 0; i < countStore; i++) {
							var did_id_del = dataStore[i];
							//Xoa store
							if (i < countStore - 200) {
								var nameStoreArrVeNumberDel = 'arrVeNumber' + did_id_del;
								var nameStoreArrVeHuyDel = 'arrVeHuy' + did_id_del;
								var nameStoreArrVeXuongXeDel = 'arrVeXuongXe' + did_id_del;
								var nameStoreArrInfoDel = 'arrInfo' + did_id_del;
								var nameStoreArrChoTangDel = 'arrChoTang' + did_id_del;
								var nameStoreArrBenDel = 'arrBen' + did_id_del;
								var nameStoreArrDMVeDel = 'arrDMVe' + did_id_del;
								var nameStoreArrDMVeTenDel = 'arrDMVeTen' + did_id_del;
								var nameStoreArrDMVeTienDel = 'arrDMVeTien' + did_id_del;

								AsyncStorage.removeItem(nameStoreArrVeNumberDel);
								AsyncStorage.removeItem(nameStoreArrVeHuyDel);
								AsyncStorage.removeItem(nameStoreArrVeXuongXeDel);
								AsyncStorage.removeItem(nameStoreArrInfoDel);
								AsyncStorage.removeItem(nameStoreArrChoTangDel);
								AsyncStorage.removeItem(nameStoreArrBenDel);
								AsyncStorage.removeItem(nameStoreArrDMVeDel);
								AsyncStorage.removeItem(nameStoreArrDMVeTenDel);
								AsyncStorage.removeItem(nameStoreArrDMVeTienDel);
								dataStore = dataStore.slice(i);
							} else {
								dataStoreNew[countStoreNew] = did_id_del;
								countStoreNew++;
							}

						}

					}
					dataStoreNew[countStoreNew] = did_id;
					var result = JSON.stringify(dataStoreNew);
					AsyncStorage.removeItem('listStoreDid');
					AsyncStorage.setItem('listStoreDid', result);
					timeSync = data.time_sync;
					dataVeNumber = data.arrVeNumber;

					dataVeXuongXe = data.arrVeXuongXe;
					dataVeHuy = data.arrVeHuy;
					dataInfo = data.arrInfo;
					dataChoTang = data.arrChoTang;
					dataBen = data.arrBen;
					dataBenTen = data.arrBenTen;
					dataBenMa = data.arrBenMa;
					dataDMVe = data.arrDMVe;

					for (let i = 0; i < data.arrDMVe.length; i++) {
						dataVe[i] = { DMVe: data.arrDMVe[i], DMVeTen: data.arrDMVeTen[i + 1], DMVeTien: data.arrDMVeTien[i + 1] };
					}

					dataDMVeTen = data.arrDMVeTen;
					dataDMVeTien = data.arrDMVeTien;

					dataGiaVe = data.arrGiaVe;
					dataGiaVeVip = data.arrGiaVeVip;
					//Luu vao store
					var result = JSON.stringify(timeSync);
					AsyncStorage.removeItem('time_sync');
					AsyncStorage.setItem('time_sync', result);

					var result = JSON.stringify(dataVeNumber);
					AsyncStorage.removeItem(nameStoreArrVeNumber);
					AsyncStorage.setItem(nameStoreArrVeNumber, result);

					var result = JSON.stringify(dataVeHuy);
					AsyncStorage.removeItem(nameStoreArrVeHuy);
					AsyncStorage.setItem(nameStoreArrVeHuy, result);

					var result = JSON.stringify(dataVeXuongXe);
					AsyncStorage.removeItem(nameStoreArrVeXuongXe);
					AsyncStorage.setItem(nameStoreArrVeXuongXe, result);

					var result = JSON.stringify(dataInfo);
					AsyncStorage.removeItem(nameStoreArrInfo);
					AsyncStorage.setItem(nameStoreArrInfo, result);

					var result = JSON.stringify(dataChoTang);
					AsyncStorage.removeItem(nameStoreArrChoTang);
					AsyncStorage.setItem(nameStoreArrChoTang, result);

					var result = JSON.stringify(dataBen);
					AsyncStorage.removeItem(nameStoreArrBen);
					AsyncStorage.setItem(nameStoreArrBen, result);

					var result = JSON.stringify(dataBenTen);
					AsyncStorage.removeItem(nameStoreArrBenTen);
					AsyncStorage.setItem(nameStoreArrBenTen, result);

					var result = JSON.stringify(dataBenMa);
					AsyncStorage.removeItem(nameStoreArrBenMa);
					AsyncStorage.setItem(nameStoreArrBenMa, result);

					var result = JSON.stringify(dataDMVe);
					AsyncStorage.removeItem(nameStoreArrDMVe);
					AsyncStorage.setItem(nameStoreArrDMVe, result);

					var result = JSON.stringify(dataVe);
					AsyncStorage.removeItem(nameStoreArrVe);
					AsyncStorage.setItem(nameStoreArrVe, result);

					var result = JSON.stringify(dataDMVeTen);
					AsyncStorage.removeItem(nameStoreArrDMVeTen);
					AsyncStorage.setItem(nameStoreArrDMVeTen, result);

					var result = JSON.stringify(dataDMVeTien);
					AsyncStorage.removeItem(nameStoreArrDMVeTien);
					AsyncStorage.setItem(nameStoreArrDMVeTien, result);

					var result = JSON.stringify(dataGiaVe);
					AsyncStorage.removeItem(nameStoreArrGiaVe);
					AsyncStorage.setItem(nameStoreArrGiaVe, result);

					var result = JSON.stringify(dataGiaVeVip);
					AsyncStorage.removeItem(nameStoreArrGiaVeVip);
					AsyncStorage.setItem(nameStoreArrGiaVeVip, result);

				}
			} catch (e) {
				this.setState({
					loading: false
				});
			}
		}

		var total_danh_sach_cho = 0;
		if (dataInfo != null) {
			total_danh_sach_cho = dataInfo.total_danh_sach_cho;
		}

		let ben_dau = 0;
		let ben_cuoi = 0;

		for (var i = 0; i < Object.keys(dataBen).length > 0; i++) {
			ben_cuoi = dataBen[i].bex_id;
			if (i == 0) {
				ben_dau = dataBen[i].bex_id;
			}
		}

		that.setState({
			infoAdm: infoAdm,
			arrVeNumber: dataVeNumber,
			arrVeHuy: dataVeHuy,
			arrVeXuongXe: dataVeXuongXe,
			arrInfo: dataInfo,
			arrChoTang: dataChoTang,
			arrBen: dataBen,
			arrBenTen: dataBenTen,
			arrBenMa: dataBenMa,
			arrVe: dataVe,
			arrDMVe: dataDMVe,
			arrDMVeTen: dataDMVeTen,
			arrDMVeTien: dataDMVeTien,
			arrGiaVe: dataGiaVe,
			arrGiaVeVip: dataGiaVeVip,
			notifiCountDanhSachCho: total_danh_sach_cho,
			loading: false,
		});

		let price =  await this.getPriceBen(ben_dau, ben_cuoi);

		this.setState({
			priceAllTrips: price,
		});

		//Dong bo du lieu lien tuc
		this.state.timeSync = (timeSync);
		this.getSyncArrVeNumber()
	}

	async getSyncArrVeNumber() {
		var sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet
		});
		let that = this;
		var sttInternet = this.state.sttInternet;
		let timeSync = this.state.timeSync;
		let infoAdm = this.state.infoAdm;
		let did_id = that.state.did_id;

		this.state.clearSync = setInterval(() => {
			if (sttInternet == true) {
				//Dong bo du lieu store
				var arrVeNumber = this.state.arrVeNumber;
				var dataVeNumber = JSON.stringify(arrVeNumber);
				console.log('dong bo');
				console.log(arrVeNumber);
				var arrVeHuy = this.state.arrVeHuy;
				var dataVeHuy = JSON.stringify(arrVeHuy);
				var arrVeXuongXe = this.state.arrVeXuongXe;
				var dataVeXuongXe = JSON.stringify(arrVeXuongXe);
				let params = {
					dataVe: dataVeNumber,
					dataVeHuy: dataVeHuy,
					dataVeXuongXe: dataVeXuongXe
				};
				let headers = {
					"Content-Type": "multipart/form-data"
				}

				let opts = {
					method: 'POST',
					headers: headers
				}
				let formData = new FormData();
				formData.append("data", JSON.stringify(params));
				opts.body = formData;

				let urlApi = domain + '/api/laixe_v1/sync_so_do_giuong.php?type=laixe&token=' + infoAdm.token + '&adm_id=' + infoAdm.adm_id + '&did_id=' + did_id
				console.log(urlApi);
				//Lay du lieu
				try {
					fetch(urlApi, opts)
						.then((response) => response.json())
						.then((responseJson) => {
							that.setState({
								arrVeNumber: responseJson.arrVeNumber
							});
						})
						.catch((error) => {
							console.error(error);
						});
				} catch (e) {
					alert('Lỗi hệ thống đồng bộ sơ đồ giường! Vui lòng liên hệ bộ phận kĩ thuật');
					Actions.welcome({ type: 'reset' });
					// console.log(e);
				}
			}

		}, timeSync);
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextState.chuyenVaoCho == undefined) {
			nextState.chuyenVaoCho = nextProps.dataParam.chuyenVaoCho;
		}
		nextState.arrVeNumber = nextState.arrVeNumber;
	}

	componentWillUnmount() {
		clearTimeout(this.state.clearTimeout);
		clearInterval(this.state.clearSync);
	}

	render() {
		let dataParam = {
			did_id: this.props.dataParam.did_id,
			countCho: this.state.notifiCountDanhSachCho
		};

		return (
			<View style={{ height: this.state.layout.height }} onLayout={this._onLayout}>
				<ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
					{!this.state.loading && this.state.arrInfo != null && <ComSDGInfo SDGInfo={this.state.arrInfo} SDGPrice={this.state.priceAllTrips} arrChoTang={this.state.arrChoTang} uri={this.state.uri}/>}
					{!this.state.loading && this.state.arrInfo == null &&
						<CardItem key="data_null">
							<View>
								<Text>Chưa cập nhật thông tin!</Text>
							</View>
						</CardItem>
					}
					<View style={{ flexDirection: 'column', flex: 1 }}>
						{this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
						{/* <Button key="baocao" block success style={styles.marginTopButton} onPress={() => { this._handleReportSales() }}>Báo cáo doanh thu</Button> */}
						{!this.state.loading && this._renderSDG()}
					</View>
				</ScrollView>

				{/* <Modal style={[styles.modal, styles.wrapPopup, { height: this.state.layout.height }]} position={"center"} ref={"modalReport"} isDisabled={this.state.isDisabled}>
					{this._renderModalReport()}
				</Modal> */}

				<Modal style={[styles.modal, styles.wrapPopup, { height: this.state.layout.height }]} position={"center"} ref={"modalPopup"} isDisabled={this.state.isDisabled}>
					{this._renderModalBen(this.state.resultsBen)}
				</Modal>

				<Modal style={[styles.modal, styles.wrapPopup, { height: this.state.layout.height }]} position={"center"} ref={"modalBenXe"} isDisabled={this.state.isDisabled}>
					{this._renderModalBenXe(this.state.resultsBen, this.state.benActive, this.state.benActiveType)}
				</Modal>

				<Modal style={[styles.modal, styles.wrapPopup, { height: this.state.layout.height }]} position={"center"} ref={"modalDMVe"} isDisabled={this.state.isDisabled}>
					{this._renderModalDMVe(this.state.resultVe, this.state.key_danh_muc)}
				</Modal>

				<Modal style={[styles.modal, styles.wrapPopup, { height: this.state.layout.height }]} position={"center"} ref={"modalKM"} isDisabled={this.state.isDisabled}>
					{this._renderModalKM()}
				</Modal>

				<Modal style={[styles.modal, styles.wrapPopup, { height: this.state.layout.height }]} position={"center"} ref={"modalListCodeKM"} isDisabled={this.state.isDisabled}>
					{this._renderModalListCodeKM()}
				</Modal>

				<Modal style={[styles.modalAction, styles.wrapPopup, { height: this.state.layout.height }]} position={"center"} ref={"modalInfoVe"} isDisabled={this.state.isDisabled}>
					{this._renderButtonAction()}
				</Modal>

				<ComSDGFooter dataParam={dataParam} />

				{this.state.chuyenVaoCho &&
					<View style={{ position: 'absolute', top: 60, right: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 10 }}>
						<Text style={{ color: '#fff' }}>Chọn chỗ trống để xếp khách lên giường "{this.props.dataParam.nameGiuongXepCho}". Nếu chưa xếp chỗ thì click vào đây để hủy thao tác:</Text>
						<TouchableOpacity onPress={() => this._handleHuyChuyenVaoCho()} style={{ backgroundColor: '#f95454', padding: 10, width: 110, alignItems: 'center', marginTop: 10 }}>
							<Text style={{ color: '#fff' }}>Hủy thao tác</Text>
						</TouchableOpacity>
					</View>}

				{this.state.themVe.check &&
					<View style={{ position: 'absolute', top: 60, right: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 10 }}>
						<Text style={{ color: '#fff', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>Chọn chỗ trống để Thêm Vé</Text>
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity onPress={() => this._handleThemVeDone()} style={{ flex: 1, backgroundColor: '#00bfff', padding: 10, width: 110, alignItems: 'center', marginTop: 10 }}>
								<Text style={{ color: '#fff', fontWeight: 'bold' }}>Xong</Text>
							</TouchableOpacity>
						</View>
					</View>}
			</View>
		);
	}

	_renderSDG() {
		var html = [];
		var arrChoTang = this.state.arrChoTang;
		if (arrChoTang != null) {
			if (arrChoTang[1] != undefined) {
				html.push(
					<Card key={'tang_1'} style={[styles.paddingContent]}>
						<CardItem header style={{ alignItems: 'center' }}>
							<Text style={{ fontSize: 20 }}>Tầng 1</Text>
						</CardItem>

						<CardItem style={{ marginTop: -20 }}>
							{this._renderTang(arrChoTang[1], 1)}
						</CardItem>

					</Card>
				);
			}

			if (arrChoTang[3] != undefined) {
				html.push(
					<Card key={'tang_3'} style={[styles.paddingContent, { marginTop: -10 }]}>
						<CardItem>
							{this._renderTang(arrChoTang[3], 3)}
						</CardItem>

					</Card>
				);
			}
			if (arrChoTang[2] != undefined) {
				html.push(
					<Card key={'tang_2'} style={styles.paddingContent}>
						<CardItem header style={{ alignItems: 'center' }}>
							<Text style={{ fontSize: 20 }}>Tầng 2</Text>
						</CardItem>

						<CardItem style={{ marginTop: -20 }}>
							{this._renderTang(arrChoTang[2], 2)}
						</CardItem>
					</Card>
				);
			}
			if (arrChoTang[4] != undefined) {
				html.push(
					<Card key={'tang_4'} style={[styles.paddingContent, { marginTop: -10 }]}>
						<CardItem>
							{this._renderTang(arrChoTang[4], 4)}
						</CardItem>

					</Card>
				);
			}

			if (arrChoTang[5] != undefined) {
				html.push(
					<Card key={'tang_5'} style={[styles.paddingContent]}>
						{/* <CardItem header>
							<Header style={{ backgroundColor: 'rgba(0,0,0,0)', marginLeft: -15, marginTop: -15 }}>
								<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ghế Sàn</Text>
							</Header>
						</CardItem>

						<CardItem style={{ marginTop: -20 }}>
							{this._renderTang(arrChoTang[5], 5)}
						</CardItem> */}

						<CardItem header>
							<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ghế Sàn</Text>
						</CardItem>

						<CardItem style={{ paddingTop: 15 }}>
							{this._renderTang(arrChoTang[5], 5)}
						</CardItem>
					</Card>
				);
			}

		}
		return html;
	}

	_renderTang(dataTang, numberTang) {
		let html = [];
		let arrInfo = this.state.arrInfo;
		let colorBorder = '';
		if (dataTang != undefined) {
			for (var i in dataTang) {
				var item = dataTang[i];
				var htmlChild = [];
				for (var j in item) {
					var idGiuong = item[j].sdgct_number;
					var dataGiuong = this.state.arrVeNumber[idGiuong];
					var newPrice = dataGiuong.bvv_price / 1000;
					var priceGiuongActive = newPrice.toFixed(0).replace(/./g, function (c, i, a) {
						return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
					});

					let newRootPrice = this.state.rootPrice;

					if (item[j].bvop_hinh_thuc == 0) {
						newRootPrice = this.state.rootPrice - Number(item[j].bvop_toan_tuyen);
					}
					else {
						if (item[j].bvop_hinh_thuc == 1) {
							newRootPrice = this.state.rootPrice * (100 - Number(item[j].bvop_phan_tram_toan_tuyen)) / 100;
						}
					}

					let newRootPriceend = newRootPrice > Number(arrInfo.tuy_gia_nho_nhat) ? newRootPrice : Number(arrInfo.tuy_gia_nho_nhat);
					newRootPriceend = Math.floor(newRootPriceend / 5000) * 5000;

					var priceGiuongUnActive = (newRootPriceend / 1000).toFixed(0).replace(/./g, function (c, i, a) {
						return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
					});

					priceGiuongActive += 'K';
					priceGiuongUnActive += 'K';
					let bvv_status_state = dataGiuong.bvv_status;
					let bvv_id_can_chuyen = this.state.bvv_id_can_chuyen;
					var style_sdg = [styles.activeGiuong, styles.opacityBg];

					if ((bvv_status_state > 0 || dataGiuong.bvv_status > 0) &&
						(bvv_status_state < 4 || dataGiuong.bvv_status < 4)) {
						if (bvv_id_can_chuyen == dataGiuong.bvv_id) {
							style_sdg = [styles.activeGiuong, styles.opacityBg, styles.borderChuyenChoo];
						}
					} else if (bvv_status_state == 11 || dataGiuong.bvv_status == 11) {
						style_sdg = [styles.activeLenXe, styles.opacityBg];
						if (bvv_id_can_chuyen == dataGiuong.bvv_id) {
							style_sdg = [styles.activeLenXe, styles.opacityBg, styles.borderChuyenChoo];
						}
					} else if ((bvv_status_state == 4 || dataGiuong.bvv_status == 4) ||
						(bvv_status_state > 100 || dataGiuong.bvv_status > 100)) {
						style_sdg = [styles.activeThanhToan, styles.opacityBg];
						if (bvv_id_can_chuyen == dataGiuong.bvv_id) {
							style_sdg = [styles.activeThanhToan, styles.opacityBg, styles.borderChuyenChoo];
						}
					}

					if (item[j].border_color) {
						colorBorder = item[j].border_color;
					}
					else {
						colorBorder = '#131722';
					}

					if (Object.keys(item).length <= 2) {
						if (j == 1) {
							htmlChild.push(
								<Col key={'idg_rong_' + idGiuong}>
									<TouchableOpacity style={styles.opacityBg}>
										<Text style={styles.textCenter}></Text>
									</TouchableOpacity>
								</Col>
							);
						}
					}

					if (bvv_status_state > 0 || dataGiuong.bvv_status > 0) {
						htmlChild.push(
							<Col key={'idg_' + idGiuong} style={[styles.borderCol, { borderColor: colorBorder }]}>
								<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={style_sdg}>
									<View style={{ flexDirection: 'row' }}>
										<View style={{ flex: 1 }}>
											<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
										</View>
										<View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 5 }}>
											<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{priceGiuongActive}</Text>
										</View>
									</View>
									{dataGiuong.bvv_phone != '' &&
										<Text style={[styles.textActiveGiuong, styles.bold]}>{dataGiuong.bvv_phone}</Text>
									}
									<Text style={[styles.textActiveGiuong, styles.small]}>{dataGiuong.bvv_ben_a} - {dataGiuong.bvv_ben_b}</Text>
									{(dataGiuong.bvv_diem_don_khach != '' || dataGiuong.bvv_diem_tra_khach != '') &&
										<Text style={[styles.textActiveGiuong, styles.small]}>{dataGiuong.bvv_diem_don_khach} - {dataGiuong.bvv_diem_tra_khach}</Text>
									}
									{dataGiuong.bvv_ghi_chu != "" &&
										<Text style={[styles.textActiveGiuong, styles.small]}>GC: {dataGiuong.bvv_ghi_chu}</Text>
									}
									{dataGiuong.bvv_seri != "" && dataGiuong.bvv_seri != 0 &&
										<Text style={[styles.textActiveGiuong, styles.small]}>Seri: {dataGiuong.bvv_danh_muc}/{dataGiuong.bvv_seri}</Text>
									}
									{dataGiuong.bvv_ten_khach_hang != "" &&
										<Text style={[styles.textActiveGiuong, styles.name]}>{dataGiuong.bvv_ten_khach_hang}</Text>
									}
								</TouchableOpacity>
							</Col>
						);

					} else {
						htmlChild.push(
							<Col key={'idg_trong_' + idGiuong} style={[styles.borderCol, { borderColor: colorBorder }]}>
								<View style={[styles.opacityNullBg, { flex: 1 }]}>
									<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
									<Text style={[styles.textCenter, { fontSize: 20 }]}>{priceGiuongUnActive}</Text>
									<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong, newRootPriceend)} style={{ position: 'absolute', top: 0, left: 0, width: 300, height: 300 }}></TouchableOpacity>
								</View>
							</Col>
						);
					}
				}
				html.push(<Grid key={'hang_' + i + numberTang} style={{ marginRight: -8, marginLeft: -8, width: (this.state.layout.width - 20) }}>{htmlChild}</Grid>);
			}
		}

		return html;
	}

	_unsetActiveGiuong(id) {
		let dataGiuong = this.state.arrVeNumber[id];

		// start refactpring code 

		this.setState({
			currentIdGiuong: id,
			// bvv_id_can_chuyen: 0,
			// bvv_bvn_id_muon_chuyen: 0,
			// bvv_number_muon_chuyen: 0
		});

		// new code
		this.state.bvv_id_can_chuyen = 0;
		this.state.bvv_bvn_id_muon_chuyen = 0;
		this.state.bvv_number_muon_chuyen = 0;

		// end refactoring code
		this.openModalInfoVe();
	}

	openModal(id) {
		this.refs.modalPopup.open();
	}

	closeModal(id) {
		this.refs.modalPopup.close();
	}

	// openModalReportSales() {
	// 	this.refs.modalReport.open();
	// }

	// closeModalReportSales() {
	// 	this.refs.modalReport.close();
	// }

	openModalBenXe(id) {
		this.refs.modalBenXe.open();
	}

	closeModalBenXe(id) {
		this.refs.modalBenXe.close();
	}

	openModalDMVe(id) {
		this.refs.modalDMVe.open();
	}

	closeModalDMVe(id) {
		this.refs.modalDMVe.close();
	}

	openModalKM(id) {
		this.refs.modalKM.open();
	}

	closeModalKM(id) {
		this.refs.modalKM.close();
	}

	openModalListCodeKM(id) {
		this.refs.modalListCodeKM.open();
	}

	closeModalListCodeKM(id) {
		this.refs.modalListCodeKM.close();
	}

	openModalInfoVe(id) {
		this.refs.modalInfoVe.open();
	}

	closeModalInfoVe(id) {
		this.refs.modalInfoVe.close();
	}

	_renderButtonAction() {
		let html = [];
		let htmlForm = [];
		let arrThemve = this.state.arrThemve;
		let checkNumberThemVe = false;
		if (this.state.arrVeNumber != null) {
			let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
			for (var i = 0; i < arrThemve.length; i++) {
				if (arrThemve[i].bvv_number == this.state.currentIdGiuong) {
					checkNumberThemVe = true;
					break;
				}
			}

			if (checkNumberThemVe) {
				html.push(<Button key="3" block danger style={styles.marginTopButton} onPress={this._handleHuyVeCurrent.bind(this)}>Hủy Vé</Button>);
			} else {
				if (this.state.currentIdGiuong != 0) {
					if (dataGiuong.bvv_status == 11) {
						html.push(<Button key="1" block success style={styles.marginTopButton} onPress={this._handleXuongXe.bind(this)}>Xuống xe</Button>);
					} else {
						html.push(<Button key="2" block success style={styles.marginTopButton} onPress={this._handleLenXe.bind(this)}>Xác Nhận Lên Xe</Button>);
						html.push(<Button key="7" block style={styles.marginTopButton} onPress={this._handleChinhSua.bind(this)}>Chỉnh sửa</Button>);
						if (this.state.bvv_id_can_chuyen != this.state.currentIdGiuong) {
							html.push(<Button key="5" block info style={styles.marginTopButton} onPress={this._handleChuyenChoo.bind(this)}>Chuyển chỗ</Button>);
						}
						html.push(<Button key="6" block success style={styles.marginTopButton} onPress={this._handleThemVe.bind(this)}>Thêm vé</Button>);
						html.push(<Button key="3" block danger style={styles.marginTopButton} onPress={this._handleHuyVe.bind(this)}>Hủy Vé</Button>);
						html.push(<Button key="4" block warning style={styles.marginTopButton} onPress={this._handleChuyenTro.bind(this)}>Chuyển chờ</Button>);

					}
				}


			}

			if (this.state.currentIdGiuong != 0) {
				var diem_di = '';
				var diem_den = '';
				var arrBenTen = this.state.arrBenTen;

				if (arrBenTen[dataGiuong.bvv_bex_id_a] != undefined) {
					diem_di = arrBenTen[dataGiuong.bvv_bex_id_a];
				}
				if (arrBenTen[dataGiuong.bvv_bex_id_a] != undefined) {
					diem_den = arrBenTen[dataGiuong.bvv_bex_id_b];
				}


				htmlForm.push(
					<View key="1" style={{ width: this.state.layout.width, height: (this.state.layout.height - 110), paddingTop: 10, paddingBottom: 10 }}>
						<View style={{ position: 'absolute', zIndex: 9, top: 10, right: 10, width: 50, height: 50 }}>
							<TouchableOpacity onPress={() => this.closeModalInfoVe()} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
								<Icon name="md-close" style={{ fontSize: 30 }} />
							</TouchableOpacity>
						</View>
						<ScrollView keyboardShouldPersistTaps="always" style={{ width: this.state.layout.width }}>
							<View style={{ margin: 10 }}>
								<Text>Họ và tên: <Text style={styles.bold}>{dataGiuong.bvv_ten_khach_hang}</Text></Text>
								<Text>Số điện thoại: <Text style={styles.bold}>{dataGiuong.bvv_phone}</Text></Text>
								<Text>Điểm đón: <Text style={styles.bold}>{dataGiuong.bvv_diem_don_khach}</Text></Text>
								<Text>Điểm trả: <Text style={styles.bold}>{dataGiuong.bvv_diem_tra_khach}</Text></Text>
								<Text>Nơi đi & đến: <Text style={styles.bold}>{diem_di} -> {diem_den}</Text></Text>
								<Text>Giá vé: <Text style={styles.bold}>{Common.formatPrice(dataGiuong.bvv_price)} VNĐ</Text></Text>
								<Text>Ghi chú: <Text style={styles.bold}>{dataGiuong.bvv_ghi_chu}</Text></Text>
								{dataGiuong.bvv_seri != '' && dataGiuong.bvv_seri != 0 &&
									<Text>Seri: <Text style={styles.bold}>{dataGiuong.bvv_danh_muc}/{dataGiuong.bvv_seri}</Text></Text>
								}
								{html}
							</View>
						</ScrollView>
					</View>
				);
			}
		}
		return htmlForm;
	}

	_renderModalBen(data) {
		let html = [],
			htmlPrice = [],
			htmlButton = [],
			htmlKM = [];
		if (this.state.status == 200) {
			let keyDiemDi = this.state.keyDiemDi,
				keyDiemDen = this.state.keyDiemDen,
				currentDiemDen = '',
				currentDiemDi = '',
				currentDMVe = '',
				currentKM = '',
				codeKM = '',
				seri = '',
				key_KM = 0;
			type = this.state.type,
				// ve_price = this.state.newrootPrive - this.state.decreasePrice;
				ve_price = this.state.rootPrice - this.state.decreasePrice;
			rootPrice = this.state.rootPrice;
			// rootPrice = this.state.newrootPrive;
			if (this.state.nameKM != '') {
				currentKM = this.state.nameKM;
			}
			else {
				currentKM = this.state.arrKM[this.state.arrKM.length - 1].value;
				this.state.nameKM = currentKM;
			}

			if (this.state.key_KM > 0) {
				key_KM = this.state.key_KM;
			}
			else {
				key_KM = this.state.arrKM[this.state.arrKM.length - 1].key;
				this.state.key_KM = key_KM;
			}

			if (this.state.nameDiemDen != '') {
				currentDiemDen = this.state.nameDiemDen;
			}

			if (this.state.nameDMVe != '') {
				currentDMVe = this.state.nameDMVe;
			}

			if (this.state.nameDiemDi != '') {
				currentDiemDi = this.state.nameDiemDi;
			}

			if (this.state.codeKM != '') {
				codeKM = this.state.codeKM;
			}

			if (this.state.seri != '') {
				seri = this.state.seri;
			}

			if (this.props.dataParam.bvh_id_can_chuyen != undefined && this.props.dataParam.bvh_id_can_chuyen > 0) {
				html.push(<Button key="9" block info style={styles.marginTopButton} onPress={this._handleXacNhanChuyenVaoCho.bind(this)}>Xác nhận Chuyển vào chỗ</Button>);
			} else {
				if (this.state.bvv_id_can_chuyen <= 0) {
					if (data.length > 0) {
						let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong],
							currentPrice = dataGiuong.bvv_price,
							priceConver = 0;
						rootPriceConvert = '0';
						if (type == 'update') {
							if (ve_price > 0) {
								currentPrice = ve_price;
							}
							if (currentPrice > 0) {
								priceConver = Common.formatPrice(currentPrice);
								rootPriceConvert = Common.formatPrice(rootPrice);
							}
						} else {
							if (ve_price > 0) {
								priceConver = Common.formatPrice(ve_price);
								rootPriceConvert = Common.formatPrice(rootPrice);
							}
						}
						Object.keys(data).map(function (key) {
							if (keyDiemDi != '' && keyDiemDi == data[key].key) {
								if (type == 'update') {
									currentDiemDi = data[key].value;
								}
							}
						});

						Object.keys(data).map(function (key) {
							if (keyDiemDen != '' && keyDiemDen == data[key].key) {
								if (type == 'update') {
									currentDiemDen = data[key].value;
								}
							}
						});

						htmlPrice.push(
							<View key="8" style={{ flexDirection: 'column', justifyContent: 'center', margin: 5 }}>
								<View key="5" style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
									<Text style={{ flex: 1 }}>Giá gốc:</Text>
									<Text style={{ flex: 4, color: 'red', fontSize: 20 }}>{rootPriceConvert} VNĐ</Text>
								</View>
								<View key="9" style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
									<Text style={{ flex: 1 }}>Giảm:</Text>
									<Text style={{ flex: 4, color: 'red', fontSize: 20 }}>{this.state.decreasePrice == '' ? '0' : Common.formatPrice(this.state.decreasePrice)} VNĐ</Text>
								</View>
								<View key="10" style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
									<Text style={{ flex: 1 }}>Giá vé:</Text>
									<Text style={{ flex: 4, color: 'red', fontSize: 20 }}>{priceConver} VNĐ</Text>
								</View>
							</View>
						);

						if (type == 'update') {
							htmlButton.push(
								<Button style={{ marginRight: 10, marginLeft: 10, marginBottom: 50, height: 50 }} key="6" block success onPress={this.updateGiuong.bind(this, this.state.currentIdGiuong)}>Cập nhật</Button>
							);
						} else {
							htmlButton.push(
								<Button style={{ marginRight: 10, marginLeft: 10, marginBottom: 50, height: 50 }} key="6" block success onPress={this.bookGiuong.bind(this, this.state.currentIdGiuong)}>Đặt vé</Button>
							);
						}

						if (key_KM == 3) {
							htmlKM.push(
								<View key="6" style={styles.form_mdp_content}>
									<Input style={{ textAlign: 'left', textAlignVertical: 'center' }}
										keyboardType="numeric" placeholder="Số tiền giảm"
										value={this.state.decreasePrice}
										onChange={(event) => this.calculatePrice(event)} />
								</View>);
						}

						if (key_KM == 6) {
							htmlKM.push(
								// <TouchableOpacity key="1" onPress={() => this._showListCodeKM()} style={[styles.form_mdp_content, { height: 45 }]}>
								// 	<Text style={{ textAlign: 'left', textAlignVertical: 'center' }}>
								// 		{codeKM == '' ? 'Nhập mã khuyến mại' : codeKM}
								// 	</Text>
								// </TouchableOpacity>

								<View key={1}>
									<View key={1} style={{ flexDirection: 'row', marginHorizontal: 5 }}>
										<View style={{ flex: 3, borderWidth: 1, borderRadius: 10, marginRight: 5 }} >
											<Input
												placeholder="Nhập mã khuyến mại"
												onChange={(event) => this.setState({ codeKM: event.nativeEvent.text })}
												value={this.state.codeKM}
											/>
										</View>
										<View style={{ flex: 1, borderWidth: 1, borderRadius: 10, marginLeft: 5, backgroundColor: '#5cb85c', borderColor: '#5cb85c' }} >
											<TouchableOpacity key="1" onPress={() => this.checkCodeKM()} style={{ flex: 1, justifyContent: 'center' }}>
												<Text style={{ textAlign: 'center', textAlignVertical: 'center', }}>
													Sử dụng
											</Text>
											</TouchableOpacity>
										</View>
									</View>
									{(this.state.mesKM != null) && (this.state.mesKM != '') &&
										<Text style={{ textAlign: 'center', textAlignVertical: 'center', color: 'red', margin: 5 }}>
											{this.state.mesKM}
										</Text>
									}
								</View>
							);
						}

						html.push(
							<View key="1" style={{ width: this.state.layout.width, height: this.state.layout.height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

								<View style={styles.close_popup}>
									<TouchableOpacity onPress={() => {
										this.setState({
											rootPrice: this.state.priceAllTrips,
										});
										this.state.key_KM = 0;
										this.state.nameKM = '';
										this.state.nameDMVe = '';
										this.closeModal();
									}} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
										<Icon name="md-close" style={{ fontSize: 30 }} />
									</TouchableOpacity>
								</View>
								{!this.state.sttInternet && <Text>Không có internet. Xin hãy kiểm tra kết nối!</Text>}

								<ScrollView style={{ width: this.state.layout.width }} keyboardShouldPersistTaps="always">
									<TouchableOpacity onPress={() => this._showBenXe(this.state.keyDiemDi, 1)}>
										<View style={styles.form_mdp_content}>
											<Icon style={styles.form_update_icon} name="md-bus" />
											<Text style={styles.form_mdp_label}>Điểm đi:</Text>
											<Text style={{ marginLeft: 10, textAlignVertical: 'center' }}>
												{currentDiemDi == '' ? 'Chọn điểm đến' : currentDiemDi}
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._showBenXe(this.state.keyDiemDen, 2)}>
										<View style={styles.form_mdp_content}>
											<Icon style={styles.form_update_icon} name="ios-bus" />
											<Text style={styles.form_mdp_label}>Điểm đến:</Text>
											<Text style={{ marginLeft: 10, textAlignVertical: 'center' }}>
												{currentDiemDen == '' ? 'Chọn điểm đến' : currentDiemDen}
											</Text>
										</View>
									</TouchableOpacity>
									<InputGroup style={styles.form_item}>
										<Icon style={styles.form_update_icon} name='ios-call' />
										<Input style={{ textAlignVertical: 'center' }}
											placeholder="SDT"
											keyboardType="numeric"
											value={this.state.phone}
											onChange={(event) => this.setState({ phone: event.nativeEvent.text })} />
									</InputGroup>
									<InputGroup style={styles.form_item}>
										<Icon style={styles.form_update_icon} name='ios-person' />
										<Input style={{ textAlignVertical: 'center' }}
											placeholder="Họ và Tên"
											value={this.state.fullName}
											onChange={(event) => this.setState({ fullName: event.nativeEvent.text })} />
									</InputGroup>

									<View style={{ flex: 1, flexDirection: 'row' }}>
										<InputGroup style={[styles.form_item, { flex: 3 }]}>
											<Icon style={styles.form_update_icon} name='ios-home' />
											<Input style={{ textAlignVertical: 'center' }}
												placeholder="Nơi đón"
												value={this.state.diem_don}
												onChange={(event) => this.setState({ diem_don: event.nativeEvent.text })} />
										</InputGroup>

										<CheckBox style={{ flex: 1 }} checkboxStyle={{ marginTop: 10, borderColor: 'red' }} label='' checked={this.state.trung_chuyen_don} onChange={(checked) => { this.setState({ trung_chuyen_don: !this.state.trung_chuyen_don }) }} />
									</View>
									<View style={{ flex: 1, flexDirection: 'row', }}>
										<InputGroup style={[styles.form_item, { flex: 3 }]}>
											<Icon style={styles.form_update_icon} name='ios-home-outline' />
											<Input style={{ textAlignVertical: 'center' }}
												placeholder="Nơi trả"
												value={this.state.diem_tra}
												onChange={(event) => this.setState({ diem_tra: event.nativeEvent.text })} />
										</InputGroup>
										<CheckBox style={{ flex: 1 }} checkboxStyle={{ marginTop: 10, borderColor: 'red' }} label='' checked={this.state.trung_chuyen_tra} onChange={(checked) => this.setState({ trung_chuyen_tra: !this.state.trung_chuyen_tra })} />
									</View>
									<InputGroup style={styles.form_item}>
										<Icon style={styles.form_update_icon} name='ios-create-outline' />
										<Input style={{ textAlignVertical: 'center' }}
											placeholder="Ghi Chú"
											value={this.state.ghi_chu} onChange={(event) => this.setState({ ghi_chu: event.nativeEvent.text })} />
									</InputGroup>


									<TouchableOpacity onPress={() => this._showKM()} >
										<View style={styles.form_mdp_content}>
											<Icon style={styles.form_update_icon} name="ios-menu" />
											<Text style={styles.form_mdp_label}>KM:</Text>
											<Text style={{ textAlignVertical: 'center', paddingLeft: 10 }}>{currentKM == '' ? 'Hình thức KM' : currentKM}</Text>
										</View>
									</TouchableOpacity>

									{htmlKM}

									<TouchableOpacity onPress={() => this._showDMVe(this.state.key_danh_muc)}>
										<View style={styles.form_mdp_content}>
											<Icon style={styles.form_update_icon} name="ios-menu" />
											<Text style={styles.form_mdp_label}>DM vé:</Text>
											<Text style={{ textAlignVertical: 'center', paddingLeft: 10 }}>{currentDMVe == '' ? 'Chọn danh mục' : currentDMVe}</Text>
										</View>
									</TouchableOpacity>
									<View style={styles.form_item}>
										<Icon style={styles.form_update_icon} name='ios-key' />
										{/* <Input placeholder="Seri" value={this.state.seri} onChange={(event) => this.setState({ seri: event.nativeEvent.text })} /> */}
										<Text style={{ textAlignVertical: 'center', paddingLeft: 10 }}>{seri == '' ? 'Seri' : seri}</Text>
									</View>
									{htmlPrice}
									{htmlButton}
								</ScrollView>
							</View>
						);
					}
				}
			}
		}

		return html;
	}

	async checkCodeKM() {
		try {
			var keyDiemDi = this.state.keyDiemDi;
			var keyDiemDen = this.state.keyDiemDen;
			let ve_price =  await this.getPriceBen(keyDiemDi, keyDiemDen);
			let ve_price_linh_hoat = ve_price;

			if (this.state.codeKM && (this.state.codeKM.trim() != '')) {

				// let body = {
				// 	token: this.state.infoAdm.token,
				// 	adm_id: this.state.infoAdm.adm_id,
				// 	did_id: this.state.arrInfo.did_id,
				// 	bvv_id: this.state.bvv_id,
				// 	diem_di: this.state.keyDiemDi,
				// 	diem_den: this.state.keyDiemDen,
				// }

				// let data = await fetchData('api_get_giam_gia_linh_hoat', body, 'GET');

				// if (data.status != 200) {
				// 	alert(data.mes);
				// 	Actions.welcome({ type: 'reset' });
				// } else if (data.status == 200) {
				// 	ve_price_linh_hoat = (ve_price - data.price_discount) > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? (ve_price - data.price_discount) : Number(this.state.arrInfo.tuy_gia_nho_nhat);


				// }

				let body1 = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					did_id: this.state.arrInfo.did_id,
					phone: this.state.phone,
					// id: this.state.codeKM,
					diem_di: keyDiemDi,
					diem_den: keyDiemDen,
					giam_gia_text: this.state.codeKM,
					bvv_id: this.state.bvv_id,
				}

				let data1 = await fetchData('api_get_discount_detail', body1, 'GET');

				if (data1.status != 200) {
					// alert(data1.mes);
					// Actions.welcome({ type: 'reset' });
					if (data1.mes && (data1.mes.trim() != '')) {
						this.setState({
							mesKM: data1.mes,
							rootPrice: ve_price_linh_hoat,
							decreasePrice: '0',
							ve_price: ve_price_linh_hoat,
							loading: false
						});
					}
					else {
						this.setState({
							mesKM: 'Đã xảy ra lỗi khi kiểm tra mã giảm giá!',
							rootPrice: ve_price_linh_hoat,
							decreasePrice: '0',
							ve_price: ve_price_linh_hoat,
							loading: false
						});
					}
				} else if (data1.status == 200) {
					let price1 = (ve_price_linh_hoat - data1.price_discount) > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? (ve_price_linh_hoat - data1.price_discount) : Number(this.state.arrInfo.tuy_gia_nho_nhat);
					this.setState({
						rootPrice: ve_price_linh_hoat,
						decreasePrice: data1.price_discount.toString(),
						ve_price: price1,
						mesKM: '',
						loading: false
					});
					// this.state.arrCodeDiscount = Object.values(data1.data);
				}

			}
			else {
				this.setState({
					mesKM: 'Bạn chưa nhập mã khuyến mại',
					rootPrice: ve_price_linh_hoat,
					decreasePrice: '0',
					ve_price: ve_price_linh_hoat,
					loading: false
				});
			}

		} catch (error) {
			console.log(error);
		}
	}

	_renderModalBenXe(arrBen, benActive, benActiveType) {
		var htmlBen = [];
		if (arrBen != undefined) {
			let countData = arrBen.length;
			var itemBen = [];
			for (var i = 0; i < countData; i++) {
				itemBen = arrBen[i];
				let keyBenXe = itemBen.key;
				htmlBen.push(
					<CardItem key={'ben_' + i} style={{ shadowOpacity: 0, shadowColor: 'red', paddingTop: 10 }} onPress={() => this._renderPriceBen(keyBenXe, benActiveType)} >
						<View>
							<Text>{itemBen.value}</Text>
						</View>
					</CardItem>
				);

			}
		}
		return (
			<View key="1" style={{ width: this.state.layout.width, height: this.state.layout.height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

				<View style={styles.close_popup}>
					<TouchableOpacity onPress={() => this.closeModalBenXe()} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
						<Icon name="md-close" style={{ fontSize: 30 }} />
					</TouchableOpacity>
				</View>

				<ScrollView style={{ width: this.state.layout.width }} keyboardShouldPersistTaps="always">
					<Card key="group_card_bx" style={{ marginTop: 0 }}>{htmlBen}</Card>
				</ScrollView>
			</View>
		)
	}

	_renderModalDMVe(arrDMVe) {
		var htmlDM = [];
		if (arrDMVe != undefined) {
			let countData = arrDMVe.length;
			var itemDM = [];
			for (var i = 0; i < countData; i++) {
				itemDM = arrDMVe[i];
				let keyDMVe = itemDM.key;
				htmlDM.push(
					<CardItem key={'dm_' + i} style={{ shadowOpacity: 0, shadowColor: 'red', paddingTop: 10 }} onPress={() => this._renderDMActive(keyDMVe, this.state.ve_price)} >
						<View>
							<Text>{itemDM.value}</Text>
						</View>
					</CardItem>
				);

			}
		}
		return (
			<View key="1" style={{ width: this.state.layout.width, height: this.state.layout.height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

				<View style={styles.close_popup}>
					<TouchableOpacity onPress={() => this.closeModalDMVe()} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
						<Icon name="md-close" style={{ fontSize: 30 }} />
					</TouchableOpacity>
				</View>

				<ScrollView style={{ width: this.state.layout.width }} keyboardShouldPersistTaps="always">
					<Card key="group_card_dm" style={{ marginTop: 0 }}>{htmlDM}</Card>
				</ScrollView>
			</View>
		)
	}

	_renderModalKM() {
		var htmlKM = [];
		let arrKM = this.state.arrKM;
		let countData = arrKM.length;
		var itemKM = {};

		for (var i = 0; i < countData; i++) {
			itemKM = arrKM[i];
			let keyKM = itemKM.key;
			htmlKM.push(
				<CardItem key={'km_' + i} style={{ shadowOpacity: 0, shadowColor: 'red', paddingTop: 10 }} onPress={() => this._renderKMActive(keyKM)} >
					<View>
						<Text>{itemKM.value}</Text>
					</View>
				</CardItem>
			);
		}

		return (
			<View key="1" style={{ width: this.state.layout.width, height: this.state.layout.height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

				<View style={styles.close_popup}>
					<TouchableOpacity onPress={() => this.closeModalKM()} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
						<Icon name="md-close" style={{ fontSize: 30 }} />
					</TouchableOpacity>
				</View>

				<ScrollView style={{ width: this.state.layout.width }} keyboardShouldPersistTaps="always">
					<Card key="group_card_km" style={{ marginTop: 0 }}>{htmlKM}</Card>
				</ScrollView>
			</View>
		)
	}

	_renderModalListCodeKM() {
		var htmlListCodeKM = [];
		let arrCodeKM = this.state.arrCodeDiscount;
		let countData = arrCodeKM.length;
		// var itemCodeKM = '';
		for (var i = 0; i < arrCodeKM.length; i++) {
			let itemCodeKM = arrCodeKM[i];
			htmlListCodeKM.push(
				<CardItem key={'codeKm_' + i} style={{ shadowOpacity: 0, shadowColor: 'red', paddingTop: 10 }} onPress={() => this._renderCodeKMActive(itemCodeKM.km_id, itemCodeKM.price_dis, itemCodeKM.code, itemCodeKM.id)} >
					<View>
						<Text>{itemCodeKM.code}</Text>
					</View>
				</CardItem>
			);
		}

		return (
			<View key="1" style={{ width: this.state.layout.width, height: this.state.layout.height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

				<View style={styles.close_popup}>
					<TouchableOpacity onPress={() => this.closeModalListCodeKM()} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
						<Icon name="md-close" style={{ fontSize: 30 }} />
					</TouchableOpacity>
				</View>

				<ScrollView style={{ width: this.state.layout.width }} keyboardShouldPersistTaps="always">
					<Card key="group_card_bx" style={{ marginTop: 0 }}>{htmlListCodeKM}</Card>
				</ScrollView>
			</View>
		)
	}

	_showBenXe(benActive, type) {
		this.setState({
			benActive: benActive,
			benActiveType: type
		});
		this.openModalBenXe();
	}

	async _showDMVe(id_danh_muc) {
		var sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet,
		});

		if (this.state.sttInternet != false) {
			let body = {
				token: this.state.infoAdm.token,
				adm_id: this.state.infoAdm.adm_id,
				did_id: this.state.arrInfo.did_id,
				price: this.state.ve_price,
			}
			try {
				let data = await fetchData('api_get_dm_ve', body, 'GET');

				if (data.status == 404) {
					alert(data.mes);
					Actions.welcome({ type: 'reset' });
				} else if (data.status == 200) {
					if (data.mes != '') {
						alert(data.mes);
					}
					else {
						// get data danh muc
						let dataDM = data.dataDM;
						let newDataVe = [];

						for (var i = 0; i < dataDM.length > 0; i++) {
							newDataVe.push({ key: dataDM[i].bvd_id, value: dataDM[i].bvd_ma_ve, price: dataDM[i].bvd_menh_gia });
						}

						this.setState({
							resultVe: newDataVe,
						});

						this.setState({
							key_danh_muc: id_danh_muc
						});

						this.openModalDMVe();
					}
				}
			} catch (error) {
				alert(error);
			}

		}
	}

	async _showKM() {
		this.openModalKM();
	}

	async _showListCodeKM() {
		var sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet,
			nameDMVe: '',
			seri: '',
		});

		if (this.state.sttInternet != false) {
			try {

				let body = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					did_id: this.state.arrInfo.did_id,
					phone: this.state.phone,
					diem_di: this.state.keyDiemDi,
					diem_den: this.state.keyDiemDen,
				}

				let data1 = await fetchData('api_get_list_discount', body, 'GET');

				if (data1.status == 404) {
					alert(data1.mes);
					Actions.welcome({ type: 'reset' });
				} else if (data1.status == 200) {
					this.setState({
						arrCodeDiscount: Object.values(data1.data)
					});
					if (this.state.arrCodeDiscount.length == 0) {
						alert('Không có mã khuyến mãi');
					}
					else {
						this.openModalListCodeKM();
					}
				}

			} catch (error) {
				console.log(error);
			}
		}
	}

	_changeTreEm() {
		var val_tre_em = !this.state.tre_em;
		var ve_price = this.state.ve_price;
		if (!this.state.tre_em) {
			ve_price = ve_price / 2;
		} else {
			ve_price = ve_price * 2;
		}
		this.setState({
			tre_em: val_tre_em,
			ve_price: ve_price
		});
	}

	_renderDMActive(key, price) {
		checkServerAlive().then((sttInternet) => {
			this.setState({
				sttInternet: sttInternet,
				seri: ''
			});
		});

		if (this.state.sttInternet != false) {
			try {
				let params = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					did_id: this.state.arrInfo.did_id,
					dm_id: key,
					price: price,
				}
				fetchData('api_get_seri_min', params, 'GET')
					.then((data) => {
						if (data.status == 404) {
							stt_check_update = 0;
							alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
							Actions.welcome({ type: 'reset' });
						} else {
							// this.state.seri = data.seri;
							if (data.mes != "") {
								alert(data.mes);
							}
							else {
								this.setState({
									seri: data.seri.toString()
								});
							}
						}

					});
			} catch (e) {
				console.log(e);
			}
		}

		var dataDMVeTen = this.state.arrDMVeTen;
		if (dataDMVeTen != null && dataDMVeTen[key] != undefined) {
			nameDMVe = dataDMVeTen[key];
		}
		this.setState({
			key_danh_muc: key,
			nameDMVe: nameDMVe,
			loading: false
		});
		this.closeModalDMVe();
		return key;
	}

	async _renderKMActive(key) {
		var sttInternet = await checkServerAlive();
		// this.setState({
		// 	sttInternet: sttInternet,
		// });

		this.state.sttInternet = sttInternet;

		let nameKM = '';
		var dataKM = this.state.arrKM;

		for (let i = 0; i < dataKM.length; i++) {
			if (dataKM[i].key == key)
				nameKM = dataKM[i].value;
		}

		this.setState({
			key_KM: key,
			nameKM: nameKM,
			loading: false,
			codeKM: '',
			decreasePrice: '',
			ve_price: rootPrice,
			nameDMVe: '',
			seri: '',
			keyCodeDiscount: ''
		});

		// hinh thuc khuyen mai la tre em
		if (key == 4) {
			if (sttInternet != false) {
				let body = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					did_id: this.state.arrInfo.did_id,
					diem_di: this.state.keyDiemDi,
					diem_den: this.state.keyDiemDen,
					bvv_id: this.state.bvv_id
				}

				let data = await fetchData('api_get_discount_children', body, 'GET');

				if (data.status == 404) {
					alert(data.mes);
					Actions.welcome({ type: 'reset' });
				} else if (data.status == 200) {
					// get price discount
					let priceDiscount = data.price_discount;
					let vePrice = (this.state.rootPrice - priceDiscount) > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? (this.state.rootPrice - priceDiscount) : Number(this.state.arrInfo.tuy_gia_nho_nhat);
					this.setState({
						decreasePrice: priceDiscount.toString(),
						ve_price: vePrice,
					});
				}
			}
		}

		// hinh thuc khuyen mại giá vé linh hoạt
		if (key == 7) {
			if (sttInternet != false) {
				try {
					let body = {
						token: this.state.infoAdm.token,
						adm_id: this.state.infoAdm.adm_id,
						did_id: this.state.arrInfo.did_id,
						bvv_id: this.state.bvv_id,
						diem_di: this.state.keyDiemDi,
						diem_den: this.state.keyDiemDen,
					}

					let data1 = await fetchData('api_get_giam_gia_linh_hoat', body, 'GET');

					if (data1.status == 404) {
						alert(data1.mes);
						Actions.welcome({ type: 'reset' });
					} else if (data1.status == 200) {
						let vePrice1 = (this.state.rootPrice - data1.price_discount) > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? (this.state.rootPrice - data1.price_discount) : Number(this.state.arrInfo.tuy_gia_nho_nhat);
						this.setState({
							decreasePrice: data1.price_discount.toString(),
							ve_price: vePrice1,
						});
					}

				} catch (error) {
					console.log(error);
				}
			}
		}

		this.closeModalKM();
		return key;
	}

	async _renderCodeKMActive(key, discount, value, id) {
		this.setState({
			decreasePrice: discount.toString(),
			ve_price: (rootPrice - discount) > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? (rootPrice - discount) : Number(this.state.arrInfo.tuy_gia_nho_nhat),
			codeKM: value,
			key_km: id,
			key_codeKM: key,
			loading: false
		});
		this.closeModalListCodeKM();
		return key;
	}

	async _renderPriceBen(key, type) {
		var sttInternet = await checkServerAlive();
		this.state.sttInternet = sttInternet;

		var keyDiemDi = this.state.keyDiemDi;
		var keyDiemDen = this.state.keyDiemDen;

		if (type == 1) {
			keyDiemDi = key;
			this.setState({
				keyDiemDi: keyDiemDi
			});
		}
		if (type == 2) {
			keyDiemDen = key;
			this.setState({
				keyDiemDen: keyDiemDen,
			});
		}
		var ve_price =  await this.getPriceBen(keyDiemDi, keyDiemDen);

		this.setState({
			rootPrice: ve_price,
			newRootPrice: ve_price,
			decreasePrice: 0,
			ve_price: ve_price,
			loading: false
		});

		totalPrice = Common.formatPrice(ve_price);

		// if (this.state.key_KM == 7) {
		// if (sttInternet) {
		// 	try {
		// 		let body = {
		// 			token: this.state.infoAdm.token,
		// 			adm_id: this.state.infoAdm.adm_id,
		// 			did_id: this.state.arrInfo.did_id,
		// 			bvv_id: this.state.bvv_id,
		// 			diem_di: this.state.keyDiemDi,
		// 			diem_den: this.state.keyDiemDen,
		// 		}

		// 		let data1 = await fetchData('api_get_giam_gia_linh_hoat', body, 'GET');

		// 		if (data1.status == 404) {
		// 			alert(data1.mes);
		// 			Actions.welcome({ type: 'reset' });
		// 		} else if (data1.status == 200) {
		// 			let price2 = (ve_price - data1.price_discount) > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? (ve_price - data1.price_discount) : Number(this.state.arrInfo.tuy_gia_nho_nhat);

		// 			this.setState({
		// 				rootPrice: price2,
		// 				newRootPrice: price2,
		// 				decreasePrice: '0',
		// 				ve_price: price2,
		// 				loading: false
		// 			});
		// 		}

		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// }
		// }

		// check khuyen mai la ma khuyen mai theo diem di diem den
		if (this.state.codeKM != '') {
			if (this.state.sttInternet != false) {
				try {
					let body = {
						token: this.state.infoAdm.token,
						adm_id: this.state.infoAdm.adm_id,
						did_id: this.state.arrInfo.did_id,
						phone: this.state.phone,
						id: this.state.codeKM,
						diem_di: keyDiemDi,
						diem_den: keyDiemDen,
						giam_gia_text: this.state.codeKM,
						bvv_id: this.state.bvv_id,
					}

					let data1 = await fetchData('api_get_discount_detail', body, 'GET');

					if (data1.status == 404) {
						alert(data1.mes);
						Actions.welcome({ type: 'reset' });
					} else if (data1.status == 200) {
						let price1 = (ve_price - data1.price_discount) > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? (ve_price - data1.price_discount) : Number(this.state.arrInfo.tuy_gia_nho_nhat);

						this.setState({
							rootPrice: ve_price,
							decreasePrice: data1.price_discount.toString(),
							ve_price: price1,
							loading: false
						});
						// this.state.arrCodeDiscount = Object.values(data1.data);
					}

				} catch (error) {
					console.log(error);
				}
			}
		}

		if (this.state.key_KM == 4) {

			if (sttInternet != false) {
				let body = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					did_id: this.state.arrInfo.did_id,
					diem_di: keyDiemDi,
					diem_den: keyDiemDen,
					bvv_id: this.state.bvv_id
				}

				let data = await fetchData('api_get_discount_children', body, 'GET');

				if (data.status == 404) {
					alert(data.mes);
					Actions.welcome({ type: 'reset' });
				} else if (data.status == 200) {
					// get price discount
					let priceDiscount = data.price_discount;
					let price3 = (ve_price - priceDiscount) > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? (ve_price - priceDiscount) : Number(this.state.arrInfo.tuy_gia_nho_nhat);

					this.setState({
						ve_price: price3,
						rootPrice: ve_price,
						decreasePrice: priceDiscount.toString(),
						loading: false
					});
				}
			}
		}

		if (this.state.key_KM == 3) {
			let price4 = (ve_price - Number(this.state.decreasePrice)) > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? (ve_price - Number(this.state.decreasePrice)) : Number(this.state.arrInfo.tuy_gia_nho_nhat);
			this.setState({
				ve_price: price4,
				rootPrice: ve_price,
				loading: false
			});
		}

		this.closeModalBenXe();
		return totalPrice;
	}

	async getPriceBen(diem_a, diem_b) {
		var totalPrice = 0;
		let ve_price1 = 0;
		var keyDiemDi = parseInt(diem_a);
		var keyDiemDen = parseInt(diem_b);
		var nameDiemDi = '';
		var nameDiemDen = '';
		//Lay gia va ten ben tu state
		var dataInfo = this.state.arrInfo;
		var dataBenTen = this.state.arrBenTen;
		var dataBenMa = this.state.arrBenMa;
		var dataGiaVe = this.state.arrGiaVe;
		var dataGiaVeVip = this.state.arrGiaVeVip;
		var did_loai_xe = this.state.arrInfo.did_loai_xe;
		if (dataBenTen != null && dataBenTen[keyDiemDi] != undefined) {
			nameDiemDi = dataBenTen[keyDiemDi];
		}
		if (dataBenTen != null && dataBenTen[keyDiemDen] != undefined) {
			nameDiemDen = dataBenTen[keyDiemDen];
		}

		{/* if (dataInfo.not_chieu_di == 2) {
			let tg1 = nameDiemDi;
			nameDiemDi = nameDiemDen;
			nameDiemDen = tg1;
			let tg2 = keyDiemDi;
			keyDiemDi = keyDiemDen;
			keyDiemDen = tg2;
		} */}

		// if (did_loai_xe == 1) {
		// 	if (dataGiaVeVip != null && dataGiaVeVip[keyDiemDi] != undefined) {
		// 		if (dataGiaVeVip[keyDiemDi][keyDiemDen] != undefined) {
		// 			ve_price1 = dataGiaVeVip[keyDiemDi][keyDiemDen];
		// 		}
		// 	} else if (dataGiaVeVip != null && dataGiaVeVip[keyDiemDen] != undefined) {
		// 		if (dataGiaVeVip[keyDiemDen][keyDiemDi] != undefined) {
		// 			ve_price1 = dataGiaVeVip[keyDiemDen][keyDiemDi];
		// 		}
		// 	}
		// } else {
		// 	if (dataGiaVe != null && dataGiaVe[keyDiemDi] != undefined) {
		// 		if (dataGiaVe[keyDiemDi][keyDiemDen] != undefined) {
		// 			ve_price1 = dataGiaVe[keyDiemDi][keyDiemDen];
		// 		}
		// 	} else if (dataGiaVe != null && dataGiaVe[keyDiemDen] != undefined) {
		// 		if (dataGiaVe[keyDiemDen][keyDiemDi] != undefined) {
		// 			ve_price1 = dataGiaVe[keyDiemDen][keyDiemDi];
		// 		}
		// 	}
		// }

		if (dataGiaVe != null && dataGiaVe[keyDiemDi] != undefined) {
			if (dataGiaVe[keyDiemDi][keyDiemDen] != undefined) {
				ve_price1 = dataGiaVe[keyDiemDi][keyDiemDen];
			}
		} else if (dataGiaVe != null && dataGiaVe[keyDiemDen] != undefined) {
			if (dataGiaVe[keyDiemDen][keyDiemDi] != undefined) {
				ve_price1 = dataGiaVe[keyDiemDen][keyDiemDi];
			}
		}

		if (this.state.bvv_id != 0) {
			let body = {
				token: this.state.infoAdm.token,
				adm_id: this.state.infoAdm.adm_id,
				did_id: this.state.arrInfo.did_id,
				bvv_id: this.state.bvv_id,
				diem_di: this.state.keyDiemDi,
				diem_den: this.state.keyDiemDen,
			}
	
			let data = await fetchData('api_get_giam_gia_linh_hoat', body, 'GET');
	
			if (data.status != 200) {
				alert(data.mes);
				Actions.welcome({ type: 'reset' });
			} else if (data.status == 200) {
				ve_price1 = (ve_price1 - data.price_discount) > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? (ve_price1 - data.price_discount) : Number(this.state.arrInfo.tuy_gia_nho_nhat);
			}
		}

		totalPrice = Common.formatPrice(ve_price1);

		this.setState({
			ve_price: ve_price1,
			keyDiemDi: keyDiemDi,
			keyDiemDen: keyDiemDen,
			nameDiemDi: nameDiemDi,
			nameDiemDen: nameDiemDen,
			rootPrice: ve_price1,
			newRootPrice: ve_price1,
		});
		return ve_price1;
	}

	async _setActiveGiuong(id, newRootPriceend) {
		var sttInternet = await checkServerAlive();
		// this.setState({
		// 	sttInternet: sttInternet
		// });

		this.state.sttInternet = sttInternet;
		let bvh_id_can_chuyen = this.props.dataParam.bvh_id_can_chuyen;
		let arrVeNumberState = this.state.arrVeNumber;
		let dataGiuong = this.state.arrVeNumber[id];
		var dataVeNew = dataGiuong;
		var that = this;
		this.setState({
			bvv_id: dataGiuong.bvv_id
		});
		//Check mang kiem tra ve con trong hay khong, neu mat mang coi nhu con trong
		var check_ve = 1;
		var infoAdm = this.state.infoAdm;
		var dateTime = new Date();
		var dayTime = dateTime.getTime();
		if (sttInternet != false) {
			try {
				let params = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'checkBook',
					did_id: this.state.arrInfo.did_id,
					numberGiuong: id,
					bvv_id: dataGiuong.bvv_id,
				}
				let data = await fetchData('api_check_ve', params, 'GET');
				if (data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({ type: 'reset' });
					check_ve = 0;
				} else if (data.status == 201) {
					check_ve = 0;
					alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
					this.setState({
						loading: false
					});
				} else {
					check_ve = 1;
				}
			} catch (e) {
				console.log(e);
			}
		}

		if (check_ve == 1) {
			//Them ve
			if (this.state.themVe.check) {
				let arrThemve = this.state.arrThemve;
				arrThemve.push({
					bvv_bvn_id: dataGiuong.bvv_bvn_id,
					bvv_id: dataGiuong.bvv_id,
					bvv_number: id,
					bvv_khach_hang_id: this.state.themVe.khach_hang_id,
					bvv_diem_don_khach: dataGiuong.bvv_diem_don_khach,
					bvv_diem_tra_khach: dataGiuong.bvv_diem_tra_khach,
					bvv_ghi_chu: dataGiuong.bvv_ghi_chu,
					bvv_seri: dataGiuong.bvv_seri,
					bvv_danh_muc: dataGiuong.bvv_danh_muc
				});

				dataVeNew.bvv_status = 1;
				dataVeNew.bvv_ten_khach_hang = this.state.themVe.ten_khach_hang;
				dataVeNew.bvv_phone = this.state.themVe.phone;
				dataVeNew.bvv_diem_don_khach = this.state.themVe.diem_don;
				dataVeNew.bvv_diem_tra_khach = this.state.themVe.diem_tra;
				dataVeNew.bvv_ghi_chu = this.state.themVe.ghi_chu;
				dataVeNew.bvv_bex_id_a = this.state.themVe.keyDiemDi;
				dataVeNew.bvv_bex_id_b = this.state.themVe.keyDiemDen;
				dataVeNew.bvv_ben_a = this.state.themVe.bvv_ben_a;
				dataVeNew.bvv_ben_b = this.state.themVe.bvv_ben_b;
				dataVeNew.bvv_price = this.state.themVe.ve_price;
				dataVeNew.bvv_khach_hang_id = this.state.themVe.khach_hang_id;
				dataVeNew.bvv_trung_chuyen_a = this.state.themVe.bvv_trung_chuyen_a;
				dataVeNew.bvv_trung_chuyen_b = this.state.themVe.bvv_trung_chuyen_b;
				dataVeNew.bvv_bvd_id_ly_thuyet = this.state.themVe.bvv_bvd_id_ly_thuyet;
				dataVeNew.stt_change = 1;
				dataVeNew.bvv_admin_creat = infoAdm.adm_id;
				dataVeNew.bvv_time_book = dayTime;

				dataVeNew.bvv_seri = '';
				dataVeNew.bvv_danh_muc = '';

				arrVeNumberState[id] = dataVeNew;
				this.setState({
					arrThemve: arrThemve,
					arrVeNumber: arrVeNumberState,
					loading: false
				});
			} else if (bvh_id_can_chuyen > 0 && bvh_id_can_chuyen != undefined) {
				//Chuyen ve huy vao cho trong
				var stt_check_add = 1;
				var stt_change = 1;
				if (this.state.sttInternet != false) {
					try {
						let params = {
							token: this.state.infoAdm.token,
							adm_id: this.state.infoAdm.adm_id,
							huy: this.props.dataParam.huy,
							type: 'chuyenvaocho',
							did_id: dataGiuong.bvv_bvn_id,
							bvv_number_muon_chuyen: dataGiuong.bvv_number,
							bvh_id_can_chuyen: this.props.dataParam.bvh_id_can_chuyen,
							idAdm: this.state.infoAdm.adm_id,
						}
						let data = await fetchData('api_so_do_giuong_update', params, 'GET');
						if (data.status == 404) {
							stt_check_add = 0;
							alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
							Actions.welcome({ type: 'reset' });
						} else if (data.status == 201) {
							stt_check_add = 0;
							alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
						} else {
							stt_change = 0;
							stt_check_add = 1;
						}
					} catch (e) {
						console.log(e);
					}

				}
				if (stt_check_add == 1) {
					dataVeNew.bvv_ten_khach_hang = this.props.dataParam.fullName;
					dataVeNew.bvv_phone = this.props.dataParam.phone;
					dataVeNew.bvv_bex_id_a = this.props.dataParam.bvv_bex_id_a;
					dataVeNew.bvv_bex_id_b = this.props.dataParam.bvv_bex_id_b;
					dataVeNew.bvv_trung_chuyen_a = this.props.dataParam.bvv_trung_chuyen_a;
					dataVeNew.bvv_trung_chuyen_b = this.props.dataParam.bvv_trung_chuyen_b;
					dataVeNew.bvv_ben_a = this.state.arrBenTen[this.props.dataParam.bvv_bex_id_a];
					dataVeNew.bvv_ben_b = this.state.arrBenTen[this.props.dataParam.bvv_bex_id_b];
					dataVeNew.bvv_diem_don_khach = this.props.dataParam.bvv_diem_don_khach;
					dataVeNew.bvv_diem_tra_khach = this.props.dataParam.bvv_diem_tra_khach;
					dataVeNew.bvv_price = parseInt(this.props.dataParam.bvv_price);
					dataVeNew.bvv_status = 1;
					dataVeNew.stt_change = stt_change;
					dataVeNew.bvv_admin_creat = infoAdm.adm_id;
					dataVeNew.bvv_time_book = dayTime;

					arrVeNumberState[id] = dataVeNew;
					let arrInfo = this.state.arrInfo;
					let did_so_cho_da_ban = parseInt(arrInfo.did_so_cho_da_ban) + 1;
					arrInfo.did_so_cho_da_ban = did_so_cho_da_ban;
					this.setState({
						arrVeNumber: arrVeNumberState,
						arrInfo: arrInfo,
						notifiCountDanhSachCho: this.state.notifiCountDanhSachCho - 1,
						chuyenVaoCho: false
					});
					this.props.dataParam.bvh_id_can_chuyen = 0;
					this.props.dataParam.nameGiuongXepCho = '';
				}
				this.setState({
					loading: false
				});
			} else if (this.state.bvv_id_can_chuyen != 0) {
				//Chuyen cho
				var stt_change = 1;
				var stt_check_add = 1;
				if (sttInternet != false) {
					try {
						let params = {
							token: this.state.infoAdm.token,
							adm_id: this.state.infoAdm.adm_id,
							type: 'chuyencho',
							did_id: dataGiuong.bvv_bvn_id,
							bvv_number_muon_chuyen: dataGiuong.bvv_number,
							bvv_id_can_chuyen: this.state.bvv_id_can_chuyen,
							idAdm: this.state.infoAdm.adm_id,
						}
						let data = await fetchData('api_so_do_giuong_update', params, 'GET');
						if (data.status == 404) {
							stt_check_add = 0;
							alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
							Actions.welcome({ type: 'reset' });
						} else if (data.status == 201) {
							stt_check_add = 0;
							alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
						} else {
							stt_check_add = 1;
							stt_change = 0;
						}
					} catch (e) {
						console.log(e);
					}
				}
				if (stt_check_add == 1) {
					var dataVeChuyen = {};
					dataVeChuyen = arrVeNumberState[this.state.currentIdGiuong];

					dataVeNew.bvv_phone = dataVeChuyen.bvv_phone;
					dataVeNew.bvv_bex_id_a = dataVeChuyen.bvv_bex_id_a;
					dataVeNew.bvv_bex_id_b = dataVeChuyen.bvv_bex_id_b;
					dataVeNew.bvv_ben_a = dataVeChuyen.bvv_ben_a;
					dataVeNew.bvv_ben_b = dataVeChuyen.bvv_ben_b;
					dataVeNew.bvv_status = dataVeChuyen.bvv_status;
					dataVeNew.bvv_diem_don_khach = dataVeChuyen.bvv_diem_don_khach;
					dataVeNew.bvv_diem_tra_khach = dataVeChuyen.bvv_diem_tra_khach;
					dataVeNew.bvv_ten_khach_hang = dataVeChuyen.bvv_ten_khach_hang;
					dataVeNew.bvv_trung_chuyen_a = dataVeChuyen.bvv_trung_chuyen_a;
					dataVeNew.bvv_trung_chuyen_b = dataVeChuyen.bvv_trung_chuyen_b;
					dataVeNew.bvv_seri = dataVeChuyen.bvv_seri;
					dataVeNew.bvv_bvd_id_ly_thuyet = dataVeChuyen.bvv_bvd_id_ly_thuyet;
					dataVeNew.bvv_hinh_thuc_giam_gia = dataVeChuyen.bvv_hinh_thuc_giam_gia;
					dataVeNew.bvv_ghi_chu = dataVeChuyen.bvv_ghi_chu;
					dataVeNew.bvv_ghi_chu_2 = dataVeChuyen.bvv_ghi_chu_2;
					dataVeNew.stt_change = stt_change;
					dataVeNew.bvv_admin_creat = infoAdm.adm_id;
					dataVeNew.bvv_time_book = dayTime;

					if (dataVeChuyen.bvv_hinh_thuc_giam_gia == 7) {
						// dataVeNew.bvv_price_discount = dataVeChuyen.bvv_price_discount;
						dataVeNew.bvv_price = newRootPriceend;
					} else {
						dataVeNew.bvv_price_discount = dataVeChuyen.bvv_price_discount;
						dataVeNew.bvv_price = dataVeChuyen.bvv_price;
					}

					// dataVeNew.bvv_price = dataVeChuyen.bvv_price;

					arrVeNumberState[id] = dataVeNew;
					arrVeNumberState[this.state.currentIdGiuong].stt_change = stt_change;
					arrVeNumberState[this.state.currentIdGiuong].bvv_status = 0;
					this.setState({
						arrVeNumber: arrVeNumberState,
						bvv_id_can_chuyen: 0,
						bvv_bvn_id_muon_chuyen: 0,
						bvv_number_muon_chuyen: 0
					});
				}
				this.setState({
					loading: false
				});
			} else {
				//form book
				this.setState({
					currentIdGiuong: id,
					type: '',
					fullName: '',
					phone: '',
					diem_don: '',
					diem_tra: '',
					ghi_chu: '',
					seri: '',
					danh_muc: '',
					key_danh_muc: 0,
					bvv_bvd_id_ly_thuyet: 0,
					trung_chuyen_don: false,
					trung_chuyen_tra: false,
					tre_em: false,
					key_danh_muc: 0,
					bvv_id: dataGiuong.bvv_id,
					newrootPrive: newRootPriceend,
					codeKM: '',
				});

				this.openModal();
				let dataBen = this.state.arrBen;
				let newDataBen = [];
				var ben_dau = 0;
				var ben_cuoi = 0;

				var not_chieu_di = this.state.arrInfo.not_chieu_di;

				for (var i = 0; i < Object.keys(dataBen).length > 0; i++) {
					ben_cuoi = dataBen[i].bex_id;
					if (i == 0) {
						ben_dau = dataBen[i].bex_id;
					}
					newDataBen.push({ key: dataBen[i].bex_id, value: dataBen[i].bex_ten });
				}

				let dataDMVe = this.state.arrDMVe;
				let newDataDMVe = [];
				for (var i = 0; i < Object.keys(dataDMVe).length > 0; i++) {
					newDataDMVe.push({ key: dataDMVe[i].bvd_id, value: dataDMVe[i].bvd_ma_ve, price: dataDMVe[i].price });
				}

				let dataVe = this.state.arrVe;
				let newDataVe = [];
				for (var i = 0; i < Object.keys(dataVe).length > 0; i++) {
					newDataVe.push({ key: dataVe[i].DMVe.bvd_id, value: dataVe[i].DMVe.bvd_ma_ve, price: dataVe[i].DMVeTien });
				}

				if (not_chieu_di == 2) {
					let tg = ben_dau;
					ben_dau = ben_cuoi;
					ben_cuoi = tg;
				}

				let priceDisTemp = 0;
				// if (this.state.sttInternet != false) {
				// 	try {
				// 		let body = {
				// 			token: this.state.infoAdm.token,
				// 			adm_id: this.state.infoAdm.adm_id,
				// 			did_id: this.state.arrInfo.did_id,
				// 			bvv_id: dataGiuong.bvv_id,
				// 			diem_di: ben_dau,
				// 			diem_den: ben_cuoi,
				// 		}

				// 		let data1 = await fetchData('api_get_giam_gia_linh_hoat', body, 'GET');

				// 		if (data1.status == 404) {
				// 			alert(data1.mes);
				// 			Actions.welcome({ type: 'reset' });
				// 		} else if (data1.status == 200) {
				// 			priceDisTemp = data1.price_discount;
				// 		}

				// 	} catch (error) {
				// 		console.log(error);
				// 	}
				// }

				let ve_price =  await this.getPriceBen(ben_dau, ben_cuoi) - priceDisTemp;
				// bỏ giam gia linh hoat, thay bằng tính ngay giá
				// let ve_price = this.getPriceBen(ben_dau, ben_cuoi)
				ve_price = ve_price > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? ve_price : Number(this.state.arrInfo.tuy_gia_nho_nhat);

				this.setState({
					rootPrice: ve_price,
					ve_price: ve_price,
					decreasePrice: '0',
					status: 200,
					resultsBen: newDataBen,
					resultsDMVe: newDataDMVe,
					resultVe: newDataVe,
					bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
					bvv_number_muon_chuyen: dataGiuong.bvv_number,
					type: '',
					loading: false
				});
			}
		}

		//Luu vao store
		let did_id = this.state.arrInfo.did_id;
		var nameStoreArrVeNumber = 'arrVeNumber' + did_id;
		var result = JSON.stringify(arrVeNumberState);
		AsyncStorage.removeItem(nameStoreArrVeNumber);
		AsyncStorage.setItem(nameStoreArrVeNumber, result);
	}

	async bookGiuong(id) {
		var sttInternet = await checkServerAlive();
		// this.setState({
		// 	sttInternet: sttInternet,
		// });

		let dataGiuong = this.state.arrVeNumber[id];
		let checkData = true;
		if (this.state.keyDiemDi == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đi!');
		} else if (this.state.keyDiemDen == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đến!');
		}
		if (checkData) {
			this.setState({
				isOpen: false,
				bvv_id: dataGiuong.bvv_id
			});
			this.closeModal();
			//Neu co mang thi ban du lieu len server trang thai store thay doi la 0
			//Khong co mang thi trang thai store la 1
			//Luu vao store
			var stt_change = 1;
			var stt_check_add = 1;
			var userId = 0;

			if (sttInternet != false) {
				try {
					let params = {
						token: this.state.infoAdm.token,
						adm_id: this.state.infoAdm.adm_id,
						type: 'insert',
						bvv_id: dataGiuong.bvv_id,
						did_id: dataGiuong.bvv_bvn_id,
						bvv_number: dataGiuong.bvv_number,
						diem_a: this.state.keyDiemDi,
						diem_b: this.state.keyDiemDen,
						price: this.state.ve_price,
						price_discount: this.state.decreasePrice,
						idAdm: this.state.infoAdm.adm_id,
						fullName: this.state.fullName,
						phone: this.state.phone,
						diem_don: this.state.diem_don,
						diem_tra: this.state.diem_tra,
						ghi_chu: this.state.ghi_chu,
						trung_chuyen_don: this.state.trung_chuyen_don,
						trung_chuyen_tra: this.state.trung_chuyen_tra,
						tre_em: this.state.tre_em,
						seri: this.state.seri,
						key_danh_muc: this.state.key_danh_muc,
						hinh_thuc_giam_gia: this.state.key_KM,
						ma_giam_gia_id: this.state.keyCodeDiscount,
						// km_id: this.state.key_codeKM,
						// key_km: this.state.key_km,
						giam_gia_text: this.state.codeKM,
					}

					let data = await fetchData('api_so_do_giuong_update', params, 'GET');
					if (data.status == 404) {
						stt_check_add = 0;
						alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
						Actions.welcome({ type: 'reset' });
					} else if (data.status == 201) {
						stt_check_add = 0;
						alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
					} else {
						stt_change = 0;
						userId = data.userId;
					}
				} catch (e) {
					console.log(e);
				}
			}

			if (stt_check_add == 1) {
				var bvv_trung_chuyen_a = 0;
				var bvv_trung_chuyen_b = 0;
				if (this.state.trung_chuyen_don) {
					bvv_trung_chuyen_a = 1;
				}
				if (this.state.trung_chuyen_tra) {
					bvv_trung_chuyen_b = 1;
				}
				var key_danh_muc = this.state.key_danh_muc;
				var dataDMVeTen = this.state.arrDMVeTen;
				var nameDMVe = '';
				if (dataDMVeTen != null && dataDMVeTen[key_danh_muc] != undefined) {
					nameDMVe = dataDMVeTen[key_danh_muc];
				}
				//Ma diem den diem di
				var infoAdm = this.state.infoAdm;
				var dataBenMa = this.state.arrBenMa;
				var keyDiemDi = this.state.keyDiemDi;
				var keyDiemDen = this.state.keyDiemDen;
				if (dataBenMa != null && dataBenMa[keyDiemDi] != undefined) {
					nameDiemDi = dataBenMa[keyDiemDi];
				}
				if (dataBenMa != null && dataBenMa[keyDiemDen] != undefined) {
					nameDiemDen = dataBenMa[keyDiemDen];
				}
				var dateTime = new Date();
				var dayTime = dateTime.getTime();

				let currentArrActive = this.state.arrVeNumber;
				currentArrActive[id].bvv_status = 1;
				currentArrActive[id].bvv_ten_khach_hang = this.state.fullName;
				currentArrActive[id].bvv_phone = this.state.phone;
				currentArrActive[id].bvv_diem_don_khach = this.state.diem_don;
				currentArrActive[id].bvv_diem_tra_khach = this.state.diem_tra;
				currentArrActive[id].bvv_ghi_chu = this.state.ghi_chu;
				currentArrActive[id].bvv_seri = this.state.seri;
				currentArrActive[id].bvv_danh_muc = this.state.danh_muc;
				currentArrActive[id].bvv_bvd_id_ly_thuyet = this.state.key_danh_muc;
				currentArrActive[id].bvv_danh_muc = nameDMVe;
				currentArrActive[id].bvv_bex_id_a = this.state.keyDiemDi;
				currentArrActive[id].bvv_bex_id_b = this.state.keyDiemDen;
				currentArrActive[id].bvv_ben_a = nameDiemDi;
				currentArrActive[id].bvv_ben_b = nameDiemDen;
				currentArrActive[id].bvv_price = this.state.ve_price;
				currentArrActive[id].bvv_price_discount = this.state.decreasePrice;
				currentArrActive[id].bvv_hinh_thuc_giam_gia = this.state.key_KM;
				currentArrActive[id].ma_giam_gia_id = this.state.keyCodeDiscount;
				currentArrActive[id].bvv_khach_hang_id = userId;
				currentArrActive[id].bvv_trung_chuyen_a = bvv_trung_chuyen_a;
				currentArrActive[id].bvv_trung_chuyen_b = bvv_trung_chuyen_b;
				currentArrActive[id].stt_change = stt_change;
				currentArrActive[id].tre_em = this.state.tre_em;
				currentArrActive[id].km_id = this.state.key_codeKM;
				currentArrActive[id].codeKM = this.state.codeKM;
				currentArrActive[id].bvv_giu_code = this.state.codeKM;

				currentArrActive[id].bvv_admin_creat = infoAdm.adm_id;
				currentArrActive[id].bvv_time_book = dayTime;

				let arrInfo = this.state.arrInfo;
				let did_so_cho_da_ban = parseInt(arrInfo.did_so_cho_da_ban) + 1;
				arrInfo.did_so_cho_da_ban = did_so_cho_da_ban;
				this.setState({
					arrVeNumber: currentArrActive,
					isOpen: false,
					nameDiemDi: '',
					keyDiemDi: '',
					nameDiemDen: '',
					keyDiemDen: '',
					diem_don: '',
					diem_tra: '',
					phone: '',
					fullName: '',
					ve_price: 0,
					rootPrice: this.state.priceAllTrips,
					decreasePrice: '',
					fullName: '',
					phone: '',
					trung_chuyen_tra: false,
					trung_chuyen_don: false,
					tre_em: false,
					ghi_chu: '',
					seri: '',
					danh_muc: '',
					key_danh_muc: 0,
					arrInfo: arrInfo,
					nameDMVe: '',
					key_KM: 0,
					nameKM: '',
					keyCodeDiscount: '',
					codeKM: '',
					key_codeKM: '',
					mesKM: '',
					loading: false
				});

				//Luu vao store
				let did_id = this.state.arrInfo.did_id;
				var nameStoreArrVeNumber = 'arrVeNumber' + did_id;
				var result = JSON.stringify(currentArrActive);
				AsyncStorage.removeItem(nameStoreArrVeNumber);
				AsyncStorage.setItem(nameStoreArrVeNumber, result);
			}

			// this.setState({
			// 	loading: false
			// });
		}
	}

	async _handleChinhSua() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];

		this.setState({
			type: 'update'
		});

		let newDataBen = [];
		let dataBen = this.state.arrBen;
		for (var i = 0; i < Object.keys(dataBen).length > 0; i++) {
			newDataBen.push({ key: dataBen[i].bex_id, value: dataBen[i].bex_ten });
		}

		let newDataDMVe = [];
		let dataDMVe = this.state.arrDMVe;
		for (var i = 0; i < Object.keys(dataDMVe).length > 0; i++) {
			newDataDMVe.push({ key: dataDMVe[i].bvd_id, value: dataDMVe[i].bvd_ma_ve });
		}

		let dataVe = this.state.arrVe;
		let newDataVe = [];
		for (var i = 0; i < Object.keys(dataVe).length > 0; i++) {
			newDataVe.push({ key: dataVe[i].DMVe.bvd_id, value: dataVe[i].DMVe.bvd_ma_ve, price: dataVe[i].DMVeTien });
		}

		var trung_chuyen_don = false;
		if (dataGiuong.bvv_trung_chuyen_a == 1) {
			trung_chuyen_don = true;
		}
		var trung_chuyen_tra = false;
		if (dataGiuong.bvv_trung_chuyen_b == 1) {
			trung_chuyen_tra = true;
		}
		//Diem den diem di
		var nameDiemDi = '';
		var nameDiemDen = '';
		let dataBenTen = this.state.arrBenTen;
		var keyDiemDi = dataGiuong.bvv_bex_id_a;
		var keyDiemDen = dataGiuong.bvv_bex_id_b;

		if (dataBenTen != null && dataBenTen[keyDiemDi] != undefined) {
			nameDiemDi = dataBenTen[keyDiemDi];
		}

		if (dataBenTen != null && dataBenTen[keyDiemDen] != undefined) {
			nameDiemDen = dataBenTen[keyDiemDen];
		}

		var dataDMVeTen = this.state.arrDMVeTen;
		var bvv_bvd_id_ly_thuyet = dataGiuong.bvv_bvd_id_ly_thuyet;
		var nameDMVe = '';

		if (dataDMVeTen != null && dataDMVeTen[bvv_bvd_id_ly_thuyet] != undefined) {
			nameDMVe = dataDMVeTen[bvv_bvd_id_ly_thuyet];
		}

		var seriEdit = '';

		if (dataGiuong.bvv_seri > 0) {
			seriEdit = dataGiuong.bvv_seri;
		}

		let nameKM = '';
		var dataKM = this.state.arrKM;

		for (let i = 0; i < dataKM.length; i++) {
			if (dataKM[i].key == dataGiuong.bvv_hinh_thuc_giam_gia)
				nameKM = dataKM[i].value;
		}

		this.setState({
			status: '200',
			resultsBen: newDataBen,
			resultsDMVe: newDataDMVe,
			resultVe: newDataVe,
			bvv_id: dataGiuong.bvv_id,
			bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
			bvv_number_muon_chuyen: dataGiuong.bvv_number,
			fullName: dataGiuong.bvv_ten_khach_hang,
			phone: dataGiuong.bvv_phone,
			diem_don: dataGiuong.bvv_diem_don_khach,
			diem_tra: dataGiuong.bvv_diem_tra_khach,
			ghi_chu: dataGiuong.bvv_ghi_chu,
			bvv_ben_a: dataGiuong.bvv_ben_a,
			bvv_ben_b: dataGiuong.bvv_ben_b,
			ve_price: dataGiuong.bvv_price,
			decreasePrice: dataGiuong.bvv_price_discount.toString(),
			rootPrice: dataGiuong.bvv_price + Number(dataGiuong.bvv_price_discount),
			seri: seriEdit,
			key_danh_muc: dataGiuong.bvv_bvd_id_ly_thuyet,
			tre_em: dataGiuong.tre_em,
			key_KM: dataGiuong.bvv_hinh_thuc_giam_gia,
			nameKM: nameKM,
			key_km: dataGiuong.bvv_giu_id,
			codeKM: dataGiuong.bvv_giu_code,
			mesKM: '',

			keyDiemDi: keyDiemDi,
			keyDiemDen: keyDiemDen,
			nameDiemDi: nameDiemDi,
			nameDiemDen: nameDiemDen,
			nameDMVe: nameDMVe,

			trung_chuyen_tra: trung_chuyen_tra,
			trung_chuyen_don: trung_chuyen_don,
			loading: false
		});

		this.closeModalInfoVe();
		this.openModal();
	}

	async updateGiuong(id) {
		var sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet
		});
		let dataGiuong = this.state.arrVeNumber[id];
		let checkData = true;
		if (this.state.keyDiemDi == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đi!');
		} else if (this.state.keyDiemDen == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đến!');
		}
		if (checkData) {
			this.setState({
				isOpen: false
			});

			this.closeModal();
			//Neu co mang thi ban du lieu len server trang thai store thay doi la 0
			//Khong co mang thi trang thai store la 1
			//Luu vao store
			var stt_change = 1;
			var stt_check_update = 1;
			if (this.state.sttInternet != false) {
				try {
					let params = {
						token: this.state.infoAdm.token,
						adm_id: this.state.infoAdm.adm_id,
						type: 'update',
						bvv_id: dataGiuong.bvv_id,
						did_id: dataGiuong.bvv_bvn_id,
						bvv_number: dataGiuong.bvv_number,
						diem_a: this.state.keyDiemDi,
						diem_b: this.state.keyDiemDen,
						price: this.state.ve_price,
						price_discount: this.state.decreasePrice,
						idAdm: this.state.infoAdm.adm_id,
						fullName: this.state.fullName,
						phone: this.state.phone,
						diem_don: this.state.diem_don,
						diem_tra: this.state.diem_tra,
						ghi_chu: this.state.ghi_chu,
						seri: this.state.seri,
						key_danh_muc: this.state.key_danh_muc,
						trung_chuyen_don: this.state.trung_chuyen_don,
						trung_chuyen_tra: this.state.trung_chuyen_tra,
						tre_em: this.state.tre_em,
						hinh_thuc_giam_gia: this.state.key_KM,
						ma_giam_gia_id: this.state.keyCodeDiscount,
						km_id: this.state.key_codeKM,
						key_km: this.state.key_km,
						giam_gia_text: this.state.codeKM,
					}
					let data = await fetchData('api_so_do_giuong_update', params, 'GET');
					if (data) {
						if (data.status == 404) {
							stt_check_update = 0;
							alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
							Actions.welcome({ type: 'reset' });
						} else {
							stt_change = 0;
							stt_check_update = 1;
						}
					}
					else {
						alert('Lỗi kết nối server');
					}
				} catch (e) {
					console.log(e);
				}
			}

			if (stt_check_update == 1) {
				var bvv_trung_chuyen_a = 0;
				var bvv_trung_chuyen_b = 0;
				if (this.state.trung_chuyen_don) {
					bvv_trung_chuyen_a = 1;
				}
				if (this.state.trung_chuyen_tra) {
					bvv_trung_chuyen_b = 1;
				}

				//Ma diem den diem di
				var nameDiemDi = '';
				var nameDiemDen = '';
				var nameDMVe = '';
				var infoAdm = this.state.infoAdm;
				var dataBenMa = this.state.arrBenMa;
				var keyDiemDi = this.state.keyDiemDi;
				var keyDiemDen = this.state.keyDiemDen;
				if (dataBenMa != null && dataBenMa[keyDiemDi] != undefined) {
					nameDiemDi = dataBenMa[keyDiemDi];
				}
				if (dataBenMa != null && dataBenMa[keyDiemDen] != undefined) {
					nameDiemDen = dataBenMa[keyDiemDen];
				}
				var key_danh_muc = this.state.key_danh_muc;
				var dataDMVeTen = this.state.arrDMVeTen;
				if (dataDMVeTen != null && dataDMVeTen[key_danh_muc] != undefined) {
					nameDMVe = dataDMVeTen[key_danh_muc];
				}
				var dateTime = new Date();
				var dayTime = dateTime.getTime();
				let currentArrActive = this.state.arrVeNumber;
				currentArrActive[id].bvv_ten_khach_hang = this.state.fullName;
				currentArrActive[id].bvv_phone = this.state.phone;
				currentArrActive[id].bvv_bex_id_a = keyDiemDi;
				currentArrActive[id].bvv_bex_id_b = keyDiemDen;
				currentArrActive[id].bvv_ben_a = nameDiemDi;
				currentArrActive[id].bvv_ben_b = nameDiemDen;
				currentArrActive[id].bvv_price = this.state.ve_price;
				currentArrActive[id].bvv_price_discount = this.state.decreasePrice;

				currentArrActive[id].bvv_diem_don_khach = this.state.diem_don;
				currentArrActive[id].bvv_diem_tra_khach = this.state.diem_tra;
				currentArrActive[id].bvv_ghi_chu = this.state.ghi_chu;
				currentArrActive[id].bvv_trung_chuyen_a = bvv_trung_chuyen_a;
				currentArrActive[id].bvv_trung_chuyen_b = bvv_trung_chuyen_b;
				currentArrActive[id].km_id = this.state.key_codeKM;
				currentArrActive[id].codeKM = this.state.codeKM;
				currentArrActive[id].bvv_giu_code = this.state.codeKM;

				currentArrActive[id].stt_change = stt_change;
				currentArrActive[id].bvv_admin_update = infoAdm.adm_id;
				currentArrActive[id].bvv_time_last_update = dayTime;

				currentArrActive[id].bvv_seri = this.state.seri;
				currentArrActive[id].tre_em = this.state.tre_em;
				currentArrActive[id].bvv_danh_muc = nameDMVe;
				currentArrActive[id].bvv_bvd_id_ly_thuyet = this.state.key_danh_muc;
				currentArrActive[id].bvv_hinh_thuc_giam_gia = this.state.key_KM;

				this.setState({
					arrVeNumber: currentArrActive,
					isOpen: false,
					nameDiemDi: '',
					keyDiemDi: '',
					nameDiemDen: '',
					keyDiemDen: '',
					ve_price: 0,
					rootPrice: 0,
					decreasePrice: '',
					fullName: '',
					phone: '',
					type: '',
					trung_chuyen_don: false,
					trung_chuyen_tra: false,
					tre_em: false,
					seri: '',
					danh_muc: '',
					key_danh_muc: 0,
					nameDMVe: '',
					key_KM: 0,
					nameKM: '',
					keyCodeDiscount: '',
					codeKM: '',
					key_codeKM: '',
					mesKM: '',
				});

				//Luu vao store
				let did_id = this.state.arrInfo.did_id;
				var nameStoreArrVeNumber = 'arrVeNumber' + did_id;
				var result = JSON.stringify(currentArrActive);
				AsyncStorage.removeItem(nameStoreArrVeNumber);
				AsyncStorage.setItem(nameStoreArrVeNumber, result);
			}

			this.setState({
				loading: false
			});
		}
	}

	calculatePrice(event) {
		this.setState({
			nameDMVe: '',
			seri: '',
		});

		if (rootPrice > Number(event.nativeEvent.text)) {
			// this.setState({ decreasePrice: event.nativeEvent.text, ve_price: rootPrice - event.nativeEvent.text });
			this.state.decreasePrice = event.nativeEvent.text;
			this.state.ve_price = rootPrice - Number(event.nativeEvent.text) > Number(this.state.arrInfo.tuy_gia_nho_nhat) ? (rootPrice - event.nativeEvent.text) : Number(this.state.arrInfo.tuy_gia_nho_nhat);
		}
		else {
			alert("Số tiền giảm không được lớn hơn giá gốc");
		}
	}

	_onLayout = event => {
		let widthDevice = Dimensions.get('window').width;
		let heightDevice = Dimensions.get('window').height;
		let twoColumn = (widthDevice >= 600) ? 'row' : 'column';

		this.setState({
			twoColumn: twoColumn,
			layout: {
				height: heightDevice,
				width: widthDevice
			},
		});
	}

	_handleThemVe() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.closeModalInfoVe();
		this.setState({
			themVe: {
				check: true,
				keyDiemDi: dataGiuong.bvv_bex_id_a,
				keyDiemDen: dataGiuong.bvv_bex_id_b,
				ve_price: dataGiuong.bvv_price,
				ten_khach_hang: dataGiuong.bvv_ten_khach_hang,
				khach_hang_id: dataGiuong.bvv_khach_hang_id,
				phone: dataGiuong.bvv_phone,
				diem_don: dataGiuong.bvv_diem_don_khach,
				diem_tra: dataGiuong.bvv_diem_tra_khach,
				bvv_ben_a: dataGiuong.bvv_ben_a,
				bvv_ben_b: dataGiuong.bvv_ben_b,
				ghi_chu: dataGiuong.bvv_ghi_chu
			}
		});
	}

	_handleHuyVeCurrent() {
		let arrThemve = this.state.arrThemve;
		let arrVeNumberState = this.state.arrVeNumber;
		this.closeModalInfoVe();
		for (var i = 0; i < arrThemve.length; i++) {
			let numberGiuong = arrThemve[i].bvv_number;
			if (this.state.currentIdGiuong == numberGiuong) {
				arrVeNumberState[numberGiuong].bvv_status = 0;
				arrVeNumberState[numberGiuong].bvv_bex_id_a = '';
				arrVeNumberState[numberGiuong].bvv_bex_id_b = '';
				arrVeNumberState[numberGiuong].bvv_ben_a = '';
				arrVeNumberState[numberGiuong].bvv_ben_b = '';
				arrVeNumberState[numberGiuong].bvv_price = '';
				arrVeNumberState[numberGiuong].bvv_ten_khach_hang = '';
				arrVeNumberState[numberGiuong].bvv_phone = '';
				arrVeNumberState[numberGiuong].bvv_diem_don_khach = '';
				arrVeNumberState[numberGiuong].bvv_diem_tra_khach = '';
				arrVeNumberState[numberGiuong].bvv_ghi_chu = '';
				arrVeNumberState[numberGiuong].bvv_seri = '';
				arrVeNumberState[numberGiuong].bvv_danh_muc = '';
				arrThemve.splice(i, 1);
				break;
			}
		}
		this.setState({
			arrThemve: arrThemve,
			arrVeNumber: arrVeNumberState
		});
	}

	async _handleThemVeDone() {
		var sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet
		});
		let that = this;
		let dataThemVe = this.state.themVe;
		if (this.state.sttInternet != false) {
			try {
				let params = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'insert',
					diem_a: dataThemVe.keyDiemDi,
					diem_b: dataThemVe.keyDiemDen,
					price: dataThemVe.ve_price,
					arrDataGiuong: JSON.stringify(this.state.arrThemve),
					idAdm: this.state.infoAdm.adm_id,
					fullName: dataThemVe.ten_khach_hang,
					phone: dataThemVe.phone,
					diem_don: dataThemVe.diem_don,
					diem_tra: dataThemVe.diem_tra,
					ghi_chu: dataThemVe.ghi_chu,
					trung_chuyen_don: this.state.trung_chuyen_don,
					trung_chuyen_tra: this.state.trung_chuyen_tra,
					tre_em: this.state.tre_em
				}
				let data = await fetchData('adm_them_ve', params, 'GET');
				if (data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({ type: 'reset' });
				} else {
					let arrThemve = this.state.arrThemve;
					for (var i = 0; i < arrThemve.length; i++) {
						var arrInfo = this.state.arrInfo;
						var did_so_cho_da_ban = parseInt(arrInfo.did_so_cho_da_ban) + 1;
						arrInfo.did_so_cho_da_ban = did_so_cho_da_ban;
					}
					this.setState({
						themVe: [],
						arrThemve: [],
						arrInfo: arrInfo
					});
				}
			} catch (e) {
				console.log(e);
			}
		}
		this.setState({
			loading: false
		});
	}

	async _handleLenXe() {
		var sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet
		});

		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];

		// if (dataGiuong.bvv_seri == 0) {
		// 	alert('Chưa có seri!');
		// 	return;
		// }

		this.closeModalInfoVe();
		var stt_change = 1;
		var stt_check = 1;
		if (this.state.sttInternet != false) {
			try {
				let params = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'lenxe',
					bvv_id: dataGiuong.bvv_id,
					did_id: dataGiuong.bvv_bvn_id,
					bvv_number: dataGiuong.bvv_number,
					idAdm: this.state.infoAdm.adm_id,
				}
				let data = await fetchData('api_so_do_giuong_update', params, 'GET');
				if (data.status == 404) {
					stt_check = 0
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({ type: 'reset' });
				} else {
					stt_change = 0;
				}
			} catch (e) {
				console.log(e);
			}

		}
		if (stt_check == 1) {
			let arrVeNumberState = this.state.arrVeNumber;
			arrVeNumberState[this.state.currentIdGiuong].bvv_status = 11;
			arrVeNumberState[this.state.currentIdGiuong].stt_change = stt_change;
			this.setState({
				arrVeNumber: arrVeNumberState
			});
			//Luu vao store
			let did_id = this.state.arrInfo.did_id;
			var nameStoreArrVeNumber = 'arrVeNumber' + did_id;
			var result = JSON.stringify(arrVeNumberState);
			AsyncStorage.removeItem(nameStoreArrVeNumber);
			AsyncStorage.setItem(nameStoreArrVeNumber, result);
		}
		this.setState({
			loading: false
		});
	}

	async _handleXuongXe() {
		var sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet
		});

		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.closeModalInfoVe();
		var stt_change = 1;
		var stt_check = 1;
		var arrVeXuongXeState = this.state.arrVeXuongXe;
		if (this.state.sttInternet != false) {
			try {
				let params = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'xuongxe',
					did_id: this.state.arrInfo.did_id,
					bvv_id: dataGiuong.bvv_id,
					idAdm: this.state.infoAdm.adm_id,
				}
				let data = await fetchData('api_so_do_giuong_update', params, 'GET');
				console.log(data);
				if (data.status == 404) {
					stt_check = 0;
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({ type: 'reset' });
				} else {
					stt_change = 0;
				}
			} catch (e) {
				console.log(e);
			}
		} else {
			//Xuong xe khi mat mang thay doi du lieu la 1
			stt_change = 1;
			//Xuong xe co id = 0 de cap nhat them moi
			var currentIdGiuong = this.state.currentIdGiuong;
			var arrVeNumberState = this.state.arrVeNumber;
			var arrVeXuongXeState = this.state.arrVeXuongXe;
			var countVeXuongXe = arrVeXuongXeState.length;
			var dataXuongXe = arrVeNumberState[currentIdGiuong];
			dataXuongXe.bvh_id = 0;
			arrVeXuongXeState[countVeXuongXe] = dataXuongXe;

		}
		if (stt_check == 1) {
			var currentIdGiuong = this.state.currentIdGiuong;
			var arrVeNumberState = this.state.arrVeNumber;
			arrVeNumberState[currentIdGiuong].bvv_status = 0;
			arrVeNumberState[currentIdGiuong].stt_change = stt_change;
			let arrInfo = this.state.arrInfo;
			let did_so_cho_da_ban = parseInt(arrInfo.did_so_cho_da_ban) - 1;
			arrInfo.did_so_cho_da_ban = did_so_cho_da_ban;
			this.setState({
				arrVeNumber: arrVeNumberState,
				arrVeXuongXe: arrVeXuongXeState,
				arrInfo: arrInfo,
				loading: false
			});
			//Luu vao store
			let did_id = this.state.arrInfo.did_id;
			var nameStoreArrVeNumber = 'arrVeNumber' + did_id;
			var result = JSON.stringify(arrVeNumberState);
			AsyncStorage.removeItem(nameStoreArrVeNumber);
			AsyncStorage.setItem(nameStoreArrVeNumber, result);

			var nameStoreArrVeXuongXe = 'arrVeXuongXe' + did_id;
			var result = JSON.stringify(arrVeXuongXeState);
			AsyncStorage.removeItem(nameStoreArrVeXuongXe);
			AsyncStorage.setItem(nameStoreArrVeXuongXe, result);
		}
		// this.setState({
		// 	loading: false
		// });
	}

	async _handleHuyVe() {
		var sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet
		});

		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.closeModalInfoVe();
		var stt_change = 1;
		var stt_check = 1;
		var arrVeHuyState = this.state.arrVeHuy;
		if (this.state.sttInternet != false) {
			try {
				let params = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'huyve',
					bvv_id: dataGiuong.bvv_id,
					did_id: dataGiuong.bvv_bvn_id,
					bvv_number: dataGiuong.bvv_number,
					bvv_bex_id_a: dataGiuong.bvv_bex_id_a,
					bvv_bex_id_b: dataGiuong.bvv_bex_id_b,
					bvv_price: dataGiuong.bvv_price,
					bvv_number: this.state.currentIdGiuong,
					idAdm: this.state.infoAdm.adm_id,
				}
				let data = await fetchData('api_so_do_giuong_update', params, 'GET');
				if (data.status == 404) {
					stt_check = 0;
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({ type: 'reset' });
				} else {
					stt_change = 1;
				}
			} catch (e) {
				console.log(e);
			}

		} else {
			//Huy ve thay doi du lieu la 1
			stt_change = 1;
			//Xuong xe co id = 0 de cap nhat them moi
			var currentIdGiuong = this.state.currentIdGiuong;
			var arrVeNumberState = this.state.arrVeNumber;
			var arrVeHuyState = this.state.arrVeHuy;
			var countVeHuy = arrVeHuyState.length;
			var dataHuy = arrVeNumberState[currentIdGiuong];
			dataHuy.bvh_id = 0;
			arrVeHuyState[countVeHuy] = dataHuy;
		}
		if (stt_check == 1) {
			var numberGiuong = this.state.currentIdGiuong;
			var arrVeNumberState = this.state.arrVeNumber;

			arrVeNumberState[numberGiuong].bvv_status = 0;
			arrVeNumberState[numberGiuong].bvv_bex_id_a = '';
			arrVeNumberState[numberGiuong].bvv_bex_id_b = '';
			arrVeNumberState[numberGiuong].bvv_ben_a = '';
			arrVeNumberState[numberGiuong].bvv_ben_b = '';
			arrVeNumberState[numberGiuong].bvv_price = '';
			arrVeNumberState[numberGiuong].bvv_ten_khach_hang = '';
			arrVeNumberState[numberGiuong].bvv_phone = '';
			arrVeNumberState[numberGiuong].bvv_diem_don_khach = '';
			arrVeNumberState[numberGiuong].bvv_diem_tra_khach = '';
			arrVeNumberState[numberGiuong].bvv_ghi_chu = '';
			arrVeNumberState[numberGiuong].bvv_seri = 0;
			arrVeNumberState[numberGiuong].bvv_danh_muc = 0;
			arrVeNumberState[numberGiuong].stt_change = stt_change;
			arrVeNumberState[numberGiuong].bvv_giu_code = '';

			var arrInfo = this.state.arrInfo;
			var did_so_cho_da_ban = parseInt(arrInfo.did_so_cho_da_ban) - 1;
			arrInfo.did_so_cho_da_ban = did_so_cho_da_ban;

			this.setState({
				arrVeNumber: arrVeNumberState,
				arrVeXuongXe: arrVeHuyState,
				arrInfo: arrInfo
			});
			//Luu vao store
			let did_id = this.state.arrInfo.did_id;
			var nameStoreArrVeNumber = 'arrVeNumber' + did_id;
			var result = JSON.stringify(arrVeNumberState);
			AsyncStorage.removeItem(nameStoreArrVeNumber);
			AsyncStorage.setItem(nameStoreArrVeNumber, result);

			var nameStoreArrVeHuy = 'arrVeHuy' + did_id;
			var result = JSON.stringify(arrVeHuyState);
			AsyncStorage.removeItem(nameStoreArrVeHuy);
			AsyncStorage.setItem(nameStoreArrVeHuy, result);
		}
		this.setState({
			loading: false
		});
	}

	async _handleChuyenTro() {
		var sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet
		});
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];

		this.closeModal();
		this.closeModalInfoVe();
		if (this.state.sttInternet != false) {
			try {
				let params = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'chuyentro',
					did_id: this.state.arrInfo.did_id,
					bvv_bvn_id_can_chuyen: dataGiuong.bvv_bvn_id,
					bvv_id_can_chuyen: dataGiuong.bvv_id,
					idAdm: this.state.infoAdm.adm_id,
				}
				let data = await fetchData('api_so_do_giuong_update', params, 'GET');
				if (data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({ type: 'reset' });
				} else {
					let arrVeNumberState = this.state.arrVeNumber;
					//arrVeNumberState[this.state.bvv_number_muon_chuyen].bvv_status = arrVeNumberState[this.state.currentIdGiuong].bvv_status;
					arrVeNumberState[this.state.currentIdGiuong].bvv_status = 0;
					let arrInfo = this.state.arrInfo;
					let did_so_cho_da_ban = parseInt(arrInfo.did_so_cho_da_ban) - 1;
					arrInfo.did_so_cho_da_ban = did_so_cho_da_ban;
					this.setState({
						arrVeNumber: arrVeNumberState,
						bvv_id_can_chuyen: 0,
						bvv_bvn_id_muon_chuyen: 0,
						bvv_number_muon_chuyen: 0,
						arrInfo: arrInfo,
						notifiCountDanhSachCho: parseInt(this.state.notifiCountDanhSachCho) + 1
					});
				}
			} catch (e) {
				console.log(e);
			}
		}
		this.setState({
			loading: false
		});
	}

	async _handleXacNhanChuyenVaoCho() {
		var sttInternet = await checkServerAlive();
		this.setState.sttInternet = sttInternet;

		this.closeModal();
		try {
			let params = {
				token: this.state.infoAdm.token,
				adm_id: this.state.infoAdm.adm_id,
				type: 'chuyenvaocho',
				did_id: this.state.arrInfo.did_id,
				bvv_bvn_id_muon_chuyen: this.state.bvv_bvn_id_muon_chuyen,
				bvv_number_muon_chuyen: this.state.bvv_number_muon_chuyen,
				bvh_id_can_chuyen: this.props.dataParam.bvh_id_can_chuyen,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('api_so_do_giuong_update', params, 'GET');
			if (data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({ type: 'reset' });
			} else {
				let arrVeNumberState = this.state.arrVeNumber;
				arrVeNumberState[this.state.currentIdGiuong].bvv_status = 1;
				this.setState({
					arrVeNumber: arrVeNumberState,
					notifiCountDanhSachCho: this.state.notifiCountDanhSachCho - 1
				});
				this.props.dataParam.bvh_id_can_chuyen = 0;
			}
		} catch (e) {
			console.log(e);
		}
		this.setState({
			loading: false
		});
	}

	_handleHuyChuyenVaoCho() {
		this.setState({
			chuyenVaoCho: false
		});
		this.props.dataParam.bvh_id_can_chuyen = 0;
		this.props.dataParam.nameGiuongXepCho = '';
	}

	_handleChuyenChoo() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.setState({
			bvv_id_can_chuyen: dataGiuong.bvv_id
		});
		this.closeModalInfoVe();
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: 64,
		marginBottom: 50
	},
	paddingContent: {
		marginLeft: 5,
		marginRight: 5,
		marginTop: 20
	},
	borderCol: {
		height: 160,
		borderWidth: 2,
		marginRight: 2,
		marginBottom: 2
	},
	nullBorderCol: {
		height: 100,
		borderWidth: 1,
		borderColor: '#d6d7da',
		marginRight: 2,
		marginBottom: 2,
		backgroundColor: '#d6d7da'
	},
	opacityBg: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		overflow: 'hidden'
	},
	opacityNullBg: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden'
	},
	disabled: {
		backgroundColor: 'red'
	},
	activeGiuong: {
		backgroundColor: '#ffa500',
	},
	activeLenXe: {
		backgroundColor: '#60c0dc'
	},
	activeThanhToan: {
		backgroundColor: '#5fb760',
	},
	textActiveGiuong: {
		color: '#ffffff',
		paddingLeft: 2
	},
	textRightGiuong: {
		fontSize: 13,
		color: '#000',
		paddingLeft: 2,
		fontWeight: 'bold'
	},
	textCenter: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 13
	},
	textLeft: {
		fontSize: 13,
		alignItems: 'flex-start',
		lineHeight: 16
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
		color: '#000066'
	},
	welcomePress: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
		color: '#ffffff'
	},
	button: {
		borderColor: '#000066',
		borderWidth: 1,
		borderRadius: 10,
	},
	buttonPress: {
		borderColor: '#000066',
		backgroundColor: '#000066',
		borderWidth: 1,
		borderRadius: 10,
	},
	modal: {
		alignItems: 'center'
	},
	wrapPopup: {
		paddingTop: 60
	},
	modalAction: {
		alignItems: 'center'
	},
	marginTopButton: {
		marginTop: 10,
		height: 50
	},
	styleTabbars: {
		flex: 1,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f7f7f7'
	},
	countDanhSachCho: {
		position: 'absolute',
		right: 25,
		top: 0,
		backgroundColor: 'rgba(255,114,114, 0.7)',
		width: 30,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 100
	},
	borderChuyenChoo: {
		borderWidth: 3,
		borderColor: '#000000'
	},
	bold: {
		fontWeight: 'bold'
	},
	name: {
		fontSize: 12,
		lineHeight: 15,
		fontWeight: 'bold'
	},
	small: {
		fontSize: 12,
		lineHeight: 15
	},
	colorTabs: {
		color: '#999'
	},
	close_popup: {
		position: 'absolute', zIndex: 9, top: 10, right: 10, width: 50, height: 50
	},
	form_item: {
		flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, marginLeft: 0,
		marginBottom: 10
	},
	form_input_text: {
		marginLeft: 200
	},
	form_modal_picker: {
		paddingLeft: 10, paddingRight: 10, marginBottom: 10
	},
	form_mdp_content: {
		flexDirection: 'row', alignItems: 'center', borderBottomColor: '#ccc', borderBottomWidth: 1, marginLeft: 5,
		paddingTop: 5, paddingBottom: 5
	},
	form_mdp_label: {
		marginLeft: 5, color: '#666'
	},
	form_update_icon: {
		marginLeft: 0,
		marginTop: 5
	}
});

export default ViewSoDoGiuong;

async function checkServerAlive() {
	if (net == 0) {
		try {
			let response = await fetch(domain + '/api/ping.php');
			let responseJson = await response.json();
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	else {
		return await isConnected();
	}

}
