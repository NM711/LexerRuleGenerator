import TrieTree from "./trie";
import GeneratorTypes from "./types/generator.types";

interface Options {
  caseSensitive?: boolean;
};

class BioGenerator<ID> implements GeneratorTypes.IGenerator<ID> {
  private data: string[];
  private rules: GeneratorTypes.RuleMap<ID>;
  // pattern rules are to be executed after a failed rule lookup.
  private patternRules: GeneratorTypes.RegexRule<ID>[];
  private tokens: GeneratorTypes.Token<ID>[];
  private info: GeneratorTypes.LineInfo;
  private tree: TrieTree;
  private options: Options;

  constructor(options?: Options) {
    this.tokens = [];
    this.patternRules = [];
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
      this.defineTokenRule(id, value);
    };
  };

  /**
   * @method defineToken
   * @param id
   * @param rule
   * @description
   * Sets a single token rule by using the provided literal and identifier, it attempts to match strings with the given rule
   * during tokenization
   */

  private defineTokenRule(id: ID, rule: string): void {
    
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

  public definePatternRule(id: ID, rule: string, ignore: boolean = false) {
    const regRule = new RegExp(`^${rule}$`);
    this.patternRules.push({ rule: regRule, id, ignore });
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
    const ruleId = this.rules.get(word) as ID;
    this.pushToken(ruleId, word);
  };

  private matchRegexRule(str: string): GeneratorTypes.RegexRuleState {
    for (const { rule, ignore, id } of this.patternRules) {
      if (rule.test(str) && !ignore) {
        this.pushToken(id, str);
        return GeneratorTypes.RegexRuleState.VALID;
      } else if (rule.test(str) && ignore) {
        return GeneratorTypes.RegexRuleState.IGNORE
      };
    };
    return GeneratorTypes.RegexRuleState.INVALID;
  };

  public tokenize(): void {
    let word: string = "";
    for (let i = 0; i < this.data.length; ++i) {
      const current = this.data[i];
      const next = this.data[i + 1];

      word += current;

      this.updateLineInfo(current);


      console.log(this.isValid(word), word)

      if (this.isWordMatch(word)) {
        
        this.getIdAndPush(word);
        word = "";

      } else if (!this.isValid(word) && word.length === 0) {
        
        this.matchRegexRule(word);
        word = "";

      } else if (!this.isValid(word) && word.length > 0) {

        let temp: string[] = word.split("");

          if (next !== undefined) {
            temp = `${word}${next}`.split("");
            
            console.log(next)
            this.updateLineInfo(next);
            ++i
          };

        while (temp.length > 0) {
          const consumed = temp.shift() as string;
          const matchReg = this.matchRegexRule(consumed);
          const potentialMatch = temp.join("");

          // note mathcReg = 0 = false, so ! is valid
          if (!matchReg && !this.rules.has(consumed) && consumed !== "\n") {
            throw new GeneratorTypes.SyntaxError(`invalid lexeme found "${consumed}" at "${word}"`, this.info);
          } else if (matchReg === GeneratorTypes.RegexRuleState.IGNORE) {
            continue; 
          } else if (this.rules.has(consumed)) {
            this.getIdAndPush(consumed);
            continue;
          } else if (this.isWordMatch(potentialMatch)) {
            console.log(potentialMatch)
            this.getIdAndPush(potentialMatch);
            break;
          };
        };

        word = "";
      };
    };
  };
};

export default BioGenerator;
