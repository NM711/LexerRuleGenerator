namespace GeneratorTypes {

  export enum RegexRuleState {
    INVALID,
    VALID,
    IGNORE,
  };

  export type RuleObj<ID = number> = { value: string, id: ID };

  export type RuleMap<ID = number> = Map<string, ID>;
  
  export type RegexRule<ID = number> = { rule: RegExp, id: ID, ignore: boolean };
  /**
  * Associates the token id to the construct argument, IF the token rule has been defined already.
  */

  export interface IGenerator<ID = number> {
    defineTokenRules(rules: GeneratorTypes.RuleObj<ID>[]): void;
    definePatternRule(id: ID, rule: string, ignore: boolean): void;
    tokenize(): void;
  };

  export type Token<ID = number> = {
    id: ID;
    lexeme: string;
    line: number;
    char: number;
  };

  export type LineInfo = {
    line: number;
    char: number;
  };

  export class SyntaxError extends Error {
    constructor (message: string, info: LineInfo) {
      super(`${message}. (line: ${info.line}, char: ${info.char})`);
    };
  };
};

export default GeneratorTypes;
