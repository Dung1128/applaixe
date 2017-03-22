import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class Ghe extends React.Component{
  render(){
    return(
      <View style={styles.gheContent}>
        <Text>{this.props.tenGhe}</Text>
      </View>
    );
  }
}

Ghe.PropTypes = {
  tenGhe: React.PropTypes.string;
}

var styles  = StyleSheet.create({
  gheContent: {
    width: 100,
  }
})
