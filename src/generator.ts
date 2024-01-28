import TrieTree from "./trie";
import GeneratorTypes from "./types/generator.types";

interface Options {
  caseSensitive?: boolean;
};

class BioGenerator<ID> implements GeneratorTypes.IGenerator<ID> {
  private data: string[];
  private rules: GeneratorTypes.RuleMap<ID>;
  private toConcat: GeneratorTypes.IdsToConcat<ID>;
  private tokens: GeneratorTypes.Token<ID>[];
  private info: GeneratorTypes.LineInfo;
  private tree: TrieTree;
  private options: Options;

  constructor(options?: Options) {
    this.tokens = [];
    this.rules = new Map();
    this.toConcat = new Map();
    this.tree = new TrieTree();
    this.info = this.initInfo();
    this.options = options || { caseSensitive: false };
  };

  private initInfo(): GeneratorTypes.LineInfo {
    return {
      line: 1,
      char: 0
    };
  };
  /**
   * @method source
   * @param data
   * @description
   * Sets the source to be lexed.
   */

  public set source(data: string) {
    if (!this.options.caseSensitive) {
      this.data = data.toLowerCase().split("");
    } else {
      this.data = data.split("");
    };
  };

  /**
   * @method retrieve
   * @description
   * Returns the generated tokens
   */

  public get retrieve(): GeneratorTypes.Token<ID>[] {
    return this.tokens;
  };

  private pushToken(id: ID, lexeme: string) {
    this.tokens.push({
      id,
      lexeme,
      line: this.info.line,
      char: this.info.char
    });
  };

 /**
  * @method defineTokenRules
  * @param rules
  * @description
  * Sets many token rules at once, and attempts to match strings with the given rules during tokenization.
  */

  public defineTokenRules(rules: GeneratorTypes.RuleObj<ID>[]) {
    for (const { id, value } of rules) {
      this.defineRule(id, value, false);
    };
  };

  // TOKENS never get ignored.

  private defineRule(id: ID, rule: string, ignore: boolean): void {
    
    if (!this.options.caseSensitive) {
      rule = rule.toLowerCase();
    };

    this.rules.set(rule, {
      id,
      ignore
    });

    this.tree.insert(rule);
  };

  /**
   * @method defineCollections
   * @param collections
   * @description
   * Collections are strings whcich represent a sequence of characters, or single characters, which get split into an array.
   * They get pushed to the rule map, in order to match single characters with the provided sequence of rules.
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

  public defineCollections(collections: GeneratorTypes.Collection<ID>[]): void {
    for (const { id, value, ignore } of collections) {
      const values = value.split("");
      for (const char of values) {
        this.defineRule(id, char, ignore);
      };
    };
  };

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

  public defineConcat(id: ID, transition: ID = id): void {
    if (!this.toConcat.has(id)) {
      this.toConcat.set(id, transition);
    } else throw new GeneratorTypes.LexerError(`The id of "${id}" has already been set to be concatenated!`);
  };

  private updateLineInfo(char: string) {
    if (char === "\n") {
      ++this.info.line;
      this.info.char = 1;
    } else {
      ++this.info.char;
    };
  };

  private isValid(word: string): boolean {
     return this.options.caseSensitive ? this.tree.search(word) : this.tree.search(word.toLowerCase());
  };

  private isWordMatch(word: string): boolean {
    return this.isValid(word) && this.rules.has(word);
  };

  private getIdAndPush(word: string) {
    const data = this.rules.get(word) as GeneratorTypes.Rule<ID>;

    if (!data.ignore) {
      this.pushToken(data.id, word);
    };
  };

  /**
   * @method repass
   * @descripion
   * After the tokens are built initially, we use this method in order to apply concatenation and transitions
   * to specific tokens, before sending the tokens to the user.
   */

  private repass() {
    let matchedConcatId: ID | null = null;

    let concated: string = "";
    
    for (let t = 0; t < this.tokens.length; ++t) {
      const value = this.tokens[t];

      if (this.toConcat.has(value.id) && !matchedConcatId) {
        matchedConcatId = value.id;
      };

      if (this.toConcat.has(value.id) && matchedConcatId) {
        this.info.line = value.line;
        this.info.char = value.char;
        concated += value.lexeme;

        this.tokens.splice(t, 1);
        // update state of t, since we removed an element from the array.
        --t
      } else if (!this.toConcat.has(value.id) && concated.length > 1 && matchedConcatId) {
          const transitionId = this.toConcat.get(matchedConcatId) as ID;

          this.tokens.splice(t, 0, {
            id: transitionId,
            lexeme: concated,
            line: this.info.line,
            char: this.info.char
          })

         concated = "";
         matchedConcatId = null; 
      };
    };
  };

  public tokenize(): void {

    if (!this.data) {
      throw new GeneratorTypes.LexerError("Data source has not been set!");
    };

    let word: string = "";

    for (let i = 0; i < this.data.length; ++i) {
      const current = this.data[i];
      let next = this.data[i + 1];
      word += current;
      this.updateLineInfo(current);

      const temp: string = word + next;

      if (this.isValid(word) && this.isValid(temp)) {
        continue;
      } else if (this.isWordMatch(word) && !this.isValid(temp)) {
        this.getIdAndPush(word);
        word = "";
      } else {
        const split = word.split("");
        const consumed = split.shift();

        if (consumed && this.isWordMatch(consumed)) {
          this.getIdAndPush(consumed);
        } else {
          throw new GeneratorTypes.SyntaxError(`Unexpected found in "${word}"`, this.info);
        };

        word = split.join("");
      };
    };

    if (this.toConcat.size > 0) {
      this.repass();
    };
  };
};

export default BioGenerator;