export default abstract class ApiObject {
	protected nextApi: ApiObject;

	constructor(nextApi: ApiObject) {
		this.nextApi = nextApi;
	}

	public abstract use(): BrowserStorage.IBrowserStorage;
}