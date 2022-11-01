import BrowserStorage from "../typings/browser-storage";

export default class CookieOptions<T>
  implements BrowserStorage.IApiOptions<BrowserStorage.KeyValue<T>>
{
  private readonly EXPIRES: string;
  private readonly MAX_AGE: string;
  private readonly PATH: string;
  private readonly DOMAIN: string;
  private readonly SAMESITE: string;
  private readonly SECURE: string;

  private options: BrowserStorage.ICookieOptions;

  constructor(options?: BrowserStorage.ICookieOptions) {
    this.options = options;

    this.EXPIRES = "expires";
    this.MAX_AGE = "max-age";
    this.PATH = "path";
    this.DOMAIN = "domain";
    this.SAMESITE = "samesite";
    this.SECURE = "secure";
  }

  /**
   * creates a cookie string from options
   * @value {BrowserStorage.KeyValue<string>} the cookie key/value pair
   * @return {string} the cookie string
   */
  public create(keyValue: BrowserStorage.KeyValue<T>): string {
    let cookie: string = `${keyValue.key}=${JSON.stringify(keyValue.value)};`;
    
    if (!this.options) {
      cookie += ` ${this.PATH}=/; ${this.SAMESITE}=${<
        BrowserStorage.SameSite
      >"strict"}; ${this.SECURE}`;
    } else {
      if (this.options.expires) {
        cookie += ` ${this.EXPIRES}=${this.options.expires.toUTCString()};`;
      }

      if (this.options.domain) {
        cookie += ` ${this.DOMAIN}=${this.options.domain};`;
      }

      if (this.options.maxAge !== undefined) {
        cookie += ` ${this.MAX_AGE}=${this.options.maxAge};`;
      }

      if (this.options.path) {
        cookie += ` ${this.PATH}=${this.options.path};`;
      }

      if (this.options.sameSite) {
        cookie += ` ${this.SAMESITE}=${this.options.sameSite};`;
      }

      if (this.options.secure) {
        cookie += ` ${this.SECURE};`;
      }
    }

    return cookie;
  }
}
