import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  View,
  Dimensions
} from 'react-native';
import {domain, cache} from '../../Config/common';
import { Container, Content, InputGroup, Icon, Text, Input, Button, Spinner, Card, CardItem } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';

const heightDevice = Dimensions.get('window').height;

class ViewSoDoGiuongCho extends Component {

   constructor(props) {
      super(props);
		this.state = {
			loading: true,
			results: [],
			tenGiuong: []
		};
   }

	_getDanhSachCho() {
		this.setState({
			loading: true
		});
		var that = this;
      fetch(domain+'/api/api_adm_danh_sach_cho.php?not_id='+this.props.data.notId+'&day='+this.props.data.day, {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
			that.setState({
				results: responseJson.arrDanhSach,
				tenGiuong: responseJson.ten_giuong,
				loading: false
			});
      })
      .catch((error) => {
         console.error(error);
      });
   }

	componentWillMount() {
		this._getDanhSachCho();
	}

	_TimCho(bvh_id_can_chuyen, nameGiuongXepCho, price, diemA, diemB, fullName, phone) {
		let data = {
			chuyenVaoCho: true,
			nameGiuongXepCho: nameGiuongXepCho,
			bvh_id_can_chuyen: bvh_id_can_chuyen,
			fullName: fullName,
			phone: phone,
			notId: this.props.data.notId,
			day:this.props.data.day,
			notTuyenId: this.props.data.notTuyenId,
			bvv_price: price, bvv_bex_id_a: diemA,
			bvv_bex_id_b: diemB,
			bien_kiem_soat: this.props.data.bien_kiem_soat,
			laixe1: this.props.data.laixe1,
			laixe2: this.props.data.laixe2,
			tiepvien: this.props.data.tiepvien,
			adm_id: this.props.data.adm_id,
			tuy_ten: this.props.data.tuy_ten,
			did_gio_xuat_ben_that: this.props.data.did_gio_xuat_ben_that,
			did_so_cho_da_ban: this.props.data.did_so_cho_da_ban,
			tong_so_cho: this.props.data.tong_so_cho
		};
		Actions.ViewSoDoGiuong({data});
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
			adm_id: this.props.data.adm_id
		};
      return(
			<View style={styles.container}>
				<ScrollView>
					<View style={{alignItems: 'center'}}>
						<Text style={{padding: 10, marginTop: 10}}>Danh sách chờ</Text>
					</View>
					{this.state.loading && <Spinner /> }
					{dataDanhSach.length > 0 &&
						<Card dataArray={dataDanhSach}
						  renderRow={(dataDanhSach) =>
						 	<CardItem>
								<TouchableOpacity onPress={this._TimCho.bind(this, dataDanhSach.info.bvh_id, this.state.tenGiuong[dataDanhSach.info.bvv_number].sdgct_label_full, dataDanhSach.info.bvv_price, dataDanhSach.info.bvv_bex_id_a, dataDanhSach.info.bvv_bex_id_b, dataDanhSach.info.bvv_ten_khach_hang, dataDanhSach.info.bvv_phone)} style={[styles.opacityBg]}>
									<View style={{flex: 5}}>
										<Text>Họ tên: {dataDanhSach.info.bvv_ten_khach_hang}</Text>
										<Text>Số điện thoại: {dataDanhSach.info.bvv_phone}</Text>
										<Text>Giường đã đặt: {this.state.tenGiuong[dataDanhSach.info.bvv_number].sdgct_label_full}</Text>
										<Text>Điểm đi - Điểm đến: {dataDanhSach.ben_a + ' -> ' + dataDanhSach.ben_b}</Text>
										<Text>Giá: {dataDanhSach.info.bvv_price + ' VNĐ'}</Text>
									</View>
									<View style={{flex: 2, backgroundColor: '#74c166', height: 50, marginTop: 30, padding: 10, justifyContent: 'center',alignItems: 'center'}}>
										<Text style={{color: '#fff'}}>Xếp Chỗ</Text>
									</View>
								</TouchableOpacity>
					 		</CardItem>
						}>
				  		</Card>
			  		}
			  </ScrollView>

			  <View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>
				  <TouchableOpacity style={[styles.styleTabbars, {flex: 4}]} onPress={() => Actions.ViewSoDoGiuong({title: 'Trên Xe', data: {adm_id: this.props.data.adm_id, bien_kiem_soat: this.props.data.bien_kiem_soat, laixe1: this.props.data.laixe1, laixe2: this.props.data.laixe2, tiepvien: this.props.data.tiepvien, chuyenVaoCho: false, notId:this.props.data.notId, day:this.props.data.day, notTuyenId: this.props.data.notTuyenId,tuy_ten: this.props.data.tuy_ten, did_gio_xuat_ben_that: this.props.data.did_gio_xuat_ben_that, did_so_cho_da_ban: this.props.data.did_so_cho_da_ban, tong_so_cho: this.props.data.tong_so_cho}})}>
					  <Text style={styles.colorTabs}>Trên Xe</Text>
				  </TouchableOpacity>
				  <TouchableOpacity onPress={() => Actions.ViewDanhSachTra({title: 'Danh sách Gọi', data}) } style={[styles.styleTabbars, {flex: 4}]}>
					  <Text style={styles.colorTabs}>Trả Khách</Text>
				  </TouchableOpacity>
				  <TouchableOpacity style={[styles.styleTabbars, {flex: 4, borderBottomWidth:3, borderBottomColor: '#5fb760'}]}>
					  <Text style={{color: '#111'}}>Đang Chờ</Text>
					  {this.props.data.notifiCountDanhSachCho > 0 && <View style={styles.countDanhSachCho}><Text style={{color: '#fff'}}>{this.props.data.notifiCountDanhSachCho}</Text></View>}
				  </TouchableOpacity>
				  <TouchableOpacity style={[styles.styleTabbars, {flex: 1}]} onPress={() => this._handleDropdown()}>
					  <Icon name="ios-more" />

				  </TouchableOpacity>
			  </View>
			  {this.state.showDropdown &&
				  <View style={{backgroundColor: '#000', position: 'absolute', width: 250, bottom: 55, right: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: '#fff', shadowOffset: {width: 0, height: 2}, shadowRadius: 2, shadowOpacity: 0.1, shadowColor: 'black'}}>
					  <View style={{flexDirection: 'row', margin: 10}}>
						  <Text onPress={() => [ Actions.ViewDanhSachGoi({title: 'Danh sách Gọi', data}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Gọi</Text>
						  <TouchableOpacity style={{flex: 1,backgroundColor: '#00ced1', marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-call" style={{color: '#fff'}} /></TouchableOpacity>
					  </View>
					  <View style={{flexDirection: 'row', margin: 10}}>
						  <Text onPress={() => [Actions.ViewDanhSachHuy({title: 'Danh sách hủy vé', data}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Hủy Vé</Text>
						  <TouchableOpacity style={{flex: 1,backgroundColor: '#ff4500', marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-close-circle-outline" style={{color: '#fff'}} /></TouchableOpacity>
					  </View>
					  <View style={{flexDirection: 'row', margin: 10}}>
						  <Text onPress={() => [Actions.ViewDanhSachDaXuongXe({title: 'Danh sách xuống xe', data}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Xuống Xe</Text>
						  <TouchableOpacity style={{flex: 1,backgroundColor: '#00bfff', marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-cloud-done-outline" style={{color: '#fff'}} /></TouchableOpacity>
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

export default ViewSoDoGiuongCho
