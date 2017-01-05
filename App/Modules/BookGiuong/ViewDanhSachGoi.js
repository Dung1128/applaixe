import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  View,
  Dimensions,
} from 'react-native';
import {domain, cache} from '../../Config/common';
import fetchData from '../../Components/FetchData';
import StorageHelper from '../../Components/StorageHelper';
import * as Common from '../../Components/Common';
import { Container, Content, InputGroup, Icon, Text, Input, Button, Spinner, Card, CardItem } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
import Communications from 'react-native-communications';

const heightDevice = Dimensions.get('window').height;
class ViewDanhSachGoi extends Component {

	constructor(props) {
      super(props);
		this.state = {
			loading: true,
			results: [],
			tenGiuong: [],
			infoAdm: []
		};
   }

	async _getDanhSachCho(token, admId) {
		this.setState({
			loading: true
		});

		try {
			let params = {
				token: token,
				adm_id: admId,
				type: 'goi',
				not_id: this.props.data.notId,
				day: this.props.data.day,
			}
			let data = await fetchData('adm_get_danh_sach', params, 'GET');
			if(data.status != 404) {
				this.setState({
					results: data.arrDanhSach,
					tenGiuong: data.ten_giuong
				});
			}else if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}
		} catch (e) {
			console.log(e);
		} finally {
			this.setState({
				loading: false
			});
		}

   }

	async componentWillMount() {
		let results = await StorageHelper.getStore('infoAdm');
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;
		let data = [];
		this.setState({
			infoAdm: results,
			token: token,
			loading: true
		});

		this._getDanhSachCho(token, admId);
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

	ten_giuong(number) {
		let arrNumber = number.split(',');
		let newArrNumber = '';
		for(var i = 0; i < arrNumber.length; i++) {
			newArrNumber += this.state.tenGiuong[arrNumber[i]].sdgct_label_full+', ';
		}
		return(<Text>Giường đã đặt: <Text style={{fontWeight: 'bold'}}>{newArrNumber.trim(',')}</Text></Text>);
	}

	render() {
		let dataDanhSach = this.state.results;
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
		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={{alignItems: 'center'}}>
						<Text style={{padding: 10, marginTop: 10}}>Danh sách gọi</Text>
					</View>
					{this.state.loading && <Spinner /> }
					{dataDanhSach.length > 0 &&
						<Card dataArray={dataDanhSach}
						  renderRow={(dataDanhSach) =>
						 	<CardItem>
								<TouchableOpacity onPress={() => Communications.phonecall(dataDanhSach.info.bvv_phone, true)} style={[styles.opacityBg]}>
									<View style={{flex: 5}}>
										<Text>Họ tên: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.info.bvv_ten_khach_hang}</Text></Text>
										<Text>Số điện thoại: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.info.bvv_phone}</Text></Text>
										{this.ten_giuong(dataDanhSach.info.number)}
										<Text style={{fontWeight: 'bold'}}>{dataDanhSach.ben_a + ' -> ' + dataDanhSach.ben_b}</Text>
										<Text>Giá: <Text style={{fontWeight: 'bold'}}>{Common.formatPrice(dataDanhSach.info.bvv_price) + ' VNĐ'}</Text></Text>
									</View>
									<View style={{flex: 1, backgroundColor: '#74c166', height: 50, marginTop: 30, padding: 10, justifyContent: 'center',alignItems: 'center', borderRadius: 100}}>
										<Icon name="ios-call-outline" style={{color: '#fff'}} />
									</View>
								</TouchableOpacity>
					 		</CardItem>
						}>
				  		</Card>
					}
			  </ScrollView>
			  <View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>
				  <TouchableOpacity style={[styles.styleTabbars, {flex: 4}]} onPress={() => Actions.ViewSoDoGiuong({title: 'Trên Xe', data: {adm_id: this.props.data.adm_id, last_login: this.props.data.last_login, adm_name: this.props.data.adm_name, bien_kiem_soat: this.props.data.bien_kiem_soat, laixe1: this.props.data.laixe1, laixe2: this.props.data.laixe2, tiepvien: this.props.data.tiepvien, chuyenVaoCho: false, notId:this.props.data.notId, day:this.props.data.day, notTuyenId: this.props.data.notTuyenId,tuy_ten: this.props.data.tuy_ten, did_gio_xuat_ben_that: this.props.data.did_gio_xuat_ben_that, did_so_cho_da_ban: this.props.data.did_so_cho_da_ban, tong_so_cho: this.props.data.tong_so_cho}})}>
					  <Text style={styles.colorTabs}>Trên Xe</Text>
				  </TouchableOpacity>
				  <TouchableOpacity onPress={() => Actions.ViewDanhSachTra({title: 'Danh sách Gọi', data}) } style={[styles.styleTabbars, {flex: 4}]}>
					  <Text style={styles.colorTabs}>Trả Khách</Text>
				  </TouchableOpacity>
				  <TouchableOpacity onPress={() => Actions.DanhSachCho({title: 'Đang Chờ', data})} style={[styles.styleTabbars, {flex: 4}]}>
					  <Text style={styles.colorTabs}>Đang Chờ</Text>
					  {this.props.data.notifiCountDanhSachCho > 0 && <View style={styles.countDanhSachCho}><Text style={{color: '#fff'}}>{this.props.data.notifiCountDanhSachCho}</Text></View>}
				  </TouchableOpacity>
				  <TouchableOpacity style={[styles.styleTabbars, {flex: 1}]} onPress={() => this._handleDropdown()}>
					  <Icon name="ios-more" />
				  </TouchableOpacity>
			  </View>
			  {this.state.showDropdown &&
				  <View style={{backgroundColor: '#000', position: 'absolute', width: 250, bottom: 55, right: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: '#fff', shadowOffset: {width: 0, height: 2}, shadowRadius: 2, shadowOpacity: 0.1, shadowColor: 'black'}}>
					  <View style={{flexDirection: 'row', margin: 10}}>
						  <Text onPress={() => [ this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Gọi</Text>
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
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 58,
		height: heightDevice,
		paddingBottom: 50
	},
   marginButton: {
      marginTop: 10
   },
   paddingContent: {
      padding: 30
   },
	opacityBg: {
		flexDirection: 'row',
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
	colorTabs: {
		color: '#999'
	}
});

export default ViewDanhSachGoi
