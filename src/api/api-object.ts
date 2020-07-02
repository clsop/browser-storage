export default abstract class ApiObject {
	protected nextApi: ApiObject;

	constructor(nextApi: ApiObject) {
		this.nextApi = nextApi;
	}

	/**
	 * use the instance api or fallback to the predecessor
	 * @return {BrowserStorage.IBrowserStorage} the browser storage api selected for usage
	 */
	public abstract use(): BrowserStorage.IBrowserStorage;
}