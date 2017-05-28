import React, { Component, PropTypes } from 'react';
import {
	AppRegistry, StyleSheet, AsyncStorage,
	Image, Dimensions, ScrollView,NetInfo
} from 'react-native';
import { Container, Content, InputGroup, View, Icon, Input,Text, Button, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {Actions} from 'react-native-router-flux';
import {domain, cache} from '../../Config/common';
import fetchData from '../../Components/FetchData';
import StorageHelper from '../../Components/StorageHelper';
const heightDevice = Dimensions.get('window').height;
class ChangePass extends Component {

	constructor(props) {
      super(props);
      this.state = {
         password: '',
         passwordOld: '',
			error: 'false',
			messageError: '',
			sttInternet: false
      };
   }

	async componentWillMount() {
		let sttInternet = await checkServerAlive();
		this.setState({
			sttInternet: sttInternet
		});
		let dataUser = await AsyncStorage.getItem('infoAdm');
		let jsonDataUser = JSON.parse(dataUser);
	}

   async handleChangePass() {
		let results = await StorageHelper.getStore('infoAdm');
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;


		let checkNullForm = false;
		var mesValid = '';
		if(this.state.password == '' || this.state.password == null) {
			checkNullForm = true;
			mesValid = 'Vui lòng nhập mật khẩu.';
		}else if(this.state.passwordOld == '' || this.state.passwordOld == null) {
			checkNullForm = true;
			mesValid = 'Vui lòng nhập lại mật khẩu.';
		}else if(this.state.password != this.state.passwordOld) {
			checkNullForm = true;
			mesValid = 'Nhập lại mật khẩu không đúng.';
		}

		if(!checkNullForm) {
	      this.setState({
	         loading: true
	      });
	      try {
	      	let params = {
					token: token,
					adm_id: admId,
					type: 'changePass',
					passwordOld: this.state.passwordOld,
					password: this.state.password,
				}
				let data = await fetchData('api_change_pass', params, 'GET');
	         if(data.status == 200) {
	            let result = JSON.stringify(data);
					alert('Đổi mật khẩu thành công.');
	            Actions.home({title: 'Trang Chủ', data: result});
	         }else {
					this.setState({
						loading: false,
						error: 'true',
						messageError: 'Có lỗi xảy ra vui lòng thử lại.'
					});
				}
	      } catch (e) {
				this.setState({
	            loading: false,
					error: 'true',
					messageError: 'Lỗi hệ thống. Vui lòng liên hệ với bộ phận Kỹ Thuật.'
	         });
				console.log(e);
	      }
		}else {
			this.setState({
				error: 'true',
				loading: false,
				messageError: mesValid
			});
		}
   }

	renderHtml() {
		let htmlContent = [],
			htmlGroup = [],
			arrValid = [];

			htmlGroup.push(
				<InputGroup key="group_username">
					<Icon name='ios-unlock' />
					<Input placeholder="Nhập mật khẩu mới" secureTextEntry={true} onChange={(event) => this.setState({password: event.nativeEvent.text})} />
				</InputGroup>
			);
			htmlGroup.push(
				<InputGroup key="group_password">
					<Icon name='ios-unlock' />
					<Input placeholder="Nhập lại mật khẩu mới" secureTextEntry={true} onChange={(event) => this.setState({passwordOld: event.nativeEvent.text})} />
				</InputGroup>
			);


		if(this.state.messageError != '') {
			arrValid.push(<Text style={{color: 'red', marginTop: 10}} key="username_vl">- {this.state.messageError}</Text>);
		}

		htmlContent.push(
			<View key="content_login" style={styles.paddingContent}>
				{htmlGroup}
				{arrValid}
				<Button block success
					style={[styles.marginButton, {height: 50}]}
					onPress={this.handleChangePass.bind(this)}
				>Đổi mật khẩu</Button>
			</View>
		);

		return htmlContent;
	}

   render() {
      return(
			<View style={styles.container}>
				<View style={{height: heightDevice}}>
						<Grid>
							<Row size={1}></Row>
							<Row size={5}>
								<View>
									<ScrollView>
									{ this.state.loading && <View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View> }
									{!this.state.loading && this.renderHtml()}
									</ScrollView>
								</View>
							</Row>
							<Row size={1}></Row>
						</Grid>
				</View>
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
	marginButton: {
      marginTop: 10
   },
   paddingContent: {
      padding: 30
   }
});

export default ChangePass;



async function checkServerAlive() {
   try {
     let response = await fetch('http://hasonhaivan.vn/api/ping.php');
     let responseJson = await response.json();
     return true;
   } catch(error) {
      console.log(error);
      return false;
   }

}
