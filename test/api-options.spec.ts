import { suite, test } from '@testdeck/mocha';

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

	@test.pending("set default options")
	public defaultOptionsTest() {
	}

	@test.pending("set expires option")
	public setExpiresTest() {
	}

	@test.pending("set persist option")
	public setPersistTest() {
	}

	@test.pending("set samesite option")
	public setSameSiteTest() {
	}

	@test.pending("set path option")
	public setPathTest() {
	}

	@test.pending("set domain option")
	public setDomainTest() {
	}

	@test.pending("set max age option")
	public setMaxAgeTest() {
	}

	@test.pending("set secure option")
	public setSecureTest() {
	}
}
