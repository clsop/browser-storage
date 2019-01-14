export default class BrowserApiError extends Error {
	constructor(message?: string) {
		super(message);

		this.name = "browser api error";
	}

	public toString = () => `${this.name}: ${this.message}`;
}