import React, { Component, PropTypes } from 'react';
import {
    AppRegistry, StyleSheet, AsyncStorage,
    TouchableOpacity, ScrollView, View, Dimensions
} from 'react-native';
import { domain, cache } from '../../Config/common';
import fetchData from '../../Components/FetchData';
import StorageHelper from '../../Components/StorageHelper';
import Common from '../../Components/Common';
import { Container, Content, InputGroup, Icon, Text, Input, Button, Spinner, Card, CardItem } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import ComSDGFooter from '../BookGiuong/ComSDGFooter';
import { TabNavigator } from "react-navigation";
import isConnected from '../../Components/CheckNet';

const heightDevice = Dimensions.get('window').height;

export default class ReportSales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            arrVe: [],
        };
    }

    async _getDataTicket(token, admId) {
        this.setState({
            loading: true
        });
        let sttInternet = await checkServerAlive();
        this.setState({
            sttInternet: sttInternet
        });

        // let did_id = this.props.dataParam.did_id;
        let did_id = this.props.dataParam.did_id;

        var nameStoreArrVe = 'arrReport' + did_id;
        var dataTicket = [];

        if (this.state.sttInternet != false) {
            try {
                let params = {
                    token: token,
                    adm_id: admId,
                    did_id: did_id
                }
                let data = await fetchData('api_report', params, 'GET');
                if (data.status == 404) {
                    alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
                    Actions.welcome({ type: 'reset' });
                } else {
                    dataTicket = data.arrVeNumber;
                }
            } catch (e) {
                console.log(e);
            }

        } else {
            let storeVe = await AsyncStorage.getItem(nameStoreArrVe);
            dataTicket = JSON.parse(storeVe);
        }

        this.setState({
            arrVe: dataTicket,
            loading: false
        });

        //Luu store
        var result = JSON.stringify(dataTicket);
        AsyncStorage.removeItem(nameStoreArrVe);
        AsyncStorage.setItem(nameStoreArrVe, result);
    }

    async componentDidMount() {
        let results = await StorageHelper.getStore('infoAdm');
        results = JSON.parse(results);
        let admId = results.adm_id;
        let token = results.token;
        let data = [];
        this.setState({
            token: token,
            loading: true
        });

        this._getDataTicket(token, admId);
        // this._getDanhSachTrenXe(token, admId);
    }

    render() {
        let dataParam = {
            did_id: this.props.dataParam.did_id,
            countCho: this.props.dataParam.countCho
        };

        return (
            <View style={styles.container}>
                {this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
                <MainScreenReport screenProps={
                    /* this prop will get passed to the screen components as this.props.screenProps */
                    this.state.arrVe}
                />
                <ComSDGFooter dataParam={dataParam} />
            </View>
        );
    }
}

class ReportTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrVeXuongXe: [],
            arrVeNumber: [],
        };
    }

    static navigationOptions = {
        tabBarLabel: 'Tổng doanh thu',
    };

    render() {
        // let dataDanhSach = this.props.screenProps;
        let dataVeNumber = Object.values(this.props.screenProps);
        let dataTrenXe = [];
        let tongDoanhThu = 0;
        let tongSoVe = 0;
        let tongVeBanTrenXe = 0;
        let tongTienBanTrenXe = 0;

        for (let i = 0; i < dataVeNumber.length; i++) {
            if (dataVeNumber[i].bvv_status > 0 && dataVeNumber[i].bvv_seri != '0') {
                dataTrenXe.push(dataVeNumber[i]);

                tongDoanhThu += dataVeNumber[i].bvv_price;

                if (dataVeNumber[i].bvv_type == 1) {
                    tongVeBanTrenXe++;
                    tongTienBanTrenXe += dataVeNumber[i].bvv_price;
                }
            }
        }

        // for (let i = 0; i < dataTrenXe.length; i++) {
        //     tongDoanhThu += dataTrenXe[i].bvv_price;

        //     if (dataTrenXe[i].bvv_type == 1) {
        //         tongVeBanTrenXe++;
        //         tongTienBanTrenXe += dataTrenXe[i].bvv_price;
        //     }
        // }

        tongSoVe = dataTrenXe.length;

        return (
            <ScrollView style={{ marginBottom: 50 }}>
                {/* {this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>} */}

                <Text style={{ color: 'red', alignItems: 'flex-start', marginTop: 10, marginLeft: 10 }}>Tổng số vé: {tongSoVe + ' vé'}</Text>
                <Text style={{ color: 'red', alignItems: 'flex-start', margin: 10 }}>Tổng doanh thu: {Common.formatPrice(tongDoanhThu) + ' VNĐ'}</Text>

                <Text style={{ color: 'red', alignItems: 'flex-start', marginTop: 10, marginLeft: 10 }}>Số vé xuất trên xe: {tongVeBanTrenXe + ' vé'}</Text>
                <Text style={{ color: 'red', alignItems: 'flex-start', margin: 10 }}>Doanh thu vé xuất trên xe: {Common.formatPrice(tongTienBanTrenXe) + ' VNĐ'}</Text>

                {dataTrenXe.length > 0 &&
                    <Card style={{ marginTop: 0 }} dataArray={dataTrenXe}
                        renderRow={(dataTrenXe) =>
                            <CardItem>
                                <View style={{ flex: 5 }}>
                                    <Text>Họ tên: <Text style={{ fontWeight: 'bold' }}>{dataTrenXe.bvv_ten_khach_hang}</Text></Text>
                                    <Text>SĐT: <Text style={{ fontWeight: 'bold' }}>{dataTrenXe.bvv_phone}</Text></Text>
                                    <Text>Giường: <Text style={{ fontWeight: 'bold' }}>{dataTrenXe.sdgct_label_full}</Text></Text>
                                    <Text>Điểm đi - Điểm đến: <Text style={{ fontWeight: 'bold' }}>{dataTrenXe.bvv_ben_a + ' -> ' + dataTrenXe.bvv_ben_b}</Text></Text>
                                    <Text>Giá: <Text style={{ fontWeight: 'bold' }}>{Common.formatPrice(dataTrenXe.bvv_price) + ' VNĐ'}</Text></Text>
                                </View>
                            </CardItem>
                        }>
                    </Card>
                }

            </ScrollView>
        );
    }
}

