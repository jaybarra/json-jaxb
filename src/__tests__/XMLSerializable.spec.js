import {XMLSerializable} from "../XMLSerializable";

describe("XMLSerializable", function() {
  it("should be able to be imported", function() {
	  let xmlSerializable = new XMLSerializable();
	expect(xmlSerializable).toBeTruthy();
  });

})
