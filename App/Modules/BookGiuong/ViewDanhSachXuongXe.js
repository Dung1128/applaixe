import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,StyleSheet,AsyncStorage,
  TouchableOpacity,ScrollView,View,Dimensions
} from 'react-native';
import {domain, cache, net} from '../../Config/common';
import fetchData from '../../Components/FetchData';
import StorageHelper from '../../Components/StorageHelper';
import Common from '../../Components/Common';
import { Container, Content, InputGroup, Icon, Text, Input, Button, Spinner, Card, CardItem } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
import ComSDGFooter from './ComSDGFooter';
import isConnected from '../../Components/CheckNet';

const heightDevice = Dimensions.get('window').height;

class ViewDanhSachXuongXe extends Component {

	constructor(props) {
      super(props);
		this.state = {
			loading: true,
			arrVeXuongXe: [],
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
		var nameStoreArrVeXuongXe	= 'arrVeXuongXe' + did_id;
		var dataVeXuongXe				= [];
		if(this.state.sttInternet != false){
			try {
				let params = {
					token: token,
					adm_id: admId,
					did_id: did_id
				}
				let data = await fetchData('api_sdg_danh_sach_xuong_xe', params, 'GET');
				if(data.status == 404) {
					alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
					Actions.welcome({type: 'reset'});
				}else {
					dataVeXuongXe	= data.arrData;
				}
			} catch (e) {
				console.log(e);
			}
		}else{
			let storeVeXuongXe = await AsyncStorage.getItem(nameStoreArrVeXuongXe);
			dataVeXuongXe 	= JSON.parse(storeVeXuongXe);
		}
		this.setState({
			arrVeXuongXe: dataVeXuongXe,
			loading: false
		});
		//Luu store
		var result = JSON.stringify(dataVeXuongXe);
		AsyncStorage.removeItem(nameStoreArrVeXuongXe);
		AsyncStorage.setItem(nameStoreArrVeXuongXe, result);

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


	render() {
		let dataDanhSach = this.state.arrVeXuongXe;
		let dataParam = {
			did_id: this.props.dataParam.did_id,
			countCho: this.props.dataParam.countCho
		};
		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={{alignItems: 'center', backgroundColor: '#f3f3f3'}}>
						<Text style={{padding: 10}}>Danh sách xuống xe</Text>
					</View>

					{this.state.loading && <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View> }
					{!this.state.loading && dataDanhSach.length > 0 &&
						<Card style={{marginTop:0}} dataArray={dataDanhSach}
						  renderRow={(dataDanhSach) =>
						 	<CardItem>
								<TouchableOpacity>
									<View style={{flex: 5}}>
										<Text>Họ tên: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.bvv_ten_khach_hang}</Text></Text>
										<Text>SĐT: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.bvv_phone}</Text></Text>
										<Text>Giường: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.sdgct_label_full}</Text></Text>
										<Text>Điểm đi - Điểm đến: <Text style={{fontWeight: 'bold'}}>{dataDanhSach.ben_a + ' -> ' + dataDanhSach.ben_b}</Text></Text>
										<Text>Giá: <Text style={{fontWeight: 'bold'}}>{Common.formatPrice(dataDanhSach.bvv_price) + ' VNĐ'}</Text></Text>
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

export default ViewDanhSachXuongXe;


async function checkServerAlive() {
	if (net == 0) {
        try {
            let response = await fetch(domain + '/api/ping.php');
            let responseJson = await response.json();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    else {
        return await isConnected();
    }

}
