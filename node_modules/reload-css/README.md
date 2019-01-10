# reload-css

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

This module reloads all style sheets associated with a specified `url`. This is primarily useful for LiveReload servers that wish to update style sheets without triggering a full page refresh.

If you omit the `url` argument, all style sheets will be cache busted.

## Install

```sh
npm install reload-css --save
```

## Usage

[![NPM](https://nodei.co/npm/reload-css.png)](https://www.npmjs.com/package/reload-css)

#### `reloadCSS([url], [opt])`

Cache-busts the URLs for all `<link>` tags that match the specified `url`, as well as any other style sheets that `@import` the URL.

By default, this will only look for local style sheets (i.e. `localhost`, `127.0.0.1`, or matching the document domain). You can pass `{ local: false }` as the options to cache bust all styles.

In some cases, it will walk upwards to a more top-level style sheet (i.e. in a long chain of import dependencies) to ensure a consistent result across browsers. Import statements are updated in the `cssRules`, and `<link>` tags are re-attached for a clean update (no flicker/flash).

You can omit `url` or pass `null` as the first argument to reload all styles instead of just a target one.

## License

MIT, see [LICENSE.md](http://github.com/Jam3/reload-css/blob/master/LICENSE.md) for details.
