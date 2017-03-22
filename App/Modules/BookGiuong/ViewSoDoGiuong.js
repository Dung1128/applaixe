import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,StyleSheet,Dimensions,TextInput,TouchableOpacity,
	AsyncStorage,TabBarIOS,View,ScrollView
} from 'react-native';
import {domain, cache} from '../../Config/common';
import * as Common from '../../Components/Common';
import { Container, Content, Header, Title, Text, Icon, Input, InputGroup, Button, Card, CardItem, Spinner, Thumbnail } from 'native-base';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from 'react-native-modalbox';
import ModalPicker from 'react-native-modal-picker';
const heightDevice = Dimensions.get('window').height;
const {width, height} = Dimensions.get('window');
import StorageHelper from '../../Components/StorageHelper';
import fetchData from '../../Components/FetchData';
import Ghe from '../../Components/Ghe';

class ViewSoDoGiuong extends Component {

	constructor(props) {
		super(props);
		this.state = {
			layout:{
	        	height: height,
	        	width: width
	      },
			timeSync: (1000*2),
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
			token: '',
			clearTimeout: '',
			clearSync: ''
		};
	}

	getSyncArrVeNumber() {
		let that = this;
		this.state.clearSync = setInterval(() => {
			fetch(domain+'/api/api_sync_so_do_giuong.php?type=laixe&token='+that.state.token+'&adm_id='+that.state.infoAdm.adm_id+'&notId='+that.props.data.notId+'&day='+that.props.data.day, {
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
		}, this.state.timeSync);
	}

	async componentWillMount() {

		var that = this;
		let results = await StorageHelper.getStore('infoAdm');
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;
		let data = [];
		let time_sync = 60;
		let objTimeSync = await fetchData('adm_get_time_sync', {type: 'laixe'}, 'GET');
		if(objTimeSync.time_sync >= 60) {
			time_sync = objTimeSync.time_sync;
		}
		this.state.timeSync = (1000*time_sync);
		this.setState({
			infoAdm: results,
			token: token,
			loading: true
		});

		try {
			let params = {
				token: token,
				adm_id: admId,
				not_id: that.props.data.notId,
				day: that.props.data.day,
			}
			data = await fetchData('adm_so_do_giuong', params, 'GET');
		} catch (e) {
			this.setState({
				loading: false
			});
			console.log(e);
		}

		this.state.clearTimeout = setTimeout(() => {
			if(data.status != 404) {
				if(data.status == 200) {
					that.setState({
						results:data.so_do_giuong,
						arrVeNumber: data.so_do_giuong.arrVeNumber,
						arrActive: data.so_do_giuong.arrVeNumber,
						notifiCountDanhSachCho: data.total_danh_sach_cho,
						arrBen: data.arrBen
					});
				}
			}else if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}
			that.setState({
				loading: false
			});
		}, 1000);

		this.getSyncArrVeNumber();
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextState.chuyenVaoCho == undefined) {
			nextState.chuyenVaoCho = nextProps.data.chuyenVaoCho;
		}
		nextState.arrVeNumber = nextState.arrVeNumber;
	}

