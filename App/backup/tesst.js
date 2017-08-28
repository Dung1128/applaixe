/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
// import Common from './Components/Common';

export default class PingServer extends Component {
   constructor(props) {
      super(props);
      this.state = {networkstring: "undefined"};
   }
   async PingTest(){
      let returnValue = await checkServerAlive();
      if (returnValue) { this.setState({ networkstring: "OK" }); }
      else { this.setState({ networkstring: "Die" }); }
   }
  render() {
    return (
      <View>
         <TouchableHighlight onPress={() => this.PingTest()} ><Text>Test Server</Text></TouchableHighlight>
         <Text>{this.state.networkstring}</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('PingServer', () => PingServer);

async function checkServerAlive() {
  //  if (Common.net == 0) {
  //       try {
  //           let response = await fetch(Common.domain + '/api/ping.php');
  //           let responseJson = await response.json();
  //           return true;
  //       } catch (error) {
  //           console.log(error);
  //           return false;
  //       }
  //   }
  //   else {
        return await isConnected();
    // }

}
