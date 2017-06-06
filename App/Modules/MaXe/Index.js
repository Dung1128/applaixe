import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  Image,
  Dimensions,
  View,
  Text,
  ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import fetchData from '../../Components/FetchData';
import { Container, Content, InputGroup, Icon, Input, Button, Grid, Row, Spinner } from 'native-base';
const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

class MaXe extends Component {

   constructor(props) {
      super(props);
      this.state = {
         maxe: '',
			loading: false,
			error: '',
			messageError: ''
      }
   }

   async handleLogin() {
		if(this.state.maxe == '') {
			this.setState({
				error: 'error',
				messageError: 'Mã xe không được để trống.'
			})
		}else {
			this.setState({loading: true});
			try {
				let params = {
					maxe: this.state.maxe
				}
				let data = await fetchData('adm_ma_xe', params, 'GET');
				if(data.status == 200) {
					let result = JSON.stringify(data);
					AsyncStorage.removeItem('ma_xe');
					AsyncStorage.setItem("ma_xe", result);
					Actions.home({title: 'Trang Chủ'});
				}else {
					this.setState({
						loading: false,
						error: 'error',
						messageError: 'Mã xe không tồn tại.'
					})
				}
			} catch (e) {
				console.log(e);
				this.setState({loading: false});
			}
		}
   }

   render() {
      return(
			<View style={{flex: 1, flexDirection: 'column'}}>
				<View style={{height: heightDevice}}>
						<Grid>
							<Row size={1}></Row>
							<Row size={5}>
								<View style={{width: widthDevice}}>
									<ScrollView keyboardShouldPersistTaps="always">
										<View style={styles.paddingContent}>
											{this.state.loading &&
												<View style={{alignItems: 'center'}}>
													<Spinner />
													<Text>Đang đọc dữ liệu...</Text>
												</View>
											}
											{!this.state.loading &&
												<View>
													<InputGroup style={{height: 50}}>
														<Icon name='md-bus' style={styles[this.state.error]} />
														<Input placeholder="Mã Xe" onChange={(event) => this.setState({maxe: event.nativeEvent.text})} />
													</InputGroup>

								               <Button
								                  block
								                  success
								                  style={styles.marginButton}
								                  onPress={this.handleLogin.bind(this)}
								               >Xác Nhận</Button>
													<View style={{alignItems: 'center', marginTop: 10}}>
														<Text style={{color: 'red'}}>{this.state.messageError}</Text>
													</View>
												</View>
											}
										</View>
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
   marginButton: {
      marginTop: 10
   },
   paddingContent: {
      padding: 30
   },
	error: {
		color: 'red'
	}
});

export default MaXe
