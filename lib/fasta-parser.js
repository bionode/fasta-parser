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
//     var fastaData = Buffer.from ('>sequence1\n\
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
// To include the reverse compliment of the sequences, pass arguments to the parser:
//
//     var parser = fasta(true) // Includes the reverse compliment for DNA sequences
//     var parser = fasta(true, true) // Includes the reverse compliment for RNA sequences
//
//     Example output:
//     //   { id: 'sequence1',
//     //     seq: 'ATGCACGTCACGTCAGTACTCGTCAGTAC',
//     //     rc: 'TACGTGCAGTGCAGTCATGAGCAGTCATG' }
//
// For a more useful API, check the dependent module:
//
// [bionode-fasta](http://github.com/bionode/bionode-fasta)

var through = require('through2')
var split = require('split')
var pumpify = require('pumpify')
var BufferList = require('bl')

module.exports = function (includeRevComp, isRna) {
  includeRevComp = typeof (includeRevComp) === 'boolean' ? includeRevComp : false
  isRna = typeof (isRna) === 'boolean' ? isRna : false
  var bases = includeRevComp ? getBaseComplements(isRna) : false
  return pumpify(split(), parser(bases))
}

function parser (bases) {
  var cacheBuf
  var openID = Buffer.from('{"id":"')
  var closeIDOpenSeq = Buffer.from('","seq":"')
  var closeSeqOpenRevComp = Buffer.from('","rc":"')
  var closeSeq = Buffer.from('"}\n')
  var stream = through(transform, flush)

  return stream

  function transform (buf, enc, next) {
    if (buf[0] === 62) { // If line starts with '>', this is an ID
      if (cacheBuf) { // If a previous object is in cache, push it
        cacheBuf.append(closeSeq)
        this.push(cacheBuf.slice())
      }
      var id = buf.toString().slice(1).trim().replace(/"/g, '\\"')
      cacheBuf = new BufferList()
      cacheBuf.append(openID)
      cacheBuf.append(id)
      cacheBuf.append(closeIDOpenSeq)
    } else {
      if (buf.length === 0) {
        // Ignore empty
      } else if (!cacheBuf) {
        this.emit('error', {msg: 'Failed fasta parsing', buf: buf})
      } else {
        cacheBuf.append(buf)
        if (bases) { // If bases is thruthy then it contains a string with reference bases
          cacheBuf.append(closeSeqOpenRevComp)
          cacheBuf.append(getReverseCompliment(buf))
        }
      }
    }
    next()
  }

  function flush () {
    if (cacheBuf) {
      cacheBuf.append(closeSeq)
      this.push(cacheBuf.slice())
    }
    this.push(null)
  }

  function getReverseCompliment (buf) {
    var seq = buf.toString()
    var complement = Buffer.alloc(seq.length)
    for (var i = 0; i < seq.length; i++) {
      var baseIndex = bases.indexOf(seq[i])
      if (baseIndex > -1) {
        // If the base was found in the base reference, pick the base 4 positions to the right, which is the complementary base
        complement.write(bases[bases.indexOf(seq[i]) + 4], i)
      } else {
        // If no match was found (e.g. if specifying that a DNA sequence is RNA), set the complimentary base to 0
        complement.write('0', i)
      }
    }
    return complement
  }
}

function getBaseComplements (isRna) {
  return isRna ? 'AGCUUCGA' : 'ATGCTACG'
}
