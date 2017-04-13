import React, { Component, PropTypes } from 'react';
import {
   AppRegistry,
   StyleSheet,
   Dimensions,
   TextInput,
	View,
	ScrollView,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';
import {domain, cache} from '../../Config/common';
import { Text, Button, Card, CardItem, Spinner, Icon, Thumbnail } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import {Actions} from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Col, Row, Grid } from "react-native-easy-grid";
import StorageHelper from '../../Components/StorageHelper';
const heightDevice = Dimensions.get('window').height;
import fetchData from '../../Components/FetchData';

class HomeIOS extends Component {
   constructor(props) {
      super(props);
      let date = new Date();
      this.state = {
         date: date,
         day: date.getDate(),
         month: (date.getMonth()+1),
         year: date.getFullYear(),
         fullDate: date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear(),
         WEEKDAYS: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
         MONTHS: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7',
         'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
         results: [],
         showDatePicker: false,
         optionSelect: '',
         arrSoDoGiuong: [],
         loading: true,
			isDisabled: false,
			currentId: 1,
			tabActive : 1,
			token: '',
			admInfo: []
      };
   }

   onDateChange(date) {
      let currentSelectDate = date.date;
      this.setState({
         date: currentSelectDate,
         day: currentSelectDate.getDate(),
         month: (currentSelectDate.getMonth()+1),
         year: currentSelectDate.getFullYear(),
         fullDate: currentSelectDate.getDate()+'-'+(currentSelectDate.getMonth()+1)+'-'+currentSelectDate.getFullYear()
      });
		this.closeModal();
   }

   _setDatePickerShow() {
      this.setState({
         showDatePicker: true
      });
		this.openModal();
   }

   _renderDatePicker() {
      return (
         <CalendarPicker
            selectedDate={this.state.date}
            onDateChange={(date) => this.onDateChange({date})}
            months={this.state.MONTHS}
            weekdays={this.state.WEEKDAYS}
            previousTitle='Tháng trước'
            nextTitle='Tháng sau'
            screenWidth={Dimensions.get('window').width}
            selectedBackgroundColor={'#5ce600'} />
      );
   }

   _renderNot(tabActive) {
      let countData = this.state.results.length,
			 results = this.state.results,
			 html = [],
			 htmlChild = [];

			if(countData < 1) {
			 	htmlChild.push(
		 			<CardItem key="data_null">
		 				<View>
		 					<Text>Chưa có chuyến nào!</Text>
		 				</View>
		 			</CardItem>
		 		);
			}
      for(var i = 0; i < countData; i++) {
			let dataNot			= results[i];
			let did_id			= dataNot.did_id;
			let currentId		= dataNot.currentId;
			let not_chieu_di	= dataNot.not_chieu_di;
			let dataParam = {
				did_id: did_id,
				chuyenVaoCho: false
			};
			let showData		= 0;
			if(tabActive == 1 || tabActive == 2) {
				if(not_chieu_di == tabActive) {
					showData	= 1;
				}
			}else {
				if(currentId == 1) {
					showData	= 1;
				}
			}

			if(showData == 1){
				htmlChild.push(
					<CardItem key={i} style={{shadowOpacity: 0, shadowColor: 'red'}} onPress={() => Actions.ViewSoDoGiuong({title: 'Trên Xe', dataParam})}>
						<View style={{flex:1}}>
							<Text style={{fontWeight: 'bold'}}>{dataNot.did_gio_dieu_hanh+' ← ' +dataNot.did_gio_xuat_ben_that}</Text>
							{dataNot.bien_kiem_soat != '' && dataNot.bien_kiem_soat != null &&
								<Text>Biển kiểm soát: <Text style={{fontWeight: 'bold'}}>{dataNot.bien_kiem_soat}</Text></Text>
							}
							<Text>{dataNot.tuy_ten}</Text>
							{dataNot.did_loai_xe == 1 &&
								<View style={{position: 'absolute', right: 0, top: 0, width: 60,height:60}}>
									<Thumbnail size={60} source={require('../../Skin/Images/vip.png')} />
								</View>
							}
						</View>
					</CardItem>
				);
			}

      }

		html.push(<Card key="group_card" style={{marginTop: 0}}>{htmlChild}</Card>);
      return html;
   }

	async componentWillMount() {

		let results = await StorageHelper.getStore('infoAdm');
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;

		this.setState({
			admInfo: results,
			token: token,
			loading: true
		});

		try {
			let params = {
				token: token,
				day: this.state.fullDate,
				adm_id: admId
			};
			let data = await fetchData('api_list_chuyen', params, 'GET');
			if(data.status == 200) {
				this.setState({
	            results: data.so_do_giuong
	         });
			}

		} catch (e) {
			console.error(e);
		}
		this.setState({
			loading: false
		});
	}

