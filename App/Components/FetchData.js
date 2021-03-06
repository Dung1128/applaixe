import { Actions } from 'react-native-router-flux'
import * as common from '../Config/common';

const API_URL = {
  api_ping: common.domain + '/api/ping.php',
  login: common.domain + '/api/api_adm_dang_nhap.php',
  api_change_pass: common.domain + '/api/laixe_v1/change_pass.php',
  api_list_chuyen: common.domain + '/api/laixe_v1/get_list_chuyen.php',
  api_so_do_giuong: common.domain + '/api/laixe_v1/so_do_giuong_get.php',
  api_sync_so_do_giuong: common.domain + '/api/laixe_v1/sync_so_do_giuong.php',
  api_cap_nhat_khi_co_mang: common.domain + '/api/laixe_v1/cap_nhat_khi_co_mang.php',

  api_sdg_danh_sach_huy: common.domain + '/api/laixe_v1/sdg_danh_sach_huy.php',
  api_sdg_danh_sach_xuong_xe: common.domain + '/api/laixe_v1/sdg_danh_sach_xuong_xe.php',

  api_get_ben_did: common.domain + '/api/laixe_v1/get_ben_did.php',
  api_ve_get: common.domain + '/api/laixe_v1/ve_get.php',
  api_get_seri_min: common.domain + '/api/laixe_v1/get_seri_min.php',
  api_get_dm_ve: common.domain + '/api/laixe_v1/get_danh_muc_ve.php',
  api_sdg_danh_sach: common.domain + '/api/laixe_v1/get_sdg_danh_sach.php',
  // api_so_do_giuong_update: common.domain + '/api/laixe_v1/so_do_giuong_update.php',
  api_so_do_giuong_update: common.domain + '/api/laixe_v1/so_do_giuong_update_2.php',
  api_danh_sach_cho: common.domain + '/api/laixe_v1/get_danh_sach_cho.php',
  api_get_price: common.domain + '/api/laixe_v1/get_price.php',

  api_check_ve: common.domain + '/api/api_check_ve.php',
  adm_so_do_giuong_update: common.domain + '/api/api_adm_so_do_giuong_update.php',
  adm_price_ben: common.domain + '/api/api_adm_price_ben.php',
  adm_ben: common.domain + '/api/api_adm_ben.php',
  adm_them_ve: common.domain + '/api/api_adm_them_ve.php',
  adm_get_danh_sach: common.domain + '/api/api_adm_get_danh_sach.php',
  adm_danh_sach_cho: common.domain + '/api/api_adm_danh_sach_cho.php',
  user_get_content: common.domain + '/api/api_user_get_content.php',
  adm_get_time_sync: common.domain + '/api/api_adm_get_time_sync.php',
  adm_ma_xe: common.domain + '/api/api_adm_ma_xe.php',
  api_check_version: common.domain + '/api/api_check_version.php',

  api_get_list_discount: common.domain + '/api/laixe_v1/get_ma_giam_gia.php',
  api_get_discount_detail: common.domain + '/api/laixe_v1/get_ma_giam_gia_detail.php',
  api_get_discount_children: common.domain + '/api/laixe_v1/get_giam_gia_tre_em.php',
  api_report: common.domain + '/api/laixe_v1/get_doanh_thu.php',
  api_get_list_hang_ghe: common.domain + '/api/laixe_v1/get_list_color_hang_ghe.php',
  api_get_giam_gia_linh_hoat: common.domain + '/api/laixe_v1/get_giam_gia_gia_ve_linh_hoat.php',
  api_get_permision: common.domain + '/api/laixe_v1/api_adm_menu.php',
  api_get_xe: common.domain + '/api/dieu_hanh/api_adm_get_xe.php',
  api_get_lai_xe: common.domain + '/api/dieu_hanh/api_adm_get_lai_xe.php',
  api_get_tiep_vien: common.domain + '/api/dieu_hanh/api_adm_get_tiep_vien.php',
  api_save_time: common.domain + '/api/dieu_hanh/api_adm_save_time.php',
  api_save_xe: common.domain + '/api/dieu_hanh/api_adm_save_xe.php',
  api_save_tiep_vien: common.domain + '/api/dieu_hanh/api_adm_save_tiep_vien.php',
  api_save_lai_xe: common.domain + '/api/dieu_hanh/api_adm_save_lai_xe.php',
  api_get_info_tuyen: common.domain + '/api/dieu_hanh/api_adm_edit_not_dieu_hanh.php',

  api_adm_get_lx: common.domain + '/api/thanh_tra/api_adm_get_lai_xe.php',
  api_adm_get_loi_vi_pham: common.domain + '/api/thanh_tra/api_adm_get_loi_vi_pham.php',
  api_adm_get_tiep_vien: common.domain + '/api/thanh_tra/api_adm_get_tiep_vien.php',
  api_adm_get_tuyen: common.domain + '/api/thanh_tra/api_adm_get_tuyen.php',
  api_adm_get_xe: common.domain + '/api/thanh_tra/api_adm_get_xe.php',
  api_adm_view_listing: common.domain + '/api/thanh_tra/api_adm_view_listing.php',
  api_adm_save_listing: common.domain + '/api/thanh_tra/api_adm_save_listing.php',
}

const API_HEADERS = {
  login_id: {
    "Content-Type": "application/json",
    "Accept-Encoding": "identity",
  },
}

const HttpError = {
  no_network: 'Network request failed'
}

const fetchData = async (type, param = {}, method = "GET", retry = undefined) => {
  if (!(type in API_URL)) return []
  let url = API_URL[type]
  try {
    // Khai báo headers mặc định
    let headers = {
      "Content-Type": "multipart/form-data",
      "Cache-Control": common.cache,
    }
    // Gán lại headers nếu có
    if (type in API_HEADERS) headers = Object.assign(headers, API_HEADERS[type])

    // Tạo biến opts
    let opts = {
      method: method,
      headers: headers,
    }

    // Method GET
    if (method == "GET") {
      if (Object.keys(param).length) url += "?" + Object.keys(param).map((k) => k + "=" + encodeURIComponent(param[k])).join("&")
    }

    // Method POST
    else if (method == "POST") {
      let formData = new FormData()
      if (headers["Content-Type"] == "application/json") opts.body = JSON.stringify(param)
      else {
        formData.append("data", JSON.stringify(param))
        opts.body = formData
      }
    }

    console.log(url);
    // Trả về dữ liệu json
    let response = await fetch(url, opts)
    let responseJson = await response.json()
    return responseJson
  } catch (e) {
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
