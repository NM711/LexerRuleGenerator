namespace GeneratorTypes {

  export type RuleObj<ID = number> = { value: string, id: ID };

  export type Rule<ID> = { id: ID, ignore: boolean };

  export type RuleMap<ID = number> = Map<string, Rule<ID>>;
  
  export type RegexRule<ID = number> = { rule: RegExp, id: ID };
  
  export type Collection<ID = number> = { id: ID, value: string, ignore: boolean };

  export interface IGenerator<ID = number> {
    defineTokenRules(rules: RuleObj<ID>[]): void;
    defineCollections(collections: Collection<ID>[]): void;
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

  export class LexerError extends Error {
    constructor (message: string) {
      super(message);
    };
  };
};

export default GeneratorTypes;
