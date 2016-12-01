import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Platform
} from 'react-native';
import {Icon, Text} from 'native-base';
import Drawer from 'react-native-drawer';

import {Actions, Scene, Router, Schema, ActionConst, Reducer} from 'react-native-router-flux';

import NavBar from './App/Modules/NavBar/Index';
import Home from './App/Modules/Home/HomeIOS';
import Login from './App/Modules/Login/Login';
import SideBar from './App/Modules/SideBar/SideBar';
import Register from './App/Modules/Register/Register';
import Errors from './App/Modules/Errors/Errors';
import SoDoGiuong from './App/Modules/BookGiuong/SoDoGiuong';
import ViewSoDoGiuong from './App/Modules/BookGiuong/ViewSoDoGiuong';
import ViewSoDoGiuongCho from './App/Modules/BookGiuong/ViewSoDoGiuongCho';
import modal_search_dia_diem from './App/Modules/BookGiuong/SearchDiaDiem';
import ViewDanhSachHuy from './App/Modules/BookGiuong/ViewDanhSachHuy';
import ViewDanhSachDaXuongXe from './App/Modules/BookGiuong/ViewDanhSachXuongXe';
import ViewDanhSachGoi from './App/Modules/BookGiuong/ViewDanhSachGoi';
import Welcome from './App/Welcome';

const reducerCreate = params => {
 	const defaultReducer = Reducer(params);
 	return (state, action)=>{
		var currentState = state;
        if(currentState){
          while (currentState.children){
            currentState = currentState.children[currentState.index]
          }
        }
	  	return defaultReducer(state, action);
 	}
};

class App extends Component {
	render() {
		return(
			<Router navBar={NavBar} createReducer={reducerCreate}>
  	       	<Scene key="root">

  			 		<Scene key="welcome" component={Welcome} hideNavBar initial />
  	         	<Scene key="home" component={Home} title="Trang Chủ" type="reset" />
					<Scene key="register" component={Register} title="Đăng Ký" />
					<Scene key="login" component={Login} title="Đăng Nhập" />
					<Scene key="ViewSoDoGiuong" component={ViewSoDoGiuong} title="Trên Xe" />
					<Scene key="DanhSachCho" component={ViewSoDoGiuongCho} title="Đang Chờ" />
					<Scene key="ViewDanhSachHuy" component={ViewDanhSachHuy} title="Danh sách hủy vé" />
					<Scene key="ViewDanhSachDaXuongXe" component={ViewDanhSachDaXuongXe} title="Danh sách đã xuống xe" />
					<Scene key="ViewDanhSachGoi" component={ViewDanhSachGoi} title="Danh sách gọi" />
  	       	</Scene>
       	</Router>
		);
	}
}

const drawerStyles = {
  drawer: {
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 0
  }
}
export default class AppLaiXe extends Component {

	render() {
		return (
			<Drawer
				ref={c => this.drawer = c}
				type={'overlay'}
				content={<SideBar closeDrawer={() => { this.drawer.close(); }} />}
				styles={drawerStyles}
				tapToClose
				openDrawerOffset={0.2}
				panCloseMask={0.2}>
			  		<App />
			</Drawer>
		);
	}
}



AppRegistry.registerComponent('AppLaiXe', () => AppLaiXe);
