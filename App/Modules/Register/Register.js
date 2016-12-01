import React, { Component } from 'react';
import {
   AppRegistry,
   StyleSheet,
   Text,
   View
} from 'react-native';
import { Button } from 'native-base';

class Register extends Component {

   render() {
      let Actions = this.props.routes;
      return(
         <View style={styles.container}>
            <Text>Register page</Text>
            <Button onPress={Actions.pop}>
               <Text>Back</Text>
            </Button>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
   },
   welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
   },
   instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
   },
});

export default Register
