namespace TestTypes {
  export class TestError extends Error {
    constructor (message: string) {
      super(message);
    };
  };

  export type Test = { pass: boolean, message: string };
};

export default TestTypes;
