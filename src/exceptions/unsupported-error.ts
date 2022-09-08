export default class UnsupportedError extends Error {
	constructor(message?: string) {
		super(message);

		this.name = "unsupported error";
	}

	public toString = () => `${this.name}: ${this.message}`;
}