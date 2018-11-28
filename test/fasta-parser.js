var test = require('tape')
var fasta = require('../')
var jsonData = require('./data')

var fastaData = Buffer.from(`>contig1\n\
TCACCAACTACGAGATATGAGGTAAGCCAAAAAAGCACGTGGTGGCGCTCACCGACTGTTCCCAAACTGTAACTCATCGTT\n\
CCGTCAAGGCCTGACTTACTTCCCGGCCCTTTCCATGCGCGGACCATACCGTCCTAGTTCTTCGGTTATGTTTCCGATGTA\n\
GGAGTGAGCCTACCTCCGTTTGCGTCTTGTTACCAATGAAAAAGCTATGCACTTTGTACAGGGTGCCATCGGGTTTCTGAA\n\
CTCTCAGATAGTGGGGATCCCGGGAAAGGGCCTATATTTGCGGTCCAACTTAGGCGTAAACCTCGATGCTACCTACTCAGA\n\
CCCACCCCGCGCGGGGTAAATATGGCACTCATCCCAGCTGGTTCTTGGCGTTCTACGCAGCCACATGTTCATTAACAGTTG\n\
TCTGGTAGCACAAAAGTATTACCATGGTCCTAGAAGCCCGGCAGAGTTAGTTCGAACCTAATGCCACAAATGAGACAGGAC\n\
>contig2\n\
GCCAATGGGTACCGGACATTAGGTCGAGCTCAGTTCGGTAACGGAGAGACCCTGCGGCGTACTTAATTATGCATATGAAAC\n\
GCGCCCAAGTGACGCCAGGCAAGTCTCAGCAGGTTCCCGTGTTAGCTCGAGGGTAAACATACAAGCCGATTGAACATGGGT\n\
TGGGGGCTTCAAATCGTCGAGGACCCCACAGTACCTCGGAGACCAAGTAGGGCACCCTATAGTTCGAAGCAGAACTATTTC\n\
GAGGGGCGAGCCCTCATCGTCTCTTCTGCGGATGACTTAACACGCTAGGGACGTGGAGTCGATTCCATCGATGGTTATAAA\n\
> contig3 with | "strange" chars > in the header % 123\n\
TCAAAGATTCGGAATGCTGTCTGGAGGGTGAATCTAACGGTGCGTATCTCGATTGCTCAGTCGCTTTTCGTACTGCGCGAA\n\
AGTTCGTACCGCTCATTCACTTGGTTCCGAAGCCTGTCCTGATATATGAATCCAAACTAGAGCGGGGCTCTTGACATTTGG\n\
AGTTGTAAATATCTAATACTCCAATCGG\n`)

var fastaDataShortDNA = Buffer.from(`>contig1\n\
TCACCAACTACGA\n`)

var fastaDataShortRNA = Buffer.from(`>contig1\n\
AGCUUCAAC\n`)

test('Should parse a FASTA Buffer to a JSON Buffer', function (t) {
  t.plan(1)
  var result = []
  var parser = fasta()
  parser
  .on('data', function (data) { result.push(JSON.parse(data.toString())) })
  .on('end', function () { t.deepEqual(result, jsonData) })
  parser.write(fastaData)
  parser.end()
})

test('Should include reverse compliment if specified', function (t) {
  t.plan(1)
  var result = []
  var parser = fasta(true)
  parser
  .on('data', function (data) { result.push(JSON.parse(data.toString())) })
  .on('end', function () {
    t.deepEqual(result[0].rc, 'AGTGGTTGATGCT')
  })
  parser.write(fastaDataShortDNA)
  parser.end()
})

test('Should handle reverse complement of RNA sequences', function (t) {
  t.plan(1)
  var result = []
  var parser = fasta(true, true)
  parser
  .on('data', function (data) { result.push(JSON.parse(data.toString())) })
  .on('end', function () {
    t.deepEqual(result[0].rc, 'UCGAAGUUG')
  })
  parser.write(fastaDataShortRNA)
  parser.end()
})

test('Should replace invalid bases with 0', function (t) {
  t.plan(1)
  var result = []
  var parser = fasta(true, true)
  parser
  .on('data', function (data) { result.push(JSON.parse(data.toString())) })
  .on('end', function () {
    t.deepEqual(result[0].rc, '0GUGGUUG0UGCU')
  })
  parser.write(fastaDataShortDNA)
  parser.end()
})
