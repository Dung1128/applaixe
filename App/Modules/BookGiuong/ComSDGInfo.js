import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Content, Header, Title, Text, Icon, Input, InputGroup, Button, Card, CardItem, Spinner, Thumbnail } from 'native-base';
import StorageHelper from '../../Components/StorageHelper';
import fetchData from '../../Components/FetchData';
import Common from '../../Components/Common';

export default class ComSDGInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			listHangGhe: []
		}
	}

	async componentWillMount() {
		let results = await StorageHelper.getStore('infoAdm');
		let infoAdm = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;
		let Info = this.props.SDGInfo;
		let arrChoTang = this.props.arrChoTang;
		let sdg_id = arrChoTang[1][1][0];

		try {
			let params = {
				token: infoAdm.token,
				adm_id: infoAdm.adm_id,
				did_id: Info.did_id,
				sdg_id: sdg_id.sdgct_sdg_id
			}

			let data = await fetchData('api_get_list_hang_ghe', params, 'GET');
			// let data = {status: 200, arrColor: {}}

			if (data.status == 200) {
				this.setState({
					listHangGhe: data.arrColor,
				});
			}
			else {
				alert('Server hạng ghế lỗi!');
			}
		} catch (error) {
			console.log(error)
		}
	}

	render() {
		let Info = this.props.SDGInfo;
		let rootPrice = this.props.SDGPrice;
		let borderCl = '#60c0dc';
		let html = [];
		let dataHangGhe = this.state.listHangGhe || {};
		let price = rootPrice;
		let uri = this.props.uri;

		for (let i = 0; i < dataHangGhe.length; i++) {
			borderCl = dataHangGhe[i].color;

			// if (Info.did_loai_xe == 1) {
			// 	if (dataHangGhe[i].bvop_hinh_thuc == '0') {
			// 		price = rootPrice - Number(dataHangGhe[i].bvop_toan_tuyen_vip);
			// 	}
			// 	else {
			// 		if (dataHangGhe[i].bvop_hinh_thuc == '1') {
			// 			price = (rootPrice * (100 - Number(dataHangGhe[i].bvop_phan_tram_toan_tuyen_vip))/100);
			// 		}
			// 	}
			// } else {
			// 	if (dataHangGhe[i].bvop_hinh_thuc == '0') {
			// 		price = rootPrice - Number(dataHangGhe[i].bvop_toan_tuyen);
			// 	}
			// 	else {
			// 		if (dataHangGhe[i].bvop_hinh_thuc == '1') {
			// 			price = (rootPrice * (100 - Number(dataHangGhe[i].bvop_phan_tram_toan_tuyen))/100);
			// 		}
			// 	}
			// }

			if (dataHangGhe[i].bvop_hinh_thuc == '0') {
				price = rootPrice - Number(dataHangGhe[i].bvop_toan_tuyen);
			}
			else {
				if (dataHangGhe[i].bvop_hinh_thuc == '1') {
					price = (rootPrice * (100 - Number(dataHangGhe[i].bvop_phan_tram_toan_tuyen)) / 100);
				}
			}

			let roundPrice = price > Number(Info.tuy_gia_nho_nhat) ? price : Number(Info.tuy_gia_nho_nhat);
			roundPrice = Math.floor(roundPrice / 5000) * 5;

			html.push(
				<View key={i}>
					<View style={{ flexDirection: 'row' }}>
						<View height={35} style={{ marginRight: 10, marginTop: 3, borderColor: borderCl, borderWidth: 2 }}>
							<Text style={{ padding: 2 }}>{Common.formatPrice(roundPrice) + 'K'}</Text>
						</View>
					</View>
				</View>
			);
		}

		return (
			<Card style={[styles.paddingContent]}>
				<CardItem header>
					<View style={{ flexDirection: 'column', flex: 1 }}>
						{Info.did_id > 0 &&
							<View style={{ marginBottom: 10 }}>
								<Text style={styles.bold}>
									{Info.tuy_ten}  {Info.did_gio_xuat_ben_that} - {Info.day}
								</Text>

								<Text>
									BKS: <Text style={styles.bold}> {Info.bien_kiem_soat}</Text>
								</Text>
								<Text>Lái Xe 1: <Text style={styles.bold}>{Info.laixe1}</Text></Text>
								<Text>Lái Xe 2: <Text style={styles.bold}>{Info.laixe2}</Text></Text>
								<Text>Tiếp viên: <Text style={styles.bold}>{Info.tiepvien}</Text></Text>
								<View style={{ flexDirection: 'row' }}>
									<Text style={{ flex: 1 }}>Đã đặt: <Text style={styles.bold}>{Info.did_so_cho_da_ban} </Text> </Text>
									<Text style={{ flex: 3 }}> Còn trống: <Text style={styles.bold}>{(Info.tong_so_cho - Info.did_so_cho_da_ban)}/{Info.tong_so_cho}</Text></Text>
								</View>

							</View>

						}


						<View style={{ flexDirection: 'row' }}>
							<View style={{ flex: 1 }}>
								<View style={{ flexDirection: 'row' }}>
									<View width={15} height={15} backgroundColor={'#60c0dc'} style={{ marginRight: 10, marginTop: 3 }}></View>
									<View><Text>Đã lên xe</Text></View>
								</View>
							</View>
							<View style={{ flex: 2 }}>
								<View style={{ flexDirection: 'row' }}>
									<View width={15} height={15} backgroundColor={'#ffa500'} style={{ marginRight: 10, marginTop: 3 }}></View>
									<View><Text>Đã book</Text></View>
								</View>
							</View>
						</View>

						<View style={{ flexDirection: 'row' }}>
							{html}
						</View>

						{/* {Info.did_loai_xe == 1 &&
							<View style={{ position: 'absolute', right: 0, top: 30 }}>
								<Thumbnail size={60} source={require('../../Skin/Images/vip.png')} />
							</View>
						} */}

						{(Info.did_loai_xe != 0) && (uri.trim() != '') &&
							<View style={{ position: 'absolute', right: 0, top: 30 }}>
								<Thumbnail size={60} source={{ uri: uri }} />
							</View>
						}

					</View>

				</CardItem>
			</Card>
		);
	}
}

ComSDGInfo.PropType = {
	SDGInfo: React.PropTypes.Object,
	SDGPrice: React.PropTypes.number,
	arrChoTang: React.PropTypes.Object,
	uri: React.PropTypes.string,
}

const styles = StyleSheet.create({
	paddingContent: {
		marginLeft: 5,
		marginRight: 5,
		marginTop: 20
	},
	bold: {
		fontWeight: 'bold'
	},
});
