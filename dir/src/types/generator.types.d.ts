declare namespace GeneratorTypes {
    type RuleObj<ID = number> = {
        value: string;
        id: ID;
    };
    type Rule<ID> = {
        id: ID;
        ignore: boolean;
    };
    type RuleMap<ID = number> = Map<string, Rule<ID>>;
    type RegexRule<ID = number> = {
        rule: RegExp;
        id: ID;
    };
    type IdsToConcat<ID = number> = Map<ID, ID>;
    type Collection<ID = number> = {
        id: ID;
        value: string;
        ignore: boolean;
    };
    interface IGenerator<ID = number> {
        defineTokenRules(rules: RuleObj<ID>[]): void;
        defineCollections(collections: Collection<ID>[]): void;
        defineConcat(id: ID, transition?: ID): void;
        tokenize(): void;
    }
    type Token<ID = number> = {
        id: ID;
        lexeme: string;
        line: number;
        char: number;
    };
    type LineInfo = {
        line: number;
        char: number;
    };
    class SyntaxError extends Error {
        constructor(message: string, info: LineInfo);
    }
    class LexerError extends Error {
        constructor(message: string);
    }
}
export default GeneratorTypes;
