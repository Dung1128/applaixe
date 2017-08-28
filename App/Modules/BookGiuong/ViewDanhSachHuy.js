import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,StyleSheet,AsyncStorage,
  TouchableOpacity,ScrollView,View,Dimensions
} from 'react-native';
import {domain, cache} from '../../Config/common';
import fetchData from '../../Components/FetchData';
import StorageHelper from '../../Components/StorageHelper';
import Common from '../../Components/Common';
import { Container, Content, InputGroup, Icon, Text, Input, Button, Spinner, Card, CardItem } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
import ComSDGFooter from './ComSDGFooter';
import isConnected from '../../Components/CheckNet';

const heightDevice = Dimensions.get('window').height;

class ViewDanhSachHuy extends Component {

	constructor(props) {
      super(props);
		this.state = {
			loading: true,
			arrVeHuy: [],
			infoAdm: []
		};
   }

	async _getDanhSachCho(token, admId) {
		this.setState({
			loading: true
		});
		let sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet
		});
		let did_id					= this.props.dataParam.did_id;
		var nameStoreArrVeHuy	= 'arrVeHuy' + did_id;
		var dataVeHuy				= [];
		if(this.state.sttInternet != false){
			try {
				let params = {
					token: token,
					adm_id: admId,
					did_id: did_id
				}
				let data = await fetchData('api_sdg_danh_sach_huy', params, 'GET');
				if(data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
				}else{
					dataVeHuy	= data.arrData;
				}
			} catch (e) {
				console.log(e);
			}
		}else{
			let storeVeHuy = await AsyncStorage.getItem(nameStoreArrVeHuy);
			dataVeHuy 	= JSON.parse(storeVeHuy);
		}
		this.setState({
			arrVeHuy: dataVeHuy,
			loading: false
		});
		//Luu store
		var result = JSON.stringify(dataVeHuy);
		AsyncStorage.removeItem(nameStoreArrVeHuy);
		AsyncStorage.setItem(nameStoreArrVeHuy, result);

   }

	async componentWillMount() {
		let results = await StorageHelper.getStore('infoAdm');
		results 		= JSON.parse(results);
		let admId 	= results.adm_id;
		let token 	= results.token;
		let data 	= [];
		this.setState({
			infoAdm: results,
			token: token,
			loading: true
		});
		this._getDanhSachCho(token, admId);
	}

	_TimCho(dataGiuong) {
		let dataParam = {
			chuyenVaoCho: true,
			nameGiuongXepCho: dataGiuong.sdgct_label_full,
			bvh_id_can_chuyen: dataGiuong.bvh_id,
			fullName: dataGiuong.bvv_ten_khach_hang,
			phone: dataGiuong.bvv_phone,
			huy: true,
			bvv_price: dataGiuong.bvv_price,
			bvv_bex_id_a: dataGiuong.bvv_bex_id_a,
			bvv_bex_id_b: dataGiuong.bvv_bex_id_b,
			bvv_trung_chuyen_a: dataGiuong.bvv_trung_chuyen_a,
			bvv_trung_chuyen_b: dataGiuong.bvv_trung_chuyen_b,
			bvv_diem_don_khach: dataGiuong.bvv_diem_don_khach,
			bvv_diem_tra_khach: dataGiuong.bvv_diem_tra_khach,
			did_id: this.props.dataParam.did_id
		};
		Actions.ViewSoDoGiuong({dataParam});
	}

	render() {
		let dataDanhSach = this.state.arrVeHuy;
		let dataParam = {
			did_id: this.props.dataParam.did_id,
			countCho: this.props.dataParam.countCho
		};
		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={{alignItems: 'center', backgroundColor: '#f3f3f3'}}>
						<Text style={{padding: 10, marginTop: 10}}>Danh sách hủy</Text>
					</View>
					{this.state.loading && <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View> }
					{!this.state.loading && dataDanhSach.length > 0 &&
						<Card style={{marginTop:0}} dataArray={dataDanhSach}
							  renderRow={(dataDanhSach) =>
							 	<CardItem>
									<TouchableOpacity onPress={this._TimCho.bind(this, dataDanhSach)} style={[styles.opacityBg]}>
										<View style={{flex: 5}}>
											<Text>Họ tên: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.bvv_ten_khach_hang}</Text></Text>
											<Text>SĐT: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.bvv_phone}</Text></Text>
											<Text>Giường: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.sdgct_label_full}</Text></Text>
											<Text style={{fontWeight: 'bold'}}>{dataDanhSach.ben_a + ' -> ' + dataDanhSach.ben_b}</Text>
											<Text>Giá: <Text style={{fontWeight: 'bold'}}>{Common.formatPrice(dataDanhSach.bvv_price) + ' VNĐ'}</Text></Text>
										</View>
										<View style={{flex: 2, backgroundColor: '#74c166', height: 50, marginTop: 30, padding: 10, justifyContent: 'center',alignItems: 'center'}}>
											<Text style={{color: '#fff'}}>Xếp chỗ</Text>
										</View>
									</TouchableOpacity>
						 		</CardItem>
							}>
					  </Card>
				  }
				  {dataDanhSach.length <= 0 &&
					  <View style={{alignItems: 'center', marginTop: 10}}><Text style={{color: 'red'}}>Hiện tại chưa có dữ liệu.</Text></View>
				  }
			  </ScrollView>
			  <ComSDGFooter dataParam={dataParam} />

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 58,
		height: heightDevice
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

export default ViewDanhSachHuy;


async function checkServerAlive() {
//    try {
//      let response = await fetch('http://hasonhaivan.vn/api/ping.php');
//      let responseJson = await response.json();
//      return true;
//    } catch(error) {
//       console.log(error);
//       return false;
//    }

	return await isConnected();

}
