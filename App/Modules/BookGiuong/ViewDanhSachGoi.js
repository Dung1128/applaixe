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
import Communications from 'react-native-communications';
import ComSDGFooter from './ComSDGFooter';

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
				did_id: this.props.dataParam.did_id
			}
			let data = await fetchData('api_sdg_danh_sach', params, 'GET');
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}else {
				this.setState({
					results: data.arrDanhSach,
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
		let dataParam = {
			did_id: this.props.dataParam.did_id,
			countCho: this.props.dataParam.countCho
		};
		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={{alignItems: 'center', backgroundColor: '#f3f3f3'}}>
						<Text style={{padding: 10, marginTop: 10}}>Danh sách gọi</Text>
					</View>
					{this.state.loading && <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View> }
					{!this.state.loading && dataDanhSach.length > 0 &&
						<Card style={{marginTop:0}} dataArray={dataDanhSach}
						  renderRow={(dataDanhSach) =>
						 	<CardItem>
								<TouchableOpacity onPress={() => Communications.phonecall(dataDanhSach.info.bvv_phone, true)} style={[styles.opacityBg]}>
									<View style={{flex: 5}}>
										<Text>Họ tên: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.info.bvv_ten_khach_hang}</Text></Text>
										<Text>SĐT: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.info.bvv_phone}</Text></Text>
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

export default ViewDanhSachGoi
