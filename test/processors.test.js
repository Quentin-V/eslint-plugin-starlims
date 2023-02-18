const { expect } = require("chai");
const { ".js": jsProcessor, starlimsFunctionSuffixes, starlimsFunctionsPrefixes } = require("../src/processors");

describe("processor", () => {
  describe("preprocess", () => {
    describe("simple code", () => {
        it("should return the same code", () => {
            const code = "const foo = 1;";
            const result = jsProcessor.preprocess(code);
            expect(result).to.deep.equal([code]);
        });
    });
    describe("include statements", () => {
      it("should return the code with the include statements commented", () => {
        const code = "#include 'Categ.Script'\n" +
                     "const foo = 1;";
        const result = jsProcessor.preprocess(code);
        expect(result).to.deep.equal(["//#include 'Categ.Script'\n" + "const foo = 1;"]);
      });
      it('should comment the include statement even if the syntax is not correct', () => {
        const code = "#include 'Categ'\n" +
                     "#include BadInclude\n" +
                     "const foo = 1;";
        const result = jsProcessor.preprocess(code);
        expect(result).to.deep.equal(["//#include 'Categ'\n" + "//#include BadInclude\n" + "const foo = 1;"]);
      });
    });
  });
});
