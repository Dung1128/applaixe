import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,
   StyleSheet,
   AsyncStorage,
} from 'react-native';
import { Container, Content, InputGroup, View, Icon, Input,Text, Button, Thumbnail, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {Actions} from 'react-native-router-flux';

const domain = 'http://haivanexpress.com';
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

	componentWillMount() {
		this.setState({
			loading: true
		});
		var that = this;
      AsyncStorage.getItem('infoAdm').then((data) => {
         let results = JSON.parse(data);
         if(results != null) {
            Actions.home({title: 'Trang Chủ', data: ''});
         }else {
				that.setState({
					loading: false
				});
			}
      }).done();
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
	      fetch(domain+'/api/api_adm_dang_nhap.php?username='+this.state.username+'&password='+this.state.password)
	      .then((response) => response.json())
	      .then((responseJson) => {
	         that.setState({
	            loading: false,
					username: '',
					password: ''
	         });
	         if(responseJson.status == 200) {
	            let result = JSON.stringify(responseJson);
	            AsyncStorage.setItem("infoAdm", result);
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
					<Input placeholder="Email" onChange={(event) => this.setState({username: event.nativeEvent.text})} />
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
				<InputGroup key="group_username">
					<Icon name='ios-person' />
					<Input placeholder="Email" onChange={(event) => this.setState({username: event.nativeEvent.text})} />
				</InputGroup>
			);
			htmlGroup.push(
				<InputGroup key="group_password">
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
					style={styleWelcome.marginButton}
					onPress={this.handleLogin.bind(this)}
				>Đăng nhập</Button>
			</View>
		);

		return htmlContent;
	}

   render() {
      return(
			<Grid>
				<Row size={1}></Row>
				<Row size={2}>
					<View>
						<View style={styleWelcome.wrapViewImage}>
							<Thumbnail size={80} source={require('./Skin/Images/logo.png')} />
						</View>
						{ this.state.loading && <Spinner /> }
						{!this.state.loading && this.renderHtml()}
					</View>
				</Row>
				<Row size={1}></Row>
			</Grid>

      );
   }
}

const styleWelcome = StyleSheet.create({
   marginButton: {
      marginTop: 10
   },
   paddingContent: {
      padding: 30
   },
	wrapViewImage: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: -30
	}
});

export default Welcome
