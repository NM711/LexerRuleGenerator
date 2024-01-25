import TrieTree from "./trie";
import GeneratorTypes from "./types/generator.types";

interface Options {
  caseSensitive?: boolean;
};

class BioGenerator<ID> implements GeneratorTypes.IGenerator<ID> {
  private data: string[];
  // later on determine wether you should use a map
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
      char: 1
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
   * @method defineToken
   * @param id
   * @param rule
   * @description
   * Sets a token rule for the given string literal and during generation, provides an identifier which was set for this rule here, if
   * there is a match.
   */

  // yet to implement

  public defineTokenRule(id: ID, rule: string): void {
    
    if (!this.options.caseSensitive) {
      rule = rule.toLowerCase();
    };

    this.rules.set(rule, id);
    this.tree.insert(rule);
  };

  /**
   * @method definePatternRule
   * @param id
   * @param rule
   * @description
   * Similarly to defineToken, this method sets a new token rule for the given regex and during generation provides the matching string,
   * with the provided identifier.
   */

  // public definePatternRule(id: ID, rule: RegExp) {
    // this.pushToken(id, rule);
  // };

  /**
   * @method defineConstruct
   * @param id 
   * @param steps 
   * @description
   * Constructs are rules that aim to implement more than a single token or literal,
   * they are intended to lex sentence like rules!
   */

  public defineConstructRule(id: ID, ...steps: GeneratorTypes.ConstructArgument<number>[]): void {
    if (steps.length <= 1) {
      throw new Error(`Constructs are rules made up of more than one literals or tokens, current length is of ${steps.length}!`)
    };

    let constructedRule: string = "";

    for (const step of steps) {
      if (step.kind !== "TOKEN") {
        constructedRule += step.value;
        this.tree.insert(step.value);
        continue;
      };

      let isMatch: boolean = false;

      for (const [value, id] of Object.entries(this.rules)) {
        if (id === step.tokenId) {
          isMatch = true;
          constructedRule += value;
        };
      };

      if (!isMatch) {
        throw new Error("Expected a valid rule id!");
      };
    };

    this.rules.set(constructedRule, id);
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

  public tokenize(): void {
    let word: string = "";
    // const matchedLineNums: Set<string> = new Set([]);

    // const possibleRecheks: {value: string,  index: number}[][] = [];

    // just trynna get shit to work, ignore the comments :)

    for (let j = 0; j < this.data.length; ++j) {
      const current = this.data[j];
      // const next = this.data[j + 1];

      word += current;
      this.updateLineInfo(current);

      if (this.isValid(word) && this.rules.has(word)) {
        const ruleId = this.rules.get(word) as ID;
        this.pushToken(ruleId, word);
      } else if (!this.isValid(word)) {
        word = "";
      };


      // if (!this.isValid(initialChar)) {
      //   continue;
      // };

      // for (let k = j; k < this.data.length; ++k) {

      //   const innerChar = this.data[k];
      //   word += innerChar;

      //   if (innerChar === "\n") {
      //     ++info.line;
      //     info.char = 1;
      //   } else {
      //     // console.log(k, info)
      //     ++info.char;
      //   };
 
      //   if (this.isValid(word) && this.rules.has(word) && !matchedLineNums.has(JSON.stringify(info))) {
      //     matchedLineNums.add(JSON.stringify(info));
      //     const ruleId = this.rules.get(word) as ID;
      //     this.pushToken(ruleId, word, info);

      //     word = "";
      //   } else if (!this.isValid(word)) {
      //     word = "";
      //   };
      // };
    };
  };
};

export default BioGenerator;