   async _getNot() {
		this.setState({
			loading: true
		});
		let params = {
			token: this.state.token,
			day: this.state.fullDate,
			adm_id: this.state.admInfo.adm_id,
		}

		try {
			let data = await fetchData('api_list_chuyen', params, 'GET');
			if(data.status == 200) {
				this.setState({
					results: data.so_do_giuong
				});
			}
			this.setState({
				loading: false
			});
		} catch (e) {
			this.setState({
				loading: false
			});
			console.error(e);
		}

   }

	openModal(id) {
		this.refs.modal3.open();
	}

	closeModal(id) {
		this.refs.modal3.close();
	}

	setDropdown() {
		if(this.state.dropdown) {
			this.setState({dropdown: false});
		}else {
			this.setState({dropdown: true});
		}
	}

   render() {
		let activeTab1 = 'activeTab',
			activeTab2 = '',
			activeTab3 = '';
			let tabActive	= this.state.tabActive;
			if(tabActive == 1) {
				activeTab1 = 'activeTab';
				activeTab2 = '';
				activeTab3 = '';
			}else if(tabActive == 2) {
				activeTab1 = '';
				activeTab2 = 'activeTab';
				activeTab3 = '';
			}else if(tabActive == 3) {
				activeTab1 = '';
				activeTab2 = '';
				activeTab3 = 'activeTab';
			}

      return(
         <View style={[styles.container]}>
				<View style={{flexDirection: 'row', padding: 10}}>
					<Text style={{flex: 3, width: 200, borderWidth:1, borderColor:'#ccc', padding:10, height:45}} onPress={() => this._setDatePickerShow()}>{this.state.fullDate}</Text>
					<TouchableOpacity style={{flex: 1, borderRadius: 0, width: 70, backgroundColor: '#1e90ff', height: 45, alignItems: 'center', justifyContent: 'center'}} onPress={() => {this._getNot()}}>
						<Icon name="ios-search" style={{color: '#fff'}} />
					</TouchableOpacity>
				</View>
				<View style={{backgroundColor: '#777'}}>
					<View style={{flexDirection: 'row'}}>
						<View style={[styles[activeTab1], {flex: 3, alignItems: 'center', justifyContent: 'center'}]}>
							<TouchableOpacity style={{flex: 4, padding: 15, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.setState({tabActive: 1})}>
								<Text style={{color: '#fff'}}>Chiều đi</Text>
							</TouchableOpacity>
						</View>
						<View style={[styles[activeTab2], {flex: 3}]}>
							<TouchableOpacity style={{padding: 15, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.setState({tabActive: 2})}>
								<Text style={{color: '#fff'}}>Chiều về</Text>
							</TouchableOpacity>
						</View>
						<View style={[styles[activeTab3], {flex: 3}]}>
							<TouchableOpacity style={{padding: 15, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.setState({tabActive: 3})}>
								<Text style={{color: '#fff'}}>Của tôi</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<ScrollView>
					{ this.state.loading && <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View> }
					{ !this.state.loading && this._renderNot(this.state.tabActive) }
			  	</ScrollView>

			  	<Modal style={[styles.modal, styles.modalPopup, {paddingTop: 50}]} position={"top"} ref={"modal3"} isDisabled={this.state.isDisabled}>
					<TouchableOpacity onPress={() => this.closeModal()} style={{width: 50, height: 40, position: 'absolute', right: 0, top: 0, padding: 10}}>
						<Icon name="ios-close-circle" />
					</TouchableOpacity>
			  		{this._renderDatePicker()}
	        	</Modal>
         </View>
      );
   }
}


const styles = StyleSheet.create({
   container: {
		flex: 1,
      marginTop: 64,
      position: 'relative'
   },
   contentAbsolute: {
      position: 'absolute',
      top: 0
   },
   selectedDate: {
      backgroundColor: 'rgba(0,0,0,0)',
      color: '#000',
   },
	modal: {
		alignItems: 'center',
		top: 80,
		paddingRight: 20,
		paddingLeft: 20
	},
	modalPopup: {
	},
	activeTab: {
		backgroundColor: '#ffca6b'
	},
	activeDiVe: {
		color: '#55afff'
	},
	noActiveDiVe: {
		color: '#fff'
	}
});

export default HomeIOS
