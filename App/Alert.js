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
class Alert extends Component {

	constructor(props) {
      super(props);
      this.state = {
         username: '',
         password: '',
			selectedIndex: 0,
			error: 'false',
			messageError: [],
			sttInternet: true
      };
   }

	async componentWillMount() {
	}

   render() {
      return(
			<View style={{flex: 1, flexDirection: 'column'}}>
				
				<View style={{height: heightDevice}}>
						<Text>Lỗi mạng</Text>
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

export default Alert
