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
    Platform,
    Image,
    KeyboardAvoidingView
} from 'react-native';
import { domain, cache, colorLogo } from '../../Config/common';
import StorageHelper from '../../Components/StorageHelper';
import fetchData from '../../Components/FetchData';
import Common from '../../Components/Common';
import Modal from 'react-native-modalbox';
import { Button, Icon, Spinner, Thumbnail, Input, Card, CardItem } from 'native-base';
import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
const { height, width } = Dimensions.get('window');
const img = require('../../Skin/Images/camera.png');

const rem = 16 / 360 * width;

class Inspect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            adm_id: '',
            arrLaixe: [],
            arrLoi: [],
            arrTiepvien: [],
            arrTuyen: [],
            arrXe: [],
            id_tuyen: '',
            tuyen: '',
            id_xe: '',
            xe: '',
            id_lai1: '',
            lai1: '',
            id_lai2: '',
            lai2: '',
            id_tiepvien: '',
            tiepvien: '',
            id_loi: '',
            loi: '',
            xtt_so_lenh_van_chuyen: '',
            xtt_dia_diem: '',
            xtt_so_khach_tren_xe: '',
            xtt_so_khach_len: '',
            xtt_tien_khach: '',
            xtt_so_khach: '',
            xtt_tien_hang: '',
            xtt_noi_dung_vi_pham: '',
            xtt_thong_tin_khac: '',
            xtt_img: '',
            searchTuyen: false,
            searchXe: false,
            searchLai1: false,
            searchLai2: false,
            searchTiepVien: false,
            searchLoi: false,
            img: img,
        };
    }

    async componentWillMount() {
        try {
            let info = await StorageHelper.getStore('infoAdm');
            info = JSON.parse(info);
            let admId = info.adm_id;
            let token = info.token;
            let arrLaixe = [],
                arrLoi = [],
                arrTiepvien = [],
                arrTuyen = [],
                arrXe = [];

            let params = {
                token: token,
                adm_id: admId,
            };

            let data = await fetchData('api_adm_get_lx', params, 'GET');

            if (data.status == 200) {
                arrLaixe = data.arrLaiXe;
            }

            let params1 = {
                token: token,
                adm_id: admId,
            };

            let data1 = await fetchData('api_adm_get_loi_vi_pham', params1, 'GET');

            if (data1.status == 200) {
                arrLoi = data1.arrLoi;
            }

            let params2 = {
                token: token,
                adm_id: admId,
            };

            let data2 = await fetchData('api_adm_get_tiep_vien', params2, 'GET');

            if (data2.status == 200) {
                arrTiepvien = data2.arrLaiTV;
            }

            let params3 = {
                token: token,
                adm_id: admId,
            };

            let data3 = await fetchData('api_adm_get_tuyen', params3, 'GET');

            if (data3.status == 200) {
                arrTuyen = data3.arrTuyen;
            }

            let params4 = {
                token: token,
                adm_id: admId,
            };

            let data4 = await fetchData('api_adm_get_xe', params4, 'GET');

            if (data4.status == 200) {
                arrXe = data4.arrXe;
            }

            this.setState({
                loading: false,
                token: token,
                adm_id: admId,
                arrTuyen: arrTuyen,
                arrLaixe: arrLaixe,
                arrXe: arrXe,
                arrTiepvien: arrTiepvien,
                arrLoi: arrLoi,
            });

        } catch (e) {
            console.error(e);
        }
    }

    _onChangeText(value) {
        value = value.split(".").join("");

        if (value != "") {
            value = value.replace(/\D/g, "");

            value = value.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1" + ".");
        }

        return value;
    }

    _onChangeTienHang(value) {
        let val = this._onChangeText(value);

        this.setState({ xtt_tien_hang: val });
    }

    _onChangeTienKhach(value) {
        let val = this._onChangeText(value);

        this.setState({ xtt_tien_khach: val });
    }

    render() {
        let tuyen = this.state.tuyen,
            xe = this.state.xe,
            lai1 = this.state.lai1,
            lai2 = this.state.lai2,
            tiepvien = this.state.tiepvien,
            loi = this.state.loi,
            th = this.state.xtt_tien_hang,
            color_tuyen = (this.state.tuyen == '') ? '#FF0000' : '#000000',
            color_xe = (this.state.xe == '') ? '#FF0000' : '#000000';


        return (
            <View style={{ height: height, width: width, paddingTop: 60 }}>
                <ScrollView>
                    {this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
                    {!this.state.loading &&
                        // <View style={{ flexDirection: 'column', margin: 20 }}>
                        <KeyboardAvoidingView
                            style={{ flexDirection: 'column', margin: 20 }}
                        // contentContainerStyle={{ flexDirection: 'column', margin: 20 }}
                        // behavior="padding"
                        >
                            <TouchableOpacity
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60 }}
                                onPress={() => { this.openModalTuyen() }}>
                                <Text style={{ marginLeft: 10, textAlignVertical: 'center', color: '#000000' }}>
                                    {tuyen == '' ? 'Chọn tuyến (*)' : tuyen}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60 }}
                                onPress={() => { this.openModalXe() }}>
                                <Text style={{ marginLeft: 10, textAlignVertical: 'center', color: '#000000' }}>
                                    {xe == '' ? 'Chọn xe (*)' : xe}
                                </Text>
                            </TouchableOpacity>

                            <Input
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60, paddingLeft: 10 }}
                                placeholder='Số lệnh vận chuyển (*)'
                                placeholderTextColor='#000000'
                                onChangeText={(lenh) => { this.setState({ xtt_so_lenh_van_chuyen: lenh }) }}
                            />

                            <Input
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60, paddingLeft: 10 }}
                                placeholder='Địa điểm (*)'
                                placeholderTextColor='#000000'
                                onChangeText={(ddiem) => { this.setState({ xtt_dia_diem: ddiem }) }}
                            />

                            <TouchableOpacity
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60 }}
                                onPress={() => { this.openModalLaiXe1() }}>
                                <Text style={{ marginLeft: 10, textAlignVertical: 'center', color: '#000000' }}>
                                    {lai1 == '' ? 'Chọn lái xe 1' : lai1}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60 }}
                                onPress={() => { this.openModalLaiXe2() }}>
                                <Text style={{ marginLeft: 10, textAlignVertical: 'center', color: '#000000' }}>
                                    {lai2 == '' ? 'Chọn lái xe 2' : lai2}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60 }}
                                onPress={() => { this.openModalTiepVien() }}>
                                <Text style={{ marginLeft: 10, textAlignVertical: 'center', color: '#000000' }}>
                                    {tiepvien == '' ? 'Chọn tiếp viên' : tiepvien}
                                </Text>
                            </TouchableOpacity>

                            <Input
                                keyboardType='numeric'
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60, paddingLeft: 10 }}
                                placeholder='Số khách trên xe'
                                onChangeText={(khach) => { this.setState({ xtt_so_khach_tren_xe: khach }) }}
                            />

                            <Input
                                keyboardType='numeric'
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60, paddingLeft: 10 }}
                                placeholder='Số khách lên'
                                onChangeText={(khach_len) => { this.setState({ xtt_so_khach_len: khach_len }) }}
                            />

                            <Input
                                keyboardType='numeric'
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60, paddingLeft: 10 }}
                                placeholder='Tiền khách'
                                onChangeText={(tien) => this._onChangeTienKhach(tien)}
                                value={this.state.xtt_tien_khach}
                            />

                            <Input
                                keyboardType='numeric'
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60, paddingLeft: 10 }}
                                placeholder='Số khách tổng phơi'
                                onChangeText={(khach_phoi) => { this.setState({ xtt_so_khach: khach_phoi }) }}
                            />

                            <Input
                                keyboardType='numeric'
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60, paddingLeft: 10 }}
                                placeholder='Tiền hàng'
                                onChangeText={(tien_hang) => this._onChangeTienHang(tien_hang)}
                                value={this.state.xtt_tien_hang}
                            />

                            <TouchableOpacity
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60 }}
                                onPress={() => { this.openModalLoi() }}>
                                <Text style={{ marginLeft: 10, textAlignVertical: 'center', color: '#000000' }}>
                                    {loi == '' ? 'Loại vi phạm' : loi}
                                </Text>
                            </TouchableOpacity>

                            <Input
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60, paddingLeft: 10 }}
                                placeholder='Nội dung vi phạm'
                                onChangeText={(vi_pham) => { this.setState({ xtt_noi_dung_vi_pham: vi_pham }) }}
                            />

                            <TouchableOpacity
                                onPress={() => this.onPressButtonImagePicker()}
                                style={{ alignItems: 'center' }}
                            >
                                <Image
                                    source={this.state.img}
                                    style={styles.image}
                                />
                            </TouchableOpacity>

                            <Input
                                style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60, paddingLeft: 10 }}
                                placeholder='Ghi chú'
                                onChangeText={(ghi_chu) => { this.setState({ xtt_thong_tin_khac: ghi_chu }) }}
                            />

                            <TouchableOpacity
                                style={{
                                    height: 60,
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    borderColor: colorLogo,
                                    backgroundColor: colorLogo,
                                    marginVertical: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => { this.saveLoi() }}
                            >
                                <Text style={{ alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>HOÀN THÀNH</Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                        // {/* </View> */}
                    }
                </ScrollView>

                <Modal style={[styles.modal, styles.wrapPopup, { height: height }]} position={"center"} ref={"modalTuyen"} isDisabled={this.state.isDisabled}>
                    {this._renderModalTuyen()}
                </Modal>

                <Modal style={[styles.modal, styles.wrapPopup, { height: height }]} position={"center"} ref={"modalXe"} isDisabled={this.state.isDisabled}>
                    {this._renderModalXe()}
                </Modal>

                <Modal style={[styles.modal, styles.wrapPopup, { height: height }]} position={"center"} ref={"modalLaixe1"} isDisabled={this.state.isDisabled}>
                    {this._renderModalLaiXe1()}
                </Modal>

                <Modal style={[styles.modal, styles.wrapPopup, { height: height }]} position={"center"} ref={"modalLaixe2"} isDisabled={this.state.isDisabled}>
                    {this._renderModalLaiXe2()}
                </Modal>

                <Modal style={[styles.modal, styles.wrapPopup, { height: height }]} position={"center"} ref={"modalTiepVien"} isDisabled={this.state.isDisabled}>
                    {this._renderModalTiepVien()}
                </Modal>

                <Modal style={[styles.modal, styles.wrapPopup, { height: height }]} position={"center"} ref={"modalLoi"} isDisabled={this.state.isDisabled}>
                    {this._renderModalLoi()}
                </Modal>
            </View>
        );
    }

    async saveLoi() {
        try {
            if (this.state.id_tuyen == '') {
                alert('Vui lòng chọn tuyến');
                return
            }

            if (this.state.id_xe == '') {
                alert('Vui lòng chọn xe');
                return
            }

            if (this.state.xtt_so_lenh_van_chuyen.trim() == '') {
                alert('Vui lòng nhập số lệnh vận chuyển');
                return
            }

            if (this.state.xtt_dia_diem.trim() == '') {
                alert('Vui lòng nhập địa điểm');
                return
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    let params = {
                        token: this.state.token,
                        adm_id: this.state.adm_id,
                        xtt_tuyen_id: this.state.id_tuyen,
                        xtt_xe_id: this.state.id_xe,
                        xtt_so_lenh_van_chuyen: this.state.xtt_so_lenh_van_chuyen,
                        xtt_dia_diem: this.state.xtt_dia_diem,
                        xtt_so_khach_tren_xe: this.state.xtt_so_khach_tren_xe,
                        xtt_so_khach_len: this.state.xtt_so_khach_len,
                        xtt_tien_khach: this.state.xtt_tien_khach.split(".").join(""),
                        xtt_so_khach: this.state.xtt_so_khach,
                        xtt_tien_hang: this.state.xtt_tien_hang.split(".").join(""),
                        xtt_lai_xe_1: this.state.id_lai1,
                        xtt_lai_xe_2: this.state.id_lai2,
                        xtt_tiep_vien: this.state.id_tiepvien,
                        xtt_noi_dung_vi_pham: this.state.xtt_noi_dung_vi_pham,
                        xtt_loai_vi_pham: this.state.id_loi,
                        xtt_thong_tin_khac: this.state.xtt_thong_tin_khac,
                        xtt_img: this.state.xtt_img,
                        xtt_lat: position.coords.latitude,
                        xtt_long: position.coords.longitude,
                    }

                    let data = await fetchData('api_adm_save_listing', params, 'POST');

                    if (data.status != 200) {
                        alert(data.mes);
                        return;
                    }

                    Actions.InspectHistory();
                },
                async (error) => {
                    let params = {
                        token: this.state.token,
                        adm_id: this.state.adm_id,
                        xtt_tuyen_id: this.state.id_tuyen,
                        xtt_xe_id: this.state.id_xe,
                        xtt_so_lenh_van_chuyen: this.state.xtt_so_lenh_van_chuyen,
                        xtt_dia_diem: this.state.xtt_dia_diem,
                        xtt_so_khach_tren_xe: this.state.xtt_so_khach_tren_xe,
                        xtt_so_khach_len: this.state.xtt_so_khach_len,
                        xtt_tien_khach: this.state.xtt_tien_khach.split(".").join(""),
                        xtt_so_khach: this.state.xtt_so_khach,
                        xtt_tien_hang: this.state.xtt_tien_hang.split(".").join(""),
                        xtt_lai_xe_1: this.state.id_lai1,
                        xtt_lai_xe_2: this.state.id_lai2,
                        xtt_tiep_vien: this.state.id_tiepvien,
                        xtt_noi_dung_vi_pham: this.state.xtt_noi_dung_vi_pham,
                        xtt_loai_vi_pham: this.state.id_loi,
                        xtt_thong_tin_khac: this.state.xtt_thong_tin_khac,
                        xtt_img: this.state.xtt_img,
                        xtt_lat: '',
                        xtt_long: '',
                    }

                    let data = await fetchData('api_adm_save_listing', params, 'POST');

                    if (data.status != 200) {
                        alert(data.mes);
                        return;
                    }

                    Actions.InspectHistory();
                },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
            );
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }

    _str_slug(title) {
        //Đổi chữ hoa thành chữ thường
        slug = title.toLowerCase();

        //Đổi ký tự có dấu thành không dấu
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        //Xóa các ký tự đặt biệt
        // slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        //Đổi khoảng trắng thành ký tự gạch ngang
        // slug = slug.replace(/ /gi, " - ");
        //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
        //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
        // slug = slug.replace(/\-\-\-\-\-/gi, '-');
        // slug = slug.replace(/\-\-\-\-/gi, '-');
        // slug = slug.replace(/\-\-\-/gi, '-');
        // slug = slug.replace(/\-\-/gi, '-');
        //Xóa các ký tự gạch ngang ở đầu và cuối
        // slug = '@' + slug + '@';
        // slug = slug.replace(/\@\-|\-\@|\@/gi, '');


        return slug;
    }

    openModalTuyen() {
        this.refs.modalTuyen.open();
    }

    closeModalTuyen() {
        this.refs.modalTuyen.close();
    }

    _renderModalTuyen() {
        return (
            <View key="1" style={{ width: width, height: height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

                <View style={styles.close_popup}>
                    <TouchableOpacity
                        onPress={() => {
                            this.closeModalTuyen();
                            this.setState({
                                tuyen: '',
                                id_tuyen: '',
                            });
                        }}
                        style={{ alignItems: 'flex-end', justifyContent: 'center' }}
                    >
                        <Icon name="md-close" style={{ fontSize: 30 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, paddingLeft: 10, marginTop: 30, justifyContent: 'center' }}>
                        <Icon name="ios-pin-outline" style={{ fontSize: 27 }} />
                        <Input placeholder="Chọn tuyến" value={this.state.tuyen} onChangeText={(tuyen) => this._handleSetTuyen(tuyen)} style={{ paddingLeft: 15 }} />
                    </View>
                    <View style={{ backgroundColor: '#f6fbff' }}>
                        {this._handleSearchAutocomplateTuyen(this.state.tuyen)}
                    </View>
                </View>
            </View>
        )
    }

    _handleSetTuyen(tuyen) {
        if (tuyen.length > 0) {
            this.setState({ tuyen: tuyen, searchTuyen: true });
        } else {
            this.setState({ tuyen: tuyen, searchTuyen: false });
        }
    }

    _handleSearchAutocomplateTuyen(tuyen) {
        let arrTuyen = this.state.arrTuyen;
        let html = [],
            childHtml = [];

        for (var i = 0; i < arrTuyen.length; i++) {

            let label = arrTuyen[i].tuy_ten.toLowerCase();
            let tentuyen = this._str_slug(label);
            let convertTuyen = this._str_slug(tuyen.toLowerCase());
            let check = false;

            if (tentuyen.includes(convertTuyen)) {
                check = true;
            }


            if (check) {
                let value = arrTuyen[i].tuy_id;
                let label = arrTuyen[i].tuy_ten;
                childHtml.push(
                    <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10, paddingLeft: 45 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeModalTuyen();
                                this.setState({ id_tuyen: value, tuyen: label, searchTuyen: false });
                            }
                            }
                        >
                            <Text>{label}</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }


        if (arrTuyen.length == 0) {
            html.push(
                <View key="scroll_autocomplate1" style={{ overflow: 'hidden', marginVertical: 20, paddingLeft: 45 }}>
                    <Text style={{ fontSize: 15 }}>Không có tuyến</Text>
                </View>
            );
        }
        else {
            html.push(
                <View key="scroll_autocomplate2" style={{ overflow: 'hidden' }}>
                    <ScrollView>
                        {childHtml}
                    </ScrollView>
                </View>
            );
        }

        return html;
    }

    openModalXe() {
        this.refs.modalXe.open();
    }

    closeModalXe() {
        this.refs.modalXe.close();
    }

    _renderModalXe() {
        return (
            <View key="1" style={{ width: width, height: height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

                <View style={styles.close_popup}>
                    <TouchableOpacity
                        onPress={() => {
                            this.closeModalXe();
                            this.setState({
                                xe: '',
                                id_xe: '',
                            });
                        }}
                        style={{ alignItems: 'flex-end', justifyContent: 'center' }}
                    >
                        <Icon name="md-close" style={{ fontSize: 30 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, paddingLeft: 10, marginTop: 30, justifyContent: 'center' }}>
                        <Icon name="md-bus" style={{ fontSize: 27 }} />
                        <Input placeholder="Chọn xe" value={this.state.xe} onChangeText={(xe) => this._handleSetXe(xe)} style={{ paddingLeft: 15 }} />
                    </View>
                    <View style={{ backgroundColor: '#f6fbff' }}>
                        {this._handleSearchAutocomplateXe(this.state.xe)}
                    </View>
                </View>
            </View>
        )
    }

    _handleSetXe(xe) {
        if (xe.length > 0) {
            this.setState({ xe: xe, searchXe: true });
        } else {
            this.setState({ xe: xe, searchXe: false });
        }
    }

    _handleSearchAutocomplateXe(xe) {
        let arrXe = this.state.arrXe;
        let html = [],
            childHtml = [];

        for (var i = 0; i < arrXe.length; i++) {

            let label = arrXe[i].xe_bien_kiem_soat.toLowerCase();
            let convertXe = xe.toLowerCase();
            let check = false;

            if (label.includes(convertXe)) {
                check = true;
            }


            if (check) {
                let value = arrXe[i].xe_id;
                let label = arrXe[i].xe_bien_kiem_soat;
                childHtml.push(
                    <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10, paddingLeft: 45 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeModalXe();
                                this.setState({ id_xe: value, xe: label, searchXe: false });
                            }
                            }
                        >
                            <Text>{label}</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }


        if (arrXe.length == 0) {
            html.push(
                <View key="scroll_autocomplate1" style={{ overflow: 'hidden', marginVertical: 20, paddingLeft: 45 }}>
                    <Text style={{ fontSize: 15 }}>Không có xe</Text>
                </View>
            );
        }
        else {
            html.push(
                <View key="scroll_autocomplate2" style={{ overflow: 'hidden' }}>
                    <ScrollView>
                        {childHtml}
                    </ScrollView>
                </View>
            );
        }

        return html;
    }

    openModalLaiXe1() {
        this.refs.modalLaixe1.open();
    }

    closeModalLaiXe1() {
        this.refs.modalLaixe1.close();
    }

    _renderModalLaiXe1() {
        return (
            <View key="1" style={{ width: width, height: height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

                <View style={styles.close_popup}>
                    <TouchableOpacity
                        onPress={() => {
                            this.closeModalLaiXe1();
                            this.setState({
                                lai1: '',
                                id_lai1: '',
                            });
                        }}
                        style={{ alignItems: 'flex-end', justifyContent: 'center' }}
                    >
                        <Icon name="md-close" style={{ fontSize: 30 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, paddingLeft: 10, marginTop: 30, justifyContent: 'center' }}>
                        <Icon name="md-person" style={{ fontSize: 27 }} />
                        <Input placeholder="Chọn lái xe 1" value={this.state.lai1} onChangeText={(lai1) => this._handleSetLaiXe1(lai1)} style={{ paddingLeft: 15 }} />
                    </View>
                    <View style={{ backgroundColor: '#f6fbff' }}>
                        {this._handleSearchAutocomplateLaiXe1(this.state.lai1)}
                    </View>
                </View>
            </View>
        )
    }

    _handleSetLaiXe1(lai1) {
        if (lai1.length > 0) {
            this.setState({ lai1: lai1, searchLai1: true });
        } else {
            this.setState({ lai1: lai1, searchLai1: false });
        }
    }

    _handleSearchAutocomplateLaiXe1(lai1) {
        let arrLaiXe1 = this.state.arrLaixe;
        let html = [],
            childHtml = [];

        for (var i = 0; i < arrLaiXe1.length; i++) {

            let label = this._str_slug(arrLaiXe1[i].lx_name);
            let convertLaiXe = this._str_slug(lai1);
            let check = false;

            if (label.includes(convertLaiXe)) {
                check = true;
            }

            if (check) {
                let value = arrLaiXe1[i].lx_id;
                let label = arrLaiXe1[i].lx_name;
                childHtml.push(
                    <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10, paddingLeft: 45 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeModalLaiXe1();
                                this.setState({ id_lai1: value, lai1: label, searchLai1: false });
                            }
                            }
                        >
                            <Text>{label}</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }


        if (arrLaiXe1.length == 0) {
            html.push(
                <View key="scroll_autocomplate1" style={{ overflow: 'hidden', marginVertical: 20, paddingLeft: 45 }}>
                    <Text style={{ fontSize: 15 }}>Không có lái xe</Text>
                </View>
            );
        }
        else {
            html.push(
                <View key="scroll_autocomplate2" style={{ overflow: 'hidden' }}>
                    <ScrollView>
                        {childHtml}
                    </ScrollView>
                </View>
            );
        }

        return html;
    }

    openModalLaiXe2() {
        this.refs.modalLaixe2.open();
    }

    closeModalLaiXe2() {
        this.refs.modalLaixe2.close();
    }

    _renderModalLaiXe2() {
        return (
            <View key="1" style={{ width: width, height: height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

                <View style={styles.close_popup}>
                    <TouchableOpacity
                        onPress={() => {
                            this.closeModalLaiXe2();
                            this.setState({
                                lai2: '',
                                id_lai2: '',
                            });
                        }}
                        style={{ alignItems: 'flex-end', justifyContent: 'center' }}
                    >
                        <Icon name="md-close" style={{ fontSize: 30 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, paddingLeft: 10, marginTop: 30, justifyContent: 'center' }}>
                        <Icon name="md-person" style={{ fontSize: 27 }} />
                        <Input placeholder="Chọn lái xe 2" value={this.state.lai2} onChangeText={(lai2) => this._handleSetLaiXe2(lai2)} style={{ paddingLeft: 15 }} />
                    </View>
                    <View style={{ backgroundColor: '#f6fbff' }}>
                        {this._handleSearchAutocomplateLaiXe2(this.state.lai2)}
                    </View>
                </View>
            </View>
        )
    }

    _handleSetLaiXe2(lai2) {
        if (lai2.length > 0) {
            this.setState({ lai2: lai2, searchLai2: true });
        } else {
            this.setState({ lai2: lai2, searchLai2: false });
        }
    }

    _handleSearchAutocomplateLaiXe2(lai2) {
        let arrLaiXe = this.state.arrLaixe;
        let html = [],
            childHtml = [];

        for (var i = 0; i < arrLaiXe.length; i++) {

            let label = this._str_slug(arrLaiXe[i].lx_name);
            let convertLaiXe = this._str_slug(lai2);
            let check = false;

            if (label.includes(convertLaiXe)) {
                check = true;
            }


            if (check) {
                let value = arrLaiXe[i].lx_id;
                let label = arrLaiXe[i].lx_name;
                childHtml.push(
                    <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10, paddingLeft: 45 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeModalLaiXe2();
                                this.setState({ id_lai2: value, lai2: label, searchLai2: false });
                            }
                            }
                        >
                            <Text>{label}</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }


        if (arrLaiXe.length == 0) {
            html.push(
                <View key="scroll_autocomplate1" style={{ overflow: 'hidden', marginVertical: 20, paddingLeft: 45 }}>
                    <Text style={{ fontSize: 15 }}>Không có lái xe</Text>
                </View>
            );
        }
        else {
            html.push(
                <View key="scroll_autocomplate2" style={{ overflow: 'hidden' }}>
                    <ScrollView>
                        {childHtml}
                    </ScrollView>
                </View>
            );
        }

        return html;
    }

    openModalTiepVien() {
        this.refs.modalTiepVien.open();
    }

    closeModalTiepVien() {
        this.refs.modalTiepVien.close();
    }

    _renderModalTiepVien() {
        return (
            <View key="1" style={{ width: width, height: height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

                <View style={styles.close_popup}>
                    <TouchableOpacity
                        onPress={() => {
                            this.closeModalTiepVien();
                            this.setState({
                                tiepvien: '',
                                id_tiepvien: '',
                            });
                        }}
                        style={{ alignItems: 'flex-end', justifyContent: 'center' }}
                    >
                        <Icon name="md-close" style={{ fontSize: 30 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, paddingLeft: 10, marginTop: 30, justifyContent: 'center' }}>
                        <Icon name="md-person" style={{ fontSize: 27 }} />
                        <Input placeholder="Chọn tiếp viên" value={this.state.tiepvien} onChangeText={(tiepvien) => this._handleSetTiepVien(tiepvien)} style={{ paddingLeft: 15 }} />
                    </View>
                    <View style={{ backgroundColor: '#f6fbff' }}>
                        {this._handleSearchAutocomplateTiepVien(this.state.tiepvien)}
                    </View>
                </View>
            </View>
        )
    }

    _handleSetTiepVien(tiepvien) {
        if (tiepvien.length > 0) {
            this.setState({ tiepvien: tiepvien, searchTiepVien: true });
        } else {
            this.setState({ tiepvien: tiepvien, searchTiepVien: false });
        }
    }

    _handleSearchAutocomplateTiepVien(tiepvien) {
        let arrTiepvien = this.state.arrTiepvien;
        let html = [],
            childHtml = [];

        for (var i = 0; i < arrTiepvien.length; i++) {

            let label = this._str_slug(arrTiepvien[i].tv_name);
            let convertTiepVien = this._str_slug(tiepvien);
            let check = false;

            if (label.includes(convertTiepVien)) {
                check = true;
            }


            if (check) {
                let value = arrTiepvien[i].tv_id;
                let label = arrTiepvien[i].tv_name;
                childHtml.push(
                    <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10, paddingLeft: 45 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeModalTiepVien();
                                this.setState({ id_tiepvien: value, tiepvien: label, searchTiepVien: false });
                            }
                            }
                        >
                            <Text>{label}</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }


        if (arrTiepvien.length == 0) {
            html.push(
                <View key="scroll_autocomplate1" style={{ overflow: 'hidden', marginVertical: 20, paddingLeft: 45 }}>
                    <Text style={{ fontSize: 15 }}>Không có tiếp viên</Text>
                </View>
            );
        }
        else {
            html.push(
                <View key="scroll_autocomplate2" style={{ overflow: 'hidden' }}>
                    <ScrollView>
                        {childHtml}
                    </ScrollView>
                </View>
            );
        }
        return html;
    }

    openModalLoi() {
        this.refs.modalLoi.open();
    }

    closeModalLoi() {
        this.refs.modalLoi.close();
    }

    _renderModalLoi() {
        return (
            <View key="1" style={{ width: width, height: height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

                <View style={styles.close_popup}>
                    <TouchableOpacity
                        onPress={() => {
                            this.closeModalLoi();
                            this.setState({
                                loi: '',
                                id_loi: '',
                            });
                        }}
                        style={{ alignItems: 'flex-end', justifyContent: 'center' }}
                    >
                        <Icon name="md-close" style={{ fontSize: 30 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, paddingLeft: 10, marginTop: 30, justifyContent: 'center' }}>
                        <Icon name="ios-warning-outline" style={{ fontSize: 27 }} />
                        <Input placeholder="Chọn loại vi phạm" value={this.state.loi} onChangeText={(loi) => this._handleSetLoi(loi)} style={{ paddingLeft: 15 }} />
                    </View>
                    <View style={{ backgroundColor: '#f6fbff' }}>
                        {this._handleSearchAutocomplateLoi(this.state.loi)}
                    </View>
                </View>
            </View>
        )
    }

    _handleSetLoi(loi) {
        if (loi.length > 0) {
            this.setState({ loi: loi, searchLoi: true });
        } else {
            this.setState({ loi: loi, searchLoi: false });
        }
    }

    _handleSearchAutocomplateLoi(loi) {
        let arrLoi = this.state.arrLoi;
        let html = [],
            childHtml = [];
        let convertLoi = this._str_slug(loi.toLowerCase());

        for (var i = 0; i < arrLoi.length; i++) {
            let arrLoiChi = arrLoi[i].arrLoiChi;
            let label = arrLoi[i].xdm_name.toLowerCase();
            let loiDetail = this._str_slug(label);
            let check = false;
            let htmlChi = [];

            for (let j = 0; j < arrLoiChi.length; j++) {
                let loiChi = this._str_slug(arrLoiChi[j].xdm_name.toLowerCase());
                let checkChi = false;
                if (loiChi.includes(convertLoi)) {
                    checkChi = true;
                }

                if (checkChi) {
                    let value = arrLoiChi[j].xdm_id;
                    let label = arrLoiChi[j].xdm_name;
                    htmlChi.push(
                        <View key={j} style={{ paddingVertical: 10, paddingLeft: 45 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.closeModalLoi();
                                    this.setState({ id_loi: value, loi: label, searchLoi: false });
                                }
                                }
                            >
                                <Text>{label}</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }
            }

            if (loiDetail.includes(convertLoi)) {
                check = true;
            }

            if (check) {
                let value = arrLoi[i].xdm_id;
                let label = arrLoi[i].xdm_name;
                childHtml.push(
                    <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10, paddingLeft: 45 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeModalLoi();
                                this.setState({ id_loi: value, loi: label, searchLoi: false });
                            }
                            }
                        >
                            <Text>{label}</Text>
                        </TouchableOpacity>
                        <View style={{ marginLeft: 10 }}>
                            {htmlChi}
                        </View>
                    </View>
                );
            }
        }


        if (arrLoi.length == 0) {
            html.push(
                <View key="scroll_autocomplate1" style={{ overflow: 'hidden', marginVertical: 20, paddingLeft: 45 }}>
                    <Text style={{ fontSize: 15 }}>Không có danh mục lỗi</Text>
                </View>
            );
        }
        else {
            html.push(
                <View key="scroll_autocomplate2" style={{ overflow: 'hidden' }}>
                    <ScrollView>
                        {childHtml}
                    </ScrollView>
                </View>
            );
        }

        return html;
    }

    async onPressButtonImagePicker() {
        await ImagePicker.showImagePicker(
            {
                quality: 0.1,
                title: 'Chọn ảnh',
                cancelButtonTitle: 'Hủy',
                takePhotoButtonTitle: 'Chụp ảnh',
                chooseFromLibraryButtonTitle: 'Chọn ảnh từ bộ nhớ máy'
            },
            (response) => {
                if (response.data) {
                    this.setState({
                        img: { uri: 'data:image/jpeg;base64,' + response.data },
                        xtt_img: 'data:image/jpeg;base64,' + response.data,
                    });
                }
            });
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
    modal: {
        alignItems: 'center'
    },
    wrapPopup: {
        paddingTop: 60
    },
    close_popup: {
        position: 'absolute', zIndex: 9, top: 10, right: 10, width: 50, height: 50
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
});

export default Inspect
