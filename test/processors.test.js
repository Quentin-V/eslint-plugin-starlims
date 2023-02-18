const { expect } = require("chai");
const {
  ".js": jsProcessor,
  starlimsFunctionSuffixes,
  starlimsFunctionsPrefixes,
} = require("../src/processors");

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
        const code = "#include 'Categ.Script'\n" + "const foo = 1;";
        const result = jsProcessor.preprocess(code);
        expect(result).to.deep.equal([
          "//#include 'Categ.Script'\n" + "const foo = 1;",
        ]);
      });
      it("should comment the include statement even if the syntax is not correct", () => {
        const code =
          "#include 'Categ'\n" + "#include BadInclude\n" + "const foo = 1;";
        const result = jsProcessor.preprocess(code);
        expect(result).to.deep.equal([
          "//#include 'Categ'\n" + "//#include BadInclude\n" + "const foo = 1;",
        ]);
      });
    });
  });

  describe("postprocess", () => {
    describe("no-undef", () => {
      it("should ignore the message if it is a Starlims prefixed function", () => {
        const messages = [
          {
            ruleId: "no-undef",
            message: "'csOpenSomething' is not defined.",
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 1,
          },
        ];
        const result = jsProcessor.postprocess([messages]);
        expect(result).to.deep.equal([]);
      });
      it("should not ignore the message if it is not a Starlims prefixed function", () => {
        const messages = [
          {
            ruleId: "no-undef",
            message: "'foo' is not defined.",
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 1,
          },
        ];
        const result = jsProcessor.postprocess([messages]);
        expect(result).to.deep.equal(messages);
      });
    });

    describe("no-unused-vars", () => {
      it("should ignore the message if it is a Starlims suffixed function", () => {
        const messages = [
          {
            ruleId: "no-unused-vars",
            message: "'foo_OnLoad' is defined but never used.",
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 1,
          },
          {
            ruleId: "no-unused-vars",
            message: "'dgd_OnRowChange' is defined but never used.",
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 1,
          },
          {
            ruleId: "no-unused-vars",
            message: "'btn_OnClick' is defined but never used.",
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 1,
          }
        ];
        const result = jsProcessor.postprocess([messages]);
        expect(result).to.deep.equal([]);
      });
      it("should not ignore the message if it is not a Starlims suffixed function", () => {
        const messages = [
          {
            ruleId: "no-unused-vars",
            message: "'foo' is defined but never used.",
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 1,
          },
        ];
        const result = jsProcessor.postprocess([messages]);
        expect(result).to.deep.equal(messages);
      });
      it('should not do anything if there is no message', () => {
        const messages = [];
        const result = jsProcessor.postprocess([messages]);
        expect(result).to.deep.equal(messages);
      });
    });
  });
});
