import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,StyleSheet,AsyncStorage,TouchableOpacity,
  	ScrollView,View,Dimensions
} from 'react-native';
import {domain, cache} from '../../Config/common';
import fetchData from '../../Components/FetchData';
import StorageHelper from '../../Components/StorageHelper';
import Common from '../../Components/Common';
import { Container, Content, InputGroup, Icon, Text, Input, Button, Spinner, Card, CardItem } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
import ComSDGFooter from './ComSDGFooter';

const heightDevice = Dimensions.get('window').height;

class ViewSoDoGiuongCho extends Component {

   constructor(props) {
      super(props);
		this.state = {
			loading: true,
			results: [],
			infoDid: [],
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
				did_id: this.props.dataParam.did_id
			}
			let data = await fetchData('api_danh_sach_cho', params, 'GET');
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}else {
				this.setState({
					results: data.arrDanhSach,
					infoDid: data.info,
					tenGiuong: data.ten_giuong
				});
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

	_TimCho(dataGiuong) {
		let dataParam = {
			chuyenVaoCho: true,
			nameGiuongXepCho: this.state.tenGiuong[dataGiuong.bvv_number].sdgct_label_full,
			bvh_id_can_chuyen: dataGiuong.bvh_id,
			fullName: dataGiuong.bvv_ten_khach_hang,
			phone: dataGiuong.bvv_phone,
			huy: false,
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
		let dataDanhSach = this.state.results;
		let dataParam = {
			did_id: this.props.dataParam.did_id,
			countCho: this.props.dataParam.countCho
		};
      return(
			<View style={styles.container}>
				<ScrollView>
					<View style={{alignItems: 'center', backgroundColor: '#f3f3f3'}}>
						<Text style={{padding: 10, marginTop: 10}}>Danh sách chờ</Text>
					</View>
					{this.state.loading && <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View> }
					{!this.state.loading && dataDanhSach.length > 0 &&
						<Card style={{marginTop:0}} dataArray={dataDanhSach}
						  renderRow={(dataDanhSach) =>
						 	<CardItem>
								<TouchableOpacity onPress={this._TimCho.bind(this, dataDanhSach.info)} style={[styles.opacityBg]}>
									<View style={{flex: 5}}>
										<Text>Họ tên: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.info.bvv_ten_khach_hang}</Text></Text>
										<Text>SĐT: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.info.bvv_phone}</Text></Text>
										<Text>Giường: <Text style={{fontWeight: 'bold'}}>{this.state.tenGiuong[dataDanhSach.info.bvv_number].sdgct_label_full}</Text></Text>
										<Text style={{fontWeight: 'bold'}}>{dataDanhSach.ben_a + ' -> ' + dataDanhSach.ben_b}</Text>
										<Text>Điểm đón: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.info.bvv_diem_don_khach}</Text></Text>
										<Text>Giá: <Text style={{fontWeight: 'bold'}}>{Common.formatPrice(dataDanhSach.info.bvv_price) + ' VNĐ'}</Text></Text>
									</View>
									<View style={{flex: 2, backgroundColor: '#74c166', height: 50, marginTop: 30, padding: 10, justifyContent: 'center',alignItems: 'center'}}>
										<Text style={{color: '#fff'}}>Xếp Chỗ</Text>
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

});

export default ViewSoDoGiuongCho
