import React, {Component} from 'react';
import {View, StyleSheet,TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { Container, Content, Header, Title, Text, Icon, Input, InputGroup, Button, Card, CardItem, Spinner, Thumbnail } from 'native-base';

export default class ComSDGFooter extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			showDropdown: false,
		}
	}

	render(){
		let dataParam		= this.props.dataParam;
		let countCho		= dataParam.countCho;
		return(
			<View>
				<View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>
					<TouchableOpacity style={[styles.styleTabbars, {flex: 4}]} onPress={() => Actions.ViewSoDoGiuong({title: 'Trên Xe', dataParam})}>
					  <Text style={styles.colorTabs}>Trên Xe</Text>
				  </TouchableOpacity>
					<TouchableOpacity onPress={() => Actions.ViewDanhSachTra({title: 'Danh sách Gọi', dataParam}) } style={[styles.styleTabbars, {flex: 4}]}>
						<Text style={[styles.colorTabs]}>Trả Khách</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => Actions.DanhSachCho({title: 'Đang Chờ', dataParam})} style={[styles.styleTabbars, {flex: 4}]}>
						<Text style={[styles.colorTabs]}>Đang Chờ</Text>
						{countCho > 0 && <View style={styles.countDanhSachCho}><Text style={{color: '#fff'}}>{countCho}</Text></View>}
					</TouchableOpacity>
					<TouchableOpacity style={[styles.styleTabbars, {flex: 1}]} onPress={() => this._handleDropdown()}>
						<Icon name="ios-more" />
					</TouchableOpacity>
				</View>
				{this.state.showDropdown &&
					<View style={{backgroundColor: '#000', position: 'absolute', width: 250, bottom: 55, right: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: '#fff', shadowOffset: {width: 0, height: 2}, shadowRadius: 2, shadowOpacity: 0.1, shadowColor: 'black'}}>
						<View style={{flexDirection: 'row', margin: 10}}>
							<Text onPress={() => [ Actions.ViewDanhSachGoi({title: 'Danh sách Gọi', dataParam}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Gọi</Text>
							<TouchableOpacity style={{flex: 2,backgroundColor: '#00ced1', marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-call" style={{color: '#fff'}} /></TouchableOpacity>
						</View>
						<View style={{flexDirection: 'row', margin: 10}}>
							<Text onPress={() => [Actions.ViewDanhSachHuy({title: 'Danh sách hủy vé', dataParam}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Hủy Vé</Text>
							<TouchableOpacity style={{flex: 2,backgroundColor: '#ff4500', marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-close-circle-outline" style={{color: '#fff'}} /></TouchableOpacity>
						</View>
						<View style={{flexDirection: 'row', margin: 10}}>
							<Text onPress={() => [Actions.ViewDanhSachDaXuongXe({title: 'Danh sách xuống xe', dataParam}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Xuống Xe</Text>
							<TouchableOpacity style={{flex: 2,backgroundColor: '#00bfff', marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-cloud-done-outline" style={{color: '#fff'}} /></TouchableOpacity>
						</View>
					</View>
				}
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



}

ComSDGFooter.PropType	= {
	dataParam:React.PropTypes.Object,
}

const styles = StyleSheet.create({
	paddingContent: {
		marginLeft: 5,
		marginRight: 5,
		marginTop: 20
	},
	bold: {
		fontWeight: 'bold'
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
