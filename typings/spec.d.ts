declare namespace Test {
	export interface Storage {
		getItem: sinon.SinonStub;
		setItem: sinon.SinonSpy;
		removeItem: sinon.SinonSpy;
		clear: sinon.SinonSpy;
	}
}