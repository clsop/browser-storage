import { suite, test } from '@testdeck/mocha';
import CookieOptions from '../src/cookie-options';
import BrowserStorage from '../typings/browser-storage';

import stubs from './stubs';

@suite("Api options: cookie options tests")
class CookieOptionsTests {
	public before() {
		stubs.defineWindow();
		stubs.defineDocument();
		stubs.defineCookie();
	}

	public after() {
		stubs.undefineCookie();
		stubs.undefineDocument();
		stubs.undefineWindow();
	}

	@test("set default options")
	public defaultOptionsTest() {
		// arrange
		const options = new CookieOptions();
		
		// act
		const cookie = options.create({ key: 'key', value: 'value' });

		// assert
		cookie.should.containEql("path=/");
		cookie.should.containEql(`samesite=${<BrowserStorage.SameSite>"strict"}`);
		cookie.should.containEql("secure");
	}

	@test("set expires option")
	public setExpiresTest() {
		// arrange
		const expiresDate = new Date();
		const options = new CookieOptions({ expires: expiresDate });

		// act
		const cookie = options.create({ key: 'key', value: 'value' });

		// assert
		cookie.should.containEql(`expires=${expiresDate.toUTCString()}`);
	}

	@test("set samesite option")
	public setSameSiteTest() {
		// arrange
		const sameSite: BrowserStorage.SameSite = "lax";
		const options = new CookieOptions({ sameSite: sameSite });

		// act
		const cookie = options.create({ key: 'key', value: 'value' });

		// assert
		cookie.should.containEql(`samesite=${sameSite}`);
	}

	@test("set path option")
	public setPathTest() {
		// arrange
		const path = "/domain/name";
		const options = new CookieOptions({ path: path });

		// act
		const cookie = options.create({ key: 'key', value: 'value' });

		// assert
		cookie.should.containEql(`path=${path}`);
	}

	@test("set domain option")
	public setDomainTest() {
		// arrange
		const domain = "test.local";
		const options = new CookieOptions({ domain: domain });

		// act
		const cookie = options.create({ key: 'key', value: 'value' });

		// assert
		cookie.should.containEql(`domain=${domain}`);
	}

	@test("set max age option")
	public setMaxAgeTest() {
		// arrange
		const maxAge = 15;
		const options = new CookieOptions({ maxAge: maxAge });

		// act
		const cookie = options.create({ key: 'key', value: 'value' });

		// assert
		cookie.should.containEql(`max-age=${maxAge}`);
	}

	@test("set secure option")
	public setSecureTest() {
		// arrange
		const secure = true;
		const options = new CookieOptions({ secure: secure });

		// act
		const cookie = options.create({ key: 'key', value: 'value' });

		// assert
		cookie.should.containEql(`secure`);
	}
}
