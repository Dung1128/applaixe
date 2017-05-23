import { NetInfo } from 'react-native';
import * as common from '../Config/common';
export default class Common{
	static formatPrice(number) {
		let newNumber = parseInt(number);
		return newNumber.toFixed(0).replace(/./g, function(c, i, a) {
			return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
		});
	}

 	static async pingServer(){
		let url     	= common.domain+'/api/ping.php';
		var status	= false;
		// Khai báo headers mặc định
		let headers = {
			"Content-Type"    : "multipart/form-data",
			"Cache-Control"   : common.cache,
		}
		// Tạo biến opts
		let opts    = {
			method  : "GET",
			headers : headers,
		}
		console.log(url);
		// Trả về dữ liệu json
		await fetch(url, opts)
		.catch((err)=> {
			return false;
			console.log('cccc');
		})
		.then((response) => response.json())
		.then((responseData) => {
			status = true;
		})
		.catch((err)=> {
			console.log('Some errors occured');
			console.log(err);
		});
		return status;
	}

	async checkServerAlive() {
	   try {
	     let response = await fetch('http://hasonhaivan.vn/api/ping.php');
	     let responseJson = await response.json();
	     return true;
	   } catch(error) {
	      console.log(error);
	      return false;
	   }

	}


 }
