import { StorageType } from './enums';

export default abstract class BaseStorage {
	protected storageType: StorageType;

	constructor(type: StorageType) {
		this.storageType = type;
	}

	protected asArray = <T>(typeAsValue: any, aPredicate: (value: Array<T>) => void, vPredicate: (value: T) => void) => {
		if (typeAsValue instanceof Array) {
			aPredicate(typeAsValue);
		} else {
			vPredicate(typeAsValue);
		}
	};
}