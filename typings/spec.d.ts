// define global vars for node env when testing
declare const global: Test.Global;
declare const root: Test.Global;

declare namespace Test {
	export interface Window {
		localStorage: Storage;
		sessionStorage: Storage;
		indexedDB: IDBFactory;
	}

	export interface Global {
		window: Window;
		document: Document;
	}

	export interface Storage {
		getItem: sinon.SinonStub;
		setItem: sinon.SinonSpy;
		removeItem: sinon.SinonSpy;
		clear: sinon.SinonSpy;
	}
}