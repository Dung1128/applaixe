import React, { Component } from 'react';
import {
   AppRegistry,
   StyleSheet,
   Dimensions,
   TextInput,
	View,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import {domain, cache} from '../../Config/common';
import { Text, Button, Card, CardItem, Spinner, Icon } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import {Actions} from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Col, Row, Grid } from "react-native-easy-grid";

const urlApi = domain+'/api/api_adm_so_do_giuong.php';

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
			type_not_chieu_di: 0
      }
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

   _renderNot(type) {
      let countData = this.state.results.length,
			 results = this.state.results,
			 html = [];
      for(var i = 0; i < countData; i++) {
			if(type == 0) {
				let data;
	         data = {
					notId: results[i].not_id,
					day: this.state.fullDate,
					notTuyenId: results[i].not_tuy_id,
					benA: results[i].tuy_ben_a,
					benB: results[i].tuy_ben_b,
					tuy_ten: results[i].tuy_ten,
					did_gio_xuat_ben_that: results[i].did_gio_xuat_ben_that,
					tong_so_cho: results[i].tong_so_cho,
					ten_so_do_giuong: results[i].ten_so_do_giuong,
					did_so_cho_da_ban: results[i].did_so_cho_da_ban
				};
				html.push(
					<Card key={i}>
		 		  		<CardItem onPress={() => Actions.ViewSoDoGiuong({title: 'Trên Xe', data})}>
					  		<Text>{results[i].did_gio_dieu_hanh+' ← ' +results[i].did_gio_xuat_ben_that+' | '+results[i].tuy_ten}</Text>
				 	  	</CardItem>
				  </Card>
				);
			}else {
				if(type == results[i].not_chieu_di) {
					let data;
		         data = {
						notId: results[i].not_id,
						day: this.state.fullDate,
						notTuyenId: results[i].not_tuy_id,
						benA: results[i].tuy_ben_a,
						benB: results[i].tuy_ben_b,
						tuy_ten: results[i].tuy_ten,
						did_gio_xuat_ben_that: results[i].did_gio_xuat_ben_that,
						tong_so_cho: results[i].tong_so_cho,
						ten_so_do_giuong: results[i].ten_so_do_giuong,
						did_so_cho_da_ban: results[i].did_so_cho_da_ban
					};
					html.push(
						<Card key={i}>
			 		  		<CardItem onPress={() => Actions.ViewSoDoGiuong({title: 'Trên Xe', data})}>
						  		<Text>{results[i].did_gio_dieu_hanh+' ← ' +results[i].did_gio_xuat_ben_that+' | '+results[i].tuy_ten}</Text>
					 	  	</CardItem>
					  </Card>
					);
				}
			}

      }

      return html;
   }

   searchGiuong() {
      var that = this;
      that.setState({
         loadingSDG: true
      });
      fetch(urlApi+'?not_id='+this.state.optionSelect.key+'&day='+this.state.fullDate, {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
         that.setState({
            arrSoDoGiuong:responseJson.so_do_giuong,
            loadingSDG: false
         });
      })
      .catch((error) => {
         console.error(error);
      });
   }

	componentDidMount() {
		var that = this;
		that.setState({
			loading: true
		});
      fetch(urlApi+'?day='+that.state.fullDate, {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
         that.setState({
            results:responseJson.so_do_giuong,
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

   _getNot() {
      var that = this;
		that.setState({
			loading: true
		});
      fetch(urlApi+'?day='+that.state.fullDate, {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
         that.setState({
            results:responseJson.so_do_giuong,
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

	openModal(id) {
		this.refs.modal3.open();
	}

	closeModal(id) {
		this.refs.modal3.close();
	}

   render() {
		let activeTab0 = 'activeTab',
			activeTab1 = '',
			activeTab2 = '';
			if(this.state.type_not_chieu_di == 1) {
				activeTab0 = activeTab2 = '';
				activeTab1 = 'activeTab';
			}else if(this.state.type_not_chieu_di == 2) {
				activeTab0 = activeTab1 = '';
				activeTab2 = 'activeTab';
			}
      return(
         <View style={styles.container}>
				<View style={{flexDirection: 'row', padding: 30}}>
					<Text style={{flex: 3, width: 200, borderWidth:1, borderColor:'#ccc', padding:10, height:39}} onPress={() => this._setDatePickerShow()}>{this.state.fullDate}</Text>
					<Button style={{flex: 1, borderRadius: 0, width: 70}} onPress={() => {this._getNot()}}><Icon name="ios-search" /></Button>
				</View>
				<View style={{backgroundColor: '#777'}}>
					<View style={{flexDirection: 'row'}}>
						<View style={[styles[activeTab0], {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10}]}>
							<TouchableOpacity onPress={() => this.setState({type_not_chieu_di: 0})}>
								<Text style={{color: '#fff'}}>Tất Cả</Text>
							</TouchableOpacity>
						</View>
						<View style={[styles[activeTab1], {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10}]}>
							<TouchableOpacity onPress={() => this.setState({type_not_chieu_di: 1})}>
								<Text style={{color: '#fff'}}>Chiều đi</Text>
							</TouchableOpacity>
						</View>
						<View style={[styles[activeTab2], {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10}]}>
							<TouchableOpacity onPress={() => this.setState({type_not_chieu_di: 2})}>
								<Text style={{color: '#fff'}}>Chiều về</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<ScrollView>
					{ this.state.loading && <Spinner /> }
					{ !this.state.loading && this._renderNot(this.state.type_not_chieu_di) }
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
	}
});

export default HomeIOS
