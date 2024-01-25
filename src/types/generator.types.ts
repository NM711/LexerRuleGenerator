namespace GeneratorTypes {

  export type RuleMap<ID = number> = Map<string, ID>;

  /**
  * Associates the token id to the construct argument, IF the token rule has been defined already.
  */

  export type ConstructToken<ID = number> = {
    kind: "TOKEN",
    tokenId: ID
  };

  /**
  * Matches the exact lexeme provided within the construct argument, in order to create a full construct rule.
  */

  export type ConstructLiteral = {
    kind: "LITERAL",
    value: string
  };

  export type ConstructArgument<ID = number> = ConstructLiteral | ConstructToken<ID>

  export interface IGenerator<ID = number> {
    defineTokenRule(id: ID, rule: string): void;
    definePatternRule(id: ID, rule: RegExp): void;
    defineConstructRule(id: ID, ...steps: ConstructArgument[]): void;
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
};

export default GeneratorTypes;
