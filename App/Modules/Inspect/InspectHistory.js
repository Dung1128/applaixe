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
    ScrollView,
    Image
} from 'react-native';
import {
    Card, CardItem
} from 'native-base';
import { domain, cache, colorLogo } from '../../Config/common';
import StorageHelper from '../../Components/StorageHelper';
import Common from '../../Components/Common';
import fetchData from '../../Components/FetchData';
import { Button, Icon, Spinner, Thumbnail } from 'native-base';
import { Actions } from 'react-native-router-flux';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modalbox';
const { height, width } = Dimensions.get('window');
const limit = 24;
const rem = 16 / 360 * width;
const img = require('../../Skin/Images/camera.png');

class InspectHistory extends Component {

    constructor(props) {
        super(props);
        let date = new Date();
        this.state = {
            loading: true,
            isDisabled: false,
            infoAdm: [],
            token: '',
            arrLoi: [],
            errorDetail: { xtt_tien_khach: '0', xtt_tien_hang: '0' },
            showDatePicker: false,
            date: date,
            day: date.getDate(),
            month: (date.getMonth() + 1),
            year: date.getFullYear(),
            fullDate: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear(),
            WEEKDAYS: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            MONTHS: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7',
                'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        };
    }

    async componentWillMount() {
        let info = await StorageHelper.getStore('infoAdm');
        let results = JSON.parse(info);
        let admId = results.adm_id;
        let token = results.token;
        let arrLoi = [];
        let date = new Date();
        let day = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

        var that = this;

        try {
            let params = {
                token: token,
                adm_id: admId,
                day: day
            };

            let data = await fetchData('api_adm_view_listing', params, 'GET');

            if (data.status == 200) {
                arrLoi = data.arrThanhTra;
            }

            this.setState({
                loading: false,
                infoAdm: results,
                token: token,
                arrLoi: arrLoi,
            });
        } catch (error) {
            console.log(error);
        }
    }

    renderListError() {
        let html = [];
        let arrLoi = this.state.arrLoi;
        let tien_khach = '0',
            tien_hang = '0';

        for (let i = 0; i < arrLoi.length; i++) {
            tien_khach = (arrLoi[i].xtt_tien_khach != '') ? arrLoi[i].xtt_tien_khach : '0';
            tien_hang = (arrLoi[i].xtt_tien_hang != '') ? arrLoi[i].xtt_tien_hang : '0';

            html.push(
                <TouchableOpacity
                    key={i}
                    style={{ padding: 10, marginHorizontal: 20, borderWidth: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', }}
                    onPress={() => this.openModalErrorDetail(arrLoi[i])}
                >
                    <Text style={{ flex: 1 }}>Tuyến: <Text>{arrLoi[i].tuy_ten}</Text></Text>
                    <Text style={{ flex: 1 }}>BKS: <Text>{arrLoi[i].xe_bien_kiem_soat}</Text></Text>
                    <Text style={{ flex: 1 }}>Địa điểm: <Text>{arrLoi[i].xtt_dia_diem}</Text></Text>
                    <Text style={{ flex: 1 }}>Số lệnh vận chuyển: <Text>{arrLoi[i].xtt_so_lenh_van_chuyen}</Text></Text>
                    <Text style={{ flex: 1 }}>Thanh tra: <Text>{arrLoi[i].adm_name}</Text></Text>
                    <Text style={{ flex: 1 }}>Lái xe 1: <Text>{arrLoi[i].lai_xe_1}</Text></Text>
                    <Text style={{ flex: 1 }}>Lái xe 2: <Text>{arrLoi[i].lai_xe_2}</Text></Text>
                    <Text style={{ flex: 1 }}>Tiếp viên: <Text>{arrLoi[i].tiep_vien}</Text></Text>
                    <Text style={{ flex: 1 }}>Lỗi: <Text>{arrLoi[i].nhom_loi}</Text></Text>
                    <Text style={{ flex: 1 }}>Nội dung vi phạm: <Text>{arrLoi[i].xtt_noi_dung_vi_pham}</Text></Text>
                    <Text style={{ flex: 1 }}>Số khách: <Text>{arrLoi[i].xtt_so_khach}</Text></Text>
                    <Text style={{ flex: 1 }}>Số khách lên: <Text>{arrLoi[i].xtt_so_khach_len}</Text></Text>
                    <Text style={{ flex: 1 }}>Số khách trên xe: <Text>{arrLoi[i].xtt_so_khach_tren_xe}</Text></Text>
                    <Text style={{ flex: 1 }}>Tiền khách: <Text>{Common.formatPrice(tien_khach)}</Text></Text>
                    <Text style={{ flex: 1 }}>Tiền hàng: <Text>{Common.formatPrice(tien_hang)}</Text></Text>
                    {/* {(arrLoi[i].xtt_img != null) && (arrLoi[i].xtt_img != '') &&
                        <Image
                            source={{ uri: arrLoi[i].xtt_img }}
                            style={styles.image}
                        />
                    } */}
                    <Text style={{ flex: 1 }}>Ghi chú: <Text>{arrLoi[i].xtt_thong_tin_khac}</Text></Text>
                    <Text style={{ flex: 1 }}>Ngày lập: <Text>{arrLoi[i].xtt_time}</Text></Text>
                </TouchableOpacity>
            );
        }

        return html;
    }

    _setDatePickerShow() {
        this.setState({
            showDatePicker: true
        });
        this.openModal();
    }

    openModal() {
        this.refs.modal3.open();
    }

    closeModal() {
        this.refs.modal3.close();
    }

    _renderDatePicker() {
        return (
            <CalendarPicker
                selectedDate={this.state.date}
                onDateChange={(date) => this.onDateChange({ date })}
                months={this.state.MONTHS}
                weekdays={this.state.WEEKDAYS}
                previousTitle='Tháng trước'
                nextTitle='Tháng sau'
                screenWidth={Dimensions.get('window').width}
                selectedBackgroundColor={'#5ce600'} />
        );
    }

    onDateChange(date) {
        let currentSelectDate = date.date;
        this.setState({
            date: currentSelectDate,
            day: currentSelectDate.getDate(),
            month: (currentSelectDate.getMonth() + 1),
            year: currentSelectDate.getFullYear(),
            fullDate: currentSelectDate.getDate() + '-' + (currentSelectDate.getMonth() + 1) + '-' + currentSelectDate.getFullYear()
        });
        this.closeModal();
    }

    async getListError() {
        let arrLoi = [];

        try {
            let params = {
                token: this.state.token,
                adm_id: this.state.infoAdm.adm_id,
                day: this.state.fullDate,
            };

            let data = await fetchData('api_adm_view_listing', params, 'GET');

            if (data.status == 200) {
                arrLoi = data.arrThanhTra;
            }

            this.setState({
                arrLoi: arrLoi,
            });
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <View style={{ height: height, width: width, paddingTop: 60 }}>

                <ScrollView>
                    {this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
                    {!this.state.loading &&
                        <View style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', marginHorizontal: 20, marginVertical: 10, height: 40, alignItems: 'center', borderWidth: 1, borderColor: '#ccc', }}>
                                <Text style={{ flex: 3, paddingLeft: 10, textAlignVertical: 'center', }} onPress={() => this._setDatePickerShow()}>{this.state.fullDate}</Text>
                                <TouchableOpacity style={{ flex: 1, borderRadius: 0, height: 40, backgroundColor: '#1e90ff', alignItems: 'center', justifyContent: 'center' }} onPress={() => { this.getListError() }}>
                                    <Icon name="ios-search" style={{ color: '#fff' }} />
                                </TouchableOpacity>
                            </View>
                            {(this.state.arrLoi.length == 0) &&
                                <View style={{ margin: 20, alignItems: 'center' }}>
                                    <Text>Không có dữ liệu!</Text>
                                </View>
                            }
                            {(this.state.arrLoi.length > 0) &&
                                <View style={{ flexDirection: 'column', marginBottom: 20 }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginBottom: 10, marginTop: 20 }}>LỊCH SỬ THANH TRA</Text>
                                    {this.renderListError()}
                                </View>
                            }
                        </View>
                    }
                </ScrollView>
                <Modal style={[styles.modal, styles.modalPopup, { paddingTop: 50 }]} position={"top"} ref={"modal3"} isDisabled={this.state.isDisabled}>
                    <TouchableOpacity onPress={() => this.closeModal()} style={{ width: 50, height: 40, position: 'absolute', right: 0, top: 0, padding: 10 }}>
                        <Icon name="ios-close-circle" />
                    </TouchableOpacity>
                    {this._renderDatePicker()}
                </Modal>
                <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modalErrorDetail"} swipeArea={20}>
                    <ScrollView>
                        <View style={{ width: width, paddingBottom: 10 }}>
                            <View style={styles.close_popup}>
                                <TouchableOpacity onPress={() => this.closeModalErrorDetail()} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <Icon name="md-close" style={{ fontSize: 30 }} />
                                </TouchableOpacity>
                            </View>
                            {this._renderModalErrorDetail()}
                        </View>
                    </ScrollView>
                </Modal>
            </View>
        );
    }

    openModalErrorDetail(error) {
        this.setState({
            errorDetail: error,
        });

        this.refs.modalErrorDetail.open();
    }

    closeModalErrorDetail() {
        this.refs.modalErrorDetail.close();
    }

    _renderModalErrorDetail() {
        let errorDetail = this.state.errorDetail,
            tien_khach = (errorDetail.xtt_tien_khach != '') ? errorDetail.xtt_tien_khach : '0',
            tien_hang = (errorDetail.xtt_tien_hang != '') ? errorDetail.xtt_tien_hang : '0';

        return (
            <View style={{ width: width, height: height, paddingTop: 10, position: 'relative', paddingBottom: 120, margin: 20 }}>
                    <Text >Tuyến: <Text>{errorDetail.tuy_ten}</Text></Text>
                    <Text >BKS: <Text>{errorDetail.xe_bien_kiem_soat}</Text></Text>
                    <Text >Địa điểm: <Text>{errorDetail.xtt_dia_diem}</Text></Text>
                    <Text >Số lệnh vận chuyển: <Text>{errorDetail.xtt_so_lenh_van_chuyen}</Text></Text>
                    <Text >Thanh tra: <Text>{errorDetail.adm_name}</Text></Text>
                    <Text >Lái xe 1: <Text>{errorDetail.lai_xe_1}</Text></Text>
                    <Text >Lái xe 2: <Text>{errorDetail.lai_xe_2}</Text></Text>
                    <Text >Tiếp viên: <Text>{errorDetail.tiep_vien}</Text></Text>
                    <Text >Lỗi: <Text>{errorDetail.nhom_loi}</Text></Text>
                    <Text >Nội dung vi phạm: <Text>{errorDetail.xtt_noi_dung_vi_pham}</Text></Text>
                    <Text >Số khách: <Text>{errorDetail.xtt_so_khach}</Text></Text>
                    <Text >Số khách lên: <Text>{errorDetail.xtt_so_khach_len}</Text></Text>
                    <Text >Số khách trên xe: <Text>{errorDetail.xtt_so_khach_tren_xe}</Text></Text>
                    <Text >Tiền khách: <Text>{Common.formatPrice(tien_khach)}</Text></Text>
                    <Text >Tiền hàng: <Text>{Common.formatPrice(tien_hang)}</Text></Text>
                    {(errorDetail.xtt_img != null) && (errorDetail.xtt_img != '') &&
                        <Image
                            source={{ uri: errorDetail.xtt_img }}
                            style={styles.image}
                        />
                    }
                    <Text >Ghi chú: <Text>{errorDetail.xtt_thong_tin_khac}</Text></Text>
                    <Text >Ngày lập: <Text>{errorDetail.xtt_time}</Text></Text>
            </View>
        )
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

    },
    image: {
        width: rem * 6.625 * 3,
        height: rem * 6.625 * 3,
        borderRadius: rem * .25,
        borderWidth: 1,
        borderColor: '#E18D2D',
        marginLeft: 2,
        marginVertical: 20,
    },
    close_popup: {
        position: 'absolute', zIndex: 9, top: 10, right: 10, width: 50, height: 50
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal4: {
        height: height,
        paddingTop: 60
    },
});

export default InspectHistory
