import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Platform,
	StatusBar
} from 'react-native';
import { Icon, Text } from 'native-base';
import Drawer from 'react-native-drawer';

import { Actions, Scene, Router, Schema, ActionConst, Reducer } from 'react-native-router-flux';

import NavBar from './Modules/NavBar/Index';
import Home from './Modules/Home/HomeIOS';
import ScheduleTrip from './Modules/Home/Home';
import Login from './Modules/Login/Login';
import changePass from './Modules/Home/ChangePass';
import SideBar from './Modules/SideBar/SideBar';
import Register from './Modules/Register/Register';
import Errors from './Modules/Errors/Errors';
import MaXe from './Modules/MaXe/Index';
import SoDoGiuong from './Modules/BookGiuong/SoDoGiuong';
import ViewSoDoGiuong from './Modules/BookGiuong/ViewSoDoGiuong';
import ViewSoDoGiuongCho from './Modules/BookGiuong/ViewSoDoGiuongCho';
import modal_search_dia_diem from './Modules/BookGiuong/SearchDiaDiem';
import ViewDanhSachHuy from './Modules/BookGiuong/ViewDanhSachHuy';
import ViewDanhSachDaXuongXe from './Modules/BookGiuong/ViewDanhSachXuongXe';
import ViewDanhSachGoi from './Modules/BookGiuong/ViewDanhSachGoi';
import ViewDanhSachTra from './Modules/BookGiuong/ViewDanhSachTra';
import HuongDanSuDung from './Modules/HuongDanSuDung/Index';
import Welcome from './Welcome';
import Alert from './Alert';
import ReportSales from './Modules/ReportSales/ReportSales';
import DieuDo from './Modules/Home/DieuDo';
import BangDieuDo from './Modules/Home/BangDieuDo';Inspect
import Inspect from './Modules/Inspect/Inspect';
import InspectHistory from './Modules/Inspect/InspectHistory';

const reducerCreate = params => {
	const defaultReducer = Reducer(params);
	return (state, action) => {
		var currentState = state;
		if (currentState) {
			while (currentState.children) {
				currentState = currentState.children[currentState.index]
			}
		}
		return defaultReducer(state, action);
	}
};

class App extends Component {
	render() {
		return (
			<Router navBar={NavBar} createReducer={reducerCreate}>
				<Scene key="root">
					<Scene key="welcome" component={Welcome} hideNavBar initial />
					<Scene key="home" component={Home} title="Trang Chủ" type="reset" />
					<Scene key="ScheduleTrip" component={ScheduleTrip} title="Lịch điều hành" />
					<Scene key="register" component={Register} title="Đăng Ký" />
					<Scene key="changePass" component={changePass} title="Đổi mật khẩu" />
					<Scene key="login" component={Login} title="Đăng Nhập" />
					<Scene key="alert" component={Alert} title="Alert" />
					<Scene key="ViewSoDoGiuong" component={ViewSoDoGiuong} title="Trên Xe" />
					<Scene key="DanhSachCho" component={ViewSoDoGiuongCho} title="Đang Chờ" />
					<Scene key="ViewDanhSachHuy" component={ViewDanhSachHuy} title="Danh sách hủy vé" />
					<Scene key="ViewDanhSachDaXuongXe" component={ViewDanhSachDaXuongXe} title="Danh sách đã xuống xe" />
					<Scene key="ViewDanhSachGoi" component={ViewDanhSachGoi} title="Danh sách gọi" />
					<Scene key="ViewDanhSachTra" component={ViewDanhSachTra} title="Danh sách trả" />
					<Scene key="HuongDanSuDung" component={HuongDanSuDung} title="Hướng dẫn sử dụng" hiveNavBar />
					<Scene key="ReportSales" component={ReportSales} title="Báo cáo doanh thu" />
					<Scene key="MaXe" component={MaXe} title="Mã Xe" />
					<Scene key="DieuDo" component={DieuDo} title="Dieu do" />
					<Scene key="BangDieuDo" component={BangDieuDo} title="Bang dieu do" />
					<Scene key="Inspect" component={Inspect} title="Thanh tra" />
					<Scene key="InspectHistory" component={InspectHistory} title="Lich su Thanh tra" />
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
				panCloseMask={0.2}
				tweenHandler={(ratio) => ({
					main: { opacity: (2 - ratio) / 2 }
				})}>
				<StatusBar hidden={true} />
				<App />
			</Drawer>
		);
	}
}
