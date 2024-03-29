import { StorageType } from '../storage-type';

export default abstract class BaseStorage {
	protected storageType: StorageType;

	constructor(type: StorageType) {
		this.storageType = type;
	}

	protected getKeyName(key: string): string {
		return `bs_${key}`;
	}

	protected asArray = <T>(typeAsValue: any, aPredicate: (value: Array<T>) => void, vPredicate: (value: T) => void) => {
		if (typeAsValue instanceof Array) {
			aPredicate(typeAsValue);
		} else {
			vPredicate(typeAsValue);
		}
	};
}