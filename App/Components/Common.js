import { NetInfo } from 'react-native';
export default class Common{
	static formatPrice(number) {
		let newNumber = parseInt(number);
		return newNumber.toFixed(0).replace(/./g, function(c, i, a) {
			return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
		});
	}
 }