	componentWillUnmount() {
		clearTimeout(this.state.clearTimeout);
		clearInterval(this.state.clearSync);
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
											<View style={{flexDirection: 'row'}}>
												<View style={{flex: 1}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
												</View>
												<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 5}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{priceGiuongActive}</Text>
												</View>
											</View>
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
											<View style={{flexDirection: 'row'}}>
												<View style={{flex: 1}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
												</View>
												<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 5}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{priceGiuongActive}</Text>
												</View>
											</View>
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
										<View style={{flexDirection: 'row'}}>
											<View style={{flex: 1}}>
												<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
											</View>
											<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 5}}>
												<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{priceGiuongActive}</Text>
											</View>
										</View>
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
											<View style={{flexDirection: 'row'}}>
												<View style={{flex: 1}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
												</View>
												<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 5}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{priceGiuongActive}</Text>
												</View>
											</View>
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
											<View style={{flexDirection: 'row'}}>
												<View style={{flex: 1}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
												</View>
												<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 5}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{priceGiuongActive}</Text>
												</View>
											</View>
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
										<View style={{flexDirection: 'row'}}>
											<View style={{flex: 1}}>
												<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
											</View>
											<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 5}}>
												<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{priceGiuongActive}</Text>
											</View>
										</View>
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
											<View style={{flexDirection: 'row'}}>
												<View style={{flex: 1}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
												</View>
												<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 5}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{priceGiuongActive}</Text>
												</View>
											</View>
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
											<View style={{flexDirection: 'row'}}>
												<View style={{flex: 1}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
												</View>
												<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 5}}>
													<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{priceGiuongActive}</Text>
												</View>
											</View>
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
										<View style={{flexDirection: 'row'}}>
											<View style={{flex: 1}}>
												<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
											</View>
											<View style={{flex: 1, alignItems: 'flex-end', paddingRight: 5}}>
												<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{priceGiuongActive}</Text>
											</View>
										</View>
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
				html.push(<Grid key={i} style={{marginRight: -8, marginLeft: -8, width: (this.state.layout.width-20)}}>{htmlChild}</Grid>);
			}
		}
		return html;
	}

	async _setActiveGiuong(id) {
		if(this.state.themVe.check) {
			let arrThemve = this.state.arrThemve;
			let setStatus = this.state.arrVeNumber;
			try {
				let params = {
					token: this.state.token,
					adm_id: this.state.infoAdm.adm_id,
					numberGiuong: id,
					bvv_id: setStatus[id].bvv_id
				}
				let data = await fetchData('api_check_ve', params, 'GET');
				if(data.status != 404) {
					if(data.status == 201) {
						alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
					}else {
						arrThemve.push({
							bvv_bvn_id: setStatus[id].bvv_bvn_id,
							bvv_id: setStatus[id].bvv_id,
							bvv_number: id,
							bvv_khach_hang_id: this.state.themVe.khach_hang_id,
							bvv_diem_don_khach: setStatus[id].bvv_diem_don_khach,
							bvv_diem_tra_khach: setStatus[id].bvv_diem_tra_khach,
							bvv_ghi_chu: setStatus[id].bvv_ghi_chu
						});

						setStatus[id].bvv_status = 1;
						setStatus[id].bvv_ten_khach_hang = this.state.themVe.ten_khach_hang;
						setStatus[id].bvv_phone = this.state.themVe.phone;
						setStatus[id].bvv_diem_don_khach = this.state.themVe.diem_don;
						setStatus[id].bvv_diem_tra_khach = this.state.themVe.diem_tra;
						setStatus[id].bvv_ghi_chu = this.state.themVe.ghi_chu;
						setStatus[id].bvv_bex_id_a = this.state.themVe.keyDiemDi;
						setStatus[id].bvv_bex_id_b = this.state.themVe.keyDiemDen;
						setStatus[id].bvv_price = this.state.themVe.totalPriceInt;
						setStatus[id].bvv_khach_hang_id = this.state.themVe.khach_hang_id;

						this.setState({
							arrThemve: arrThemve,
							arrVeNumber: setStatus
						});
					}
				}else if(data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
				}
			} catch (e) {
				console.log(e);
			}
			this.setState({
				loading: false
			});
		}else {
			let dataGiuong = this.state.arrVeNumber[id];
			if(this.props.data.bvh_id_can_chuyen != 0 && this.props.data.bvh_id_can_chuyen != undefined) {
				try {
					let params = {
						token: this.state.token,
						adm_id: this.state.infoAdm.adm_id,
						huy: this.props.data.huy,
						type: 'chuyenvaocho',
						bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
						bvv_number_muon_chuyen: dataGiuong.bvv_number,
						bvh_id_can_chuyen: this.props.data.bvh_id_can_chuyen,
						day: this.props.data.day,
						idAdm: this.state.infoAdm.adm_id,
					}
					let data = await fetchData('adm_so_do_giuong_update', params, 'GET');
					if(data.status != 404) {
						if(data.status == 201) {
							alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
						}else {
							let setStatus = this.state.arrVeNumber;
							setStatus[id].bvv_status = 1;

							var dataGiuongs = this.state.arrVeNumber;
							dataGiuongs[id].bvv_ten_khach_hang = this.props.data.fullName;
							dataGiuongs[id].bvv_phone = this.props.data.phone;
							dataGiuongs[id].bvv_bex_id_a = this.props.data.bvv_bex_id_a;
							dataGiuongs[id].bvv_bex_id_b = this.props.data.bvv_bex_id_b;
							dataGiuongs[id].bvv_price = parseInt(this.props.data.bvv_price);
							dataGiuongs[id].bvv_status = 1;
							this.props.data.did_so_cho_da_ban = parseInt(this.props.data.did_so_cho_da_ban)+1;
							this.setState({
								arrVeNumber: setStatus,
								arrVeNumber: dataGiuongs,
								notifiCountDanhSachCho: this.state.notifiCountDanhSachCho-1,
								chuyenVaoCho: false
							});
							this.props.data.bvh_id_can_chuyen = 0;
							this.props.data.nameGiuongXepCho = '';
						}
					}else if(data.status == 404) {
						alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
						Actions.welcome({type: 'reset'});
					}
				} catch (e) {
					console.log(e);
				}
				this.setState({
					loading: false
				});
			}else if(this.state.bvv_id_can_chuyen != 0) {
				try {
					let params = {
						token: this.state.token,
						adm_id: this.state.infoAdm.adm_id,
						type: 'chuyencho',
						bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
						bvv_number_muon_chuyen: dataGiuong.bvv_number,
						bvv_id_can_chuyen: this.state.bvv_id_can_chuyen,
						day: this.props.data.day,
						idAdm: this.state.infoAdm.adm_id,
					}
					let data = await fetchData('adm_so_do_giuong_update', params, 'GET');
					if(data.status != 404) {
						if(data.status == 201) {
							alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
						}else {
							let setStatus = this.state.arrVeNumber;
							setStatus[dataGiuong.bvv_number].bvv_ten_khach_hang = setStatus[this.state.currentIdGiuong].bvv_ten_khach_hang;
							setStatus[dataGiuong.bvv_number].bvv_phone = setStatus[this.state.currentIdGiuong].bvv_phone;
							setStatus[dataGiuong.bvv_number].bvv_bex_id_a = setStatus[this.state.currentIdGiuong].bvv_bex_id_a;
							setStatus[dataGiuong.bvv_number].bvv_bex_id_b = setStatus[this.state.currentIdGiuong].bvv_bex_id_b;
							setStatus[dataGiuong.bvv_number].bvv_status = setStatus[this.state.currentIdGiuong].bvv_status;
							setStatus[dataGiuong.bvv_number].bvv_price = setStatus[this.state.currentIdGiuong].bvv_price;
							setStatus[this.state.currentIdGiuong].bvv_status = 0;
							this.setState({
								arrVeNumber: setStatus,
								bvv_id_can_chuyen: 0,
								bvv_bvn_id_muon_chuyen: 0,
								bvv_number_muon_chuyen: 0
							});
						}
					}else if(data.status == 404) {
						alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
						Actions.welcome({type: 'reset'});
					}
				} catch (e) {
					console.log(e);
				}
				this.setState({
					loading: false
				});
			}else {
				this.getPriceBen(dataGiuong.bvv_bex_id_a, dataGiuong.bvv_bex_id_b, dataGiuong.bvv_id);
				this.setState({
					nameGiuong: id,
					loadingModal: true,
					type: '',
					fullName: '',
					phone: '',
					diem_don: '',
					diem_tra: ''
				});

				this.openModal();
				try {
					let params = {
						token: this.state.token,
						adm_id: this.state.infoAdm.adm_id,
						type: 'getBen',
						notTuyenId: this.props.data.notTuyenId,
						numberGiuong: id,
						bvv_id: dataGiuong.bvv_id,
					}
					let data = await fetchData('adm_ben', params, 'GET');
					if(data.status != 404) {
						if(data.status == 201) {
							alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
							this.setState({
								arrVeNumber: data.arrVeNumber,
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
					}else if(data.status == 404) {
						alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
						Actions.welcome({type: 'reset'});
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
								<View style={{position: 'absolute', zIndex:9, top: 10, right: 10, width: 50, height: 50}}>
									<TouchableOpacity onPress={() => this.closeModal()} style={{alignItems: 'flex-end', justifyContent: 'center'}}>
										<Icon name="md-close" style={{fontSize: 30}} />
									</TouchableOpacity>
								</View>
								<ScrollView style={{width: this.state.layout.width}} keyboardShouldPersistTaps={true}>
									<ModalPicker
										data={listItem1}
										initValue="Chọn điểm đi"
										onChange={(option)=>{this.renderPriceBenDi(option)}}
										style={{width: this.state.layout.width, paddingLeft: 10, paddingRight: 10, marginBottom: 10}}
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
										style={{width: this.state.layout.width, paddingLeft: 10, paddingRight: 10, marginBottom: 10}}
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
										<Input placeholder="Số điện thoại" keyboardType="numeric" value={this.state.phone} onChange={(event) => this.setState({phone: event.nativeEvent.text})} />
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

	async renderPriceBenDi(option) {
		this.setState({
			loadingModal: true,
			nameDiemDi: option.label,
			keyDiemDi: option.value
		});

		try {
			let params = {
				token: this.state.token,
				adm_id: this.state.infoAdm.adm_id,
				type: 'notAuto',
				diemDi: option.value,
				diemDen: this.state.keyDiemDen,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('adm_price_ben', params, 'GET');
			if(data.status != 404) {
				var totalPriceInt = data.totalPrice;
				var totalPrice = data.totalPrice.toFixed(0).replace(/./g, function(c, i, a) {
					return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
				});
				this.setState({
					priceTotal: totalPrice,
					totalPriceInt: totalPriceInt,
				});
				return data.totalPrice;
			}else if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}
		} catch (e) {
			console.log(e);
		}
		this.setState({
			loading: false,
			loadingModal: false
		});

	}

	async renderPriceBenDen(option) {
		this.setState({
			loadingModal: true,
			nameDiemDen: option.label,
			keyDiemDen: option.value,
		});
		try {
			let params = {
				token: this.state.token,
				adm_id: this.state.infoAdm.adm_id,
				type: 'notAuto',
				diemDi: this.state.keyDiemDi,
				diemDen: option.value,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('adm_price_ben', params, 'GET');
			if(data.status != 404) {
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
			}else if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
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
					keyDiemDen: responseJson.keyDiemDen
				});
				return responseJson.totalPrice;
			}else if(responseJson.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}
		})
		.catch((error) => {
			console.error(error);
		});
	}

	async updateGiuong(id) {
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

			this.closeModal();
			try {
				let params = {
					token: this.state.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'update',
					bvv_id: dataGiuong.bvv_id,
					bvv_bvn_id: dataGiuong.bvv_bvn_id,
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
				}
				let data = await fetchData('adm_so_do_giuong_update', params, 'GET');
				if(data.status != 404) {
					let currentArrActive = this.state.arrVeNumber;
					currentArrActive[this.state.currentIdGiuong].bvv_ten_khach_hang = this.state.fullName;
					currentArrActive[this.state.currentIdGiuong].bvv_phone = this.state.phone;
					currentArrActive[this.state.currentIdGiuong].bvv_bex_id_a = this.state.keyDiemDi;
					currentArrActive[this.state.currentIdGiuong].bvv_bex_id_b = this.state.keyDiemDen;
					currentArrActive[this.state.currentIdGiuong].bvv_price = this.state.totalPriceInt;

					currentArrActive[this.state.currentIdGiuong].bvv_diem_don_khach = this.state.diem_don;
					currentArrActive[this.state.currentIdGiuong].bvv_diem_tra_khach = this.state.diem_tra;
					currentArrActive[this.state.currentIdGiuong].bvv_ghi_chu = this.state.ghi_chu;

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
						type: ''
					});
				}else if(data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
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

			this.closeModal();
			try {
				let params = {
					token: this.state.token,
					adm_id: this.state.infoAdm.adm_id,
					type: 'insert',
					bvv_id: dataGiuong.bvv_id,
					bvv_bvn_id: dataGiuong.bvv_bvn_id,
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
				}
				let data = await fetchData('adm_so_do_giuong_update', params, 'GET');
				if(data.status != 404) {
					if(data.status == 201) {
						alert('Chỗ đã có người đặt. Bạn vui lòng chọn chỗ khác');
					}else {
						let currentArrActive = this.state.arrVeNumber;
						currentArrActive[id].bvv_status = 1;
						currentArrActive[id].bvv_ten_khach_hang = this.state.fullName;
						currentArrActive[id].bvv_phone = this.state.phone;
						currentArrActive[id].bvv_diem_don_khach = this.state.diem_don;
						currentArrActive[id].bvv_diem_tra_khach = this.state.diem_tra;
						currentArrActive[id].bvv_ghi_chu = this.state.ghi_chu;
						currentArrActive[id].bvv_bex_id_a = this.state.keyDiemDi;
						currentArrActive[id].bvv_bex_id_b = this.state.keyDiemDen;
						currentArrActive[id].bvv_price = this.state.totalPriceInt;
						currentArrActive[id].bvv_khach_hang_id = data.userId;
						this.props.data.did_so_cho_da_ban = parseInt(this.props.data.did_so_cho_da_ban)+1;
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
							phone: ''
						});
					}
				}else if(data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
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
					<Card style={[styles.paddingContent]}>
						<CardItem header>
							<View style={{flexDirection: 'column', flex: 1}}>
								<View style={{marginBottom: 10}}>
									<Text style={{fontWeight: 'bold'}}>{this.props.data.tuy_ten}</Text>
									<Text style={{fontWeight: 'bold'}}>{this.props.data.did_gio_xuat_ben_that + ' - ' + this.props.data.day}</Text>
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
										<Text style={{flex: 3}}>Còn trống: <Text style={{fontWeight: 'bold'}}>{(this.props.data.tong_so_cho-this.props.data.did_so_cho_da_ban)}/{this.props.data.tong_so_cho}</Text></Text>
									</View>
								</View>
								<View>
									<View style={{flexDirection: 'row'}}>
											<View style={{flex: 1}}>
												<View style={{flexDirection: 'row'}}>
													<View width={15} height={15} backgroundColor={'#60c0dc'} style={{marginRight: 10,marginTop: 3}}></View>
													<View><Text>Đã lên xe</Text></View>
												</View>
											</View>
											<View style={{flex: 2}}>
												<View style={{flexDirection: 'row'}}>
													<View width={15} height={15} backgroundColor={'#ffa500'} style={{marginRight: 10,marginTop: 3}}></View>
													<View><Text>Đã book</Text></View>
												</View>
											</View>
									</View>
								</View>
								{this.props.data.did_loai_xe == 1 &&
									<View style={{position: 'absolute', right: 0, top: 30}}>
										<Thumbnail size={60} source={require('../../Skin/Images/vip.png')} />
									</View>
								}
							</View>
						</CardItem>
					</Card>

					<View style={{flexDirection: 'column', flex: 1}}>
						{this.state.loading && <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View> }
						{this._renderSoDoGiuong(this.state.results, 1).length > 0 &&
							<Card style={[styles.paddingContent]}>
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
					html.push(<Button key="7" block style={styles.marginTopButton} onPress={this._handleChinhSua.bind(this)}>Chỉnh sửa</Button>);
					if(this.state.bvv_id_can_chuyen != this.state.currentIdGiuong) {
						html.push(<Button key="5" block info style={styles.marginTopButton} onPress={this._handleChuyenChoo.bind(this)}>Chuyển chỗ</Button>);
					}
					html.push(<Button key="6" block success style={styles.marginTopButton} onPress={this._handleThemVe.bind(this)}>Thêm vé</Button>);
					html.push(<Button key="3" block danger style={styles.marginTopButton} onPress={this._handleHuyVe.bind(this)}>Hủy Vé</Button>);
					html.push(<Button key="4" block warning style={styles.marginTopButton} onPress={this._handleChuyenCho.bind(this)}>Chuyển chờ</Button>);

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
							<Text>Họ và tên: <Text style={{fontWeight: 'bold'}}>{dataGiuong.bvv_ten_khach_hang}</Text></Text>
							<Text>Số điện thoại: <Text style={{fontWeight: 'bold'}}>{dataGiuong.bvv_phone}</Text></Text>
							<Text>Điểm đón: <Text style={{fontWeight: 'bold'}}>{dataGiuong.bvv_diem_don_khach}</Text></Text>
							<Text>Điểm trả: <Text style={{fontWeight: 'bold'}}>{dataGiuong.bvv_diem_tra_khach}</Text></Text>
							<Text>Nơi đi & đến: <Text style={{fontWeight: 'bold'}}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]} -> {this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text></Text>
							<Text>Giá vé: <Text style={{fontWeight: 'bold'}}>{Common.formatPrice(dataGiuong.bvv_price)} VNĐ</Text></Text>
							<Text>Ghi chú: <Text style={{fontWeight: 'bold'}}>{dataGiuong.bvv_ghi_chu}</Text></Text>
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
			}
			let data = await fetchData('adm_them_ve', params, 'GET');
			if(data.status != 404) {
				let arrThemve = this.state.arrThemve;
				for(var i = 0; i < arrThemve.length; i++) {
					this.props.data.did_so_cho_da_ban = parseInt(this.props.data.did_so_cho_da_ban)+1;
				}
				this.setState({
					themVe: [],
					arrThemve: []
				});
			}else if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
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
				bvv_bvn_id: dataGiuong.bvv_bvn_id,
				bvv_number: dataGiuong.bvv_number,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('adm_so_do_giuong_update', params, 'GET');
			if(data.status != 404) {
				let setStatus = this.state.arrVeNumber;
				setStatus[this.state.currentIdGiuong].bvv_status = 11;
				this.setState({
					arrVeNumber: setStatus
				});
			}else if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
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
			let data = await fetchData('adm_so_do_giuong_update', params, 'GET');
			if(data.status != 404) {
				let setStatus = this.state.arrVeNumber;
				setStatus[this.state.currentIdGiuong].bvv_status = 0;
				this.props.data.did_so_cho_da_ban = parseInt(this.props.data.did_so_cho_da_ban)-1;
				this.setState({
					arrVeNumber: setStatus
				});
			}else if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
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
				bvv_bvn_id: dataGiuong.bvv_bvn_id,
				bvv_number: dataGiuong.bvv_number,
				day: this.props.data.day,
				bvv_bex_id_a: dataGiuong.bvv_bex_id_a,
				bvv_bex_id_b: dataGiuong.bvv_bex_id_b,
				bvv_price: dataGiuong.bvv_price,
				bvv_number: this.state.currentIdGiuong,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('adm_so_do_giuong_update', params, 'GET');
			if(data.status != 404) {
				let setStatus = this.state.arrVeNumber;
				setStatus[this.state.currentIdGiuong].bvv_status = 0;
				this.props.data.did_so_cho_da_ban = parseInt(this.props.data.did_so_cho_da_ban)-1;
				this.setState({
					arrVeNumber: setStatus
				});
			}else if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}
		} catch (e) {
			console.log(e);
		}
		this.setState({
			loadingModalAction: false,
			loading: false
		});
	}

	async _handleChuyenCho() {
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
				type: 'chuyenchoo',
				bvv_bvn_id_can_chuyen: dataGiuong.bvv_bvn_id,
				bvv_id_can_chuyen: dataGiuong.bvv_id,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('adm_so_do_giuong_update', params, 'GET');
			if(data.status != 404) {
				let setStatus = this.state.arrVeNumber;
				setStatus[this.state.bvv_number_muon_chuyen].bvv_status = setStatus[this.state.currentIdGiuong].bvv_status;
				setStatus[this.state.currentIdGiuong].bvv_status = 0;
				this.props.data.did_so_cho_da_ban = parseInt(this.props.data.did_so_cho_da_ban)-1;
				this.setState({
					arrVeNumber: setStatus,
					bvv_id_can_chuyen: 0,
					bvv_bvn_id_muon_chuyen: 0,
					bvv_number_muon_chuyen: 0,
					notifiCountDanhSachCho: this.state.notifiCountDanhSachCho+1
				});
			}else if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
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
				bvh_id_can_chuyen: this.props.data.bvh_id_can_chuyen,
				day: this.props.data.day,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('adm_so_do_giuong_update', params, 'GET');
			if(data.status != 404) {
				let setStatus = this.state.arrVeNumber;
				setStatus[this.state.nameGiuong].bvv_status = 1;
				this.setState({
					arrVeNumber: setStatus,
					notifiCountDanhSachCho: this.state.notifiCountDanhSachCho-1,
					loadingModal: false
				});
				this.props.data.bvh_id_can_chuyen = 0;
			}else if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
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
				notId: this.props.data.notId,
				notTuyenId: this.props.data.notTuyenId,
				bvv_bvn_id: dataGiuong.bvv_bvn_id,
				bvv_id: dataGiuong.bvv_id,
				bvv_number: dataGiuong.bvv_number,
				day: this.props.data.day,
			}
			let data = await fetchData('adm_ben', params, 'GET');
			if(data.status != 404) {
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
					keyDiemDi: data.keyDiemDi,
					keyDiemDen: data.keyDiemDen,
					totalPriceInt: data.totalPrice,
				});
			}else if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
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
	fontWeight: {
		fontWeight: 'bold'
	},
	 colorTabs: {
		 color: '#999'
	 }
});

export default ViewSoDoGiuong
