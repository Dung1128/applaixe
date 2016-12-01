import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Dimensions,
	View,
	AsyncStorage
} from 'react-native';
import { Container, Content, Text, Button, Card, CardItem, Spinner } from 'native-base';
const domain = 'http://haivanexpress.com';

class SearchDiaDiem extends Component {

	constructor(props) {
		super(resultsBen);
		this.state = {
			resultsBen: [],
			infoAdm: []
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
		fetch(domain + '/api/api_adm_so_do_giuong.php?not_id='+this.props.data.notId+'&day='+this.props.data.day)
		.then((response) => response.json())
		.then((responseJson) => {
			that.setState({
				results:responseJson,
				arrVeNumber: responseJson.arrVeNumber,
				arrActive: responseJson.arrVeNumber,
				loading: false
			});
			return responseJson;
		})
		.catch((error) => {
			that.setState({
				loading: true
			});
			console.error(error);
		});
	}

	_renderModalBen(data) {
		let html = [],
		listItem1 = [],
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

		if(this.state.bvv_id_can_chuyen != 0) {
			html.push(<Button key="7" block info style={styles.marginTopButton} onPress={this._handleXacNhanChuyenCho.bind(this)}>Xác nhận Chuyển chỗ</Button>);
			html.push(<Button key="8" block info style={styles.marginTopButton} onPress={this._handleHuyChuyenCho.bind(this)}>Hủy Chuyển chỗ</Button>);
		}else {
			if(Object.keys(data).length > 0) {
				let dataGiuong = this.props.arrDataGiuong[this.props.currentIdGiuong],
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
					<Text key="1" style={{marginTop: 20}}>Điểm đi:</Text>
				);
				html.push(
					<ModalPicker
					key="2"
					data={listItem1}
					initValue="Chọn điểm đi"
					onChange={(option)=>{this.renderPriceBenDi(option)}}>
					<TextInput
					style={{borderWidth:1, borderColor:'#ccc', padding:10,  width: 200, height:30, marginTop: 10, marginBottom: 10}}
					editable={false}
					placeholder="Vui lòng chọn điểm đi"
					value={currentDiemDi} />
					</ModalPicker>
				);
				html.push(
					<Text key="3">Điểm đến:</Text>
				);
				html.push(
					<ModalPicker
					key="4"
					data={listItem2}
					initValue="Chọn điểm đến"
					onChange={(option)=>{this.renderPriceBenDen(option)}}>
					<TextInput
					style={{borderWidth:1, borderColor:'#ccc', padding:10,  width: 200, height:30, marginTop: 10, marginBottom: 10}}
					editable={false}
					placeholder="Vui lòng chọn điểm đến"
					value={currentDiemDen} />
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
		return html;
	}

	render() {
		return(
			<View style={styles.container}>
				<View style={styles.container1}>
					{this.state.loadingModal? <Spinner /> : (this._renderModalBen(this.state.resultsBen))}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000000',
		opacity:0.5
	},
	container1: {
		width: 300,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		opacity: 1
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
		color: '#ffffff'
	}
});

export default SearchDiaDiem
