async _handleChinhSua() {
	let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
	this.setState({
		loadingModal: true,
		type: 'update'
	});
	//Lay du lieu
	var dataVe	= dataGiuong;
	if(this.state.sttInternet != false){
		try {
			let params = {
				token: this.state.infoAdm.token,
				adm_id: this.state.infoAdm.adm_id,
				type: 'update',
				did_id: dataGiuong.bvv_bvn_id,
				bvv_id: dataGiuong.bvv_id,
				bvv_number: dataGiuong.bvv_number
			}
			let data = await fetchData('api_ve_get', params, 'GET');
			if(data.status == 404) {
				alert('Tài khoản của bạn hiện đang đăng nhập ở 1 thiết bị khác. Vui lòng đăng nhập lại.');
				Actions.welcome({type: 'reset'});
			}else {
				dataVe	= data;
			}
		} catch (e) {
			console.log(e);
		}
	}

	let newDataBen = [];
	let dataBen		= this.state.arrBen;
	for(var i = 0; i < Object.keys(dataBen).length > 0; i++) {
		newDataBen.push({key: dataBen[i].bex_id, value: dataBen[i].bex_ten});
	}
	var trung_chuyen_don	= false;
	if(dataGiuong.bvv_trung_chuyen_a  == 1){
		trung_chuyen_don	= true;
	}
	var trung_chuyen_tra	= false;
	if(dataGiuong.bvv_trung_chuyen_b  == 1){
		trung_chuyen_tra	= true;
	}

	var nameDiemDi		= '';
	var nameDiemDen	= '';
	var dataBenTen 	= this.state.arrBenTen;
	var keyDiemDi		= dataVe.bvv_bex_id_a;
	var keyDiemDen		= dataVe.bvv_bex_id_b;
	if(dataBenTen != null && dataBenTen[keyDiemDi] != undefined){
		nameDiemDi	= dataBenTen[keyDiemDi];
	}
	if(dataBenTen != null && dataBenTen[keyDiemDen] != undefined){
		nameDiemDen	= dataBenTen[keyDiemDen];
	}
	this.setState({
		status: '200',
		resultsBen: newDataBen,
		bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
		bvv_number_muon_chuyen: dataGiuong.bvv_number,
		bvv_id: dataGiuong.bvv_id,

		fullName: dataVe.bvv_ten_khach_hang,
		phone: dataVe.bvv_phone,
		diem_don: dataVe.bvv_diem_don_khach,
		diem_tra: dataVe.bvv_diem_tra_khach,
		ghi_chu: dataVe.bvv_ghi_chu,
		totalPriceInt: dataVe.bvv_price,
		bvv_ben_a: dataVe.bvv_ben_a,
		bvv_ben_b: dataVe.bvv_ben_b,


		keyDiemDi: keyDiemDi,
		keyDiemDen: keyDiemDen,
		nameDiemDi: nameDiemDi,
		nameDiemDen: nameDiemDen,

		trung_chuyen_tra: trung_chuyen_tra,
		trung_chuyen_don: trung_chuyen_don,

		loadingModal: false,
		loading: false
	});


	this.closeModalAction();
	this.openModal();
}
