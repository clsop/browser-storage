import BrowserStorage from "../../typings/browser-storage";

export default class CookieOptions<T>
  implements BrowserStorage.IApiOptions<BrowserStorage.KeyValue<T>>
{
  private options: BrowserStorage.ICookieOptions;

  constructor(options?: BrowserStorage.ICookieOptions) {
    this.options = options;
  }

  /**
   * creates a cookie string from options
   * @value {BrowserStorage.KeyValue<string>} the cookie key/value pair
   * @return {string} the cookie string
   */
  public create(value: BrowserStorage.KeyValue<T>): string {
    let cookie: string = `${value.key}=${JSON.stringify(value.value)};`;
    let defaultExpires = new Date();
    defaultExpires.setUTCFullYear(defaultExpires.getFullYear() + 1000);

    if (!this.options) {
      cookie += ` expires=${defaultExpires.toUTCString()}; path=/; samesite=${<
        BrowserStorage.SameSite
      >"strict"}; secure`;
    } else {
      if (this.options.persist) {
        cookie += ` expire=${defaultExpires.toUTCString()};`;
      } else if (this.options.expires) {
        cookie += ` expires=${this.options.expires.toUTCString()};`;
      }

      if (this.options.domain) {
        cookie += ` domain=${this.options.domain};`;
      }

      if (this.options.maxAge !== undefined) {
        cookie += ` max-age=${this.options.maxAge};`;
      }

      if (this.options.path) {
        cookie += ` path=${this.options.path};`;
      }

      if (this.options.sameSite) {
        cookie += ` samesite=${this.options.path};`;
      }

      if (this.options.secure) {
        cookie += ` secure;`;
      }
    }

    return cookie;
  }
}
