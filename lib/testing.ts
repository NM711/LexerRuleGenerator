import TestTypes from "../src/types/test.types";
import type GeneratorTypes from "../src/types/generator.types";
// make a lib for this later on, new project idea :)

class BioTester {
  tests: (() => TestTypes.Test)[];

  constructor () {
    this.tests = [];
  };

  public test<ID>(expected: string[], values: GeneratorTypes.Token<ID>[], matchExact: boolean = false) {
    this.tests.push(() => this.execTest(expected, values, matchExact));
  };

  private execTest<ID>(expected: string[], values: GeneratorTypes.Token<ID>[], mode: boolean): { pass: boolean, message: string } {
    if (values.length !== expected.length && mode) {
      console.error(`Expected Lenth: ${expected.length}, Received Length: ${values.length}`);
      return { pass: false, message: `Expected values length does not match with the received values length!`};
    };

    if (!mode) {
      const expectedValues = new Set(expected);
      for (const v of values) {
        if (expectedValues.has(v.lexeme)) {
          expectedValues.delete(v.lexeme);
        };
      };

        if (expectedValues.size !== 0) {
          return { pass: false, message: "Could not match all of the expected values!" };
        };

    };

    // working on it

    // for (let i = 0; i < expected.length; ++i) {
      // const arg = expected[i];
      // const value = values[i];
    // };


    return { pass: true, message: "Test Pass!" }
  };

  public execute() {
    for (const [index, testCase] of this.tests.entries()) {
      const { pass,  message } = testCase();

      const failOrSuccessMessage = (kind: "FAILED" | "SUCCESS") => `Test Case #${index + 1} ${kind}: ${message}`;

      if (!pass) {
        console.error(failOrSuccessMessage("FAILED"));
        continue;
      };

      console.log(failOrSuccessMessage("SUCCESS"));
    };
  };
};

export default BioTester;
