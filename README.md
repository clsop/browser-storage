# Browser Storage
===============
Client data storage for browsers - api follows the `localStorage` and `sessionStorage` browser api.

## Build
Run `npm i` or `pnpm i` in the project root and execute build script `npm run build` or `pnpm run build`.

## Test & Coverage
Run `npm i` or `pnpm i` in the project root and execute script `npm test` or `pnpm test`.

## Usage

Typescript
<pre>
import { BrowserStorage, StorageType } from 'browser-storage';
...
const sessionStorage = BrowserStorage.getStorage(StorageType.Session);
let simpleValue = sessionStorage.get<string>('key');
let obj = sessionStorage.get<SomeType>('key');
</pre>

Javascript
<pre>
import { BrowserStorage, StorageType } from 'browser-storage';
...
const sessionStorage = BrowserStorage.getStorage(StorageType.Session);
let simpleValue = sessionStorage.get('key');
let obj = sessionStorage.get('key');
</pre>