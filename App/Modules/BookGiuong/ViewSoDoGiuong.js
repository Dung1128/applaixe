import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Dimensions,
	TextInput,
	TouchableOpacity,
	AsyncStorage,
	TabBarIOS,
	View,
	ScrollView
} from 'react-native';
import {domain, cache} from '../../Config/common';
import * as base64 from '../../Components/base64/Index';
import { Container, Content, Header, Title, Text, Icon, Input, InputGroup, Button, Card, CardItem, Spinner } from 'native-base';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from 'react-native-modalbox';
import ModalPicker from 'react-native-modal-picker';
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
			fullName: '',
			phone: '',
			diem_don: '',
			diem_tra: '',
			ghi_chu: '',
			loading: true,
			arrVeNumber: [],
			results: [],
			isOpen: false,
			isDisabled: false,
			nameDiemDi: '',
			nameDiemDen: '',
			keyDiemDi: '',
			keyDiemDen: '',
			nameGiuong: '',
			resultsBen: [],
			priceTotal: 0,
			arrVeNumber: [],
			currentIdGiuong: 0,
			totalPriceInt: 0,
			bvv_id_can_chuyen: 0,
			bvv_bvn_id_muon_chuyen: 0,
			bvv_number_muon_chuyen: 0,
			type: '',
			infoAdm: [],
			notifiCountDanhSachCho: 0,
			chuyenVaoCho: this.props.data.chuyenVaoCho,
			arrBen: [],
			themVe: false,
			arrThemve: [],
			token: ''
		};
	}

	infoAdm() {
		var that = this;
		AsyncStorage.getItem('infoAdm').then((data) => {
			let results = JSON.parse(data);
			that.setState({
				infoAdm: results
			});
		}).done();
	}

	async componentWillMount() {
		this.infoAdm();

		let admId = 0,
		admUsername = '',
		admLastLogin = '',
		token = '';

		if(this.state.infoAdm.adm_id == undefined) {
			try {
		    	let results = await AsyncStorage.getItem('infoAdm');
				results = JSON.parse(results);
				admId = results.adm_id;
				admUsername = results.adm_name;
				admLastLogin = results.last_login;
				this.setState({
					infoAdm: results
				});
		  	} catch (error) {
				console.error(error);
		  	}
		}else {
			admId = this.state.infoAdm.adm_id;
			admUsername = this.state.infoAdm.adm_name;
			admLastLogin = this.state.infoAdm.last_login;
		}
		token = base64.encodeBase64(admUsername)+'.'+base64.encodeBase64(admLastLogin)+'.'+base64.encodeBase64(''+admId+'');

		this.setState({
			token: token
		});

		var that = this;
		that.setState({
			loading: true
		});
		setTimeout(() => {
			var apiUrl = domain+'/api/api_adm_so_do_giuong.php?token='+token+'&adm_id='+admId+'&not_id='+this.props.data.notId+'&day='+this.props.data.day;
			fetch(apiUrl, {
				headers: {
			    	'Cache-Control': cache
			  	}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(responseJson.status != 404) {
					that.setState({
						results:responseJson.so_do_giuong,
						arrVeNumber: responseJson.so_do_giuong.arrVeNumber,
						arrActive: responseJson.so_do_giuong.arrVeNumber,
						notifiCountDanhSachCho: responseJson.total_danh_sach_cho,
						arrBen: responseJson.arrBen,
						loading: false
					});
				}
			})
			.catch((error) => {
				that.setState({
					loading: true
				});
				console.error(error);
			});
		},1000);
	}

	_renderSoDoGiuong(data, tang) {
		let html = [],
		dataTang = [];
		switch (tang) {
			case 1:
			dataTang = data.arrChoTang_1;
			break;
			case 2:
			dataTang = data.arrChoTang_2;
			break;
			case 3:
			dataTang = data.arrChoTang_3;
			break;
			case 4:
			dataTang = data.arrChoTang_4;
			break;
			case 5:
			dataTang = data.arrChoTang_5;
			break;
			default:
		}

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

					var idGiuong = item[j].sdgct_number;
					var dataGiuong = this.state.arrVeNumber[idGiuong];
					var newPrice = dataGiuong.bvv_price/1000;
					var priceGiuongActive = newPrice.toFixed(0).replace(/./g, function(c, i, a) {
						return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
					});
					priceGiuongActive += 'K';
					if(((this.state.arrVeNumber[idGiuong].bvv_status > 0) || (dataGiuong.bvv_status > 0)) &&
						((this.state.arrVeNumber[idGiuong].bvv_status < 4) || (dataGiuong.bvv_status < 4))) {
						if(this.state.bvv_id_can_chuyen != 0) {
							if(this.state.bvv_id_can_chuyen == dataGiuong.bvv_id) {
								htmlChild.push(
									<Col key={i+j} style={styles.borderCol}>
										<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeGiuong, styles.opacityBg, styles.borderChuyenChoo]}>
											<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}  {priceGiuongActive}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{dataGiuong.bvv_phone}</Text>
										</TouchableOpacity>
									</Col>
								);
							}else {
								htmlChild.push(
									<Col key={i+j} style={styles.borderCol}>
										<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeGiuong, styles.opacityBg]}>
											<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}  {priceGiuongActive}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{dataGiuong.bvv_phone}</Text>
										</TouchableOpacity>
									</Col>
								);
							}
						}else {
							htmlChild.push(
								<Col key={i+j} style={styles.borderCol}>
									<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeGiuong, styles.opacityBg]}>
										<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}  {priceGiuongActive}</Text>
										<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
										<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
										<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{dataGiuong.bvv_phone}</Text>
									</TouchableOpacity>
								</Col>
							);
						}
					}else if((this.state.arrVeNumber[idGiuong].bvv_status == 11) || (dataGiuong.bvv_status == 11)) {
						if(this.state.bvv_id_can_chuyen != 0) {
							if(this.state.bvv_id_can_chuyen == dataGiuong.bvv_id) {
								htmlChild.push(
									<Col key={i+j} style={styles.borderCol}>
										<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeLenXe, styles.opacityBg, styles.borderChuyenChoo]}>
											<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}  {priceGiuongActive}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{dataGiuong.bvv_phone}</Text>
										</TouchableOpacity>
									</Col>
								);
							}else {
								htmlChild.push(
									<Col key={i+j} style={styles.borderCol}>
										<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeLenXe, styles.opacityBg]}>
											<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}  {priceGiuongActive}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{dataGiuong.bvv_phone}</Text>
										</TouchableOpacity>
									</Col>
								);
							}
						}else {
							htmlChild.push(
								<Col key={i+j} style={styles.borderCol}>
									<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeLenXe, styles.opacityBg]}>
										<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}  {priceGiuongActive}</Text>
										<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
										<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
										<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{dataGiuong.bvv_phone}</Text>
									</TouchableOpacity>
								</Col>
							);
						}
					}else if(((this.state.arrVeNumber[idGiuong].bvv_status == 4) || (dataGiuong.bvv_status == 4)) ||
						((this.state.arrVeNumber[idGiuong].bvv_status > 100) || (dataGiuong.bvv_status > 100))) {
						if(this.state.bvv_id_can_chuyen != 0) {
							if(this.state.bvv_id_can_chuyen == dataGiuong.bvv_id) {
								htmlChild.push(
									<Col key={i+j} style={styles.borderCol}>
										<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeThanhToan, styles.opacityBg, styles.borderChuyenChoo]}>
											<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}  {priceGiuongActive}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{dataGiuong.bvv_phone}</Text>
										</TouchableOpacity>
									</Col>
								);
							}else {
								htmlChild.push(
									<Col key={i+j} style={styles.borderCol}>
										<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeThanhToan, styles.opacityBg]}>
											<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}  {priceGiuongActive}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
											<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{dataGiuong.bvv_phone}</Text>
										</TouchableOpacity>
									</Col>
								);
							}
						}else {
							htmlChild.push(
								<Col key={i+j} style={styles.borderCol}>
									<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeThanhToan, styles.opacityBg]}>
										<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}  {priceGiuongActive}</Text>
										<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
										<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
										<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{dataGiuong.bvv_phone}</Text>
									</TouchableOpacity>
								</Col>
							);
						}
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
				html.push(<Grid key={i} style={{marginRight: -8, marginLeft: -8}}>{htmlChild}</Grid>);
			}
		}
		return html;
	}

	_setActiveGiuong(id) {
		if(this.state.themVe.check) {
			let arrThemve = this.state.arrThemve;
			let setStatus = this.state.arrVeNumber;
			let that = this;
			fetch(domain+'/api/api_check_ve.php?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&numberGiuong='+id+'&bvv_id='+setStatus[id].bvv_id, {
				headers: {
					'Cache-Control': cache
				}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(responseJson.status != 404) {
					if(responseJson.status == 201) {
						alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
					}else {
						arrThemve.push({
							bvv_bvn_id: setStatus[id].bvv_bvn_id,
							bvv_id: setStatus[id].bvv_id,
							bvv_number: id,
							bvv_khach_hang_id: that.state.themVe.khach_hang_id,
							bvv_diem_don_khach: setStatus[id].bvv_diem_don_khach,
							bvv_diem_tra_khach: setStatus[id].bvv_diem_tra_khach,
							bvv_ghi_chu: setStatus[id].bvv_ghi_chu
						});



							setStatus[id].bvv_status = 1;
							setStatus[id].bvv_ten_khach_hang = that.state.themVe.ten_khach_hang;
							setStatus[id].bvv_phone = that.state.themVe.phone;
							setStatus[id].bvv_diem_don_khach = that.state.themVe.diem_don;
							setStatus[id].bvv_diem_tra_khach = that.state.themVe.diem_tra;
							setStatus[id].bvv_ghi_chu = that.state.themVe.ghi_chu;
							setStatus[id].bvv_bex_id_a = that.state.themVe.keyDiemDi;
							setStatus[id].bvv_bex_id_b = that.state.themVe.keyDiemDen;
							setStatus[id].bvv_price = that.state.themVe.totalPriceInt;
							setStatus[id].bvv_khach_hang_id = that.state.themVe.khach_hang_id;


						that.setState({
							arrThemve: arrThemve,
							arrVeNumber: setStatus
						});
					}
				}
			})
			.catch((error) => {
				console.error(error);
			});

		}else {
			let dataGiuong = this.state.arrVeNumber[id];
			if(this.props.data.bvh_id_can_chuyen != 0 && this.props.data.bvh_id_can_chuyen != undefined) {
				let that = this;
				let params = '?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&huy='+this.props.data.huy+'&type=chuyenvaocho&bvv_bvn_id_muon_chuyen='+dataGiuong.bvv_bvn_id+'&bvv_number_muon_chuyen='+dataGiuong.bvv_number+'&bvh_id_can_chuyen='+that.props.data.bvh_id_can_chuyen+'&day='+this.props.data.day+'&idAdm='+this.state.infoAdm.adm_id;
				fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
					headers: {
				    	'Cache-Control': cache
				  	}
				})
				.then((response) => response.json())
				.then((responseJson) => {
					if(responseJson.status != 404) {
						if(responseJson.status == 201) {
							alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
						}else {
							let setStatus = that.state.arrVeNumber;
							setStatus[id].bvv_status = 1;

							var dataGiuongs = this.state.arrVeNumber;
							dataGiuongs[id].bvv_ten_khach_hang = this.props.data.fullName;
							dataGiuongs[id].bvv_phone = this.props.data.phone;
							dataGiuongs[id].bvv_bex_id_a = this.props.data.bvv_bex_id_a;
							dataGiuongs[id].bvv_bex_id_b = this.props.data.bvv_bex_id_b;
							dataGiuongs[id].bvv_price = parseInt(this.props.data.bvv_price);
							dataGiuongs[id].bvv_status = 1;
							that.props.data.did_so_cho_da_ban = parseInt(that.props.data.did_so_cho_da_ban)+1;
							that.setState({
								arrVeNumber: setStatus,
								arrVeNumber: dataGiuongs,
								notifiCountDanhSachCho: that.state.notifiCountDanhSachCho-1,
								chuyenVaoCho: false
							});
							that.props.data.bvh_id_can_chuyen = 0;
							that.props.data.nameGiuongXepCho = '';
						}
					}
				})
				.catch((error) => {
					console.error(error);
				});
			}else if(this.state.bvv_id_can_chuyen != 0) {
				let that = this;
				let params = '?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=chuyencho&bvv_bvn_id_muon_chuyen='+dataGiuong.bvv_bvn_id+'&bvv_number_muon_chuyen='+dataGiuong.bvv_number+'&bvv_id_can_chuyen='+this.state.bvv_id_can_chuyen+'&day='+this.props.data.day+'&idAdm='+this.state.infoAdm.adm_id;
				fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
					headers: {
				    	'Cache-Control': cache
				  	}
				})
				.then((response) => response.json())
				.then((responseJson) => {
					if(responseJson.status != 404) {
						if(responseJson.status == 201) {
							alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
						}else {
							let setStatus = that.state.arrVeNumber;
							setStatus[dataGiuong.bvv_number].bvv_ten_khach_hang = setStatus[that.state.currentIdGiuong].bvv_ten_khach_hang;
							setStatus[dataGiuong.bvv_number].bvv_phone = setStatus[that.state.currentIdGiuong].bvv_phone;
							setStatus[dataGiuong.bvv_number].bvv_bex_id_a = setStatus[that.state.currentIdGiuong].bvv_bex_id_a;
							setStatus[dataGiuong.bvv_number].bvv_bex_id_b = setStatus[that.state.currentIdGiuong].bvv_bex_id_b;
							setStatus[dataGiuong.bvv_number].bvv_status = setStatus[that.state.currentIdGiuong].bvv_status;
							setStatus[dataGiuong.bvv_number].bvv_price = setStatus[that.state.currentIdGiuong].bvv_price;
							setStatus[that.state.currentIdGiuong].bvv_status = 0;
							that.setState({
								arrVeNumber: setStatus,
								bvv_id_can_chuyen: 0,
								bvv_bvn_id_muon_chuyen: 0,
								bvv_number_muon_chuyen: 0
							});
						}
					}
				})
				.catch((error) => {
					console.error(error);
				});
			}else {
				this.getPriceBen(dataGiuong.bvv_bex_id_a, dataGiuong.bvv_bex_id_b, dataGiuong.bvv_id);
				this.setState({
					nameGiuong: id,
					loadingModal: true,
					type: ''
				});
				var that = this;
				fetch(domain+'/api/api_adm_ben.php?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=getBen&notTuyenId='+this.props.data.notTuyenId+'&numberGiuong='+id+'&bvv_id='+dataGiuong.bvv_id, {
					headers: {
				    	'Cache-Control': cache
				  	}
				})
				.then((response) => response.json())
				.then((responseJson) => {
					if(responseJson.status != 404) {
						if(responseJson.status == 201) {
							alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
						}else {
							let newDataBen = [];
							for(var i = 0; i < Object.keys(responseJson.dataBen).length > 0; i++) {
								newDataBen.push({key: responseJson.dataBen[i].bex_id, value: responseJson.dataBen[i].bex_ten});
							}

							that.setState({
								status: responseJson.status,
								resultsBen: newDataBen,
								bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
								bvv_number_muon_chuyen: dataGiuong.bvv_number,
								type: '',
								totalPriceInt: that.state.totalPriceInt,
								loadingModal: false
							});
							this.openModal();
						}
					}
				})
				.catch((error) => {
					that.setState({
						loadingModal: false
					});
					console.error(error);
				});

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
		if(this.state.status == 1) {
			let listItem1 = [],
			listItem2 = [],
			keyDiemDi = this.state.keyDiemDi,
			keyDiemDen = this.state.keyDiemDen,
			currentDiemDen = '',
			currentDiemDi = '',
			type = this.state.type,
			totalPriceInt = this.state.totalPriceInt;

			if(this.state.nameDiemDen != '') {
				currentDiemDen = this.state.nameDiemDen;
			}

			if(this.state.nameDiemDi != '') {
				currentDiemDi = this.state.nameDiemDi;
			}

			if(this.props.data.bvh_id_can_chuyen != undefined && this.props.data.bvh_id_can_chuyen > 0) {
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
									priceConver = currentPrice.toFixed(0).replace(/./g, function(c, i, a) {
										return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
									});
								}
							}else {
								if(totalPriceInt > 0) {
									priceConver = totalPriceInt.toFixed(0).replace(/./g, function(c, i, a) {
										return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
									});
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
							<View key="1" style={{width: width, height: (this.state.layout.height-120), paddingTop: 10, paddingBottom: 10}}>
								<View style={{position: 'absolute', zIndex:9, top: 10, right: 10, width: 50, height: 50}}>
									<TouchableOpacity onPress={() => this.closeModal()} style={{alignItems: 'flex-end', justifyContent: 'center'}}>
										<Icon name="md-close" style={{fontSize: 30}} />
									</TouchableOpacity>
								</View>
								<ScrollView>
									<ModalPicker
										data={listItem1}
										initValue="Chọn điểm đi"
										onChange={(option)=>{this.renderPriceBenDi(option)}}
										style={{width: width, paddingLeft: 10, paddingRight: 10, marginBottom: 10}}
										>
										<View style={{flexDirection: 'column', justifyContent: 'center'}}>
											<View style={{flexDirection: 'row', alignItems: 'center'}}>
												<Icon name="md-bus" style={{width: 30}} />
												<Text style={{width: 150, fontSize: 9, marginTop: -10}}>Điểm đi</Text>
											</View>
											<View style={{borderBottomColor: '#ccc', borderBottomWidth: 1, marginLeft: 30}}>
												<Text style={{height:40, alignItems: 'center', justifyContent: 'center', paddingTop: 10, marginTop: -10, paddingLeft: 15}}>{currentDiemDi == ''? 'Chọn điểm đến' : currentDiemDi}</Text>
											</View>
										</View>
									</ModalPicker>
									<ModalPicker
										data={listItem2}
										initValue="Chọn điểm đến"
										onChange={(option)=>{this.renderPriceBenDen(option)}}
										style={{width: width, paddingLeft: 10, paddingRight: 10, marginBottom: 10}}
										>
										<View style={{flexDirection: 'column', justifyContent: 'center'}}>
											<View style={{flexDirection: 'row', alignItems: 'center'}}>
												<Icon name="ios-bus" style={{width: 30}} />
												<Text style={{width: 150, fontSize: 9, marginTop: -10}}>Điểm đến</Text>
											</View>
											<View style={{borderBottomColor: '#ccc', borderBottomWidth: 1, marginLeft: 30}}>
												<Text style={{height:40, alignItems: 'center', justifyContent: 'center', paddingTop: 10, marginTop: -10, paddingLeft: 15}}>{currentDiemDen == ''? 'Chọn điểm đến' : currentDiemDen}</Text>
											</View>
										</View>
									</ModalPicker>
									<InputGroup style={{marginBottom: 10, marginLeft: 10, marginRight: 10}}>
										<Icon name='ios-person' />
										<Input placeholder="Họ Và Tên" value={this.state.fullName} onChange={(event) => this.setState({fullName: event.nativeEvent.text})} />
									</InputGroup>
									<InputGroup style={{marginBottom: 10, marginLeft: 10, marginRight: 10}}>
										<Icon name='ios-call' />
										<Input placeholder="Số điện thoại" value={this.state.phone} onChange={(event) => this.setState({phone: event.nativeEvent.text})} />
									</InputGroup>
									<InputGroup style={{marginBottom: 10, marginLeft: 10, marginRight: 10}}>
										<Icon name='ios-home' />
										<Input placeholder="Nơi đón" value={this.state.diem_don} onChange={(event) => this.setState({diem_don: event.nativeEvent.text})} />
									</InputGroup>
									<InputGroup style={{marginBottom: 10, marginLeft: 10, marginRight: 10}}>
										<Icon name='ios-home-outline' />
										<Input placeholder="Nơi trả" value={this.state.diem_tra} onChange={(event) => this.setState({diem_tra: event.nativeEvent.text})} />
									</InputGroup>
									<InputGroup style={{marginBottom: 10, marginLeft: 10, marginRight: 10}}>
										<Icon name='ios-create-outline' />
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

	renderPriceBenDi(option) {
		this.setState({
			loadingModal: true
		});
		this.setState({nameDiemDi: option.label, keyDiemDi: option.value});
		var that = this;
		fetch(domain+'/api/api_adm_price_ben.php?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=notAuto&diemDi='+option.value+'&diemDen='+this.state.keyDiemDen+'&idAdm='+this.state.infoAdm.adm_id, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.status != 404) {
				var totalPriceInt = responseJson.totalPrice;
				var totalPrice = responseJson.totalPrice.toFixed(0).replace(/./g, function(c, i, a) {
					return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
				});
				that.setState({
					priceTotal: totalPrice,
					totalPriceInt: totalPriceInt,
					loadingModal: false
				});
				return responseJson.totalPrice;
			}
		})
		.catch((error) => {
			that.setState({
				loadingModal: false
			});
			console.error(error);
		});
	}

	renderPriceBenDen(option) {
		this.setState({
			loadingModal: true
		});
		this.setState({nameDiemDen: option.label, keyDiemDen: option.value});
		var that = this;
		fetch(domain+'/api/api_adm_price_ben.php?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=notAuto&diemDi='+this.state.keyDiemDi+'&diemDen='+option.value+'&idAdm='+this.state.infoAdm.adm_id, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.status != 404) {
				var totalPriceInt = responseJson.totalPrice;
				var totalPrice = responseJson.totalPrice.toFixed(0).replace(/./g, function(c, i, a) {
					return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
				});
				that.setState({
					priceTotal: totalPrice,
					totalPriceInt: totalPriceInt,
					loadingModal: false
				});
				return responseJson.totalPrice;
			}
		})
		.catch((error) => {
			that.setState({
				loadingModal: false
			});
			console.error(error);
		});
	}

	getPriceBen(diem_a, diem_b, bvv_id) {
		this.setState({
			loadingModal: true
		});
		var that = this;
		fetch(domain+'/api/api_adm_price_ben.php?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=auto&diemDi='+diem_a+'&diemDen='+diem_b+'&bvv_id='+bvv_id, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.status != 404) {
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
					keyDiemDen: responseJson.keyDiemDen,
					loadingModal: false
				});
				return responseJson.totalPrice;
			}
		})
		.catch((error) => {
			that.setState({
				loadingModal: false
			});
			console.error(error);
		});
	}

	updateGiuong(id) {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		checkData = false;
		if(this.state.keyDiemDi == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đi!');
		}else {
			if(this.state.keyDiemDen == '') {
				checkData = false;
				alert('Vui lòng chọn Điểm Đến!');
			}else {
				checkData = true;
			}
		}
		if(checkData) {
			this.setState({
				loadingModal: true,
				isOpen: false
			});

			var that = this;
			that.closeModal();
			fetch(domain+'/api/api_adm_so_do_giuong_update.php?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=update&bvv_id='+dataGiuong.bvv_id+'&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&bvv_number='+dataGiuong.bvv_number+'&diem_a='+this.state.keyDiemDi+'&diem_b='+this.state.keyDiemDen+'&price='+this.state.totalPriceInt+'&idAdm='+this.state.infoAdm.adm_id+'&fullName='+this.state.fullName+'&phone='+this.state.phone+this.state.phone+'&diem_don='+this.state.diem_don+'&diem_tra='+this.state.diem_tra+'&ghi_chu='+this.state.ghi_chu, {
				headers: {
			    	'Cache-Control': cache
			  	}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(responseJson.status != 404) {
					let currentArrActive = that.state.arrVeNumber;
					currentArrActive[that.state.currentIdGiuong].bvv_ten_khach_hang = that.state.fullName;
					currentArrActive[that.state.currentIdGiuong].bvv_phone = that.state.phone;
					currentArrActive[that.state.currentIdGiuong].bvv_bex_id_a = that.state.keyDiemDi;
					currentArrActive[that.state.currentIdGiuong].bvv_bex_id_b = that.state.keyDiemDen;
					currentArrActive[that.state.currentIdGiuong].bvv_price = that.state.totalPriceInt;
					that.setState({
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
						type: ''
					});
				}

			})
			.catch((error) => {
				that.setState({
					loadingModal: false
				});
				console.error(error);
			});
		}
	}

	bookGiuong(id) {
		let dataGiuong = this.state.arrVeNumber[id],
		checkData = false;
		if(this.state.keyDiemDi == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đi!');
		}else {
			if(this.state.keyDiemDen == '') {
				checkData = false;
				alert('Vui lòng chọn Điểm Đến!');
			}else {
				checkData = true;
			}
		}
		if(checkData) {
			this.setState({
				loadingModal: true,
				isOpen: false
			});

			var that = this;
			that.closeModal();
			fetch(domain+'/api/api_adm_so_do_giuong_update.php?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=insert&bvv_id='+dataGiuong.bvv_id+'&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&bvv_number='+dataGiuong.bvv_number+'&diem_a='+this.state.keyDiemDi+'&diem_b='+this.state.keyDiemDen+'&price='+this.state.totalPriceInt+'&idAdm='+this.state.infoAdm.adm_id+'&fullName='+this.state.fullName+'&phone='+this.state.phone+'&diem_don='+this.state.diem_don+'&diem_tra='+this.state.diem_tra+'&ghi_chu='+this.state.ghi_chu, {
				headers: {
			    	'Cache-Control': cache
			  	}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(responseJson.status != 404) {
					if(responseJson.status == 201) {
						alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
					}else {
						let currentArrActive = that.state.arrVeNumber;
						currentArrActive[id].bvv_status = 1;
						currentArrActive[id].bvv_ten_khach_hang = that.state.fullName;
						currentArrActive[id].bvv_phone = that.state.phone;
						currentArrActive[id].bvv_diem_don_khach = that.state.diem_don;
						currentArrActive[id].bvv_diem_tra_khach = that.state.diem_tra;
						currentArrActive[id].bvv_ghi_chu = that.state.ghi_chu;
						currentArrActive[id].bvv_bex_id_a = that.state.keyDiemDi;
						currentArrActive[id].bvv_bex_id_b = that.state.keyDiemDen;
						currentArrActive[id].bvv_price = that.state.totalPriceInt;
						currentArrActive[id].bvv_khach_hang_id = responseJson.userId;
						that.props.data.did_so_cho_da_ban = parseInt(that.props.data.did_so_cho_da_ban)+1;
						that.setState({
							arrVeNumber: currentArrActive,
							loadingModal: false,
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
							phone: ''
						});
					}
				}
			})
			.catch((error) => {
				that.setState({
					loadingModal: false
				});
				console.error(error);
			});
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextState.chuyenVaoCho == undefined) {
			nextState.chuyenVaoCho = nextProps.data.chuyenVaoCho;
		}
	}

	_onLayout = event => {
    	this.setState({
	      layout:{
	        	height: Dimensions.get('window').height,
	        	width: Dimensions.get('window').width,
	      }
    	});
	}

	render() {
		let data = {
			tuy_ten: this.props.data.tuy_ten,
			did_gio_xuat_ben_that: this.props.data.did_gio_xuat_ben_that,
			did_so_cho_da_ban: this.props.data.did_so_cho_da_ban,
			tong_so_cho: this.props.data.tong_so_cho,
			notifiCountDanhSachCho: this.state.notifiCountDanhSachCho,
			notId:this.props.data.notId,
			day:this.props.data.day,
			notTuyenId: this.props.data.notTuyenId,
			bien_kiem_soat: this.props.data.bien_kiem_soat,
			laixe1: this.props.data.laixe1,
			laixe2: this.props.data.laixe2,
			tiepvien: this.props.data.tiepvien,
			adm_id: this.props.data.adm_id,
			last_login: this.props.data.last_login,
			adm_name: this.props.data.adm_name
		};
		return(

			<View style={{height: this.state.layout.height}} onLayout={this._onLayout}>
				<ScrollView style={styles.container}>
					<Card style={styles.paddingContent}>
						<CardItem header>
							<View style={{flexDirection: 'column', flex: 1}}>
								<View style={{marginBottom: 10}}>
									<Text style={{fontWeight: 'bold'}}>{this.props.data.tuy_ten} {this.props.data.did_gio_xuat_ben_that}</Text>
									{this.props.data.bien_kiem_soat != '' && this.props.data.bien_kiem_soat != null &&
										<Text>Biến kiểm soát: <Text style={{fontWeight: 'bold'}}>{this.props.data.bien_kiem_soat}</Text></Text>
									}
									{this.props.data.laixe1 != '' && this.props.data.laixe1 != null &&
										<Text>Lái Xe 1: <Text style={{fontWeight: 'bold'}}>{this.props.data.laixe1}</Text></Text>
									}
									{this.props.data.laixe2 != '' && this.props.data.laixe2 != null &&
										<Text>Lái Xe 2: <Text style={{fontWeight: 'bold'}}>{this.props.data.laixe2}</Text></Text>
									}
									{this.props.data.tiepvien != '' && this.props.data.tiepvien != null &&
										<Text>Tiếp viên: <Text style={{fontWeight: 'bold'}}>{this.props.data.tiepvien}</Text></Text>
									}
									<View style={{flexDirection: 'row'}}>
										<Text style={{flex: 1}}>Đã đặt: <Text style={{fontWeight: 'bold'}}>{this.props.data.did_so_cho_da_ban}</Text></Text>
										<Text style={{flex: 1}}>Còn trống: <Text style={{fontWeight: 'bold'}}>{(this.props.data.tong_so_cho-this.props.data.did_so_cho_da_ban)}/{this.props.data.tong_so_cho}</Text></Text>
									</View>
								</View>
								<View>
									<View style={{flexDirection: 'row'}}>
											<View style={{flex: 1}}>
												<View style={{flexDirection: 'row'}}>
													<View width={15} height={15} backgroundColor={'#5fb760'} style={{marginRight: 10,marginTop: 3}}></View>
													<View><Text>Đã lên xe</Text></View>
												</View>
											</View>
											<View style={{flex: 1}}>
												<View style={{flexDirection: 'row'}}>
													<View width={15} height={15} backgroundColor={'#ffa500'} style={{marginRight: 10,marginTop: 3}}></View>
													<View><Text>Đã book</Text></View>
												</View>
											</View>
									</View>
								</View>
							</View>
						</CardItem>
					</Card>

					<View style={{flexDirection: 'column'}}>
						{this.state.loading && <Spinner /> }
						{this._renderSoDoGiuong(this.state.results, 1).length > 0 &&
							<Card style={styles.paddingContent}>
								<CardItem header style={{alignItems: 'center'}}>
									<Text style={{fontSize: 20}}>Tầng 1</Text>
								</CardItem>

								<CardItem style={{marginTop: -20}}>
									{this._renderSoDoGiuong(this.state.results, 1)}
								</CardItem>

							</Card>
						}

						{this._renderSoDoGiuong(this.state.results,3).length > 0 &&
							<Card style={[styles.paddingContent, {marginTop: -10}]}>
								<CardItem>
									{this._renderSoDoGiuong(this.state.results, 3)}
								</CardItem>

							</Card>
						}

						{this._renderSoDoGiuong(this.state.results, 2).length > 0 &&
							<Card style={styles.paddingContent}>
								<CardItem header style={{alignItems: 'center'}}>
									<Text style={{fontSize: 20}}>Tầng 2</Text>
								</CardItem>

								<CardItem style={{marginTop: -20}}>
									{this._renderSoDoGiuong(this.state.results, 2)}
								</CardItem>
							</Card>
						}

						{this._renderSoDoGiuong(this.state.results,4).length > 0 &&
							<Card style={[styles.paddingContent, {marginTop: -10}]}>
								<CardItem>
									{this._renderSoDoGiuong(this.state.results, 4)}
								</CardItem>

							</Card>
						}

						{this._renderSoDoGiuong(this.state.results, 5).length > 0 &&
							<Card style={styles.paddingContent}>
								<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
									<Text style={{fontSize: 20}}>Ghế Sàn</Text>
								</CardItem>

								<CardItem>
									{this._renderSoDoGiuong(this.state.results, 5)}
								</CardItem>
							</Card>
						}
					</View>

				</ScrollView>

				<Modal style={[styles.modal, styles.modalPopup]} position={"center"} ref={"modalPopup"} isDisabled={this.state.isDisabled}>
					{this.state.loadingModal? <Spinner /> : (this._renderModalBen(this.state.resultsBen))}
				</Modal>

				<Modal style={[styles.modalAction, styles.modalPopupAction]} position={"center"} ref={"modalPopupAction"} isDisabled={this.state.isDisabled}>
					<ScrollView>
						{this.state.loadingModalAction? <Spinner /> : (this._renderButtonAction())}
					</ScrollView>
				</Modal>

				<View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>
					<TouchableOpacity style={[styles.styleTabbars, {flex: 4, borderBottomWidth:3, borderBottomColor: '#5fb760'}]}>
						<Text style={{color: '#111'}}>Trên Xe</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => Actions.ViewDanhSachTra({title: 'Danh sách Gọi', data}) } style={[styles.styleTabbars, {flex: 4}]}>
						<Text style={[styles.colorTabs]}>Trả Khách</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => Actions.DanhSachCho({title: 'Đang Chờ', data})} style={[styles.styleTabbars, {flex: 4}]}>
						<Text style={[styles.colorTabs]}>Đang Chờ</Text>
						{this.state.notifiCountDanhSachCho > 0 && <View style={styles.countDanhSachCho}><Text style={{color: '#fff'}}>{this.state.notifiCountDanhSachCho}</Text></View>}
					</TouchableOpacity>
					<TouchableOpacity style={[styles.styleTabbars, {flex: 1}]} onPress={() => this._handleDropdown()}>
						<Icon name="ios-more" />
					</TouchableOpacity>
				</View>
				{this.state.showDropdown &&
					<View style={{backgroundColor: '#000', position: 'absolute', width: 250, bottom: 55, right: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: '#fff', shadowOffset: {width: 0, height: 2}, shadowRadius: 2, shadowOpacity: 0.1, shadowColor: 'black'}}>
						<View style={{flexDirection: 'row', margin: 10}}>
							<Text onPress={() => [ Actions.ViewDanhSachGoi({title: 'Danh sách Gọi', data}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Gọi</Text>
							<TouchableOpacity style={{flex: 2,backgroundColor: '#00ced1', marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-call" style={{color: '#fff'}} /></TouchableOpacity>
						</View>
						<View style={{flexDirection: 'row', margin: 10}}>
							<Text onPress={() => [Actions.ViewDanhSachHuy({title: 'Danh sách hủy vé', data}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Hủy Vé</Text>
							<TouchableOpacity style={{flex: 2,backgroundColor: '#ff4500', marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-close-circle-outline" style={{color: '#fff'}} /></TouchableOpacity>
						</View>
						<View style={{flexDirection: 'row', margin: 10}}>
							<Text onPress={() => [Actions.ViewDanhSachDaXuongXe({title: 'Danh sách xuống xe', data}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Xuống Xe</Text>
							<TouchableOpacity style={{flex: 2,backgroundColor: '#00bfff', marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-cloud-done-outline" style={{color: '#fff'}} /></TouchableOpacity>
						</View>
					</View>
				}
				{this.state.chuyenVaoCho &&
					<View style={{position: 'absolute', top: 60, right: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 10}}>
						<Text style={{color: '#fff'}}>Chọn chỗ trống để xếp khách lên giường "{this.props.data.nameGiuongXepCho}". Nếu chưa xếp chỗ thì click vào đây để hủy thao tác:</Text>
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

	_handleDropdown() {
		if(this.state.showDropdown) {
			this.setState({
				showDropdown: false
			});
		}else {
			this.setState({
				showDropdown: true
			});
		}
	}

	_renderButtonAction() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		let html = [],
			htmlForm = [];
		let arrThemve = this.state.arrThemve;
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
					html.push(<Button key="3" block danger style={styles.marginTopButton} onPress={this._handleHuyVe.bind(this)}>Hủy Vé</Button>);
					html.push(<Button key="4" block warning style={styles.marginTopButton} onPress={this._handleChuyenCho.bind(this)}>Chuyển chờ</Button>);
					html.push(<Button key="6" block success style={styles.marginTopButton} onPress={this._handleThemVe.bind(this)}>Thêm vé</Button>);
				}
			}
			if(this.state.bvv_id_can_chuyen != this.state.currentIdGiuong) {
				html.push(<Button key="5" block info style={styles.marginTopButton} onPress={this._handleChuyenChoo.bind(this)}>Chuyển chỗ</Button>);
			}
			html.push(<Button key="7" block style={styles.marginTopButton} onPress={this._handleChinhSua.bind(this)}>Chỉnh sửa</Button>);
		}

		if(this.state.currentIdGiuong != 0) {
			htmlForm.push(
				<View key="1" style={{width: width, height: (this.state.layout.height-110), paddingTop: 10, paddingBottom: 10}}>
					<View style={{position: 'absolute', zIndex:9, top: 10, right: 10, width: 50, height: 50}}>
						<TouchableOpacity onPress={() => this.closeModalAction()} style={{alignItems: 'flex-end', justifyContent: 'center'}}>
							<Icon name="md-close" style={{fontSize: 30}} />
						</TouchableOpacity>
					</View>
					<ScrollView>
						<View style={{margin: 10}}>
							<Text>Họ và tên: <Text style={{fontWeight: 'bold'}}>{dataGiuong.bvv_ten_khach_hang}</Text></Text>
							<Text>Số điện thoại: <Text style={{fontWeight: 'bold'}}>{dataGiuong.bvv_phone}</Text></Text>
							<Text>Điểm đón: <Text style={{fontWeight: 'bold'}}>{dataGiuong.bvv_diem_don_khach}</Text></Text>
							<Text>Điểm trả: <Text style={{fontWeight: 'bold'}}>{dataGiuong.bvv_diem_tra_khach}</Text></Text>
							<Text>Nơi đi & đến: <Text style={{fontWeight: 'bold'}}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]} -> {this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text></Text>
							<Text>Giá vé: <Text style={{fontWeight: 'bold'}}>{dataGiuong.bvv_price} VNĐ</Text></Text>
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
				ghi_chu: dataGiuong.bvv_ghi_chu
			}
		});
	}

	_handleHuyVeCurrent() {
		let arrThemve = this.state.arrThemve;
		let setStatus = this.state.arrVeNumber;
		this.closeModalAction();
		for(var i = 0; i < arrThemve.length; i++) {
			let numberGiuong = arrThemve[i].bvv_number;
			if(this.state.currentIdGiuong == numberGiuong) {
				setStatus[numberGiuong].bvv_status = 0;
				setStatus[numberGiuong].bvv_bex_id_a = '';
				setStatus[numberGiuong].bvv_bex_id_b = '';
				setStatus[numberGiuong].bvv_price = '';
				setStatus[numberGiuong].bvv_ten_khach_hang = '';
				setStatus[numberGiuong].bvv_phone = '';
				setStatus[numberGiuong].bvv_diem_don_khach = '';
				setStatus[numberGiuong].bvv_diem_tra_khach = '';
				setStatus[numberGiuong].bvv_ghi_chu = '';
				arrThemve.splice(i, 1);
				break;
			}
		}
		this.setState({
			arrThemve: arrThemve,
			arrVeNumber: setStatus
		});
	}

	_handleThemVeDone() {
		let that = this;
		let dataThemVe = this.state.themVe;
		fetch(domain+'/api/api_adm_them_ve.php?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=insert&diem_a='+dataThemVe.keyDiemDi+'&diem_b='+dataThemVe.keyDiemDen+'&price='+dataThemVe.totalPriceInt+'&arrDataGiuong='+JSON.stringify(this.state.arrThemve)+'&idAdm='+this.state.infoAdm.adm_id+'&fullName='+dataThemVe.ten_khach_hang+'&phone='+dataThemVe.phone+'&diem_don='+dataThemVe.diem_don+'&diem_tra='+dataThemVe.diem_tra+'&ghi_chu='+dataThemVe.ghi_chu, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.status != 404) {
				let arrThemve = that.state.arrThemve;
				for(var i = 0; i < arrThemve.length; i++) {
					that.props.data.did_so_cho_da_ban = parseInt(that.props.data.did_so_cho_da_ban)+1;
				}
				that.setState({
					themVe: [],
					arrThemve: []
				});
			}
		})
		.catch((error) => {
			console.error(error);
		});
	}

	_handleLenXe() {
		this.setState({
			loadingModalAction: true
		});
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		let that = this;
		that.closeModalAction();
		fetch(domain+'/api/api_adm_so_do_giuong_update.php?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=lenxe&bvv_id='+dataGiuong.bvv_id+'&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&bvv_number='+dataGiuong.bvv_number+'&idAdm='+this.state.infoAdm.adm_id, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.status != 404) {
				let setStatus = that.state.arrVeNumber;
				setStatus[this.state.currentIdGiuong].bvv_status = 11;
				that.setState({
					arrVeNumber: setStatus,
					loadingModalAction: false
				});
			}

		})
		.catch((error) => {
			that.setState({
				loadingModalAction: false
			});
			console.error(error);
		});
	}

	_handleXuongXe() {
		this.setState({
			loadingModalAction: true
		});
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		let that = this;
		that.closeModalAction();
		let params = '?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=xuongxe&bvv_id='+dataGiuong.bvv_id+'&idAdm='+this.state.infoAdm.adm_id;
		fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.status != 404) {
				let setStatus = that.state.arrVeNumber;
				setStatus[this.state.currentIdGiuong].bvv_status = 0;
				that.props.data.did_so_cho_da_ban = parseInt(that.props.data.did_so_cho_da_ban)-1;
				that.setState({
					arrVeNumber: setStatus,
					loadingModalAction: false
				});
			}

		})
		.catch((error) => {
			that.setState({
				loadingModalAction: false
			});
			console.error(error);
		});
	}

	_handleHuyVe() {
		this.setState({
			loadingModalAction: true
		});
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		let that = this;
		that.closeModalAction();
		let params = '?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=huyve&bvv_id='+dataGiuong.bvv_id+'&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&bvv_number='+dataGiuong.bvv_number+'&day='+this.props.data.day+'&bvv_bex_id_a='+dataGiuong.bvv_bex_id_a+'&bvv_bex_id_b='+dataGiuong.bvv_bex_id_b+'&bvv_price='+dataGiuong.bvv_price+'&bvv_number='+this.state.currentIdGiuong+'&idAdm='+this.state.infoAdm.adm_id;
		fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.status != 404) {
				let setStatus = that.state.arrVeNumber;
				setStatus[this.state.currentIdGiuong].bvv_status = 0;
				that.props.data.did_so_cho_da_ban = parseInt(that.props.data.did_so_cho_da_ban)-1;
				that.setState({
					arrVeNumber: setStatus,
					loadingModalAction: false
				});
			}

		})
		.catch((error) => {
			that.setState({
				loadingModalAction: false
			});
			console.error(error);
		});
	}

	_handleChuyenCho() {
		// return this.notifCount++;
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.setState({
			loadingModalAction: true
		});
		let that = this;
		that.closeModal();
		that.closeModalAction();
		let params = '?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=chuyenchoo&bvv_bvn_id_can_chuyen='+dataGiuong.bvv_bvn_id+'&bvv_id_can_chuyen='+dataGiuong.bvv_id+'&idAdm='+this.state.infoAdm.adm_id;
		fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.status != 404) {
				let setStatus = that.state.arrVeNumber;
				setStatus[this.state.bvv_number_muon_chuyen].bvv_status = setStatus[this.state.currentIdGiuong].bvv_status;
				setStatus[this.state.currentIdGiuong].bvv_status = 0;
				that.props.data.did_so_cho_da_ban = parseInt(that.props.data.did_so_cho_da_ban)-1;
				that.setState({
					arrVeNumber: setStatus,
					loadingModalAction: false,
					bvv_id_can_chuyen: 0,
					bvv_bvn_id_muon_chuyen: 0,
					bvv_number_muon_chuyen: 0,
					notifiCountDanhSachCho: this.state.notifiCountDanhSachCho+1
				});
			}

		})
		.catch((error) => {
			that.setState({
				loadingModalAction: false
			});
			console.error(error);
		});
	}

	_handleXacNhanChuyenVaoCho() {
		this.setState({
			loadingModal: true
		});
		let that = this;
		that.closeModal();
		let params = '?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=chuyenvaocho&bvv_bvn_id_muon_chuyen='+this.state.bvv_bvn_id_muon_chuyen+'&bvv_number_muon_chuyen='+this.state.bvv_number_muon_chuyen+'&bvh_id_can_chuyen='+that.props.data.bvh_id_can_chuyen+'&day='+this.props.data.day+'&idAdm='+this.state.infoAdm.adm_id;
		fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.status != 404) {
				let setStatus = that.state.arrVeNumber;
				setStatus[this.state.nameGiuong].bvv_status = 1;
				that.setState({
					arrVeNumber: setStatus,
					notifiCountDanhSachCho: this.state.notifiCountDanhSachCho-1,
					loadingModal: false
				});
				that.props.data.bvh_id_can_chuyen = 0;
			}
		})
		.catch((error) => {
			that.setState({
				loadingModal: false
			});
			console.error(error);
		});
	}

	_handleHuyChuyenVaoCho() {
		this.setState({
			chuyenVaoCho: false
		});
		this.props.data.bvh_id_can_chuyen = 0;
		this.props.data.nameGiuongXepCho = '';
	}

	_handleChuyenChoo() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.setState({
			bvv_id_can_chuyen: dataGiuong.bvv_id
		});
		this.closeModalAction();

	}

	_handleChinhSua() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.setState({
			loadingModal: true,
			type: 'update'
		});
		var that = this;
		fetch(domain+'/api/api_adm_ben.php?token='+this.state.token+'&adm_id='+this.state.infoAdm.adm_id+'&type=update&notId='+this.props.data.notId+'&notTuyenId='+this.props.data.notTuyenId+'&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&bvv_id='+dataGiuong.bvv_id+'&bvv_number='+dataGiuong.bvv_number+'&day='+this.props.data.day, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.status != 404) {
				let newDataBen = [];
				for(var i = 0; i < Object.keys(responseJson.dataBen).length > 0; i++) {
					newDataBen.push({key: responseJson.dataBen[i].bex_id, value: responseJson.dataBen[i].bex_ten});
				}
				that.setState({
					status: responseJson.status,
					resultsBen: newDataBen,
					bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
					bvv_number_muon_chuyen: dataGiuong.bvv_number,
					fullName: responseJson.fullName,
					phone: responseJson.phone,
					diem_don: responseJson.bvv_diem_don_khach,
					diem_tra: responseJson.bvv_diem_tra_khach,
					ghi_chu: responseJson.bvv_ghi_chu,
					nameDiemDi: responseJson.nameDiemDi,
					nameDiemDen: responseJson.nameDiemDen,
					keyDiemDi: responseJson.keyDiemDi,
					keyDiemDen: responseJson.keyDiemDen,
					totalPriceInt: responseJson.totalPrice,
					loadingModal: false
				});
				return responseJson;
			}
		})
		.catch((error) => {
			that.setState({
				loadingModal: false
			});
			console.error(error);
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
		height: 100,
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
		backgroundColor: '#5fb760'
	},
	activeThanhToan: {
		backgroundColor: '#60c0dc',
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
		height: (height-100),
		paddingTop: 20
	},
	modalAction: {
		alignItems: 'center'
	},
	modalPopupAction: {
		height: (height-100),
		paddingTop: 20
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
	fontWeight: {
		fontWeight: 'bold'
	},
	 colorTabs: {
		 color: '#999'
	 }
});

export default ViewSoDoGiuong
