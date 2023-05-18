# use `require` syntax for now still
{ XMLSerializable } = require("../src/XMLSerializable.js");
{ assert } = require("chai");

describe 'Coffescript', ->
        it 'loads from coffeescript', ->
                doc = new XMLSerializable()
                assert.exists(doc)

        it 'contains an xml declaration', ->
                doc = new XMLSerializable()
                assert.match(doc.toXML(), /<\?xml version="1\.0" encoding="UTF-8" standalone="yes"\?>/)

        it 'uses the provided root name as the outer tag', ->
                doc = new XMLSerializable()
                doc.setXMLRootName("coffee")
                assert.equal(doc.toXML().split("\n")[1] ,'<coffee/>')
