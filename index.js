module.exports = fetchRFCIndex

var https = require('https')

var SEP = '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
var MULTINEWLINE = /\n{2,}/
var ITEM = /^(\d+) (.+?)\. /

function fetchRFCIndex(callback) {
  https.get('https://www.rfc-editor.org/rfc-index.txt', function(response) {
    if (response.statusCode !== 200) { callback(response.statusCode) }
    else {
      var buffers = [ ]
      response
        .on('data', function(buffer) { buffers.push(buffer) })
        .on('end', function() {
          callback(null,
            Buffer.concat(buffers).toString('ascii')
              .split(SEP)[2] // second section
              .split(MULTINEWLINE) // items
              .reduce(function(rfcs, entry) {
                var match = ITEM.exec(entry.replace('\n', '').replace(/\s+/g, ' '))
                if (match) { rfcs.push({ number: match[1], title: ( match[2] + '.' ) }) }
                return rfcs },
              [ ])) }) } }) }
