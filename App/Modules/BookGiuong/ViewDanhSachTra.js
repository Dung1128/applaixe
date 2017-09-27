import React, { Component, PropTypes } from 'react';
import {
	AppRegistry, StyleSheet, AsyncStorage,
	TouchableOpacity, ScrollView, View, Dimensions,
} from 'react-native';
import {
	Container, Content, InputGroup, Icon, Text, Input,
	Button, Spinner, Card, CardItem
} from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import Communications from 'react-native-communications';
import { domain, cache } from '../../Config/common';
import fetchData from '../../Components/FetchData';
import StorageHelper from '../../Components/StorageHelper';
import ComSDGFooter from './ComSDGFooter';

const heightDevice = Dimensions.get('window').height;
class ViewDanhSachTra extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			results: [],
			tenGiuong: [],
			infoAdm: []
		};
	}

	async _getDanhSachTra(token, admId) {
		this.setState({
			loading: true
		});
		try {
			let params = {
				token: token,
				adm_id: admId,
				type: 'tra',
				did_id: this.props.dataParam.did_id
			}
			let data = await fetchData('api_sdg_danh_sach', params, 'GET');
			if (data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({ type: 'reset' });
			} else {
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
		console.log('infoAdm la:');
		console.log(this.props.data);
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;
		let data = [];
		this.setState({
			infoAdm: results,
			token: token,
			loading: true
		});

		this._getDanhSachTra(token, admId);
	}

	async _handleXuongXeAll(dataDanhSach) {
		if (dataDanhSach.length > 0) {
			for (let i = 0; i < dataDanhSach.length; i++) {
				this._handleXuongXe(dataDanhSach[i].info.bvv_id);
			}
		}
	}

	async _handleXuongXe(idBvv) {
		this.setState({
			loading: true
		});
		try {
			let params = {
				token: this.state.token,
				adm_id: this.state.infoAdm.adm_id,
				type: 'xuongxe',
				bvv_id: idBvv,
				idAdm: this.state.infoAdm.adm_id,
			}
			let data = await fetchData('adm_so_do_giuong_update', params, 'GET');
			if (data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({ type: 'reset' });
			} else {
				this._getDanhSachTra(this.state.token, this.state.infoAdm.adm_id);
			}
		} catch (e) {
			console.log(e);
		} finally {
			this.setState({
				loading: false
			});
		}
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
					<View style={{ backgroundColor: '#f3f3f3', flexDirection: 'row' }}>
						<Text style={{ flex: 1, padding: 10, marginTop: 10 }}>Danh sách trả khách</Text>
						<TouchableOpacity style={{flex: 1}} onPress={() => this._handleXuongXeAll(dataDanhSach)}>
							<View style={{ flex: 1, backgroundColor: '#74c166', height: 20, margin: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
								<Text style={{ color: '#fff' }}>Xuống xe tất cả</Text>
							</View>
						</TouchableOpacity>
					</View>
					{this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
					{!this.state.loading && dataDanhSach.length > 0 &&
						<Card style={{ marginTop: 0 }} dataArray={dataDanhSach}
							renderRow={(dataDanhSach) =>
								<CardItem>
									<TouchableOpacity style={[styles.opacityBg]} onPress={() => this._handleXuongXe(dataDanhSach.info.bvv_id)}>
										<View style={{ flex: 5 }}>
											<Text>Họ tên: <Text style={{ fontWeight: 'bold' }}>{dataDanhSach.info.bvv_ten_khach_hang}</Text></Text>
											<Text>SĐT: <Text style={{ fontWeight: 'bold' }}>{dataDanhSach.info.bvv_phone}</Text></Text>
											<Text>Giường: <Text style={{ fontWeight: 'bold' }}>{this.state.tenGiuong[dataDanhSach.info.bvv_number].sdgct_label_full}</Text></Text>
											<Text style={{ fontWeight: 'bold' }}>{dataDanhSach.ben_a + ' -> ' + dataDanhSach.ben_b}</Text>
											<Text>Điểm trả: <Text style={{ fontWeight: 'bold' }}>{dataDanhSach.info.bvv_diem_tra_khach}</Text></Text>
										</View>
										<View style={{ flex: 2, backgroundColor: '#74c166', height: 50, marginTop: 20, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
											<Text style={{ color: '#fff' }}>Xuống xe</Text>
										</View>
									</TouchableOpacity>
								</CardItem>
							}>
						</Card>
					}
					{dataDanhSach.length <= 0 &&
						<View style={{ alignItems: 'center', marginTop: 10 }}><Text style={{ color: 'red' }}>Hiện tại chưa có dữ liệu.</Text></View>
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

export default ViewDanhSachTra
