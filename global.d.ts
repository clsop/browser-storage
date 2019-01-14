declare namespace NodeJS {
	var document: Test.Document;
	var window: Test.Window;

	interface Global {
		window: Test.Window;
		document: Test.Document;
	}
}

declare namespace Test {
	interface Window {
		localStorage: Storage;
		sessionStorage: Storage;
		indexedDB: IDBFactory;
	}

	interface Storage {
		getItem: sinon.SinonStub;
		setItem: sinon.SinonSpy;
		removeItem: sinon.SinonSpy;
		clear: sinon.SinonSpy;
	}

	interface Document {
		cookie: Cookie;
	}

	interface Cookie {
		get: () => string;
		set: (cookie: string) => void;
	}
}