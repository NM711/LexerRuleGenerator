import GeneratorTypes from "./types/generator.types";
interface Options {
    caseSensitive?: boolean;
}
declare class BioGenerator<ID> implements GeneratorTypes.IGenerator<ID> {
    private data;
    private rules;
    private toConcat;
    private tokens;
    private info;
    private tree;
    private options;
    constructor(options?: Options);
    private initInfo;
    /**
     * @method source
     * @param data
     * @description
     * Sets the source to be lexed.
     */
    set source(data: string);
    /**
     * @method retrieve
     * @description
     * Returns the generated tokens
     */
    get retrieve(): GeneratorTypes.Token<ID>[];
    private pushToken;
    /**
     * @method defineTokenRules
     * @param rules
     * @description
     * Sets many token rules at once, and attempts to match strings with the given rules during tokenization.
     */
    defineTokenRules(rules: GeneratorTypes.RuleObj<ID>[]): void;
    private defineRule;
    /**
     * @method defineCollections
     * @param collections
     * @description
     * Collections are strings which represent a sequence of characters,
     * or single characters, which get split into an array.
     * After being split each character is pushed to the rule map, in order to match input characters with the
     * provided rule sequence.
     *
     * @example
     * // value gets converted into an array of characters [a-z], each getting pushed to the map with the given id value.
     * defineCollections([
     *  {
     *    id: 3,
     *    value: "abcdefghijklmnopqrstuvwxyz",
     *    ignore: false
     *  }
     * ])
     */
    defineCollections(collections: GeneratorTypes.Collection<ID>[]): void;
    /**
     * @method defineConcat
     * @param id
     * @param transition
     * @description
     * Method that concats tokens of one type together, if a transition id is provided, the updated token's id
     * will be updated.
     *
     * @example
     *
     * enum IDS = {
     *   Alphabet = 1,
     *   Literal
     * }
     *
     * // groups all non keyword specific tokens that are of alphabet together, then they are combined to
     * // form a new token of id literal.
     *
     * defineConcat(IDS.Alphabet, IDS.Literal);
     */
    defineConcat(id: ID, transition?: ID): void;
    private updateLineInfo;
    private isValid;
    private isWordMatch;
    private getIdAndPush;
    /**
     * @method repass
     * @descripion
     * After the tokens are built initially, we use this method in order to apply concatenation and transitions
     * to specific tokens, before sending the tokens to the user.
     */
    private repass;
    tokenize(): void;
}
export default BioGenerator;
