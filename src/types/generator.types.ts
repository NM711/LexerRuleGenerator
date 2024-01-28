namespace GeneratorTypes {

  export type RuleObj<ID = number> = { value: string, id: ID };

  export type Rule<ID> = { id: ID, ignore: boolean };

  export type RuleMap<ID = number> = Map<string, Rule<ID>>;
  
  export type RegexRule<ID = number> = { rule: RegExp, id: ID };

  // value ID = transition value;
  export type IdsToConcat<ID = number> = Map<ID, ID>;

  export type Collection<ID = number> = { id: ID, value: string, ignore: boolean };

  export interface IGenerator<ID = number> {
    defineTokenRules(rules: RuleObj<ID>[]): void;
    defineCollections(collections: Collection<ID>[]): void;
    // method that will attempt to concat any stray character tokens. This can be particularly usefule when trying to
    // build full numbers rathers than just: token 1 = 1, token 2 = 2, token = 3, instead token 1 = 123.
    // it also applies a transitioned id if provided
    defineConcat(id: ID, transition?: ID): void;
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
