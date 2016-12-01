import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  Image
} from 'react-native';
import { Container, Content, InputGroup, Icon, Input, Button, Thumbnail } from 'native-base';
const domain = 'http://haivanexpress.com';

class Login extends Component {

   constructor(props) {
      super(props);
      this.state = {
         username: '',
         password: '',
			selectedIndex: 0
      }
   }

   handleLogin() {
      this.setState({
         loading: true
      });
      var that = this;
      fetch(domain + '/api/api_adm_dang_nhap.php?username='+this.state.username+'&password='+this.state.password)
      .then((response) => response.json())
      .then((responseJson) => {
         this.setState({
            loading: false
         });
         if(responseJson.status == 200) {
            let result = JSON.stringify(responseJson);
            AsyncStorage.setItem("infoAdm", result);
				this.props.checkLogin = true;
            that.props.routes.root({title: 'Trang Chủ', data: result});

         }
      })
      .catch((error) => {
         this.setState({
            loading: false
         });
         Console.log(error);
      });
   }

   render() {
      let Actions = this.props.routes;
      return(
         <Container>
            <Content style={styleLogin.paddingContent}>
					<Thumbnail size={80} source={require('../../Skin/Images/logo.png')} />
               <InputGroup>
                  <Icon name='ios-person' />
                  <Input placeholder="Email" onChange={(event) => this.setState({username: event.nativeEvent.text})} />
               </InputGroup>

               <InputGroup error>
                  <Icon name='ios-unlock' style={{color:'red'}} />
                  <Input placeholder="Mật khẩu" secureTextEntry={true} onChange={(event) => this.setState({password: event.nativeEvent.text})} />
               </InputGroup>
               <Button
                  block
                  success
                  style={styleLogin.marginButton}
                  onPress={this.handleLogin.bind(this)}
               >Đăng nhập</Button>
            </Content>
         </Container>
      );
   }
}

const styleLogin = StyleSheet.create({
   marginButton: {
      marginTop: 10
   },
   paddingContent: {
      padding: 30
   }
});

export default Login
