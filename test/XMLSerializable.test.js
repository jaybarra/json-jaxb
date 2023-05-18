import { XMLSerializable } from "../src/XMLSerializable.js";
import { expect } from "chai";

describe("Javascript", () => {
  it("imports", () => {
    expect(XMLSerializable).to.exist;
  });
});

describe("XML conversion", () => {
  it("uses the root element name", () => {
    const doc = new XMLSerializable();
    doc.setXMLRootName("foo");

    const xml = doc.toXML();
    expect(xml.split("\n")[1]).to.equal("<foo/>");
  });
});
