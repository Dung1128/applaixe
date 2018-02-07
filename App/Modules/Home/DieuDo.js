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
} from 'react-native';
import { domain, cache, colorLogo } from '../../Config/common';
import StorageHelper from '../../Components/StorageHelper';
import fetchData from '../../Components/FetchData';
import Modal from 'react-native-modalbox';
import { Button, Icon, Spinner, Thumbnail, Input, Card, CardItem } from 'native-base';
import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';
const { height, width } = Dimensions.get('window');

class DieuDo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrKM: [],
            loading: true,
            xe: '',
            keyXe: '',
            time: '',
            timeDieuHanh: '',
            lai1: '',
            keyLai1: '',
            lai2: '',
            keyLai2: '',
            tiepvien: '',
            keyTiepVien: '',
            searchXe: false,
            searchLai1: false,
            searchLai2: false,
            searchTiepVien: false,
            arrXe: [],
            arrLaiXe: [],
            arrTiepvien: [],
        };
    }

    async componentWillMount() {
        try {
            let info = await StorageHelper.getStore('infoAdm');
            info = JSON.parse(info);
            let admId = info.adm_id;
            let token = info.token;
            let did_id = this.props.dataParam.did_id;
            let tuy_ten = this.props.dataParam.tuy_ten;
            let arrXe = [];
            let arrLaiXe = [];
            let arrTiepvien = [],
                xe = '',
                keyXe = '',
                time = '',
                timeDieuHanh = '',
                lai1 = '',
                keyLai1 = '',
                lai2 = '',
                keyLai2 = '',
                tiepvien = '',
                keyTiepVien = '';

            let params = {
                token: token,
                adm_id: admId,
                did_id: did_id,
            };

            let data = await fetchData('api_get_xe', params, 'GET');
            console.log(data);

            if (data.status == 200) {
                arrXe = data.arrXe;
            }
            else {
                // alert(data.mes);
            }

            let params1 = {
                token: token,
                adm_id: admId,
                did_id: did_id,
                type: 1,
            };

            let data1 = await fetchData('api_get_lai_xe', params1, 'GET');

            if (data1.status == 200) {
                arrLaiXe = data1.arrLaiXe;
            }
            else {
                // alert(data1.mes);
            }

            let params2 = {
                token: token,
                adm_id: admId,
                did_id: did_id,
                type: 1,
            };

            let data2 = await fetchData('api_get_tiep_vien', params2, 'GET');

            if (data2.status == 200) {
                arrTiepvien = data2.arrTiepVien;
            }
            else {
                // alert(data2.mes);
            }

            let params3 = {
                token: token,
                adm_id: admId,
                did_id: did_id,
            };

            let data3 = await fetchData('api_get_info_tuyen', params3, 'GET');
            console.log('get info tuyen');
            console.log(data3);
            if (data3.status == 200) {
                xe = (data3.arrItem.bien_kiem_soat == null) ? '' : data3.arrItem.bien_kiem_soat;
                keyXe = (data3.arrItem.xe_id == null) ? '' : data3.arrItem.xe_id;
                time = (data3.arrItem.did_gio_xuat_ben_that == null) ? '' : data3.arrItem.did_gio_xuat_ben_that;
                timeDieuHanh = (data3.arrItem.did_gio_dieu_hanh == null) ? '' : data3.arrItem.did_gio_dieu_hanh;
                lai1 = (data3.arrItem.laixe1 == null) ? '' : data3.arrItem.laixe1;
                keyLai1 = (data3.arrItem.idLaixe2 == null) ? '' : data3.arrItem.idLaixe2;
                lai2 = (data3.arrItem.laixe2 == null) ? '' : data3.arrItem.laixe2;
                keyLai2 = (data3.arrItem.idLaixe2 == null) ? '' : data3.arrItem.idLaixe2;
                tiepvien = (data3.arrItem.tiepvien == null) ? '' : data3.arrItem.tiepvien;
                keyTiepVien = (data3.arrItem.idTiepvien == null) ? '' : data3.arrItem.idTiepvien;
            }
            else {
                alert(data3.mes);
            }

            this.setState({
                loading: false,
                token: token,
                adm_id: admId,
                did_id: did_id,
                tuy_ten: tuy_ten,
                arrXe: arrXe,
                arrLaiXe: arrLaiXe,
                arrTiepvien: arrTiepvien,
                xe: xe,
                keyXe: keyXe,
                time: time,
                timeDieuHanh: timeDieuHanh,
                lai1: lai1,
                keyLai1: keyLai1,
                lai2: lai2,
                keyLai2: keyLai2,
                tiepvien: tiepvien,
                keyTiepVien: keyTiepVien,
            });

        } catch (e) {
            console.error(e);
        }
    }

    render() {
        let xe = this.state.xe,
            time = this.state.time,
            lai1 = this.state.lai1,
            lai2 = this.state.lai2,
            tiepvien = this.state.tiepvien,
            timexuatben = (this.state.time == '' || this.state.time == null) ? 'Giờ xuất bến' : this.state.time,
            timedh = (this.state.timeDieuHanh == '' || this.state.timeDieuHanh == null) ? 'Giờ điều hành' : this.state.timeDieuHanh,
            borderWith = (Platform.OS === 'ios') ? 0 : 1;
        console.log('gio dieu hanh');
        console.log(this.state.timeDieuHanh);

        return (
            <View style={{ height: height, width: width, paddingTop: 60 }}>

                <ScrollView>
                    {this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
                    {!this.state.loading &&
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ marginTop: 20, marginLeft: 20, fontSize: 20, color: '#000000' }}>Tuyến: <Text>{this.state.tuy_ten}</Text></Text>
                            <View style={{ margin: 20 }}>
                                <TouchableOpacity
                                    style={{ borderWidth: 1, borderRadius: 10, justifyContent: 'center', marginVertical: 20, height: 60 }}
                                    onPress={() => { this.openModalXe() }}>
                                    <Text style={{ marginLeft: 10, textAlignVertical: 'center', color: '#000000' }}>
                                        {xe == '' ? 'Chọn xe' : xe}
                                    </Text>
                                </TouchableOpacity>

                                <DatePicker
                                    style={{
                                        marginVertical: 20,
                                        width: width - 40,
                                        borderRadius: 10,
                                        height: 60,
                                        borderWidth: borderWith,
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                    }}
                                    date={this.state.time}
                                    mode="time"
                                    is24Hour={true}
                                    showIcon={false}
                                    placeholder={timexuatben}
                                    confirmBtnText="Chọn"
                                    cancelBtnText="Thoát"
                                    customStyles={{
                                        dateInput: {
                                            borderRadius: 10,
                                            height: 60,
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                            paddingLeft: 10,
                                        }
                                    }}
                                    onDateChange={(time) => { this.setState({ time: time }); }}
                                />

                                <DatePicker
                                    style={{
                                        marginVertical: 20,
                                        width: width - 40,
                                        borderRadius: 10,
                                        height: 60,
                                        borderWidth: borderWith,
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                    }}
                                    date={this.state.timeDieuHanh}
                                    mode="time"
                                    is24Hour={true}
                                    showIcon={false}
                                    placeholder={timedh}
                                    confirmBtnText="Chọn"
                                    cancelBtnText="Thoát"
                                    customStyles={{
                                        dateInput: {
                                            borderRadius: 10,
                                            height: 60,
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                            paddingLeft: 10,
                                        }
                                    }}
                                    onDateChange={(time) => { this.setState({ timeDieuHanh: time }); }}
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
                                    onPress={() => { this.saveDieuDo() }}
                                >
                                    <Text style={{ alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>HOÀN THÀNH</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </ScrollView>

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
            </View>
        );
    }

    async saveDieuDo() {
        try {
            // if (this.state.xe == '') {
            //     alert('Vui lòng chọn xe');
            //     return
            // }

            // if (this.state.time == '') {
            //     alert('Vui lòng chọn giờ xuất bến');
            //     return
            // }

            // if (this.state.timeDieuHanh == '') {
            //     alert('Vui lòng chọn giờ điều hành');
            //     return
            // }

            // if (this.state.lai1 == '') {
            //     alert('Vui lòng chọn lái xe 1');
            //     return
            // }

            // if (this.state.lai2 == '') {
            //     alert('Vui lòng chọn lái xe 2');
            //     return
            // }

            // if (this.state.tiepvien == '') {
            //     alert('Vui lòng chọn tiếp viên');
            //     return
            // }

            let params = {
                token: this.state.token,
                adm_id: this.state.adm_id,
                did_id: this.state.did_id,
                value: this.state.time,
                type: 1,
            }

            let data = await fetchData('api_save_time', params, 'GET');
            console.log('save time');
            console.log(data);

            if (data.status != 200) {
                alert(data.mes);
                return;
            }

            let params1 = {
                token: this.state.token,
                adm_id: this.state.adm_id,
                did_id: this.state.did_id,
                value: this.state.timeDieuHanh,
                type: 2,
            }

            let data1 = await fetchData('api_save_time', params1, 'GET');
            console.log('save time');
            console.log(data1);

            if (data1.status != 200) {
                alert(data1.mes);
                return;
            }

            let params2 = {
                token: this.state.token,
                adm_id: this.state.adm_id,
                did_id: this.state.did_id,
                xe_id: this.state.keyXe,
            }

            let data2 = await fetchData('api_save_xe', params2, 'GET');
            console.log('save xe');
            console.log(data2);

            if (data2.status != 200) {
                alert(data2.mes);
                return;
            }

            let params3 = {
                token: this.state.token,
                adm_id: this.state.adm_id,
                did_id: this.state.did_id,
                lx_id: this.state.keyTiepVien,
                type: 1,
            }

            let data3 = await fetchData('api_save_tiep_vien', params3, 'GET');
            console.log('save tiep vien');
            console.log(data3);

            if (data3.status != 200) {
                alert(data3.mes);
                return;
            }

            let params4 = {
                token: this.state.token,
                adm_id: this.state.adm_id,
                did_id: this.state.did_id,
                lx_id: this.state.keyLai1,
                type: 1,
            }

            let data4 = await fetchData('api_save_lai_xe', params4, 'GET');
            console.log('save lai xe 1');
            console.log(data4);

            if (data4.status != 200) {
                alert(data4.mes);
                return;
            }

            let params5 = {
                token: this.state.token,
                adm_id: this.state.adm_id,
                did_id: this.state.did_id,
                lx_id: this.state.keyLai2,
                type: 2,
            }

            let data5 = await fetchData('api_save_lai_xe', params5, 'GET');
            console.log('save lai xe 5');
            console.log(data5);

            if (data5.status != 200) {
                alert(data5.mes);
                return;
            }

            // alert('Đã cập nhật lịch điều độ');
            Actions.BangDieuDo({ title: 'Bảng điều độ' });
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
                                keyXe: '',
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
            this.setState({ searchXe: true });
        } else {
            this.setState({ searchXe: false });
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
                                this.setState({ keyXe: value, xe: label, searchXe: false });
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
                                keyLai1: '',
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
        let arrLaiXe = this.state.arrLaiXe;
        let html = [],
            childHtml = [];

        for (var i = 0; i < arrLaiXe.length; i++) {

            let label = this._str_slug(arrLaiXe[i].adm_name);
            let convertLaiXe = this._str_slug(lai1);
            let check = false;

            if (label.includes(convertLaiXe)) {
                check = true;
            }


            if (check) {
                let value = arrLaiXe[i].adm_id;
                let label = arrLaiXe[i].adm_name;
                childHtml.push(
                    <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10, paddingLeft: 45 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeModalLaiXe1();
                                this.setState({ keyLai1: value, lai1: label, searchLai1: false });
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
                                keyLai2: '',
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
        let arrLaiXe = this.state.arrLaiXe;
        let html = [],
            childHtml = [];

        for (var i = 0; i < arrLaiXe.length; i++) {

            let label = this._str_slug(arrLaiXe[i].adm_name);
            let convertLaiXe = this._str_slug(lai2);
            let check = false;

            if (label.includes(convertLaiXe)) {
                check = true;
            }


            if (check) {
                let value = arrLaiXe[i].adm_id;
                let label = arrLaiXe[i].adm_name;
                childHtml.push(
                    <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10, paddingLeft: 45 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeModalLaiXe2();
                                this.setState({ keyLai2: value, lai2: label, searchLai2: false });
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
                                keyTiepVien: '',
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

            let label = this._str_slug(arrTiepvien[i].adm_name);
            let convertTiepVien = this._str_slug(tiepvien);
            let check = false;

            if (label.includes(convertTiepVien)) {
                check = true;
            }


            if (check) {
                let value = arrTiepvien[i].adm_id;
                let label = arrTiepvien[i].adm_name;
                childHtml.push(
                    <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10, paddingLeft: 45 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeModalTiepVien();
                                this.setState({ keyTiepVien: value, tiepvien: label, searchTiepVien: false });
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
});

export default DieuDo
