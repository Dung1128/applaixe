import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,
   StyleSheet,
   AsyncStorage,
	Image,
	Dimensions,
	ScrollView
} from 'react-native';
import {domain, cache} from './Config/common';
import { Container, Content, InputGroup, View, Icon, Input,Text, Button, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {Actions} from 'react-native-router-flux';
import * as base64 from './Components/base64/Index';

const heightDevice = Dimensions.get('window').height;
class Welcome extends Component {

	constructor(props) {
      super(props);
      this.state = {
         username: '',
         password: '',
			selectedIndex: 0,
			error: 'false',
			messageError: []
      };
   }

	async componentWillMount() {

		try {
			this.setState({
				loading: true
			});
			let that = this;
		  	let dataUser = await AsyncStorage.getItem('infoAdm');
			let jsonDataUser = JSON.parse(dataUser);

			if(jsonDataUser != null) {
				let token = base64.encodeBase64(jsonDataUser.adm_name)+'.'+base64.encodeBase64(jsonDataUser.last_login)+'.'+base64.encodeBase64(''+jsonDataUser.adm_id+'');
				let dataToken = await AsyncStorage.getItem(token);
				if(dataToken != null) {
					fetch(domain+'/api/api_adm_dang_nhap.php?type=checkTokenLogin&token='+token, {
						headers: {
							'Cache-Control': cache
						}
					})
					.then((response) => response.json())
					.then((responseJson) => {
						if(responseJson.status == 200) {

							that.setState({
								loading: false
							});
							Actions.home({title: 'Trang Chủ', data: jsonDataUser});
						}else {
							that.setState({
								loading: false,
								error: 'true',
								messageError: [{username: 'Tài khoản đã được đăng nhập ở thiết bị khác.'}]
							});
						}
					})
					.catch((error) => {
						that.setState({
							loading: false,
							error: 'true',
							messageError: [{username: 'Lỗi hệ thống. Vui lòng liên hệ với bộ phận Kỹ Thuật.'}]
						});
						Console.error(error);
					});
				}else {
					this.setState({
						loading: false
					});
				}
			}else {
				this.setState({
					loading: false
				});
			}

	  	} catch (error) {
			this.setState({
				loading: false
			});
	  	}
	}

   handleLogin() {
		let checkNullForm = false,
			mesValid = [];
		if(this.state.username == '' || this.state.username == null) {
			checkNullForm = true;
			mesValid.push({username: 'Vui lòng nhập tên tài khoản.'});
		}
		if(this.state.password == '' || this.state.password == null) {
			checkNullForm = true;
			mesValid.push({password: 'Vui lòng nhập Mật Khẩu.'});
		}

		if(!checkNullForm) {
	      this.setState({
	         loading: true
	      });
	      var that = this;

	      fetch(domain+'/api/api_adm_dang_nhap.php?type=login&username='+this.state.username+'&password='+this.state.password, {
				headers: {
					'Cache-Control': cache
				}
			})
	      .then((response) => response.json())
	      .then((responseJson) => {
	         that.setState({
	            loading: false,
					username: '',
					password: ''
	         });
	         if(responseJson.status == 200) {
	            let result = JSON.stringify(responseJson);
					let token = base64.encodeBase64(responseJson.adm_name)+'.'+base64.encodeBase64(responseJson.last_login)+'.'+base64.encodeBase64(''+responseJson.adm_id+'');
					AsyncStorage.removeItem('infoAdm');
	            AsyncStorage.setItem("infoAdm", result);
					AsyncStorage.setItem(token, '1');
	            Actions.home({title: 'Trang Chủ', data: result});
	         }else {
					that.setState({
						error: 'true',
						messageError: [{username: 'Tài khoản hoặc Mật Khẩu không đúng.'}]
					});
				}
	      })
	      .catch((error) => {
	         that.setState({
	            loading: false,
					error: 'true',
					messageError: [{username: 'Lỗi hệ thống. Vui lòng liên hệ với bộ phận Kỹ Thuật.'}]
	         });
	         Console.log(error);
	      });
		}else {
			this.setState({
				error: 'true',
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
				<InputGroup key="group_username" error>
					<Icon name='ios-person' style={{color: 'red'}} />
					<Input placeholder="Tên đăng nhập" onChange={(event) => this.setState({username: event.nativeEvent.text})} />
				</InputGroup>
			);
			htmlGroup.push(
				<InputGroup key="group_password" error>
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
				<InputGroup key="group_password" style={{height: 50, marginTop: 10, marginBottom: 10}}>
					<Icon name='ios-unlock' />
					<Input placeholder="Mật khẩu" secureTextEntry={true} onChange={(event) => this.setState({password: event.nativeEvent.text})} />
				</InputGroup>
			);
		}

		if(this.state.messageError.length > 0) {
			arrValid.push(<Text style={{color: 'red', marginTop: 10}} key="username_vl">- {this.state.messageError[0].username}</Text>);
			if(this.state.messageError[1] != undefined) {
				arrValid.push(<Text style={{color: 'red', marginTop: 5}} key="password_vl">- {this.state.messageError[1].password}</Text>);
			}
		}

		htmlContent.push(
			<View key="content_login" style={styleWelcome.paddingContent}>
				{htmlGroup}
				{arrValid}
				<Button
					block
					success
					style={[styleWelcome.marginButton, {height: 50}]}
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
					<Image
					  square
					  style={{resizeMode: 'contain'}}
					  source={require('./Skin/Images/logo.png')}
					/>
				</View>
				<View style={{height: heightDevice}}>
						<Grid>
							<Row size={1}></Row>
							<Row size={5}>
								<View>
									<ScrollView>
									{ this.state.loading && <Spinner /> }
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

export default Welcome
