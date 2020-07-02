import * as sinon from 'sinon';

const defineWindow = () => Object.defineProperty(global, 'window', {
	value: Object.create(null),
	configurable: true,
	enumerable: true,
	writable: true
});
const defineDocument = () => Object.defineProperty(global, 'document', {
	value: Object.create(null),
	configurable: true,
	enumerable: true,
	writable: true
});
// simple cookie implementation with test doubles
const defineCookie = () => {
	let getStub: sinon.SinonStub = null;
	let setSpy: sinon.SinonSpy = null;
	
	Object.defineProperty(global.document, "cookie", (() => {
		let self: PropertyDescriptor = <PropertyDescriptor>this;
		let cookies: string[] = [];

		self.set = (value: string) => cookies.push(value);
		self.get = () => cookies.join("\r");
		self.configurable = true;
		self.enumerable = true;

		getStub = sinon.stub(self, "get").callThrough();
		setSpy = sinon.stub(self, "set").callThrough();

		return this;
	})());

	return {
		getStub: getStub,
		setSpy: setSpy
	};
};
const defineStorage = () => {
	Object.defineProperty(global.window, 'localStorage', {
		value: Object.create(null),
		configurable: true,
		enumerable: true,
		writable: true
	});
	Object.defineProperty(global.window, 'sessionStorage', {
		value: Object.create(null),
		configurable: true,
		enumerable: true,
		writable: true
	});

	let propDefs = {
		'getItem': {
			value: () => { },
			configurable: true,
			enumerable: true,
			writable: false
		},
		'setItem': {
			value: () => { },
			configurable: true,
			enumerable: true,
			writable: false
		},
		'removeItem': {
			value: () => { },
			configurable: true,
			enumerable: true,
			writable: false
		},
		'clear': {
			value: () => { },
			configurable: true,
			enumerable: true,
			writable: false
		}
	};
	Object.defineProperties(global.window.localStorage, propDefs);
	Object.defineProperties(global.window.sessionStorage, propDefs);
};
const defineIndexedDb = () => Object.defineProperty(global.window, 'indexedDB', {
	value: Object.create(null),
	configurable: true,
	enumerable: true,
	writable: true
});

const removeCookie = () => {
	delete global.document.cookie;
};
const removeStorage = () => {
	delete global.window.localStorage;
	delete global.window.sessionStorage;
};
const removeIndexedDb = () => {
	delete global.window.indexedDB;
};
const removeWindow = () => {
	delete global.window;
};
const removeDocument = () => {
	delete global.document;
};

export default {
	defineCookie: defineCookie,
	defineStorage: defineStorage,
	defineIndexedDb: defineIndexedDb,
	defineWindow: defineWindow,
	defineDocument: defineDocument,
	undefineCookie: removeCookie,
	undefineStorage: removeStorage,
	undefineIndexedDb: removeIndexedDb,
	undefineWindow: removeWindow,
	undefineDocument: removeDocument
};