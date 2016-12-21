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
import { Container, Content, InputGroup, Icon, Text, Input, Button, Spinner, Card, CardItem } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
import Communications from 'react-native-communications';

const heightDevice = Dimensions.get('window').height;
class ViewDanhSachTra extends Component {

	constructor(props) {
      super(props);
		this.state = {
			loading: true,
			results: [],
			tenGiuong: []
		};
   }

	_getDanhSachTra() {
		this.setState({
			loading: true
		});
		var that = this;
      fetch(domain+'/api/api_adm_get_danh_sach.php?type=tra&not_id='+this.props.data.notId+'&day='+this.props.data.day, {
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
		this._getDanhSachTra();
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

	_handleXuongXe(idBvv) {
		this.setState({
			loading: true
		});
		let that = this;
		let params = '?type=xuongxe&bvv_id='+idBvv+'&idAdm='+this.props.data.adm_id;
		fetch(domain+'/api/api_adm_so_do_giuong_update.php'+params, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			that._getDanhSachTra();
			that.setState({
				loading: false
			});
		})
		.catch((error) => {
			that.setState({
				loading: false
			});
			console.error(error);
		});
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
		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={{alignItems: 'center'}}>
						<Text style={{padding: 10, marginTop: 10}}>Danh sách trả khách</Text>
					</View>
					{this.state.loading && <Spinner /> }
					{dataDanhSach.length > 0 &&
						<Card dataArray={dataDanhSach}
						  renderRow={(dataDanhSach) =>
						 	<CardItem>
								<TouchableOpacity style={[styles.opacityBg]} onPress={() => this._handleXuongXe(dataDanhSach.info.bvv_id)}>
									<View style={{flex: 5}}>
										<Text>Họ tên: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.info.bvv_ten_khach_hang}</Text></Text>
										<Text>Số điện thoại: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.info.bvv_phone}</Text></Text>
										<Text>Tên Giường: <Text style={{fontWeight: 'bold'}}>{this.state.tenGiuong[dataDanhSach.info.bvv_number].sdgct_label_full}</Text></Text>
										<Text style={{fontWeight: 'bold'}}>{dataDanhSach.ben_a + ' -> ' + dataDanhSach.ben_b}</Text>
										<Text>Điểm trả: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.info.bvv_diem_tra_khach}</Text></Text>
									</View>
									<View style={{flex: 2, backgroundColor: '#74c166', height: 50, marginTop: 20, padding: 10, justifyContent: 'center',alignItems: 'center'}}>
										<Text style={{color: '#fff'}}>Xuống xe</Text>
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
				  <TouchableOpacity style={[styles.styleTabbars, {flex: 4, borderBottomWidth:3, borderBottomColor: '#5fb760'}]}>
					  <Text style={{color: '#111'}}>Trả Khách</Text>
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

export default ViewDanhSachTra
