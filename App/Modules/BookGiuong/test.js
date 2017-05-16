import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,StyleSheet,Dimensions,TextInput,TouchableOpacity,
	AsyncStorage,TabBarIOS,View,ScrollView,NetInfo
} from 'react-native';
import {domain, cache} from '../../Config/common';
import Common from '../../Components/Common';
import { Container, Content, Header, Title, Text, Icon, Input, InputGroup,
			Button, Card, CardItem, Spinner, Thumbnail
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from 'react-native-modalbox';
import ModalPicker from 'react-native-modal-picker';
import CheckBox from 'react-native-checkbox';

import StorageHelper from '../../Components/StorageHelper';
import fetchData from '../../Components/FetchData';
import ComSDGInfo from './ComSDGInfo';
import ComSDGFooter from './ComSDGFooter';

const heightDevice = Dimensions.get('window').height;
const {width, height} = Dimensions.get('window');

class ViewSoDoGiuong extends Component {

	constructor(props) {
		super(props);
		this.state = {
			layout:{
	        	height: height,
	        	width: width
	      },
			timeSync: (1000*2),showDropdown: false, did_id: 0,did_so_cho_da_ban: 0,bvv_id : 0,
			fullName: '', phone: '',diem_don: '', diem_tra: '',ghi_chu: '',loading: true,
			trung_chuyen_don: false, trung_chuyen_tra: false,
			arrVeNumber: [],isOpen: false,isDisabled: false,nameDiemDi: '', nameDiemDen: '',
			keyDiemDi: '', keyDiemDen: '', nameGiuong: '',results: [],infoDid: [],
			resultsBen: [],priceTotal: 0,arrVeNumber: [],currentIdGiuong: 0,totalPriceInt: 0,
			bvv_id_can_chuyen: 0,bvv_bvn_id_muon_chuyen: 0,bvv_number_muon_chuyen: 0,
			type: '',infoAdm: [],notifiCountDanhSachCho: 0,chuyenVaoCho: false,
			arrBen: [],themVe: false,arrThemve: [],token: '',clearTimeout: '',clearSync: ''
		};
	}

	async componentWillMount() {

		var that 	= this;
		let results = await StorageHelper.getStore('infoAdm');
		results 		= JSON.parse(results);
		let admId 	= results.adm_id;
		let token 	= results.token;
		let data 	= [];
		let time_sync 		= 60;
		let objTimeSync 	= fetchData('adm_get_time_sync', {type: 'laixe'}, 'GET');
		if(objTimeSync.time_sync >= 60) {
			time_sync = objTimeSync.time_sync;
		}
		this.state.timeSync = (1000 * time_sync);
		this.setState({
			infoAdm: results,
			token: token,
			did_id: that.props.dataParam.did_id,
			loading: true
		});

		try {
			let params = {
				token: token,
				adm_id: admId,
				did_id: that.props.dataParam.did_id
			}
			data = await fetchData('api_so_do_giuong', params, 'GET');
		} catch (e) {
			this.setState({
				loading: false
			});
		}


		this.state.clearTimeout = setTimeout(() => {
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}else if(data.status == 200) {
				that.setState({
					results: data.so_do_giuong,
					infoDid: data.info,
					did_so_cho_da_ban: data.info.did_so_cho_da_ban,
					arrVeNumber: data.so_do_giuong.arrVeNumber,
					arrActive: data.so_do_giuong.arrVeNumber,
					notifiCountDanhSachCho: data.total_danh_sach_cho,
					arrBen: data.arrBen
				});
			}
			that.setState({
				loading: false
			});
		}, 1000);

		this.getSyncArrVeNumber();
	}


	getSyncArrVeNumber() {
		let that = this;
		this.state.clearSync = setInterval(() => {
			try {
				let urlApi	= domain + '/api/laixe_v1/sync_so_do_giuong.php?type=laixe&token='+that.state.token+'&adm_id='+that.state.infoAdm.adm_id+'&did_id='+that.props.dataParam.did_id;
				fetch(urlApi, {
					headers: {
				    	'Cache-Control': cache
				  	}
				})
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
				let props = {
		        title: 'No Connection',
		        message: 'Có lỗi trong quá trính lấy dữ liệu.<br>Vui lòng kiểm tra lại kết nối',
		        typeAlert: 'warning',
		        titleButton: 'Thử lại',
		        callback: retry
		      }
		      Actions.alert(props)
			}
		}, this.state.timeSync);
	}


	componentWillUpdate(nextProps, nextState) {
		if(nextState.chuyenVaoCho == undefined) {
			nextState.chuyenVaoCho = nextProps.dataParam.chuyenVaoCho;
		}
		nextState.arrVeNumber = nextState.arrVeNumber;
	}

	componentWillUnmount() {
		clearTimeout(this.state.clearTimeout);
		clearInterval(this.state.clearSync);
	}

	_renderSoDoGiuong(dataTang) {
		let html = [];
		if(dataTang != undefined) {
			for(var i in dataTang) {
				var item = dataTang[i];
				var htmlChild = [];
				for(var j in item) {
					if(Object.keys(item).length <= 2) {
						if(j == 1) {
							htmlChild.push(
								<Col key={i+(j+9999)}>
									<TouchableOpacity style={styles.opacityBg}>
										<Text style={styles.textCenter}></Text>
									</TouchableOpacity>
								</Col>
							);
						}
					}

					var idGiuong 	= item[j].sdgct_number;
					var dataGiuong = this.state.arrVeNumber[idGiuong];
					var newPrice 	= dataGiuong.bvv_price/1000;
					var priceGiuongActive = newPrice.toFixed(0).replace(/./g, function(c, i, a) {
						return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
					});
					priceGiuongActive += 'K';
					let bvv_status_state		= dataGiuong.bvv_status;
					let bvv_id_can_chuyen	= this.state.bvv_id_can_chuyen;
					var style_sdg	= [styles.activeGiuong, styles.opacityBg];
					if((bvv_status_state > 0 || dataGiuong.bvv_status > 0) &&
						(bvv_status_state < 4 || dataGiuong.bvv_status < 4)) {
							if(bvv_id_can_chuyen == dataGiuong.bvv_id) {
								style_sdg	= [styles.activeGiuong, styles.opacityBg, styles.borderChuyenChoo];
							}
					}else if(bvv_status_state == 11 || dataGiuong.bvv_status == 11) {
						style_sdg	= [styles.activeLenXe, styles.opacityBg];
						if(bvv_id_can_chuyen == dataGiuong.bvv_id) {
							 style_sdg	= [styles.activeLenXe, styles.opacityBg, styles.borderChuyenChoo];
						}
					}else if((bvv_status_state == 4 || dataGiuong.bvv_status == 4) ||
						(bvv_status_state > 100 || dataGiuong.bvv_status > 100)) {
						style_sdg	=	[styles.activeThanhToan, styles.opacityBg];
						if(bvv_id_can_chuyen == dataGiuong.bvv_id) {
							style_sdg	= [styles.activeThanhToan, styles.opacityBg, styles.borderChuyenChoo];
						}
					}


					if( bvv_status_state > 0 || dataGiuong.bvv_status > 0) {
							htmlChild.push(
								<Col key={i+j} style={styles.borderCol}>
									<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={style_sdg}>
										<View style={{flexDirection: 'row'}}>
											<View style={{flex: 1}}>
												<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
											</View>
											<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 5}}>
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
										{dataGiuong.bvv_ten_khach_hang != "" &&
										<Text style={[styles.textActiveGiuong, styles.bold]}>{dataGiuong.bvv_ten_khach_hang}</Text>
										}
									</TouchableOpacity>
								</Col>
							);

					}else {
						htmlChild.push(
							<Col key={i+j} style={[styles.borderCol]}>
								<View style={[styles.opacityNullBg, {flex: 1}]}>
									<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
									<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong)} style={{position: 'absolute', top: 0, left: 0, width: 300, height: 300}}></TouchableOpacity>
								</View>
							</Col>
						);
					}
				}
				html.push(<Grid key={i} style={{marginRight: -8, marginLeft: -8, width: (this.state.layout.width-20)}}>{htmlChild}</Grid>);
			}
		}
		return html;
	}

	async _setActiveGiuong(id) {
		let bvh_id_can_chuyen	= this.props.dataParam.bvh_id_can_chuyen;
		let arrVeNumberState 	= this.state.arrVeNumber;
		let dataGiuong 			= this.state.arrVeNumber[id];
		var dataVeNew				= dataGiuong;
		this.setState({
			bvv_id: dataGiuong.bvv_id
		});
		//Them ve
		if(this.state.themVe.check) {
			let arrThemve = this.state.arrThemve;
			try {
				let params = {
					token: this.state.token,
					adm_id: this.state.infoAdm.adm_id,
					numberGiuong: id,
					bvv_id: arrVeNumberState[id].bvv_id
				}
				let data = await fetchData('api_check_ve', params, 'GET');
				if(data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
				} else if(data.status == 201) {
					alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
				}else {
					arrThemve.push({
						bvv_bvn_id: dataGiuong.bvv_bvn_id,
						bvv_id: dataGiuong.bvv_id,
						bvv_number: id,
						bvv_khach_hang_id: this.state.themVe.khach_hang_id,
						bvv_diem_don_khach: dataGiuong.bvv_diem_don_khach,
						bvv_diem_tra_khach: dataGiuong.bvv_diem_tra_khach,
						bvv_ghi_chu: dataGiuong.bvv_ghi_chu
					});

					dataVeNew.bvv_status 			= 1;
					dataVeNew.bvv_ten_khach_hang 	= this.state.themVe.ten_khach_hang;
					dataVeNew.bvv_phone 				= this.state.themVe.phone;
					dataVeNew.bvv_diem_don_khach 	= this.state.themVe.diem_don;
					dataVeNew.bvv_diem_tra_khach 	= this.state.themVe.diem_tra;
					dataVeNew.bvv_ghi_chu 			= this.state.themVe.ghi_chu;
					dataVeNew.bvv_bex_id_a 			= this.state.themVe.keyDiemDi;
					dataVeNew.bvv_bex_id_b 			= this.state.themVe.keyDiemDen;
					dataVeNew.bvv_ben_a 				= this.state.themVe.bvv_ben_a;
					dataVeNew.bvv_ben_b 				= this.state.themVe.bvv_ben_b;
					dataVeNew.bvv_price 				= this.state.themVe.totalPriceInt;
					dataVeNew.bvv_khach_hang_id 	= this.state.themVe.khach_hang_id;
					dataVeNew.bvv_trung_chuyen_a 	= this.state.themVe.bvv_trung_chuyen_a;
					dataVeNew.bvv_trung_chuyen_b 	= this.state.themVe.bvv_trung_chuyen_b;

					arrVeNumberState[id]	= dataVeNew;
					this.setState({
						arrThemve: arrThemve,
						arrVeNumber: arrVeNumberState
					});
				}

			} catch (e) {
				console.log(e);
			}
			this.setState({
				loading: false
			});
		}else if(bvh_id_can_chuyen > 0 && bvh_id_can_chuyen != undefined) {
			//Chuyen ve huy vao cho trong
			try {
				let params = {
					token: this.state.token,
					adm_id: this.state.infoAdm.adm_id,
					huy: this.props.dataParam.huy,
					type: 'chuyenvaocho',
					did_id: dataGiuong.bvv_bvn_id,
					bvv_number_muon_chuyen: dataGiuong.bvv_number,
					bvh_id_can_chuyen: this.props.dataParam.bvh_id_can_chuyen,
					idAdm: this.state.infoAdm.adm_id,
				}
				let data = await fetchData('api_so_do_giuong_update', params, 'GET');
				if(data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
				}else if(data.status == 201) {
					alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
				}else {
					dataVeNew.bvv_ten_khach_hang 	= this.props.dataParam.fullName;
					dataVeNew.bvv_phone 				= this.props.dataParam.phone;
					dataVeNew.bvv_bex_id_a 			= this.props.dataParam.bvv_bex_id_a;
					dataVeNew.bvv_bex_id_b 			= this.props.dataParam.bvv_bex_id_b;
					dataVeNew.bvv_trung_chuyen_a 	= this.props.dataParam.bvv_trung_chuyen_a;
					dataVeNew.bvv_trung_chuyen_b 	= this.props.dataParam.bvv_trung_chuyen_b;
					dataVeNew.bvv_ben_a 				= this.state.arrBen[this.props.dataParam.bvv_bex_id_a];
					dataVeNew.bvv_ben_b 				= this.state.arrBen[this.props.dataParam.bvv_bex_id_b];
					dataVeNew.bvv_diem_don_khach 	= this.props.dataParam.bvv_diem_don_khach;
					dataVeNew.bvv_diem_tra_khach 	= this.props.dataParam.bvv_diem_tra_khach;
					dataVeNew.bvv_price 				= parseInt(this.props.dataParam.bvv_price);
					dataVeNew.bvv_status 			= 1;

					arrVeNumberState[id]	= dataVeNew;
					this.state.did_so_cho_da_ban = parseInt(this.state.did_so_cho_da_ban)+1;
					this.setState({
						arrVeNumber: arrVeNumberState,
						notifiCountDanhSachCho: this.state.notifiCountDanhSachCho-1,
						chuyenVaoCho: false
					});
					this.props.dataParam.bvh_id_can_chuyen = 0;
					this.props.dataParam.nameGiuongXepCho = '';
				}
			} catch (e) {
				console.log(e);
			}
			this.setState({
				loading: false
			});
		}else if(this.state.bvv_id_can_chuyen != 0) {
			//Chuyen cho
			try {
				let params = {
					token: this.state.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'chuyencho',
					did_id: dataGiuong.bvv_bvn_id,
					bvv_number_muon_chuyen: dataGiuong.bvv_number,
					bvv_id_can_chuyen: this.state.bvv_id_can_chuyen,
					idAdm: this.state.infoAdm.adm_id,
				}
				let data = await fetchData('api_so_do_giuong_update', params, 'GET');
				if(data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
				}else if(data.status == 201) {
					alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
				}else {
					var dataVeChuyen	= {};
					dataVeChuyen		= arrVeNumberState[this.state.currentIdGiuong];

					dataVeNew.bvv_phone 				= dataVeChuyen.bvv_phone;
					dataVeNew.bvv_bex_id_a 			= dataVeChuyen.bvv_bex_id_a;
					dataVeNew.bvv_bex_id_b 			= dataVeChuyen.bvv_bex_id_b;
					dataVeNew.bvv_ben_a 				= dataVeChuyen.bvv_ben_a;
					dataVeNew.bvv_ben_b 				= dataVeChuyen.bvv_ben_b;
					dataVeNew.bvv_status 			= dataVeChuyen.bvv_status;
					dataVeNew.bvv_price 				= dataVeChuyen.bvv_price;
					dataVeNew.bvv_diem_don_khach 	= dataVeChuyen.bvv_diem_don_khach;
					dataVeNew.bvv_diem_tra_khach 	= dataVeChuyen.bvv_diem_tra_khach;
					dataVeNew.bvv_ten_khach_hang 	= dataVeChuyen.bvv_ten_khach_hang;
					dataVeNew.bvv_trung_chuyen_a 	= dataVeChuyen.bvv_trung_chuyen_a;
					dataVeNew.bvv_trung_chuyen_b 	= dataVeChuyen.bvv_trung_chuyen_b;

					arrVeNumberState[id]	= dataVeNew;
					arrVeNumberState[this.state.currentIdGiuong].bvv_status = 0;
					this.setState({
						arrVeNumber: arrVeNumberState,
						bvv_id_can_chuyen: 0,
						bvv_bvn_id_muon_chuyen: 0,
						bvv_number_muon_chuyen: 0
					});
				}
			} catch (e) {
				console.log(e);
			}
			this.setState({
				loading: false
			});
		}else {
			//form update
			this.getPriceBen(dataGiuong.bvv_bex_id_a, dataGiuong.bvv_bex_id_b, dataGiuong.bvv_id);
			this.setState({
				nameGiuong: id,
				loadingModal: true,
				type: '',
				fullName: '',
				phone: '',
				diem_don: '',
				diem_tra: '',
				ghi_chu: '',
				trung_chuyen_don: false,
				trung_chuyen_tra: false,
				bvv_id: dataGiuong.bvv_id
			});

			this.openModal();
			try {
				let params = {
					token: this.state.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'getBen',
					did_id: this.props.dataParam.did_id,
					numberGiuong: id,
					bvv_id: dataGiuong.bvv_id,
				}
				let data = await fetchData('api_get_ben_did', params, 'GET');
				if(data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
				}else if(data.status == 201) {
					alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
					this.setState({
						fullName: data.fullName,
						phone: data.phone,
						diem_don: data.bvv_diem_don_khach,
						diem_tra: data.bvv_diem_tra_khach,
						loading: false,
						loadingModal: false
					});
				}else {
					setTimeout(() => {
						let newDataBen = [];
						for(var i = 0; i < Object.keys(data.dataBen).length > 0; i++) {
							newDataBen.push({key: data.dataBen[i].bex_id, value: data.dataBen[i].bex_ten});
						}

						this.setState({
							status: data.status,
							resultsBen: newDataBen,
							bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
							bvv_number_muon_chuyen: dataGiuong.bvv_number,
							type: '',
							totalPriceInt: this.state.totalPriceInt,
							loading: false,
							loadingModal: false
						});
					}, 1000);
				}
			} catch (e) {
				this.setState({
					loading: false,
					loadingModal: false
				});
				console.log(e);
			}
		}

	}

	_unsetActiveGiuong(id){
		let dataGiuong = this.state.arrVeNumber[id];
		this.setState({
			currentIdGiuong: id,
			bvv_id_can_chuyen: 0,
			bvv_bvn_id_muon_chuyen: 0,
			bvv_number_muon_chuyen: 0
		});
		this.openModalAction();
	}

	openModal(id) {
		this.refs.modalPopup.open();
	}

	closeModal(id) {
		this.refs.modalPopup.close();
	}

	openModalAction(id) {
		this.refs.modalPopupAction.open();
	}

	closeModalAction(id) {
		this.refs.modalPopupAction.close();
	}

	_renderModalBen(data) {
		let html = [],
			htmlPrice = [],
			htmlButton = [];
		if(this.state.status == 200) {
			let listItem1 	= [],
			listItem2 		= [],
			keyDiemDi 		= this.state.keyDiemDi,
			keyDiemDen 		= this.state.keyDiemDen,
			currentDiemDen = '',
			currentDiemDi 	= '',
			type 				= this.state.type,
			totalPriceInt 	= this.state.totalPriceInt;

			if(this.state.nameDiemDen != '') {
				currentDiemDen = this.state.nameDiemDen;
			}

			if(this.state.nameDiemDi != '') {
				currentDiemDi = this.state.nameDiemDi;
			}

			if(this.props.dataParam.bvh_id_can_chuyen != undefined && this.props.dataParam.bvh_id_can_chuyen > 0) {
				html.push(<Button key="9" block info style={styles.marginTopButton} onPress={this._handleXacNhanChuyenVaoCho.bind(this)}>Xác nhận Chuyển vào chỗ</Button>);
			}else {
				if(this.state.bvv_id_can_chuyen <= 0) {
					if(data.length > 0) {
						let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong],
							currentPrice = dataGiuong.bvv_price,
							priceConver = 0;
							if(type == 'update') {
								if(totalPriceInt > 0) {
									currentPrice = totalPriceInt;
								}
								if(currentPrice > 0) {
									priceConver = Common.formatPrice(currentPrice);
								}
							}else {
								if(totalPriceInt > 0) {
									priceConver = Common.formatPrice(totalPriceInt);
								}
							}
						Object.keys(data).map(function(key) {
							let checkSelect = false;
							if(keyDiemDi != '' && keyDiemDi == data[key].key) {
								checkSelect = true;
								if(type == 'update') {
									currentDiemDi = data[key].value;
								}
							}
							listItem1.push({key: data[key].key.toString(), section: checkSelect, label: data[key].value, value: data[key].key});
						});

						Object.keys(data).map(function(key) {
							let checkSelect = false;
							if(keyDiemDen != '' && keyDiemDen == data[key].key) {
								checkSelect = true;
								if(type == 'update') {
									currentDiemDen = data[key].value;
								}
							}
							listItem2.push({key: data[key].key.toString(), section: checkSelect, label: data[key].value, value: data[key].key});
						});

						htmlPrice.push(
							<View key="5" style={{flexDirection: 'row', justifyContent: 'center', margin: 10}}>
								<Text style={{flex: 1}}>Giá vé:</Text>
								<Text style={{flex: 4, color: 'red', fontSize: 20}}>{priceConver} VNĐ</Text>
							</View>
						);

						if(type == 'update') {
							htmlButton.push(
								<Button style={{marginRight: 10, marginLeft: 10, height: 50}} key="6" block success onPress={this.updateGiuong.bind(this, this.state.nameGiuong)}>Cập nhật</Button>
							);
						}else {
							htmlButton.push(
								<Button style={{marginRight: 10, marginLeft: 10, height: 50}} key="6" block success onPress={this.bookGiuong.bind(this, this.state.nameGiuong)}>Đặt vé</Button>
							);
						}

						html.push(
							<View key="1" style={{width: this.state.layout.width, height: this.state.layout.height, paddingTop: 10, position: 'relative', paddingBottom: 120}}>
								<View style={styles.close_popup}>
									<TouchableOpacity onPress={() => this.closeModal()} style={{alignItems: 'flex-end', justifyContent: 'center'}}>
										<Icon name="md-close" style={{fontSize: 30}} />
									</TouchableOpacity>
								</View>
								<ScrollView style={{width: this.state.layout.width}} keyboardShouldPersistTaps={true}>
									<ModalPicker data={listItem1} initValue="Chọn điểm đi"
										onChange={(option)=>{this.renderPriceBen(option,1)}}
										style={styles.form_modal_picker} >
										<View style={styles.form_mdp_content}>
											<Icon style={styles.form_update_icon} name="md-bus" />
											<Text style={styles.form_mdp_label}>Điểm đi:</Text>
											<Text style={{height:40, alignItems: 'center', justifyContent: 'center', paddingTop: 10}}>{currentDiemDi == ''? 'Chọn điểm đến' : currentDiemDi}</Text>
										</View>
									</ModalPicker>
									<ModalPicker data={listItem2} initValue="Chọn điểm đến"
										onChange={(option)=>{this.renderPriceBen(option,2)}}
										style={styles.form_modal_picker} >
										<View style={styles.form_mdp_content}>
											<Icon style={styles.form_update_icon} name="ios-bus" />
											<Text style={styles.form_mdp_label}>Điểm đến:</Text>
											<Text style={{height:40, alignItems: 'center', justifyContent: 'center', paddingTop: 10}}>{currentDiemDen == ''? 'Chọn điểm đến' : currentDiemDen}</Text>
										</View>
									</ModalPicker>
									<InputGroup style={styles.form_item}>
										<Icon style={styles.form_update_icon} name='ios-person' />
										<Input placeholder="Họ Và Tên" value={this.state.fullName} onChange={(event) => this.setState({fullName: event.nativeEvent.text})} />
									</InputGroup>
									<InputGroup style={styles.form_item}>
										<Icon style={styles.form_update_icon} name='ios-call' />
										<Input placeholder="Số điện thoại" keyboardType="numeric" value={this.state.phone} onChange={(event) => this.setState({phone: event.nativeEvent.text})} />
									</InputGroup>
									<View style={{flex:1,flexDirection:'row'}}>
										<InputGroup style={[styles.form_item,{flex:3}]}>
											<Icon style={styles.form_update_icon} name='ios-home' />
											<Input placeholder="Nơi đón" value={this.state.diem_don} onChange={(event) => this.setState({diem_don: event.nativeEvent.text})} />
										</InputGroup>

										<CheckBox style={{flex:1}} checkboxStyle={{marginTop:10, borderColor: 'red'}} label='' checked={this.state.trung_chuyen_don} onChange={(checked) => this.setState({trung_chuyen_don: !this.state.trung_chuyen_don})}/>
									</View>
									<View style={{flex:1,flexDirection:'row',}}>
										<InputGroup style={[styles.form_item,{flex:3}]}>
											<Icon style={styles.form_update_icon} name='ios-home-outline' />
											<Input placeholder="Nơi trả" value={this.state.diem_tra} onChange={(event) => this.setState({diem_tra: event.nativeEvent.text})} />
										</InputGroup>
										<CheckBox style={{flex:1}} checkboxStyle={{marginTop:10, borderColor: 'red'}} label='' checked={this.state.trung_chuyen_tra} onChange={(checked) => this.setState({trung_chuyen_tra: !this.state.trung_chuyen_tra})}/>
									</View>
									<InputGroup style={styles.form_item}>
										<Icon style={styles.form_update_icon} name='ios-create-outline' />
										<Input placeholder="Ghi Chú" value={this.state.ghi_chu} onChange={(event) => this.setState({ghi_chu: event.nativeEvent.text})} />
									</InputGroup>
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

	async renderPriceBen(option,type) {
		var keyDiemDi	= this.state.keyDiemDi;
		var keyDiemDen	= this.state.keyDiemDen;
		if(type == 1){
			keyDiemDi	= option.value;
			this.setState({
				loadingModal: true,
				nameDiemDi: option.label,
				keyDiemDi: keyDiemDi
			});
		}
		if(type == 2){
			keyDiemDen = option.value;
			this.setState({
				loadingModal: true,
				nameDiemDen: option.label,
				keyDiemDen: keyDiemDen,
			});
		}

		try {
			let params = {
				adm_id: this.state.infoAdm.adm_id,
				did_id: this.state.did_id,
				bvv_id: this.state.bvv_id,
				type: 'notAuto',
				diemDi:  keyDiemDi,
				diemDen: keyDiemDen,
				idAdm: this.state.infoAdm.adm_id,
				token: this.state.token,
			}
			let data = await fetchData('api_get_price', params, 'GET');
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}else{
				var totalPriceInt = data.totalPrice;
				var totalPrice = data.totalPrice.toFixed(0).replace(/./g, function(c, i, a) {
					return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
				});
				this.setState({
					priceTotal: totalPrice,
					totalPriceInt: totalPriceInt,
					loadingModal: false
				});
				return data.totalPrice;
			}
		} catch (e) {
			console.log(e);
		}
		this.setState({
			loadingModal: false,
			loading: false
		});
	}

	getPriceBen(diem_a, diem_b, bvv_id) {
		this.setState({
			loadingModal: true
		});
		var that 	= this;
		let urlApi	= domain+'/api/laixe_v1/get_price.php?adm_id='+this.state.infoAdm.adm_id+'&type=auto&diemDi='+diem_a+'&diemDen='+diem_b+'&bvv_id='+bvv_id +'&token='+this.state.token;
		try {

			fetch( urlApi,{
				headers: {
					'Cache-Control': cache
				}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(responseJson.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
				}else {
					var totalPriceInt = responseJson.totalPrice;
					var totalPrice = responseJson.totalPrice.toFixed(0).replace(/./g, function(c, i, a) {
						return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
					});
					that.setState({
						priceTotal: totalPrice,
						totalPriceInt: totalPriceInt,
						keyDiemDi: responseJson.keyDiemDi,
						nameDiemDi: responseJson.nameDiemDi,
						nameDiemDen: responseJson.nameDiemDen,
						keyDiemDen: responseJson.keyDiemDen
					});
					return responseJson.totalPrice;
				}
			})
			.catch((error) => {
				console.error(error);
			});

		} catch (e) {

		}
	}

	async updateGiuong(id) {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		checkData = true;
		if(this.state.keyDiemDi == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đi!');
		}else if(this.state.keyDiemDen == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đến!');
		}
		if(checkData) {
			this.setState({
				loadingModal: true,
				isOpen: false
			});

			this.closeModal();
			try {
				let params = {
					token: this.state.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'update',
					bvv_id: dataGiuong.bvv_id,
					did_id: dataGiuong.bvv_bvn_id,
					bvv_number: dataGiuong.bvv_number,
					diem_a: this.state.keyDiemDi,
					diem_b: this.state.keyDiemDen,
					price: this.state.totalPriceInt,
					idAdm: this.state.infoAdm.adm_id,
					fullName: this.state.fullName,
					phone: this.state.phone,
					diem_don: this.state.diem_don,
					diem_tra: this.state.diem_tra,
					ghi_chu: this.state.ghi_chu,
					trung_chuyen_don: this.state.trung_chuyen_don,
					trung_chuyen_tra: this.state.trung_chuyen_tra
				}
				let data = await fetchData('api_so_do_giuong_update', params, 'GET');
				if(data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
				}else {
					var bvv_trung_chuyen_a	= 0;
					var bvv_trung_chuyen_b	= 0;
					if(this.state.trung_chuyen_don){
						bvv_trung_chuyen_a	= 1;
					}
					if(this.state.trung_chuyen_tra){
						bvv_trung_chuyen_b	= 1;
					}
					let currentArrActive = this.state.arrVeNumber;
					currentArrActive[this.state.currentIdGiuong].bvv_ten_khach_hang = this.state.fullName;
					currentArrActive[this.state.currentIdGiuong].bvv_phone = this.state.phone;
					currentArrActive[this.state.currentIdGiuong].bvv_bex_id_a = this.state.keyDiemDi;
					currentArrActive[this.state.currentIdGiuong].bvv_bex_id_b = this.state.keyDiemDen;
					currentArrActive[this.state.currentIdGiuong].bvv_ben_a = this.state.arrBen[this.state.keyDiemDi];
					currentArrActive[this.state.currentIdGiuong].bvv_ben_b = this.state.arrBen[this.state.keyDiemDen];
					currentArrActive[this.state.currentIdGiuong].bvv_price = this.state.totalPriceInt;

					currentArrActive[this.state.currentIdGiuong].bvv_diem_don_khach = this.state.diem_don;
					currentArrActive[this.state.currentIdGiuong].bvv_diem_tra_khach = this.state.diem_tra;
					currentArrActive[this.state.currentIdGiuong].bvv_ghi_chu = this.state.ghi_chu;
					currentArrActive[this.state.currentIdGiuong].bvv_trung_chuyen_a = bvv_trung_chuyen_a;
					currentArrActive[this.state.currentIdGiuong].bvv_trung_chuyen_b = bvv_trung_chuyen_b;

					this.setState({
						arrVeNumber: currentArrActive,
						loadingModal: false,
						isOpen: false,
						nameDiemDi: '',
						keyDiemDi: '',
						nameDiemDen: '',
						keyDiemDen: '',
						priceTotal: 0,
						totalPriceInt: 0,
						fullName: '',
						phone: '',
						type: '',
						trung_chuyen_don: false,
						trung_chuyen_tra: false
					});
				}
			} catch (e) {
				console.log(e);
			}
			this.setState({
				loadingModal: false,
				loading: false
			});
		}
	}

	async bookGiuong(id) {
		let dataGiuong = this.state.arrVeNumber[id],
		checkData = true;
		if(this.state.keyDiemDi == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đi!');
		}else if(this.state.keyDiemDen == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đến!');
		}
		if(checkData) {
			this.setState({
				loadingModal: true,
				isOpen: false,
				bvv_id: dataGiuong.bvv_id
			});

			this.closeModal();
			try {
				let params = {
					token: this.state.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'insert',
					bvv_id: dataGiuong.bvv_id,
					did_id: dataGiuong.bvv_bvn_id,
					bvv_number: dataGiuong.bvv_number,
					diem_a: this.state.keyDiemDi,
					diem_b: this.state.keyDiemDen,
					price: this.state.totalPriceInt,
					idAdm: this.state.infoAdm.adm_id,
					fullName: this.state.fullName,
					phone: this.state.phone,
					diem_don: this.state.diem_don,
					diem_tra: this.state.diem_tra,
					ghi_chu: this.state.ghi_chu,
					trung_chuyen_don: this.state.trung_chuyen_don,
					trung_chuyen_tra: this.state.trung_chuyen_tra
				}
				let data = await fetchData('api_so_do_giuong_update', params, 'GET');
				if(data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
				}else if(data.status == 201) {
					alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
				}else {
					var bvv_trung_chuyen_a	= 0;
					var bvv_trung_chuyen_b	= 0;
					if(this.state.trung_chuyen_don){
						bvv_trung_chuyen_a	= 1;
					}
					if(this.state.trung_chuyen_tra){
						bvv_trung_chuyen_b	= 1;
					}
					let currentArrActive 										= this.state.arrVeNumber;
					currentArrActive[id].bvv_status 				= 1;
					currentArrActive[id].bvv_ten_khach_hang = this.state.fullName;
					currentArrActive[id].bvv_phone 					= this.state.phone;
					currentArrActive[id].bvv_diem_don_khach = this.state.diem_don;
					currentArrActive[id].bvv_diem_tra_khach = this.state.diem_tra;
					currentArrActive[id].bvv_ghi_chu 				= this.state.ghi_chu;
					currentArrActive[id].bvv_bex_id_a 				= this.state.keyDiemDi;
					currentArrActive[id].bvv_bex_id_b 				= this.state.keyDiemDen;
					currentArrActive[id].bvv_ben_a 					= this.state.nameDiemDi;
					currentArrActive[id].bvv_ben_b 					= this.state.nameDiemDen;
					currentArrActive[id].bvv_price 					= this.state.totalPriceInt;
					currentArrActive[id].bvv_khach_hang_id 	= data.userId;
					currentArrActive[id].bvv_trung_chuyen_a = bvv_trung_chuyen_a;
					currentArrActive[id].bvv_trung_chuyen_b = bvv_trung_chuyen_b;
					this.state.did_so_cho_da_ban = parseInt(this.state.did_so_cho_da_ban)+1;
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
						priceTotal: 0,
						totalPriceInt: 0,
						fullName: '',
						phone: '',
						trung_chuyen_tra: false,
						trung_chuyen_don: false,
						ghi_chu: ''
					});
				}
			} catch (e) {
				console.log(e);
			}
			this.setState({
				loadingModal: false,
				loading: false
			});
		}
	}

	_onLayout = event => {
		let widthDevice = Dimensions.get('window').width;
		let heightDevice = Dimensions.get('window').height;
		let twoColumn = (widthDevice >= 600)? 'row' : 'column' ;

    	this.setState({
			twoColumn: twoColumn,
			layout:{
	        	height: heightDevice,
	        	width: widthDevice
	      },
    	});
	}

	render() {
		let dataParam = {
			did_id: this.props.dataParam.did_id,
			countCho: this.state.notifiCountDanhSachCho
		};

		return(

			<View style={{height: this.state.layout.height}} onLayout={this._onLayout}>
				<ScrollView style={styles.container}>

					<ComSDGInfo SDGInfo={this.state.infoDid} />

					<View style={{flexDirection: 'column', flex: 1}}>
						{this.state.loading && <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View> }

						{this._renderSoDoGiuong(this.state.results.arrChoTang_1).length > 0 &&
							<Card style={[styles.paddingContent]}>
								<CardItem header style={{alignItems: 'center'}}>
									<Text style={{fontSize: 20}}>Tầng 1</Text>
								</CardItem>

								<CardItem style={{marginTop: -20}}>
									{this._renderSoDoGiuong(this.state.results.arrChoTang_1)}
								</CardItem>

							</Card>
						}

						{this._renderSoDoGiuong(this.state.results.arrChoTang_2).length > 0 &&
							<Card style={[styles.paddingContent, {marginTop: -10}]}>
								<CardItem>
									{this._renderSoDoGiuong(this.state.results.arrChoTang_3)}
								</CardItem>

							</Card>
						}

						{this._renderSoDoGiuong(this.state.results.arrChoTang_2).length > 0 &&
							<Card style={styles.paddingContent}>
								<CardItem header style={{alignItems: 'center'}}>
									<Text style={{fontSize: 20}}>Tầng 2</Text>
								</CardItem>

								<CardItem style={{marginTop: -20}}>
									{this._renderSoDoGiuong(this.state.results.arrChoTang_2)}
								</CardItem>
							</Card>
						}

						{this._renderSoDoGiuong(this.state.results.arrChoTang_4).length > 0 &&
							<Card style={[styles.paddingContent, {marginTop: -10}]}>
								<CardItem>
									{this._renderSoDoGiuong(this.state.results.arrChoTang_4)}
								</CardItem>

							</Card>
						}

						{this._renderSoDoGiuong(this.state.results.arrChoTang_5).length > 0 &&
							<Card style={styles.paddingContent}>
								<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
									<Text style={{fontSize: 20}}>Ghế Sàn</Text>
								</CardItem>

								<CardItem>
									{this._renderSoDoGiuong(this.state.results.arrChoTang_5)}
								</CardItem>
							</Card>
						}
					</View>

				</ScrollView>

				<Modal style={[styles.modal, styles.modalPopup, {height: this.state.layout.height}]} position={"center"} ref={"modalPopup"} isDisabled={this.state.isDisabled}>
					{this.state.loadingModal && <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View> }
					{!this.state.loadingModal &&
						this._renderModalBen(this.state.resultsBen)
					}
				</Modal>

				<Modal style={[styles.modalAction, styles.modalPopupAction, {height: this.state.layout.height}]} position={"center"} ref={"modalPopupAction"} isDisabled={this.state.isDisabled}>
					{this.state.loadingModalAction && <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View> }
					{!this.state.loadingModalAction &&
						this._renderButtonAction()
					}
				</Modal>

				<ComSDGFooter dataParam={dataParam} />

				{this.state.chuyenVaoCho &&
					<View style={{position: 'absolute', top: 60, right: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 10}}>
						<Text style={{color: '#fff'}}>Chọn chỗ trống để xếp khách lên giường "{this.props.dataParam.nameGiuongXepCho}". Nếu chưa xếp chỗ thì click vào đây để hủy thao tác:</Text>
						<TouchableOpacity onPress={() => this._handleHuyChuyenVaoCho()} style={{backgroundColor: '#f95454', padding: 10, width: 110, alignItems: 'center', marginTop: 10}}>
							<Text style={{color: '#fff'}}>Hủy thao tác</Text>
						</TouchableOpacity>
					</View>}

				{this.state.themVe.check &&
					<View style={{position: 'absolute', top: 60, right: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 10}}>
						<Text style={{color: '#fff', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16}}>Chọn chỗ trống để Thêm Vé</Text>
						<View style={{flexDirection: 'row'}}>
							<TouchableOpacity onPress={() => this._handleThemVeDone()} style={{flex: 1,backgroundColor: '#00bfff', padding: 10, width: 110, alignItems: 'center', marginTop: 10}}>
								<Text style={{color: '#fff', fontWeight: 'bold'}}>Xong</Text>
							</TouchableOpacity>
						</View>
					</View>}
			</View>
		);
	}


	_renderButtonAction() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		let html 		= [];
		let htmlForm 	= [];
		let arrThemve 	= this.state.arrThemve;
		let checkNumberThemVe = false;

		for(var i = 0; i < arrThemve.length; i++) {
			if(arrThemve[i].bvv_number == this.state.currentIdGiuong) {
				checkNumberThemVe = true;
				break;
			}
		}

		if(checkNumberThemVe) {
			html.push(<Button key="3" block danger style={styles.marginTopButton} onPress={this._handleHuyVeCurrent.bind(this)}>Hủy Vé</Button>);
		}else {
			if(this.state.currentIdGiuong != 0) {
				if(dataGiuong.bvv_status == 11) {
					html.push(<Button key="1" block success style={styles.marginTopButton} onPress={this._handleXuongXe.bind(this)}>Xuống xe</Button>);
				}else {
					html.push(<Button key="2" block success style={styles.marginTopButton} onPress={this._handleLenXe.bind(this)}>Xác Nhận Lên Xe</Button>);
					html.push(<Button key="7" block style={styles.marginTopButton} onPress={this._handleChinhSua.bind(this)}>Chỉnh sửa</Button>);
					if(this.state.bvv_id_can_chuyen != this.state.currentIdGiuong) {
						html.push(<Button key="5" block info style={styles.marginTopButton} onPress={this._handleChuyenChoo.bind(this)}>Chuyển chỗ</Button>);
					}
					html.push(<Button key="6" block success style={styles.marginTopButton} onPress={this._handleThemVe.bind(this)}>Thêm vé</Button>);
					html.push(<Button key="3" block danger style={styles.marginTopButton} onPress={this._handleHuyVe.bind(this)}>Hủy Vé</Button>);
					html.push(<Button key="4" block warning style={styles.marginTopButton} onPress={this._handleChuyenTro.bind(this)}>Chuyển chờ</Button>);

				}
			}


		}

		if(this.state.currentIdGiuong != 0) {
			htmlForm.push(
				<View key="1" style={{width: this.state.layout.width, height: (this.state.layout.height-110), paddingTop: 10, paddingBottom: 10}}>
					<View style={{position: 'absolute', zIndex:9, top: 10, right: 10, width: 50, height: 50}}>
						<TouchableOpacity onPress={() => this.closeModalAction()} style={{alignItems: 'flex-end', justifyContent: 'center'}}>
							<Icon name="md-close" style={{fontSize: 30}} />
						</TouchableOpacity>
					</View>
					<ScrollView style={{width: this.state.layout.width}}>
						<View style={{margin: 10}}>
							<Text>Họ và tên: <Text style={styles.bold}>{dataGiuong.bvv_ten_khach_hang}</Text></Text>
							<Text>Số điện thoại: <Text style={styles.bold}>{dataGiuong.bvv_phone}</Text></Text>
							<Text>Điểm đón: <Text style={styles.bold}>{dataGiuong.bvv_diem_don_khach}</Text></Text>
							<Text>Điểm trả: <Text style={styles.bold}>{dataGiuong.bvv_diem_tra_khach}</Text></Text>
							<Text>Nơi đi & đến: <Text style={styles.bold}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]} -> {this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text></Text>
							<Text>Giá vé: <Text style={styles.bold}>{Common.formatPrice(dataGiuong.bvv_price)} VNĐ</Text></Text>
							<Text>Ghi chú: <Text style={styles.bold}>{dataGiuong.bvv_ghi_chu}</Text></Text>
							{html}
						</View>
					</ScrollView>
				</View>
			);
		}
		return htmlForm;
	}

	_handleThemVe() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.closeModalAction();
		this.setState({
			themVe: {
				check: true,
				keyDiemDi: dataGiuong.bvv_bex_id_a,
				keyDiemDen: dataGiuong.bvv_bex_id_b,
				totalPriceInt: dataGiuong.bvv_price,
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
		this.closeModalAction();
		for(var i = 0; i < arrThemve.length; i++) {
			let numberGiuong = arrThemve[i].bvv_number;
			if(this.state.currentIdGiuong == numberGiuong) {
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
		let that = this;
		let dataThemVe = this.state.themVe;
		try {
			let params = {
				token: this.state.token,
				adm_id: this.state.infoAdm.adm_id,
				type: 'insert',
				diem_a: dataThemVe.keyDiemDi,
				diem_b: dataThemVe.keyDiemDen,
				price: dataThemVe.totalPriceInt,
				arrDataGiuong: JSON.stringify(this.state.arrThemve),
				idAdm: this.state.infoAdm.adm_id,
				fullName: dataThemVe.ten_khach_hang,
				phone: dataThemVe.phone,
				diem_don: dataThemVe.diem_don,
				diem_tra: dataThemVe.diem_tra,
				ghi_chu: dataThemVe.ghi_chu,
				trung_chuyen_don: this.state.trung_chuyen_don,
				trung_chuyen_tra: this.state.trung_chuyen_tra
			}
			let data = await fetchData('adm_them_ve', params, 'GET');
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			} else {
				let arrThemve = this.state.arrThemve;
				for(var i = 0; i < arrThemve.length; i++) {
					this.state.did_so_cho_da_ban = parseInt(this.state.did_so_cho_da_ban)+1;
				}
				this.setState({
					themVe: [],
					arrThemve: []
				});
			}
		} catch (e) {
			console.log(e);
		}
		this.setState({
			loading: false
		});
	}

	async _handleLenXe() {
		this.setState({
			loadingModalAction: true
		});
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.closeModalAction();
		try {
			let params = {
				token: this.state.token,
				adm_id: this.state.infoAdm.adm_id,
				type: 'lenxe',
				bvv_id: dataGiuong.bvv_id,
				did_id: dataGiuong.bvv_bvn_id,
				bvv_number: dataGiuong.bvv_number,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('api_so_do_giuong_update', params, 'GET');
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}else {
				let arrVeNumberState = this.state.arrVeNumber;
				arrVeNumberState[this.state.currentIdGiuong].bvv_status = 11;
				this.setState({
					arrVeNumber: arrVeNumberState
				});
			}
		} catch (e) {
			console.log(e);
		}
		this.setState({
			loadingModalAction: false,
			loading: false
		});
	}

	async _handleXuongXe() {
		this.setState({
			loadingModalAction: true
		});
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.closeModalAction();
		try {
			let params = {
				token: this.state.token,
				adm_id: this.state.infoAdm.adm_id,
				type: 'xuongxe',
				bvv_id: dataGiuong.bvv_id,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('api_so_do_giuong_update', params, 'GET');
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}else {
				let arrVeNumberState = this.state.arrVeNumber;
				arrVeNumberState[this.state.currentIdGiuong].bvv_status = 0;
				this.state.did_so_cho_da_ban = parseInt(this.state.did_so_cho_da_ban)-1;
				this.setState({
					arrVeNumber: arrVeNumberState
				});
			}
		} catch (e) {
			console.log(e);
		}
		this.setState({
			loading: false,
			loadingModalAction: false
		});
	}

	async _handleHuyVe() {
		this.setState({
			loadingModalAction: true
		});
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.closeModalAction();
		try {
			let params = {
				token: this.state.token,
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
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}else {
				let arrVeNumberState = this.state.arrVeNumber;
				arrVeNumberState[this.state.currentIdGiuong].bvv_status = 0;
				this.state.did_so_cho_da_ban = parseInt(this.state.did_so_cho_da_ban)-1;
				this.setState({
					arrVeNumber: arrVeNumberState
				});
			}
		} catch (e) {
			console.log(e);
		}
		this.setState({
			loadingModalAction: false,
			loading: false
		});
	}

	async _handleChuyenTro() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.setState({
			loadingModalAction: true
		});
		this.closeModal();
		this.closeModalAction();
		try {
			let params = {
				token: this.state.token,
				adm_id: this.state.infoAdm.adm_id,
				type: 'chuyentro',
				bvv_bvn_id_can_chuyen: dataGiuong.bvv_bvn_id,
				bvv_id_can_chuyen: dataGiuong.bvv_id,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('api_so_do_giuong_update', params, 'GET');
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}else {
				let arrVeNumberState = this.state.arrVeNumber;
				arrVeNumberState[this.state.bvv_number_muon_chuyen].bvv_status = arrVeNumberState[this.state.currentIdGiuong].bvv_status;
				arrVeNumberState[this.state.currentIdGiuong].bvv_status = 0;
				this.state.did_so_cho_da_ban = parseInt(this.state.did_so_cho_da_ban) - 1;
				this.setState({
					arrVeNumber: arrVeNumberState,
					bvv_id_can_chuyen: 0,
					bvv_bvn_id_muon_chuyen: 0,
					bvv_number_muon_chuyen: 0,
					notifiCountDanhSachCho: parseInt(this.state.notifiCountDanhSachCho) + 1
				});
			}
		} catch (e) {
			console.log(e);
		}
		this.setState({
			loadingModalAction: false,
			loading: false
		});
	}

	async _handleXacNhanChuyenVaoCho() {
		this.setState({
			loadingModal: true
		});
		this.closeModal();
		try {
			let params = {
				token: this.state.token,
				adm_id: this.state.infoAdm.adm_id,
				type: 'chuyenvaocho',
				bvv_bvn_id_muon_chuyen: this.state.bvv_bvn_id_muon_chuyen,
				bvv_number_muon_chuyen: this.state.bvv_number_muon_chuyen,
				bvh_id_can_chuyen: this.props.dataParam.bvh_id_can_chuyen,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('api_so_do_giuong_update', params, 'GET');
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}else {
				let arrVeNumberState = this.state.arrVeNumber;
				arrVeNumberState[this.state.nameGiuong].bvv_status = 1;
				this.setState({
					arrVeNumber: arrVeNumberState,
					notifiCountDanhSachCho: this.state.notifiCountDanhSachCho-1,
					loadingModal: false
				});
				this.props.dataParam.bvh_id_can_chuyen = 0;
			}
		} catch (e) {
			console.log(e);
		}
		this.setState({
			loading: false,
			loadingModal: false
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
		this.closeModalAction();

	}

	async _handleChinhSua() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.setState({
			loadingModal: true,
			type: 'update'
		});
		try {
			let params = {
				token: this.state.token,
				adm_id: this.state.infoAdm.adm_id,
				type: 'update',
				did_id: dataGiuong.bvv_bvn_id,
				bvv_id: dataGiuong.bvv_id,
				bvv_number: dataGiuong.bvv_number
			}
			let data = await fetchData('api_get_ben_did', params, 'GET');
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}else {
				let newDataBen = [];
				for(var i = 0; i < Object.keys(data.dataBen).length > 0; i++) {
					newDataBen.push({key: data.dataBen[i].bex_id, value: data.dataBen[i].bex_ten});
				}
				this.setState({
					status: data.status,
					resultsBen: newDataBen,
					bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
					bvv_number_muon_chuyen: dataGiuong.bvv_number,
					fullName: data.fullName,
					phone: data.phone,
					diem_don: data.bvv_diem_don_khach,
					diem_tra: data.bvv_diem_tra_khach,
					ghi_chu: data.bvv_ghi_chu,
					nameDiemDi: data.nameDiemDi,
					nameDiemDen: data.nameDiemDen,
					bvv_ben_a: data.bvv_ben_a,
					bvv_ben_b: data.bvv_ben_b,
					bvv_id: dataGiuong.bvv_id,
					keyDiemDi: data.keyDiemDi,
					keyDiemDen: data.keyDiemDen,
					totalPriceInt: data.totalPrice,
				});
				var trung_chuyen_don	= false;
				if(dataGiuong.bvv_trung_chuyen_a  == 1){
					trung_chuyen_don	= true;
				}
				var trung_chuyen_tra	= false;
				if(dataGiuong.bvv_trung_chuyen_b  == 1){
					trung_chuyen_tra	= true;
				}
				this.setState({
					trung_chuyen_tra: trung_chuyen_tra,
					trung_chuyen_don: trung_chuyen_don
				});

			}
		} catch (e) {
			console.log(e);
		}
		this.setState({
			loadingModal: false,
			loading: false
		});
		this.closeModalAction();
		this.openModal();
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
		height: 125,
		borderWidth: 1,
		borderColor: '#d6d7da',
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
	modalPopup: {
		paddingTop: 60
	},
	modalAction: {
		alignItems: 'center'
	},
	modalPopupAction: {
		paddingTop: 60
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
	small: {
		fontSize: 12,
		lineHeight: 15
	},
	 colorTabs: {
		 color: '#999'
	 },
	close_popup:{
		position: 'absolute', zIndex:9, top: 10, right: 10, width: 50, height: 50
	},
	form_item:{
		flexDirection: 'row', alignItems: 'center', borderBottomWidth:1, marginLeft:0,
		marginBottom:10
	},
	form_input_text:{
		marginLeft:200
	},
	form_modal_picker:{
		paddingLeft: 10, paddingRight: 10, marginBottom: 10
	},
	form_mdp_content:{
		flexDirection: 'row', alignItems: 'center', borderBottomColor:'#ccc',borderBottomWidth:1, marginLeft:0
	},
	form_mdp_label:{
		width: 80,marginLeft:10,color:'#666'
	},
	form_update_icon:{
		marginLeft: 0,
		marginTop: 10
	}
});

export default ViewSoDoGiuong
