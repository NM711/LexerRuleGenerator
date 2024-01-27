import TrieTree from "./trie";
import GeneratorTypes from "./types/generator.types";

interface Options {
  caseSensitive?: boolean;
};

class BioGenerator<ID> implements GeneratorTypes.IGenerator<ID> {
  private data: string[];
  private rules: GeneratorTypes.RuleMap<ID>;
  private tokens: GeneratorTypes.Token<ID>[];
  private info: GeneratorTypes.LineInfo;
  private tree: TrieTree;
  private options: Options;

  constructor(options?: Options) {
    this.tokens = [];
    this.rules = new Map();
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
   * Collections are strings of sequences of characters, or single characters. That get pushed to the rule map, in order to match
   * single characters with the provided sequence of rules.
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
    for (const { id, value, ignore  } of collections) {
      const values = value.split("");
      for (const char of values) {
        this.defineRule(id, char, ignore);
      };
    };
  };

  /**
   * @method definePatternRule
   * @param id
   * @param rule
   * @description
   * Similarly to defineToken, a new rule is declared for a token where regex is matched against a string. But, it only matches
   * characters. Meaning that if you need to match anything greater than a single character, you would need to use defineTokenRule or
   * defineConstruct.
   *
   * @example
   * // matches characters that are part of the alphabet with a given single char.
   * defineTokenRule(5, /[A-Za-z]/);
   *
   * // matches characters that are numbers 0-9 with the given single char.
   * defineTokenRule(7, /[0-9]/);
   */

  // public definePatternRule(id: ID, rule: string, ignore: boolean = false) {
    // const regRule = new RegExp(`^${rule}$`);
    // this.patternRules.push({ rule: regRule, id, ignore });
  // };

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
        // console.log(`CONTINUEDTEMPT: ${temp}`)
        continue;
      } else if (this.isWordMatch(word) && !this.isValid(temp)) {
        // console.log(`PUSHED ${word}, TEMP: ${temp}`)
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
       
        // console.log(split)

        word = split.join("");
        continue;
      };
    };
  };
};

export default BioGenerator;
