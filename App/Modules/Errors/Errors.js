import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Button } from 'native-base';

class Errors extends Component {

   render() {
      let Actions = this.props.routes;
      return(
         <View style={{width:300,height:300,justifyContent: 'center',
        alignItems: 'center',backgroundColor:'white'}}>
                <Text>{this.props.data}</Text>
                <Button onPress={Actions.dismiss}>
                  <Text>Close</Text>
                </Button>
            </View>
      );
   }
}

export default Errors
