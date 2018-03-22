const converter = require('xml-js');

export class XMLSerializable {
    static TYPE = {
        ELEMENT: "element",
        TEXT: "text"
    };

    constructor() {
        this._xmlType = null;
        this._xmlRootName = null;
        this._xmlValue = null;
        this._xmlAttributes = {};
        this._xmlElements = [];
    }

    setXMLRootName(name) {
        this._xmlRootName = name;
    }

    getXMLRootName() {
        return this._xmlRootName;
    }

    setXMLType(type) {
        this._xmlType = type;
    }

    getXMLType() {
        return this._xmlType;
    }

    setXMLValue(value) {
        this._xmlValue = value;
    }

    getXMLValue() {
        let v = this._xmlValue;
        while (typeof v === "function") {
            v = v();
        }
        return v;
    }

    /**
     *
     * @param {String} type The type, case sensitive
     * @param {string|number|boolean|null} value The value. If null it will remove the attribute
     */
    setXMLAttribute(type, value) {
        if (!(typeof type === "string")) {
            throw new Error("Attribute type must be a string")
        }
        let valueType = typeof value;
        if (valueType !== "string" && valueType !== "number" && valueType !== "boolean") {
            throw new Error("Attribute value must be a string, number, or boolean value")
        }

        if (value === null || value === undefined) {
            delete this._xmlAttributes[type];
        } else {
            this._xmlAttributes[type] = value;
        }
    }

    getXMLAttributes() {
        return this._xmlAttributes;
    }

    /**
     *
     * @param {object} elementDescriptor
     * @param {string} elementDescriptor.name
     * @param {XMLSerializable.TYPE} elementDescriptor.type
     * @param {any} [elementDescriptor.value]
     * @param {object} [elementDescriptor.attributes]
     * @param {object[]} [elementDescriptor.elements] Should be an array of GETTER methods or values
     */
    addXMLElement(elementDescriptor) {
        if (typeof elementDescriptor !== "object") {
            throw new Error("Elements must be JSON objects");
        }
        this._xmlElements = this._xmlElements.filter(ele => ele.name !== elementDescriptor.name);
        this._xmlElements.push(elementDescriptor);
    }

    /**
     *
     * @param name
     */
    removeXMLElement(name) {
        this._xmlAttributes = this._xmlElements.filter(ele => ele.name !== name);
    }

    getXMLElements() {
        return this._xmlElements.slice(0);
    }

    toXML() {
        const options = {
            ignoreComment: true,
            spaces: 4
        };

        const js = {
            declaration: {
                attributes: {
                    version: "1.0",
                    encoding: "UTF-8",
                    standalone: "yes"
                }
            },
            elements: [this._convertToJS(this.getXMLRootName())]
        };

        // verify output using this when necessary
        // console.debug(JSON.stringify(js, null, 2));
        return converter.js2xml(js, options);
    }

    _convertToJS(elementName) {
        let selfElement = {
            type: XMLSerializable.TYPE.ELEMENT,
            name: elementName,
            attributes: this.getXMLAttributes(),
            elements: []
        };

        this.getXMLElements().forEach(function (ele) {
            while (typeof ele.value === "function") {
                ele.value = ele.value();
            }

            if (ele.type === XMLSerializable.TYPE.TEXT) {
                selfElement.elements.push({
                    type: XMLSerializable.TYPE.ELEMENT,
                    name: ele.name,
                    attributes: ele.attributes,
                    elements: [
                        {
                            type: XMLSerializable.TYPE.TEXT,
                            text: ele.value
                        }
                    ]
                })
            } else {
                if (Array.isArray(ele.value)) {
                    // iterate through the children and add them to the parent
                    ele.value.forEach(function (child) {
                        selfElement.elements.push(child._convertToJS(ele.name));
                    })

                } else {
                    selfElement.elements.push(ele.value._convertToJS(ele.name));
                }
            }
        });

        return selfElement;
    }
}

