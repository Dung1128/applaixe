import React, { Component, PropTypes } from 'react';
import {
	AppRegistry, StyleSheet, AsyncStorage,
	Image, Dimensions, ScrollView,NetInfo
} from 'react-native';
import {domain, cache} from './Config/common';
import { Container, Content, InputGroup, View, Icon, Input,Text, Button, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {Actions} from 'react-native-router-flux';
import fetchData from './Components/FetchData';
const heightDevice = Dimensions.get('window').height;
class Welcome extends Component {

	constructor(props) {
      super(props);
      this.state = {
         username: '',
         password: '',
			selectedIndex: 0,
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
		if(jsonDataUser != null) {
			this.setState({
				loading: true
			});
			if(this.state.sttInternet == false){
			  	Actions.home({title: 'Trang Chủ', data: jsonDataUser});
			}else{
				try {
					let params = {
						type: 'checkTokenLogin',
						token: jsonDataUser.token
					}
					let data = await fetchData('login', params, 'GET');
					if(data.status == 200) {
						Actions.home({title: 'Trang Chủ', data: jsonDataUser});
					}else {
						this.setState({
							error: 'true',
							loading: false,
							messageError: 'Tài khoản của bạn đang đăng nhập ở thiết bị khác. Vui lòng đăng nhập lại '
						});
					}
				} catch (e) {
					this.setState({
						error: 'true',
						loading: false,
						messageError: 'Lỗi hệ thống. Vui lòng liên hệ với bộ phận Kỹ Thuật.'
					});
					console.log(e);
				}
			}
		}
	}	

   async handleLogin() {
		let checkNullForm = false,
			mesValid = '';
		if(this.state.username == '' || this.state.username == null) {
			checkNullForm = true;
			mesValid = 'Vui lòng nhập tên tài khoản.';
		}
		if(this.state.password == '' || this.state.password == null) {
			checkNullForm = true;
				mesValid = 'Vui lòng nhập Mật Khẩu.';
		}

		if(!checkNullForm) {
	      this.setState({
	         loading: true
	      });
	      try {
	      	let params = {
					type: 'login',
					username: this.state.username,
					password: this.state.password,
				}
				let data = await fetchData('login', params, 'GET');
	         if(data.status == 200) {
	            let result = JSON.stringify(data);
					AsyncStorage.removeItem('infoAdm');
	            AsyncStorage.setItem("infoAdm", result);
	            Actions.home({title: 'Trang Chủ', data: result});
	         }else {
					this.setState({
						loading: false,
						error: 'true',
						messageError: 'Tài khoản hoặc Mật Khẩu không đúng.'
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

		if(this.state.error == 'true') {
			htmlGroup.push(
				<InputGroup key="group_username" style={{height: 50}} error>
					<Icon name='ios-person' style={{color: 'red'}} />
					<Input placeholder="Tên đăng nhập" onChange={(event) => this.setState({username: event.nativeEvent.text})} />
				</InputGroup>
			);
			htmlGroup.push(
				<InputGroup key="group_password" style={{height: 50}} error>
					<Icon name='ios-unlock' style={{color: 'red'}} />
					<Input placeholder="Mật khẩu" secureTextEntry={true} onChange={(event) => this.setState({password: event.nativeEvent.text})} />
				</InputGroup>
			);
		}else {
			htmlGroup.push(
				<InputGroup key="group_username" style={{height: 50}}>
					<Icon name='ios-person' />
					<Input placeholder="Tên đăng nhập" onChange={(event) => this.setState({username: event.nativeEvent.text})} />
				</InputGroup>
			);
			htmlGroup.push(
				<InputGroup key="group_password" style={{height: 50, marginTop: 5, marginBottom: 10}}>
					<Icon name='ios-unlock' />
					<Input placeholder="Mật khẩu" secureTextEntry={true} onChange={(event) => this.setState({password: event.nativeEvent.text})} />
				</InputGroup>
			);
		}

		if(this.state.messageError !=  '') {
			arrValid.push(<Text style={{color: 'red', marginTop: 10}} key="username_vl">- {this.state.messageError}</Text>);
		}

		htmlContent.push(
			<View key="content_login" style={styleWelcome.paddingContent}>
				{htmlGroup}
				{arrValid}
				<Button block success
					style={[styleWelcome.marginButton, {height: 60}]}
					onPress={this.handleLogin.bind(this)}
				>Đăng nhập</Button>
			</View>
		);

		return htmlContent;
	}

   render() {
      return(
			<View style={{flex: 1, flexDirection: 'column'}}>
				 <View style={{backgroundColor: 'rgba(255, 220, 66, 1)', alignItems: 'center', justifyContent: 'center', padding: 10}}> 
					 <Image square style={{resizeMode: 'contain'}}
					  source={require('./Skin/Images/logo.png')}
					/> 
				 </View> 
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

const styleWelcome = StyleSheet.create({
   marginButton: {
      marginTop: 10
   },
   paddingContent: {
      padding: 30
   }
});

export default Welcome;



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
