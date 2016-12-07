import React, { Component } from 'react';
import {
   AppRegistry,
   StyleSheet,
   Dimensions,
   Modal,
   TextInput
} from 'react-native';
import {domain} from '../../Config/common';
import { Container, Content, Header, Title, Text, Button, Card, CardItem, Spinner } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import {Actions} from 'react-native-router-flux';

const urlApi = domain + '/api/api_adm_so_do_giuong.php';

class Home extends Component {
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
			hideContent: true
      }
   }

   //  async getNotApi() {
   //     try {
   //        let response = await fetch(urlApi);
   //        let responseJson = await response.json();
   //        this.setState({
   //           results: responseJson
   //        });
   //     } catch(error) {
   //        console.error(error);
   //     }
   // }
   //
   // componentWillMount() {
   //    this.setState({
   //       loading: false
   //    });
   //    this.getNotApi();
   // }

   onDateChange(date) {
      let currentSelectDate = date.date;
      this.setState({
         date: currentSelectDate,
         day: currentSelectDate.getDate(),
         month: (currentSelectDate.getMonth()+1),
         year: currentSelectDate.getFullYear(),
         fullDate: currentSelectDate.getDate()+'-'+(currentSelectDate.getMonth()+1)+'-'+currentSelectDate.getFullYear()
      });
      this._setDatePickerHide();
   }

   _setDatePickerShow() {
      this.setState({
         showDatePicker: true
      });
   }

   _setDatePickerHide() {
      this.setState({
         showDatePicker: false
      });
   }

   _renderDatePicker() {
      if(this.state.showDatePicker) {
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
      }else {
         return null;
      }
   }

   _renderNot(results) {
      let data = [],
          countData = results.length;
      for(var i = 0; i < countData; i++) {
         data.push({key:results[i].not_id, label: results[i].did_gio_xuat_ben_that+' ← ' +results[i].did_gio_xuat_ben+' '+results[i].tuy_ma, not_tuy_id: results[i].not_tuy_id});
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
                  arrSoDoGiuong:responseJson,
                  loadingSDG: false
               });
               return responseJson;
            })
            .catch((error) => {
               console.error(error);
            });
   }

   _getNot() {
      var that = this;
		that.setState({
			hideContent: false,
			loading: true
		});
      return fetch(urlApi+'?day='+that.state.fullDate)
            .then((response) => response.json())
            .then((responseJson) => {
               that.setState({
                  results:responseJson,
                  loading: false
               });
               return responseJson;
            })
            .catch((error) => {
               that.setState({
                  loading: false
               });
               console.error(error);
            });
   }

   render() {

      let dataNot = this._renderNot(this.state.results);
      return(
         <Container>

            <Content style={styles.container}>
               <Button onPress={() => {this._setDatePickerShow()}}>Text</Button>
               {this._renderDatePicker()}
               <TextInput
                   style={{borderWidth:1, borderColor:'#ccc', padding:10, height:30}}
                   editable={false}
                   placeholder="Vui lòng chọn thời gian"
                   value={this.state.fullDate} />
					<Button onPress={() => {this._getNot()}}>Submit</Button>

					{this.state.loading? <Spinner /> : <Card dataArray={dataNot}
                    renderRow={(dataNot) =>
                      <CardItem onPress={() => Actions.SoDoGiuong({title: 'Sơ Đồ Giường', data: {notId:dataNot.key, day:this.state.fullDate, notTuyenId: dataNot.not_tuy_id}})}>
                          <Text>{dataNot.label}</Text>
                      </CardItem>
                  }>
              </Card>}
            </Content>

         </Container>
      );
   }
}


const styles = StyleSheet.create({
   container: {
      marginTop: 65,
      position: 'relative'
   },
   contentAbsolute: {
      position: 'absolute',
      top: 0
   },
   selectedDate: {
      backgroundColor: 'rgba(0,0,0,0)',
      color: '#000',
   }
});

export default Home
