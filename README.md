# JetBrains icons

[![official JetBrains project](http://jb.gg/badges/official-flat-square.svg)](https://confluence.jetbrains.com/display/ALL/JetBrains+on+GitHub)

A set of icons used in JetBrains' web applications.

## Installation
```sh
npm install @jetbrains/icons
```

## Usage

You might need to set up appropriate infrastracture to use icons in your app. We recommend to use [webpack](https://webpack.github.io/) and [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader) in order to use this icons in your app.

It is also possible to import icon as a JS file without setting up any loaders:
`import lockIconSource from '@jetbrains/icons/lock'`

## Contributing

To add an icon, one should just create an `.svg` file in the "src" directory. All icons are processed with SVGO on publish. Even though SVGO removes pretty every unnecessary attribute, please ensure that file doesn't contain generated IDs, `<title>`-element or any other junk.
Every SVG file should have "width" and "height" attributes set.

Run `npm start` command to see the demo page.
