import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  View,
  Text,
  TouchableOpacity,
  WebView,
  Dimensions,
  ScrollView
} from 'react-native';
import {domain,cache} from '../../Config/common';
import {Button, Icon} from 'native-base';
import {Actions} from 'react-native-router-flux';
import fetchData from '../../Components/FetchData';
const {height, width} = Dimensions.get('window');
class HuongDanSuDung extends Component {

   constructor(props) {
      super(props);
		this.state = {
			loading: true,
			webViewHeight: 0
		};
   }

	async componentWillMount() {
		this.setState({
			loading: true
		});

		try {
			let params = {
				type: 'huongdanlaixe'
			}
			let data = await fetchData('user_get_content', params, 'GET');
			this.setState({
				results: data.data
			});
		} catch (e) {
			console.log(e);
		} finally {
			this.setState({
				loading: false
			});
		}
	}

	 onNavigationStateChange(navState) {
	    this.setState({
	      webViewHeight: Number(navState.title)
	    });
  }

	render() {
		return(
			<View style={{height: height, width: width, paddingTop: 60}}>

				<ScrollView>
					{this.state.loading && <Text>Loading...</Text>}
					{!this.state.loading &&
						<WebView
							automaticallyAdjustContentInsets={false}
							javaScriptEnabled={true}
							domStorageEnabled={true}
							scrollEnabled={false}
							onNavigationStateChange={this.onNavigationStateChange.bind(this)}
							style={{height: this.state.webViewHeight}}
							source={{html: '<html><body>'+this.state.results+'</body></html>'}}
							injectedJavaScript={'document.title = Math.max(window.innerHeight, document.body.offsetHeight, document.documentElement.clientHeight);'}
						/>
					}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
   container: {
		flex: 1,
      marginTop: 64,
      position: 'relative',
		alignItems: 'center',
		padding: 30
   },
	styleText: {
		marginBottom: 10
	},
	styleButton: {

	}
});

export default HuongDanSuDung
