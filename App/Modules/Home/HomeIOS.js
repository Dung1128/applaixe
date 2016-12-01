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
import { Text, Button, Card, CardItem, Spinner, Icon } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import {Actions} from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Col, Row, Grid } from "react-native-easy-grid";

const domain = 'http://hai-van.local';
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
			isDisabled: false
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

   _renderNot(results) {
      let data = [],
          countData = results.length;
      for(var i = 0; i < countData; i++) {
         data.push({key:results[i].not_id, label: results[i].did_gio_xuat_ben_that+' ← ' +results[i].did_gio_xuat_ben+' '+results[i].tuy_ma, not_tuy_id: results[i].not_tuy_id, ben_a: results[i].tuy_ben_a, ben_b: results[i].tuy_ben_b});
      }

      return data;
   }

   searchGiuong() {
      var that = this;
      that.setState({
         loadingSDG: true
      });
      return fetch(urlApi+'?not_id='+this.state.optionSelect.key+'&day='+this.state.fullDate)
            .then((response) => response.json())
            .then((responseJson) => {
               that.setState({
                  arrSoDoGiuong:responseJson.so_do_giuong,
                  loadingSDG: false
               });
               return responseJson.so_do_giuong;
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
      return fetch(urlApi+'?day='+that.state.fullDate)
            .then((response) => response.json())
            .then((responseJson) => {
               that.setState({
                  results:responseJson.so_do_giuong,
                  loading: false
               });
               return responseJson.so_do_giuong;
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
      return fetch(urlApi+'?day='+that.state.fullDate)
            .then((response) => response.json())
            .then((responseJson) => {
               that.setState({
                  results:responseJson.so_do_giuong,
                  loading: false
               });
               return responseJson.so_do_giuong;
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

      let dataNot = this._renderNot(this.state.results);
      return(
         <View style={styles.container}>
				<View style={{flexDirection: 'row', padding: 30}}>
					<Text style={{flex: 2, width: 200, borderWidth:1, borderColor:'#ccc', padding:10, height:39}} onPress={() => this._setDatePickerShow()}>{this.state.fullDate}</Text>
					<Button style={{flex: 3, borderRadius: 0, width: 70}} onPress={() => {this._getNot()}}>Tìm Kiếm</Button>
				</View>
				<ScrollView>
					{ this.state.loading && <Spinner /> }
					{ !this.state.loading && <Card dataArray={dataNot}
	                 renderRow={(dataNot) =>
	                   <CardItem onPress={() => Actions.ViewSoDoGiuong({title: 'Trên Xe', data: {notId:dataNot.key, day:this.state.fullDate, notTuyenId: dataNot.not_tuy_id, benA: dataNot.ben_a, benB: dataNot.ben_b}})}>
	                       <Text>{dataNot.label}</Text>
	                   </CardItem>
	               }>
	           </Card>}
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
	}
});

export default HomeIOS
