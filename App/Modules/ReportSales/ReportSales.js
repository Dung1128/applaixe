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

const heightDevice = Dimensions.get('window').height;

export default class ReportSales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            arrVeXuongXe: [],
            arrVeNumber: [],
            infoAdm: []
        };
    }

    async _getDoanhThu(token, admId) {
        this.setState({
            loading: true
        });
        let sttInternet = await checkServerAlive();
        this.setState({
            sttInternet: sttInternet
        });
        let did_id = this.props.dataParam.did_id;
        var nameStoreArrVeXuongXe = 'arrVeXuongXe' + did_id;
        var dataVeXuongXe = [];
        let data = [];

        var dataVeNumber = [];

        var nameStoreArrVeNumber = 'arrVeNumberReport' + did_id;

        if (this.state.sttInternet != false) {
            try {
                let params = {
                    token: token,
                    adm_id: admId,
                    did_id: did_id
                }
                let data = await fetchData('api_sdg_danh_sach_xuong_xe', params, 'GET');
                if (data.status == 404) {
                    alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
                    Actions.welcome({ type: 'reset' });
                } else {
                    dataVeXuongXe = data.arrData;
                }
            } catch (e) {
                console.log(e);
            }

            try {
                let params = {
                    token: token,
                    adm_id: admId,
                    did_id: did_id
                }
                data = await fetchData('api_so_do_giuong', params, 'GET');
                if (data.status == 404) {
                    alert(data.mes);
                    Actions.welcome({ type: 'reset' });
                } else if (data.status == 200) {
                    //Luu vao danh sach store
                    //Danh sach luu store
                    dataVeNumber = data.arrVeNumber;
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            let storeVeXuongXe = await AsyncStorage.getItem(nameStoreArrVeXuongXe);
            dataVeXuongXe = JSON.parse(storeVeXuongXe);

            let storeArrVeNumber = await AsyncStorage.getItem(nameStoreArrVeNumber);
            dataVeNumber = JSON.parse(storeArrVeNumber);
        }

        this.setState({
            arrVeXuongXe: dataVeXuongXe,
            arrVeNumber: dataVeNumber,
            loading: false
        });

        //Luu store
        var result = JSON.stringify(dataVeXuongXe);
        AsyncStorage.removeItem(nameStoreArrVeXuongXe);
        AsyncStorage.setItem(nameStoreArrVeXuongXe, result);

        var result = JSON.stringify(dataVeNumber);
        AsyncStorage.removeItem(nameStoreArrVeNumber);
        AsyncStorage.setItem(nameStoreArrVeNumber, result);
    }

    async _getDanhSachTrenXe(token, admId) {
        this.setState({
            loading: true
        });

        let did_id = this.props.dataParam.did_id;
        let data = [];

        //Kiem tra mang
        var sttInternet = await checkServerAlive();
        this.setState({
            sttInternet: sttInternet
        });

        var dataVeNumber = [];

        var nameStoreArrVeNumber = 'arrVeNumberReport' + did_id;
        //AsyncStorage.removeItem(nameStorelistChuyen);
        //Lay du lieu neu ko co mang

        if (this.state.sttInternet == false) {
            let storeArrVeNumber = await AsyncStorage.getItem(nameStoreArrVeNumber);

            dataVeNumber = JSON.parse(storeArrVeNumber);

        } else {
            //Lay du lieu
            try {
                let params = {
                    token: token,
                    adm_id: admId,
                    did_id: did_id
                }
                data = await fetchData('api_so_do_giuong', params, 'GET');
                if (data.status == 404) {
                    alert(data.mes);
                    Actions.welcome({ type: 'reset' });
                } else if (data.status == 200) {
                    //Luu vao danh sach store
                    //Danh sach luu store
                    dataVeNumber = data.arrVeNumber;

                    //Luu vao store
                    var result = JSON.stringify(dataVeNumber);
                    AsyncStorage.removeItem(nameStoreArrVeNumber);
                    AsyncStorage.setItem(nameStoreArrVeNumber, result);

                }
            } catch (e) {
                this.setState({
                    loading: false
                });
            }
        }

        this.setState({
            arrVeNumber: dataVeNumber,
            loading: false
        });
    }

    async componentDidMount() {
        let results = await StorageHelper.getStore('infoAdm');
        results = JSON.parse(results);
        let admId = results.adm_id;
        let token = results.token;
        let data = [];
        this.setState({
            infoAdm: results,
            token: token,
            loading: true
        });

        this._getDoanhThu(token, admId);
        // this._getDanhSachTrenXe(token, admId);
    }


    render() {
        let dataDanhSach = this.state.arrVeXuongXe;
        let dataVeNumber = Object.values(this.state.arrVeNumber);
        let dataTrenXe = [];
        let tongDoanhThu = 0;
        let tongSoVe = 0;

        for (let i = 0; i < dataVeNumber.length; i++) {
            if (dataVeNumber[i].bvv_status > 0 && dataVeNumber[i].bvv_seri != '0') {
                dataTrenXe.push(dataVeNumber[i]);
            }
        }

        console.log('Data tren xe: ');
        console.log(dataTrenXe);

        for (let i = 0; i < dataDanhSach.length; i++) {
            tongDoanhThu += Number(dataDanhSach[i].bvv_price);
        }

        for (let i = 0; i < dataTrenXe.length; i++) {
            tongDoanhThu += dataTrenXe[i].bvv_price;
        }

        tongSoVe = dataDanhSach.length + dataTrenXe.length;

        let dataParam = {
            did_id: this.props.dataParam.did_id,
            countCho: this.props.dataParam.countCho
        };
        return (
            <View style={styles.container}>
                <ScrollView style={{ marginBottom: 50 }}>
                    {this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}

                    <Text style={{ color: 'red', alignItems: 'flex-start', marginTop: 10, marginLeft: 10 }}>Tổng số vé: {tongSoVe + ' vé'}</Text>
                    <Text style={{ color: 'red', alignItems: 'flex-start', margin: 10 }}>Tổng doanh thu: {Common.formatPrice(tongDoanhThu) + ' VNĐ'}</Text>

                    {!this.state.loading && dataDanhSach.length > 0 &&
                        <Card style={{ marginTop: 0 }} dataArray={dataDanhSach}
                            renderRow={(dataDanhSach) =>
                                <CardItem>
                                    <View style={{ flex: 5 }}>
                                        <Text>Họ tên: <Text style={{ fontWeight: 'bold' }}>{dataDanhSach.bvv_ten_khach_hang}</Text></Text>
                                        <Text>SĐT: <Text style={{ fontWeight: 'bold' }}>{dataDanhSach.bvv_phone}</Text></Text>
                                        <Text>Giường: <Text style={{ fontWeight: 'bold' }}>{dataDanhSach.sdgct_label_full}</Text></Text>
                                        <Text>Điểm đi - Điểm đến: <Text style={{ fontWeight: 'bold' }}>{dataDanhSach.ben_a + ' -> ' + dataDanhSach.ben_b}</Text></Text>
                                        <Text>Giá: <Text style={{ fontWeight: 'bold' }}>{Common.formatPrice(dataDanhSach.bvv_price) + ' VNĐ'}</Text></Text>
                                    </View>
                                </CardItem>
                            }>
                        </Card>
                    }

                    {!this.state.loading && dataTrenXe.length > 0 &&
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

                <ComSDGFooter dataParam={dataParam} />
            </View>
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
    try {
        let response = await fetch('http://hasonhaivan.vn/api/ping.php');
        let responseJson = await response.json();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}