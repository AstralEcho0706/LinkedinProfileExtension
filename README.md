<div align="center">

![KompassAI](./public/icon128.png)

</div>

KompassAI Chrome extension!

## Developing extension is easy and pretty straightforward.

1. Install dependencies with `yarn`.
2. Run `yarn start` to build development version and development server.
3. Load `dist` directory into Chrome as an unpacked extension (see screnshot below).

   1. Open `chrome://extensions`
   2. Turn on `Developer mode`
   3. Select `Load unpacked` and open `dist` folder

   ![loading unpacked extension](load-unpacked-extension.png)
4. That's all, folks! You have working extension and can develop it!

## Packaging production version of extension

> For details about extension version - please see `Extension version in manifest.json`!

1. Install dependencies with  yarn.
2. Run `yarn package` to build production version of extension

## Extension version in manifest.json

All metadata of extension is stored in `src/manifest.json`.
During build process version in aforementioned file is replaced with the version from `package.json`.
This allows to easily bump version of extension using e.g. `npm version x.y.z`.

## License

[MIT](LICENSE)
