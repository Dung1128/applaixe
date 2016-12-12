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
import { Container, Content, Header, Title, Text, Icon, Button, Card, CardItem, Spinner } from 'native-base';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from 'react-native-modalbox';
import ModalPicker from 'react-native-modal-picker';
const heightDevice = Dimensions.get('window').height;
class ViewSoDoGiuong extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			arrActive: [],
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
			arrThemve: []
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

	componentDidMount() {
		this.infoAdm();
		var that = this;
		that.setState({
			loading: true
		});
		setTimeout(() => {
			var apiUrl = domain+'/api/api_adm_so_do_giuong.php?not_id='+this.props.data.notId+'&day='+this.props.data.day;
			fetch(apiUrl, {
				headers: {
			    	'Cache-Control': cache
			  	}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				that.setState({
					results:responseJson.so_do_giuong,
					arrVeNumber: responseJson.so_do_giuong.arrVeNumber,
					arrActive: responseJson.so_do_giuong.arrVeNumber,
					notifiCountDanhSachCho: responseJson.total_danh_sach_cho,
					arrBen: responseJson.arrBen,
					loading: false
				});
			})
			.catch((error) => {
				that.setState({
					loading: true
				});
				console.error(error);
			});
		},800);
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

				if(Object.keys(item).length == 3) {
				for(var j in item) {
					// if(item[j].sdgct_disable == '1') {
					// 	htmlChild.push( <Col key={i+j} style={styles.nullBorderCol}></Col> );
					// }else {

						var idGiuong = item[j].sdgct_number;
						var dataGiuong = this.state.arrVeNumber[idGiuong];
						var newPrice = dataGiuong.bvv_price/1000;
						var priceGiuongActive = newPrice.toFixed(0).replace(/./g, function(c, i, a) {
							return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
						});
						priceGiuongActive += 'K';
						// if(((this.state.arrActive[idGiuong].bvv_status > 0) || (dataGiuong.bvv_status > 0)) &&
						// 	((this.state.arrActive[idGiuong].bvv_status < 4) || (dataGiuong.bvv_status < 4))) {
						// 	if(this.state.bvv_id_can_chuyen != 0) {
						// 		if(this.state.bvv_id_can_chuyen == dataGiuong.bvv_id) {
						// 			htmlChild.push(
						// 				<Col key={i+j} style={styles.borderCol}>
						// 					<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeGiuong, styles.opacityBg, styles.borderChuyenChoo]}>
						// 						<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{priceGiuongActive}</Text>
						// 					</TouchableOpacity>
						// 				</Col>
						// 			);
						// 		}else {
						// 			htmlChild.push(
						// 				<Col key={i+j} style={styles.borderCol}>
						// 					<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeGiuong, styles.opacityBg]}>
						// 						<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{priceGiuongActive}</Text>
						// 					</TouchableOpacity>
						// 				</Col>
						// 			);
						// 		}
						// 	}else {
						// 		htmlChild.push(
						// 			<Col key={i+j} style={styles.borderCol}>
						// 				<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeGiuong, styles.opacityBg]}>
						// 					<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
						// 					<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
						// 					<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
						// 					<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{priceGiuongActive}</Text>
						// 				</TouchableOpacity>
						// 			</Col>
						// 		);
						// 	}
						// }else if((this.state.arrActive[idGiuong].bvv_status == 11) || (dataGiuong.bvv_status == 11)) {
						// 	if(this.state.bvv_id_can_chuyen != 0) {
						// 		if(this.state.bvv_id_can_chuyen == dataGiuong.bvv_id) {
						// 			htmlChild.push(
						// 				<Col key={i+j} style={styles.borderCol}>
						// 					<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeLenXe, styles.opacityBg, styles.borderChuyenChoo]}>
						// 						<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{priceGiuongActive}</Text>
						// 					</TouchableOpacity>
						// 				</Col>
						// 			);
						// 		}else {
						// 			htmlChild.push(
						// 				<Col key={i+j} style={styles.borderCol}>
						// 					<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeLenXe, styles.opacityBg]}>
						// 						<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{priceGiuongActive}</Text>
						// 					</TouchableOpacity>
						// 				</Col>
						// 			);
						// 		}
						// 	}else {
						// 		htmlChild.push(
						// 			<Col key={i+j} style={styles.borderCol}>
						// 				<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeLenXe, styles.opacityBg]}>
						// 					<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
						// 					<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
						// 					<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
						// 					<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{priceGiuongActive}</Text>
						// 				</TouchableOpacity>
						// 			</Col>
						// 		);
						// 	}
						// }else if(((this.state.arrActive[idGiuong].bvv_status == 4) || (dataGiuong.bvv_status == 4)) ||
						// 	((this.state.arrActive[idGiuong].bvv_status > 100) || (dataGiuong.bvv_status > 100))) {
						// 	if(this.state.bvv_id_can_chuyen != 0) {
						// 		if(this.state.bvv_id_can_chuyen == dataGiuong.bvv_id) {
						// 			htmlChild.push(
						// 				<Col key={i+j} style={styles.borderCol}>
						// 					<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeThanhToan, styles.opacityBg, styles.borderChuyenChoo]}>
						// 						<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{priceGiuongActive}</Text>
						// 					</TouchableOpacity>
						// 				</Col>
						// 			);
						// 		}else {
						// 			htmlChild.push(
						// 				<Col key={i+j} style={styles.borderCol}>
						// 					<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeThanhToan, styles.opacityBg]}>
						// 						<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
						// 						<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{priceGiuongActive}</Text>
						// 					</TouchableOpacity>
						// 				</Col>
						// 			);
						// 		}
						// 	}else {
						// 		htmlChild.push(
						// 			<Col key={i+j} style={styles.borderCol}>
						// 				<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeThanhToan, styles.opacityBg]}>
						// 					<Text style={[styles.textRightGiuong, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
						// 					<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_a]}</Text>
						// 					<Text style={[styles.textLeft, styles.textActiveGiuong]}>{this.state.arrBen[dataGiuong.bvv_bex_id_b]}</Text>
						// 					<Text style={[styles.textLeft, styles.textActiveGiuong, styles.fontWeight]}>{priceGiuongActive}</Text>
						// 				</TouchableOpacity>
						// 			</Col>
						// 		);
						// 	}
						// }else {
						// 	htmlChild.push(
						// 		<Col key={i+j} style={styles.borderCol}>
						// 			<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong)} style={styles.opacityBg}>
						// 				<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
						// 			</TouchableOpacity>
						// 		</Col>
						// 	);
						// }
					// }
					htmlChild.push(
						<Col key={i+j} style={styles.borderCol}>
							<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong)} style={styles.opacityBg}>
								<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
							</TouchableOpacity>
						</Col>
					);
				}
				}
				html.push(<Grid key={i}>{htmlChild}</Grid>);
			}
		}
		return html;
	}

	_setActiveGiuong(id) {
		if(this.state.themVe.check) {
			let arrThemve = this.state.arrThemve;
			let setStatus = this.state.arrActive;

			arrThemve.push({
				bvv_bvn_id: setStatus[id].bvv_bvn_id,
				bvv_id: setStatus[id].bvv_id,
				bvv_number: id
			});

			setStatus[id].bvv_status = 1;
			setStatus[id].bvv_bex_id_a = this.state.themVe.keyDiemDi;
			setStatus[id].bvv_bex_id_b = this.state.themVe.keyDiemDen;
			setStatus[id].bvv_price = this.state.themVe.totalPriceInt;

			this.setState({
				arrThemve: arrThemve,
				arrActive: setStatus
			});
		}else {
			let dataGiuong = this.state.arrVeNumber[id];
			if(this.props.data.bvh_id_can_chuyen != 0 && this.props.data.bvh_id_can_chuyen != undefined) {
				let that = this;
				let params = '?huy='+this.props.data.huy+'&type=chuyenvaocho&bvv_bvn_id_muon_chuyen='+dataGiuong.bvv_bvn_id+'&bvv_number_muon_chuyen='+dataGiuong.bvv_number+'&bvh_id_can_chuyen='+that.props.data.bvh_id_can_chuyen+'&day='+this.props.data.day+'&idAdm='+this.state.infoAdm.adm_id;
				fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
					headers: {
				    	'Cache-Control': cache
				  	}
				})
				.then((response) => response.json())
				.then((responseJson) => {
					let setStatus = that.state.arrActive;
					setStatus[id].bvv_status = 1;

					var dataGiuongs = this.state.arrVeNumber;
					dataGiuongs[id].bvv_bex_id_a = this.props.data.bvv_bex_id_a;
					dataGiuongs[id].bvv_bex_id_b = this.props.data.bvv_bex_id_b;
					dataGiuongs[id].bvv_price = parseInt(this.props.data.bvv_price);
					dataGiuongs[id].bvv_status = 1;
					that.setState({
						arrActive: setStatus,
						arrVeNumber: dataGiuongs,
						notifiCountDanhSachCho: that.state.notifiCountDanhSachCho-1,
						chuyenVaoCho: false
					});
					that.props.data.bvh_id_can_chuyen = 0;
					this.props.data.nameGiuongXepCho = '';
				})
				.catch((error) => {
					console.error(error);
				});
			}else if(this.state.bvv_id_can_chuyen != 0) {
				let that = this;
				let params = '?type=chuyencho&bvv_bvn_id_muon_chuyen='+dataGiuong.bvv_bvn_id+'&bvv_number_muon_chuyen='+dataGiuong.bvv_number+'&bvv_id_can_chuyen='+this.state.bvv_id_can_chuyen+'&day='+this.props.data.day+'&idAdm='+this.state.infoAdm.adm_id;
				fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
					headers: {
				    	'Cache-Control': cache
				  	}
				})
				.then((response) => response.json())
				.then((responseJson) => {
					let setStatus = that.state.arrActive;
					setStatus[dataGiuong.bvv_number].bvv_bex_id_a = setStatus[that.state.currentIdGiuong].bvv_bex_id_a;
					setStatus[dataGiuong.bvv_number].bvv_bex_id_b = setStatus[that.state.currentIdGiuong].bvv_bex_id_b;
					setStatus[dataGiuong.bvv_number].bvv_status = setStatus[that.state.currentIdGiuong].bvv_status;
					setStatus[dataGiuong.bvv_number].bvv_price = setStatus[that.state.currentIdGiuong].bvv_price;
					setStatus[that.state.currentIdGiuong].bvv_status = 0;
					that.setState({
						arrActive: setStatus,
						bvv_id_can_chuyen: 0,
						bvv_bvn_id_muon_chuyen: 0,
						bvv_number_muon_chuyen: 0
					});
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

				fetch(domain+'/api/api_adm_ben.php?type=getBen&notTuyenId='+this.props.data.notTuyenId, {
					headers: {
				    	'Cache-Control': cache
				  	}
				})
				.then((response) => response.json())
				.then((responseJson) => {
					that.setState({
						status: responseJson.status,
						resultsBen: responseJson.dataBen,
						bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
						bvv_number_muon_chuyen: dataGiuong.bvv_number,
						type: '',
						totalPriceInt: that.state.totalPriceInt,
						loadingModal: false
					});
					return responseJson.dataBen;
				})
				.catch((error) => {
					that.setState({
						loadingModal: false
					});
					console.error(error);
				});
				this.openModal();
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
		let html = [];
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
					if(Object.keys(data).length > 0) {
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
							if(keyDiemDi != '' && keyDiemDi == key) {
								checkSelect = true;
								if(type == 'update') {
									currentDiemDi = data[key];
								}
							}
							listItem1.push({key: key.toString(), section: checkSelect, label: data[key], value: key});
						});

						Object.keys(data).map(function(key) {
							let checkSelect = false;
							if(keyDiemDen != '' && keyDiemDen == key) {
								checkSelect = true;
								if(type == 'update') {
									currentDiemDen = data[key];
								}
							}
							listItem2.push({key: key.toString(), section: checkSelect, label: data[key], value: key});
						});

						html.push(
							<Text key="1" style={{marginTop: 20, width: 200}}>Điểm đi:</Text>
						);
						html.push(
							<ModalPicker
							key="2"
							data={listItem1}
							initValue="Chọn điểm đi"
							onChange={(option)=>{this.renderPriceBenDi(option)}}>
							<Text style={{borderWidth:1, borderColor:'#ccc', paddingLeft:10,  width: 200, height:40, marginTop: 10, marginBottom: 10}}>
							{currentDiemDi == ''? 'Chọn điểm đến' : currentDiemDi}
							</Text>
							</ModalPicker>
						);
						html.push(
							<Text key="3" style={{width: 200}}>Điểm đến:</Text>
						);
						html.push(
							<ModalPicker
							key="4"
							data={listItem2}
							initValue="Chọn điểm đến"
							onChange={(option)=>{this.renderPriceBenDen(option)}}>
							<Text style={{borderWidth:1, borderColor:'#ccc', paddingLeft:10,  width: 200, height:40, marginTop: 10, marginBottom: 10}}>
							{currentDiemDen == ''? 'Chọn điểm đến' : currentDiemDen}
							</Text>
							</ModalPicker>
						);

						html.push(
							<Text key="5" style={{color: 'red', fontSize: 20, marginTop: 10, marginBottom: 20}}>{priceConver} VNĐ</Text>
						);

						if(type == 'update') {
							html.push(
								<Button key="6" block success onPress={this.updateGiuong.bind(this, this.state.nameGiuong)}>Cập nhật</Button>
							);
						}else {
							html.push(
								<Button key="6" block success onPress={this.bookGiuong.bind(this, this.state.nameGiuong)}>Book</Button>
							);
						}
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
		fetch(domain+'/api/api_adm_price_ben.php?type=notAuto&diemDi='+option.value+'&diemDen='+this.state.keyDiemDen+'&idAdm='+this.state.infoAdm.adm_id, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
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
		fetch(domain+'/api/api_adm_price_ben.php?type=notAuto&diemDi='+this.state.keyDiemDi+'&diemDen='+option.value+'&idAdm='+this.state.infoAdm.adm_id, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
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
		fetch(domain+'/api/api_adm_price_ben.php?type=auto&diemDi='+diem_a+'&diemDen='+diem_b+'&bvv_id='+bvv_id, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
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
			fetch(domain+'/api/api_adm_so_do_giuong_update.php?type=update&bvv_id='+dataGiuong.bvv_id+'&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&bvv_number='+dataGiuong.bvv_number+'&diem_a='+this.state.keyDiemDi+'&diem_b='+this.state.keyDiemDen+'&price='+this.state.totalPriceInt+'&idAdm='+this.state.infoAdm.adm_id, {
				headers: {
			    	'Cache-Control': cache
			  	}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				let currentArrActive = that.state.arrActive;
				currentArrActive[that.state.currentIdGiuong].bvv_bex_id_a = that.state.keyDiemDi;
				currentArrActive[that.state.currentIdGiuong].bvv_bex_id_b = that.state.keyDiemDen;
				currentArrActive[that.state.currentIdGiuong].bvv_price = that.state.totalPriceInt;
				that.setState({
					arrActive: currentArrActive,
					loadingModal: false,
					isOpen: false,
					nameDiemDi: '',
					keyDiemDi: '',
					nameDiemDen: '',
					keyDiemDen: '',
					priceTotal: 0,
					totalPriceInt: 0,
					type: ''
				});

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
			fetch(domain+'/api/api_adm_so_do_giuong_update.php?type=insert&bvv_id='+dataGiuong.bvv_id+'&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&bvv_number='+dataGiuong.bvv_number+'&diem_a='+this.state.keyDiemDi+'&diem_b='+this.state.keyDiemDen+'&price='+this.state.totalPriceInt+'&idAdm='+this.state.infoAdm.adm_id, {
				headers: {
			    	'Cache-Control': cache
			  	}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				let currentArrActive = that.state.arrActive;
				currentArrActive[id].bvv_status = 1;
				currentArrActive[id].bvv_bex_id_a = that.state.keyDiemDi;
				currentArrActive[id].bvv_bex_id_b = that.state.keyDiemDen;
				currentArrActive[id].bvv_price = that.state.totalPriceInt;
				that.setState({
					arrActive: currentArrActive,
					loadingModal: false,
					isOpen: false,
					nameDiemDi: '',
					keyDiemDi: '',
					nameDiemDen: '',
					keyDiemDen: '',
					priceTotal: 0,
					totalPriceInt: 0
				});
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

	render() {
		let data = {
			tuy_ten: this.props.data.tuy_ten,
			did_gio_xuat_ben_that: this.props.data.did_gio_xuat_ben_that,
			did_so_cho_da_ban: this.props.data.did_so_cho_da_ban,
			tong_so_cho: this.props.data.tong_so_cho,
			notifiCountDanhSachCho: this.state.notifiCountDanhSachCho,
			notId:this.props.data.notId,
			day:this.props.data.day,
			notTuyenId: this.props.data.notTuyenId
		};
		return(

			<View style={{height: heightDevice}}>
				<ScrollView style={styles.container}>
					<Card style={styles.paddingContent}>
						<CardItem header>
							<View style={{flexDirection: 'column'}}>
								<View style={{marginBottom: 10}}>
									<Text>Tuyến: <Text style={{fontWeight: 'bold'}}>{this.props.data.tuy_ten}</Text></Text>
									<Text>Giờ xuất bến: <Text style={{fontWeight: 'bold'}}>{this.props.data.did_gio_xuat_ben_that}</Text></Text>
									<Text>Số chỗ đã đặt: <Text style={{fontWeight: 'bold'}}>{this.props.data.did_so_cho_da_ban}</Text></Text>
									<Text>Số chỗ trống: <Text style={{fontWeight: 'bold'}}>{(this.props.data.tong_so_cho-this.props.data.did_so_cho_da_ban)}/{this.props.data.tong_so_cho}</Text></Text>
								</View>
								<View>
									<View style={{flexDirection: 'row', flex: 1}}>
										<View style={{marginRight: 20}}>
											<View style={{flex: 1}}>
												<View style={{flexDirection: 'row'}}>
													<View width={25} height={25} backgroundColor={'#5fb760'} style={{marginRight: 10,marginTop: -2}}></View>
													<View><Text>Đã lên xe</Text></View>
												</View>
											</View>
										</View>
										<View>
											<View style={{flex: 1}}>
												<View style={{flexDirection: 'row'}}>
													<View width={25} height={25} backgroundColor={'#ffa500'} style={{marginRight: 10,marginTop: -2}}></View>
													<View><Text>Đã book</Text></View>
												</View>
											</View>
										</View>
										<View>
											<View style={{flex: 1}}>
												<View style={{flexDirection: 'row'}}>
													<View style={{marginLeft: 5}}></View>
												</View>
											</View>
										</View>
									</View>
								</View>
							</View>
						</CardItem>
					</Card>

					{this.state.loading && <Spinner /> }


						{this._renderSoDoGiuong(this.state.results, 1).length > 0 &&
							<Card style={styles.paddingContent}>
								<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
									<Text style={{fontSize: 20}}>Tầng 1</Text>
								</CardItem>

								<CardItem>
									<View>
									{this._renderSoDoGiuong(this.state.results, 1)}
									{this._renderSoDoGiuong(this.state.results, 3).length > 0 &&
										this._renderSoDoGiuong(this.state.results, 3)
									}
									</View>
								</CardItem>
							</Card>
						}

						{this._renderSoDoGiuong(this.state.results, 2).length > 0 &&
							<Card style={styles.paddingContent}>
								<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
									<Text style={{fontSize: 20}}>Tầng 2</Text>
								</CardItem>

								<CardItem>
									<View>
									{this._renderSoDoGiuong(this.state.results, 2)}
									{this._renderSoDoGiuong(this.state.results, 4).length > 0 &&
										this._renderSoDoGiuong(this.state.results, 4)
									}
									</View>
								</CardItem>
							</Card>
						}

						{this._renderSoDoGiuong(this.state.results, 5).length > 0 &&
							<Card style={styles.paddingContent}>
								<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
									<Text style={{fontSize: 20}}>Ghế Sàn</Text>
								</CardItem>

								<CardItem>
									<View>
									{this._renderSoDoGiuong(this.state.results, 5)}
									</View>
								</CardItem>
							</Card>
						}


				</ScrollView>

				<Modal style={[styles.modal, styles.modalPopup]} position={"top"} ref={"modalPopup"} isDisabled={this.state.isDisabled}>
					{this.state.loadingModal? <Spinner /> : (this._renderModalBen(this.state.resultsBen))}
				</Modal>

				<Modal style={[styles.modalAction, styles.modalPopupAction]} position={"center"} ref={"modalPopupAction"} isDisabled={this.state.isDisabled}>
					{this.state.loadingModalAction? <Spinner /> : (this._renderButtonAction())}
				</Modal>

				<View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>
					<TouchableOpacity style={[styles.styleTabbars, {flex: 4}]}>
						<Text style={{color: 'red'}}>Trên Xe</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => Actions.ViewDanhSachGoi({title: 'Danh sách Gọi', data}) } style={[styles.styleTabbars, {flex: 4}]}>
						<Text>Gọi</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => Actions.DanhSachCho({title: 'Đang Chờ', data})} style={[styles.styleTabbars, {flex: 4}]}>
						<Text>Đang Chờ</Text>
						{this.state.notifiCountDanhSachCho > 0 && <View style={styles.countDanhSachCho}><Text style={{color: '#fff'}}>{this.state.notifiCountDanhSachCho}</Text></View>}
					</TouchableOpacity>
					<TouchableOpacity style={[styles.styleTabbars, {flex: 1}]} onPress={() => this._handleDropdown()}>
						<Icon name="ios-more" />
						{this.state.showDropdown && <View style={{position: 'absolute', width: 250, bottom: 55, right: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: '#fff', shadowOffset: {width: 0, height: 2}, shadowRadius: 2, shadowOpacity: 0.1, shadowColor: 'black'}}>
							<View style={{flexDirection: 'row', margin: 10}}>
								<Text onPress={() => [Actions.ViewDanhSachHuy({title: 'Danh sách hủy vé', data}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Hủy Vé</Text>
								<TouchableOpacity style={{flex: 1,backgroundColor: '#ff4500', width: 20, marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-close-circle-outline" style={{color: '#fff'}} /></TouchableOpacity>
							</View>
							<View style={{flexDirection: 'row', margin: 10}}>
								<Text onPress={() => [Actions.ViewDanhSachDaXuongXe({title: 'Danh sách xuống xe', data}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Xuống Xe</Text>
								<TouchableOpacity style={{flex: 1,backgroundColor: '#00bfff', width: 20, marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-cloud-done-outline" style={{color: '#fff'}} /></TouchableOpacity>
							</View>
						</View>}
					</TouchableOpacity>
				</View>
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
		let dataGiuong = this.state.arrActive[this.state.currentIdGiuong];
		let html = [];
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
		return html;
	}

	_handleThemVe() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		this.closeModalAction();
		this.setState({
			themVe: {
				check: true,
				keyDiemDi: dataGiuong.bvv_bex_id_a,
				keyDiemDen: dataGiuong.bvv_bex_id_b,
				totalPriceInt: dataGiuong.bvv_price
			}
		});
	}

	_handleHuyVeCurrent() {
		let arrThemve = this.state.arrThemve;
		let setStatus = this.state.arrActive;
		this.closeModalAction();
		for(var i = 0; i < arrThemve.length; i++) {
			let numberGiuong = arrThemve[i].bvv_number;
			if(this.state.currentIdGiuong == numberGiuong) {
				setStatus[numberGiuong].bvv_status = 0;
				setStatus[numberGiuong].bvv_bex_id_a = '';
				setStatus[numberGiuong].bvv_bex_id_b = '';
				setStatus[numberGiuong].bvv_price = '';
				arrThemve.splice(i, 1);
				break;
			}
		}
		this.setState({
			arrThemve: arrThemve,
			arrActive: setStatus
		});
	}

	_handleThemVeDone() {
		let that = this;
		let dataThemVe = this.state.themVe;
		fetch(domain+'/api/api_adm_them_ve.php?type=insert&diem_a='+dataThemVe.keyDiemDi+'&diem_b='+dataThemVe.keyDiemDen+'&price='+dataThemVe.totalPriceInt+'&arrDataGiuong='+JSON.stringify(this.state.arrThemve)+'&idAdm='+this.state.infoAdm.adm_id, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			that.setState({
				themVe: [],
				arrThemve: []
			});
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
		fetch(domain+'/api/api_adm_so_do_giuong_update.php?type=lenxe&bvv_id='+dataGiuong.bvv_id+'&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&bvv_number='+dataGiuong.bvv_number+'&idAdm='+this.state.infoAdm.adm_id, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			let setStatus = that.state.arrActive;
			setStatus[this.state.currentIdGiuong].bvv_status = 11;
			that.setState({
				arrActive: setStatus,
				loadingModalAction: false
			});

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
		let params = '?type=xuongxe&bvv_id='+dataGiuong.bvv_id+'&idAdm='+this.state.infoAdm.adm_id;
		fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {

			let setStatus = that.state.arrActive;
			setStatus[this.state.currentIdGiuong].bvv_status = 0;
			that.setState({
				arrActive: setStatus,
				loadingModalAction: false
			});


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
		let params = '?type=huyve&bvv_id='+dataGiuong.bvv_id+'&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&bvv_number='+dataGiuong.bvv_number+'&day='+this.props.data.day+'&bvv_bex_id_a='+dataGiuong.bvv_bex_id_a+'&bvv_bex_id_b='+dataGiuong.bvv_bex_id_b+'&bvv_price='+dataGiuong.bvv_price+'&bvv_number='+this.state.currentIdGiuong+'&idAdm='+this.state.infoAdm.adm_id;
		fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {

			let setStatus = that.state.arrActive;
			setStatus[this.state.currentIdGiuong].bvv_status = 0;
			that.setState({
				arrActive: setStatus,
				loadingModalAction: false
			});


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
		let params = '?type=chuyenchoo&bvv_bvn_id_can_chuyen='+dataGiuong.bvv_bvn_id+'&bvv_id_can_chuyen='+dataGiuong.bvv_id+'&idAdm='+this.state.infoAdm.adm_id;
		fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {

			let setStatus = that.state.arrActive;
			setStatus[this.state.bvv_number_muon_chuyen].bvv_status = setStatus[this.state.currentIdGiuong].bvv_status;
			setStatus[this.state.currentIdGiuong].bvv_status = 0;
			that.setState({
				arrActive: setStatus,
				loadingModalAction: false,
				bvv_id_can_chuyen: 0,
				bvv_bvn_id_muon_chuyen: 0,
				bvv_number_muon_chuyen: 0,
				notifiCountDanhSachCho: this.state.notifiCountDanhSachCho+1
			});


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
		let params = '?type=chuyenvaocho&bvv_bvn_id_muon_chuyen='+this.state.bvv_bvn_id_muon_chuyen+'&bvv_number_muon_chuyen='+this.state.bvv_number_muon_chuyen+'&bvh_id_can_chuyen='+that.props.data.bvh_id_can_chuyen+'&day='+this.props.data.day+'&idAdm='+this.state.infoAdm.adm_id;
		fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {

			let setStatus = that.state.arrActive;
			setStatus[this.state.nameGiuong].bvv_status = 1;
			that.setState({
				arrActive: setStatus,
				notifiCountDanhSachCho: this.state.notifiCountDanhSachCho-1,
				loadingModal: false
			});
			that.props.data.bvh_id_can_chuyen = 0;

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
		fetch(domain+'/api/api_adm_ben.php?type=update&notId='+this.props.data.notId+'&notTuyenId='+this.props.data.notTuyenId+'&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&bvv_id='+dataGiuong.bvv_id+'&bvv_number='+dataGiuong.bvv_number+'&day='+this.props.data.day, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			that.setState({
				status: responseJson.status,
				resultsBen: responseJson.dataBen,
				bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
				bvv_number_muon_chuyen: dataGiuong.bvv_number,
				nameDiemDi: responseJson.nameDiemDi,
				nameDiemDen: responseJson.nameDiemDen,
				keyDiemDi: responseJson.keyDiemDi,
				keyDiemDen: responseJson.keyDiemDen,
				totalPriceInt: responseJson.totalPrice,
				loadingModal: false
			});
			return responseJson;
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
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10
	},
	borderCol: {
		height: 100,
		borderWidth: 1,
		borderColor: '#d6d7da',
		marginRight: 5,
		marginBottom: 5
	},
	nullBorderCol: {
		height: 100,
		borderWidth: 1,
		borderColor: '#d6d7da',
		marginRight: 5,
		marginBottom: 5,
		backgroundColor: '#d6d7da'
	},
	opacityBg: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	disabled: {
		backgroundColor: 'red'
	},
	activeGiuong: {
		backgroundColor: '#ffa500',
	},
	activeLenXe: {
		backgroundColor: '#5fb760',
	},
	activeThanhToan: {
		backgroundColor: '#60c0dc',
	},
	textActiveGiuong: {
		color: '#ffffff'
	},
	textRightGiuong: {
		fontSize: 10,
		lineHeight: 10,
		position: 'absolute',
		right: 5,
		top: 5
	},
	textCenter: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 13
	},
	textLeft: {
		fontSize: 13,
		alignItems: 'flex-start',
		width: 80
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
		alignItems: 'center',
		top: 80,
		paddingRight: 20,
		paddingLeft: 20
	},
	modalPopup: {
		height: 300,
		width: 300
	},
	modalAction: {
		alignItems: 'center',
		paddingRight: 20,
		paddingLeft: 20
	},
	modalPopupAction: {
		height: 360,
		width: 300
	},
	marginTopButton: {
		marginTop: 20
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
	}
});

export default ViewSoDoGiuong
