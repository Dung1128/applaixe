import { Actions } from 'react-native-router-flux'
import {domain, cache} from '../Config/common';

const API_URL = {
  login: domain+'/api/api_adm_dang_nhap.php',
  adm_so_do_giuong: domain+'/api/api_adm_so_do_giuong.php',
  api_check_ve: domain+'/api/api_check_ve.php',
  adm_so_do_giuong_update: domain+'/api/api_adm_so_do_giuong_update.php',
  adm_price_ben: domain+'/api/api_adm_price_ben.php',
  adm_ben: domain+'/api/api_adm_ben.php',
  adm_them_ve: domain+'/api/api_adm_them_ve.php',
  adm_get_danh_sach: domain+'/api/api_adm_get_danh_sach.php',
  adm_danh_sach_cho: domain+'/api/api_adm_danh_sach_cho.php',
  user_get_content: domain+'/api/api_user_get_content.php',
  adm_get_time_sync: domain+'/api/api_adm_get_time_sync.php',
}

const API_HEADERS  = {
  login_id: {
    "Content-Type": "application/json",
    "Accept-Encoding": "identity",
  },
}

const HttpError = {
  no_network: 'Network request failed'
}

const fetchData = async (type, param={}, method="GET", retry=undefined) => {

  if(!(type in API_URL)) return []

  let url     = API_URL[type]

  try {

    // Khai báo headers mặc định
    let headers = {
      "Content-Type"    : "multipart/form-data",
		"Cache-Control"   : cache,
    }

    // Gán lại headers nếu có
    if(type in API_HEADERS) headers  = Object.assign(headers, API_HEADERS[type])

    // Tạo biến opts
    let opts    = {
      method  : method,
      headers : headers,
    }

    // Method GET
    if(method == "GET"){
      if(Object.keys(param).length) url += "?" + Object.keys(param).map((k) => k + "=" + encodeURIComponent(param[k])).join("&")
    }

    // Method POST
    else if(method == "POST"){
      let formData  = new FormData()
      if(headers["Content-Type"] == "application/json") opts.body = JSON.stringify(param)
      else{
        formData.append("data", JSON.stringify(param))
        opts.body   = formData
      }
    }
    // Trả về dữ liệu json
    let response    = await fetch(url, opts)
    let responseJson= await response.json()
    return responseJson
  } catch(e) {
    console.error("HttpError", e);
    console.error("HttpError", url);
    console.error("HttpError", param);
    if (e.toString().indexOf(HttpError.no_network) > -1) {
      let props = {
        title: 'No Connection',
        message: 'Có lỗi trong quá trính lấy dữ liệu.<br>Vui lòng kiểm tra lại kết nối',
        typeAlert: 'warning',
        titleButton: 'Thử lại',
        callback: retry
      }
      Actions.alert(props)
    }
  }
}

export default fetchData
