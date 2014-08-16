# fasta-parser
> Buffer Stream parser from FASTA to JSON.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]
[![Gitter chat][gitter-image]][gitter-url]
[![DOI][doi-image]][doi-url]

[![Browser][browser-image]][browser-url]

Install
-------

Install ```fasta-parser``` with [npm](//npmjs.org):

```sh
$ npm install fasta-parser
```

Alternatively, just include `fasta-parser.min.js` via a `<script/>` in your page.

Usage
-----

```js
var fasta = require('fasta-parser')

var fastaData = new Buffer ('>sequence1\n\
ATGCACGTCACGTCAGTACTCGTCAGTAC\n\
>sequence2\n\
CAGTCCTACTGCATGCATGCATGCATGCATCGATGCATGTCGACTGCATGCATGC\n')

var parser = fasta()
parser.on('data', function(data) { console.log(JSON.parse(data.toString())) })
parser.write(fastaData)
parser.end()
//=>   { id: 'sequence1',
//       seq: 'ATGCACGTCACGTCAGTACTCGTCAGTAC' }
//     { id: 'sequence2',
//       seq: 'CAGTCCTACTGCATGCATGCATGCATGCATCGATGCATGTCGACTGCATGCATGC' }
```

For a more useful API, check the dependent module [bionode-fasta](http://github.com/bionode/bionode-fasta).


Contributing
------------

To contribute, clone this repo locally and commit your code on a separate branch.

Please write unit tests for your code, and check that everything works by running the following before opening a pull-request:

```sh
$ npm test
```

To test on the browser:

```sh
$ npm run test-browser
# if you get "No headless browser found" do:
$ npm install -g phantomjs
$ rm ~/.config/browser-launcher/config.json
```

Please also check for code coverage:

```sh
$ npm run coverage
```

To rebuild and minify the module for the browser:

```sh
$ npm run build-browser
```

To rebuild the documentation using the comments in the code:

```sh
$ npm run build-docs
```
Check the [issues](http://github.com/bionode/fasta-parser/issues) for ways to contribute.

Contacts
--------
Bruno Vieira <[mail@bmpvieira.com](mailto:mail@bmpvieira.com)> [@bmpvieira](//twitter.com/bmpvieira)

License
--------

fasta-parser is licensed under the [MIT](https://raw.github.com/bmpvieira/fasta-parser/master/LICENSE) license.  
Check [ChooseALicense.com](http://choosealicense.com/licenses/mit) for details.

[npm-url]: http://npmjs.org/package/fasta-parser
[npm-image]: http://img.shields.io/npm/v/fasta-parser.svg?style=flat
[travis-url]: http:////travis-ci.org/bionode/fasta-parser
[travis-image]: http://img.shields.io/travis/bionode/fasta-parser.svg?style=flat
[coveralls-url]: http:////coveralls.io/r/bionode/fasta-parser
[coveralls-image]: http://img.shields.io/coveralls/bionode/fasta-parser.svg?style=flat
[depstat-url]: http://david-dm.org/bionode/fasta-parser
[depstat-image]: http://img.shields.io/david/bionode/fasta-parser.svg?style=flat
[gitter-image]: http://img.shields.io/badge/gitter-bionode/fasta--parser-brightgreen.svg?style=flat
[gitter-url]: https://gitter.im/bionode/fasta-parser
[doi-url]: http://dx.doi.org/10.5281/zenodo.11306
[doi-image]: http://img.shields.io/badge/doi-10.5281/zenodo.11306-blue.svg?style=flat
[browser-url]: https://ci.testling.com/bionode/fasta-parser
[browser-image]: https://ci.testling.com/bionode/fasta-parser.png
