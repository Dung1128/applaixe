import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import { Container, Content, Header, Title, Text, Icon, Input, InputGroup, Button, Card, CardItem, Spinner, Thumbnail } from 'native-base';

export default class ComSDGInfo extends React.Component{

	render(){
		let Info	= this.props.SDGInfo;
		return(
			<Card style={[styles.paddingContent]}>
				<CardItem header>
					<View style={{flexDirection: 'column', flex: 1}}>
					{Info.did_id > 0 &&
						<View style={{marginBottom: 10}}>
							<Text style={styles.bold}>
							{Info.tuy_ten}  {Info.did_gio_xuat_ben_that} - {Info.day}
							</Text>

							<Text>
								BKS: <Text style={styles.bold}> {Info.bien_kiem_soat}</Text>
							</Text>
							<Text>Lái Xe 1: <Text style={styles.bold}>{Info.laixe1}</Text></Text>
							<Text>Lái Xe 2: <Text style={styles.bold}>{Info.laixe2}</Text></Text>
							<Text>Tiếp viên: <Text style={styles.bold}>{Info.tiepvien}</Text></Text>
							<View style={{flexDirection: 'row'}}>
								<Text style={{flex: 1}}>Đã đặt: <Text style={styles.bold}>{Info.did_so_cho_da_ban} </Text> </Text>
								<Text style={{flex: 3}}> Còn trống: <Text style={styles.bold}>{(Info.tong_so_cho-Info.did_so_cho_da_ban)}/{Info.tong_so_cho}</Text></Text>
							</View>

						</View>

						}


						<View style={{flexDirection: 'row'}}>
								<View style={{flex: 1}}>
									<View style={{flexDirection: 'row'}}>
										<View width={15} height={15} backgroundColor={'#60c0dc'} style={{marginRight: 10,marginTop: 3}}></View>
										<View><Text>Đã lên xe</Text></View>
									</View>
								</View>
								<View style={{flex: 2}}>
									<View style={{flexDirection: 'row'}}>
										<View width={15} height={15} backgroundColor={'#ffa500'} style={{marginRight: 10,marginTop: 3}}></View>
										<View><Text>Đã book</Text></View>
									</View>
								</View>
						</View>

						{Info.did_loai_xe == 1 &&
							<View style={{position: 'absolute', right: 0, top: 30}}>
								<Thumbnail size={60} source={require('../../Skin/Images/vip.png')} />
							</View>
						}

					</View>

				</CardItem>
			</Card>
		);
	}
}

ComSDGInfo.PropType	= {
	SDGInfo:React.PropTypes.Object
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
