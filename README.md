# JSON-JAXB
This project is intended to act as a serializer for ECMA 6 classes.

JAXB is a well known Java XML Marshalling library and the need for a JavaScript
equivalent sparked the creation of this library.

## How to use

```javascript
import {XMLSerializable} from "json-jaxb";

class MyClass extends XMLSerializable {
    constructor() {
        super();
    
        this.val = 42;
        this.child = new MyOtherClass();
        this.vals = [];
        
        // Now configure the XML representation
        this.setXMLRootName("myclass");
        this.setXMLAttribute("xsi:type", "myclass");
        
        this.addXMLElement({
            type: XMLSerializable.TYPE.TEXT,
            name: "val",
            value: this.getValue.bind(this)
        });
        
        this.addXMLElement({
            type: XMLSerializable.TYPE.ELEMENT,
            name: "child",
            value: function() {
                return this.child;
            }.bind(this)
        });
        
        this.addXMLElement({
            type: XMLSerializable.TYPE.ELEMENT,
            name: "others",
            value: this.getVals.bind(this)
        })
    }
}

// use the `toXML` function to produce the XML document
let myClass = new MyClass();
const myClassAsXML = myClass.toXML();
console.debug(myClassAsXML);
```

The expected output should resemble the following

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<myclass xsi:type="myclass">
    <val>42</val>
    <child>
        <!-- otherClass should also extend XMLSerializable -->
    </child>
    <others></others>
    <others></others>
    <others></others>
</myclass>
```

## Documentation

[setXMLRootName](#)
Default root name to use if not specified

[setXMLAttribute](#)
XML Attributes to assign to the root element
If another element with the same key is used, the original will be replaced 

[addXMLElement](#)
Adds an element to be contained by the child.
Adding an element with the same `name` value will replace the old one. Arrays of 
elements are supported

|Value | Type| Description|
|------|-----|------------|
|type | enum | The type of node the element represents|
|name | string | a string for the element name when serializing  |
|value | function | A getter function or value to get the value at the time of serialization|