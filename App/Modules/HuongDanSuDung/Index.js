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
const {height, width} = Dimensions.get('window');
class HuongDanSuDung extends Component {

   constructor(props) {
      super(props);
		this.state = {
			loading: true,
			webViewHeight: 0
		};
   }

	_backPayment() {
		AsyncStorage.getItem('infoUser').then((data) => {
         let results = JSON.parse(data);
         if(results != null) {
            Actions.home({title: 'Chọn Chuyến', data: results});
         }else {
				Actions.welcome();
			}
      }).done();
	}

	componentDidMount() {
		this.setState({
			loading: true
		});
		var that = this;

      fetch(domain+'/api/api_user_get_content.php?type=huongdanlaixe', {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
			that.setState({
				results: responseJson.data,
				loading: false
			});
      })
      .catch((error) => {
         console.error(error);
      });
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
							source={{html: '<html><body>'+this.state.results.new_description+'</body></html>'}}
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