class ReportSeri extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrVeXuongXe: [],
            arrVeNumber: [],
        };
    }

    static navigationOptions = {
        tabBarLabel: 'Chưa có seri',
    };

    render() {
        let dataVeNumber = Object.values(this.props.screenProps);
        let dataTrenXe = [];
        let tongSoVe = 0;

        for (let i = 0; i < dataVeNumber.length; i++) {
            if (dataVeNumber[i].bvv_status > 0 && dataVeNumber[i].bvv_seri == '0') {
                dataTrenXe.push(dataVeNumber[i]);
            }
        }


        console.log('Data tren xe: ');
        console.log(dataTrenXe);
        tongSoVe = dataTrenXe.length;

        return (
            <ScrollView style={{ marginBottom: 50 }}>
                {/* {this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>} */}

                <Text style={{ color: 'red', alignItems: 'flex-start', marginTop: 10, marginLeft: 10 }}>Tổng số vé: {tongSoVe + ' vé'}</Text>

                {dataTrenXe.length > 0 &&
                    <Card style={{ marginTop: 0 }} dataArray={dataTrenXe}
                        renderRow={(dataTrenXe) =>
                            <CardItem>
                                <View style={{ flex: 5 }}>
                                    <Text>Họ tên: <Text style={{ fontWeight: 'bold' }}>{dataTrenXe.bvv_ten_khach_hang}</Text></Text>
                                    <Text>SĐT: <Text style={{ fontWeight: 'bold' }}>{dataTrenXe.bvv_phone}</Text></Text>
                                    <Text>Giường: <Text style={{ fontWeight: 'bold' }}>{dataTrenXe.sdgct_label_full}</Text></Text>
                                    <Text>Điểm đi - Điểm đến: <Text style={{ fontWeight: 'bold' }}>{dataTrenXe.bvv_ben_a + ' -> ' + dataTrenXe.bvv_ben_b}</Text></Text>
                                    <Text>Giá: <Text style={{ fontWeight: 'bold' }}>{Common.formatPrice(dataTrenXe.bvv_price) + ' VNĐ'}</Text></Text>
                                </View>
                            </CardItem>
                        }>
                    </Card>
                }

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 58,
        height: heightDevice
    },
    marginButton: {
        marginTop: 10
    },
    paddingContent: {
        padding: 30
    },
    opacityBg: {
        flexDirection: 'row',
    },
    styleTabbars: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f7f7'
    },
    countDanhSachCho: {
        position: 'absolute',
        right: 25,
        top: 0,
        backgroundColor: 'rgba(255,114,114, 0.7)',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100
    },
    colorTabs: {
        color: '#999'
    }
});

async function checkServerAlive() {
    // try {
    //     let response = await fetch('http://hasonhaivan.vn/api/ping.php');
    //     let responseJson = await response.json();
    //     return true;
    // } catch (error) {
    //     console.log(error);
    //     return false;
    // }

    return await isConnected();

}

const MainScreenReport = TabNavigator({
    ReportSales: { screen: ReportTicket },
    ReportSeri: { screen: ReportSeri },
}, {
        tabBarPosition: 'top',
        tabBarOptions: {
            labelStyle: {
                fontSize: 15,
            },
            // activeTintColor: '#ffca6b',
            // inactiveTintColor: '#fff',
        }

    });

AppRegistry.registerComponent('MainScreenReport', () => MainScreenReport);