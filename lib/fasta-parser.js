// # fasta-parser
// > Buffer Stream parser from FASTA to JSON.
// >
// > doi: [?](?)
// > author: [Bruno Vieira](http://bmpvieira.com)
// > email: <mail@bmpvieira.com>
// > license: [MIT](https://raw.githubusercontent.com/bionode/fasta-parser/master/LICENSE)
//
// ---
//
// ## Usage
//
//     $ npm install fasta-parser
//
//     var parser = require('fasta-parser')
//
//     var fastaData = new Buffer ('>sequence1\n\
//     ATGCACGTCACGTCAGTACTCGTCAGTAC\n\
//     >sequence2\n\
//     CAGTCCTACTGCATGCATGCATGCATGCATCGATGCATGTCGACTGCATGCATGC\n')
//
//     var parser = fasta()
//     parser.on('data', function(data) {
//       console.log(JSON.parse(data.toString()))
//     })
//     parser.write(fastaData)
//     parser.end()
//     //   { id: 'sequence1',
//     //     seq: 'ATGCACGTCACGTCAGTACTCGTCAGTAC' }
//     //   { id: 'sequence2',
//     //     seq: 'CAGTCCTACTGCATGCATGCATGCATGCATCGATGCATGTCGACTGCATGCATGC' }
//
// For a more useful API, check the dependent module:
//
// [bionode-fasta](http://github.com/bionode/bionode-fasta)

var through = require('through2')
var split = require('split')
var pumpify = require('pumpify')

module.exports = function() {
  return pumpify(split(), parser())
}

function parser() {
  var cacheBuf
  var cacheBufLen = 8
  var openID = new Buffer('{"id":"')
  var closeIDOpenSeq = new Buffer('","seq":"')
  var closeSeq = new Buffer('"}\n')
  var stream = through(transform, flush)

  return stream

  function transform(buf, enc, next) {
    if (buf[0] === 62) { // If line starts with '>', this is an ID
      if (cacheBuf) { // If a previous object is in cache, push it
        cacheBuf = Buffer.concat([cacheBuf, closeSeq], cacheBufLen+3)
        this.push(cacheBuf)
      }
      var id = buf.toString().slice(1).trim().replace(/"/g, '\\"')
      cacheBufLen = id.length + 16
      cacheBuf = Buffer.concat([openID, new Buffer(id), closeIDOpenSeq], cacheBufLen)
    }
    else {
      cacheBufLen += buf.length
      cacheBuf = Buffer.concat([cacheBuf, buf], cacheBufLen)
    }
    next()
  }

  function flush() {
    cacheBuf = Buffer.concat([cacheBuf, closeSeq], cacheBufLen+3)
    this.push(cacheBuf)
    this.push(null)
  }
}
