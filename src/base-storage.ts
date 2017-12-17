export default abstract class BaseStorage {
	constructor() {
	}

	protected asArray = <T>(typeAsValue: any, aPredicate: (value: Array<T>) => void, vPredicate: (value: T) => void) => {
		if (typeAsValue instanceof Array) {
			aPredicate(typeAsValue);
		} else {
			vPredicate(typeAsValue);
		}
	};
}