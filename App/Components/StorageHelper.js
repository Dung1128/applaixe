import { AsyncStorage } from "react-native"

export default class StorageHelper {

  static setStore(key, value){
    try {
      // AsyncStorage.removeStore(key);
      AsyncStorage.setItem(key, value)
    } catch (e) {}
  }

  static async getStore(key){
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (e) {}
  }

  static removeStore(key){
    try {
      AsyncStorage.removeItem(key)
    } catch (e) {}
  }

//token dang nhap qua id vg
  static setToken(value){
    StorageHelper.setStore('token', value);
  }

  static async getToken(){
    return await StorageHelper.getStore('token');
  }

  static removeToken(){
    StorageHelper.removeStore('token');
  }
//end

//token vatgia_access_token
  static setVatGiaAccessToken(value){
    StorageHelper.setStore('access_token', value);
  }

  static async getVatGiaAccessToken(){
    return await StorageHelper.getStore('access_token');
  }

  static removeVatGiaAccessToken(){
    StorageHelper.removeStore('access_token');
  }
//end

//vatgia_user id
  static setVatGiaUserId(value){
    StorageHelper.setStore('vatgia_user_id', value+'');
  }

  static async getVatGiaUserId(){
    return await StorageHelper.getStore('vatgia_user_id');
  }

  static removeVatGiaUserId(){
    StorageHelper.removeStore('vatgia_user_id');
  }
//end

//is_estore
  static setIsEstore(value){
    StorageHelper.setStore('is_estore', value+'');
  }

  static async isEstore(){
    return await StorageHelper.getStore('is_estore');
  }
//end

//thong tin dang nhap
  static setInfo(value){
    StorageHelper.setStore('user_info', value);
  }

  static async getInfo(){
    return await StorageHelper.getStore('user_info');
  }

  static removeInfo(){
    StorageHelper.removeStore('user_info');
  }
// end thong tin dang nhap,

}
