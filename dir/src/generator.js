"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trie_1 = require("./trie");
var generator_types_1 = require("./types/generator.types");
;
var BioGenerator = /** @class */ (function () {
    function BioGenerator(options) {
        this.data = null;
        this.tokens = [];
        this.rules = new Map();
        this.toConcat = new Map();
        this.tree = new trie_1.default();
        this.info = this.initInfo();
        this.options = options || { caseSensitive: false };
    }
    ;
    BioGenerator.prototype.initInfo = function () {
        return {
            line: 1,
            char: 0
        };
    };
    ;
    Object.defineProperty(BioGenerator.prototype, "source", {
        /**
         * @method source
         * @param data
         * @description
         * Sets the source to be lexed.
         */
        set: function (data) {
            if (!this.options.caseSensitive) {
                this.data = data.toLowerCase().split("");
            }
            else {
                this.data = data.split("");
            }
            ;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(BioGenerator.prototype, "retrieve", {
        /**
         * @method retrieve
         * @description
         * Returns the generated tokens
         */
        get: function () {
            return this.tokens;
        },
        enumerable: false,
        configurable: true
    });
    ;
    BioGenerator.prototype.pushToken = function (id, lexeme) {
        this.tokens.push({
            id: id,
            lexeme: lexeme,
            line: this.info.line,
            char: this.info.char
        });
    };
    ;
    /**
     * @method defineTokenRules
     * @param rules
     * @description
     * Sets many token rules at once, and attempts to match strings with the given rules during tokenization.
     */
    BioGenerator.prototype.defineTokenRules = function (rules) {
        for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
            var _a = rules_1[_i], id = _a.id, value = _a.value;
            this.defineRule(id, value, false);
        }
        ;
    };
    ;
    BioGenerator.prototype.defineRule = function (id, rule, ignore) {
        if (!this.options.caseSensitive) {
            rule = rule.toLowerCase();
        }
        ;
        this.rules.set(rule, {
            id: id,
            ignore: ignore
        });
        this.tree.insert(rule);
    };
    ;
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
    BioGenerator.prototype.defineCollections = function (collections) {
        for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
            var _a = collections_1[_i], id = _a.id, value = _a.value, ignore = _a.ignore;
            var values = value.split("");
            for (var _b = 0, values_1 = values; _b < values_1.length; _b++) {
                var char = values_1[_b];
                this.defineRule(id, char, ignore);
            }
            ;
        }
        ;
    };
    ;
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
    BioGenerator.prototype.defineConcat = function (id, transition) {
        if (transition === void 0) { transition = id; }
        if (!this.toConcat.has(id)) {
            this.toConcat.set(id, transition);
        }
        else
            throw new generator_types_1.default.LexerError("The id of \"".concat(id, "\" has already been set to be concatenated!"));
    };
    ;
    BioGenerator.prototype.updateLineInfo = function (char) {
        if (char === "\n") {
            ++this.info.line;
            this.info.char = 1;
        }
        else {
            ++this.info.char;
        }
        ;
    };
    ;
    BioGenerator.prototype.isValid = function (word) {
        return this.options.caseSensitive ? this.tree.search(word) : this.tree.search(word.toLowerCase());
    };
    ;
    BioGenerator.prototype.isWordMatch = function (word) {
        return this.isValid(word) && this.rules.has(word);
    };
    ;
    BioGenerator.prototype.getIdAndPush = function (word) {
        var data = this.rules.get(word);
        if (!data.ignore) {
            this.pushToken(data.id, word);
        }
        ;
    };
    ;
    /**
     * @method repass
     * @descripion
     * After the tokens are built initially, we use this method in order to apply concatenation and transitions
     * to specific tokens, before sending the tokens to the user.
     */
    BioGenerator.prototype.repass = function () {
        var matchedConcatId = null;
        var concated = "";
        for (var t = 0; t < this.tokens.length; ++t) {
            var value = this.tokens[t];
            if (this.toConcat.has(value.id) && !matchedConcatId) {
                matchedConcatId = value.id;
            }
            ;
            if (this.toConcat.has(value.id) && matchedConcatId) {
                this.info.line = value.line;
                this.info.char = value.char;
                concated += value.lexeme;
                this.tokens.splice(t, 1);
                // update state of t, since we removed an element from the array.
                --t;
            }
            else if (!this.toConcat.has(value.id) && concated.length > 1 && matchedConcatId) {
                var transitionId = this.toConcat.get(matchedConcatId);
                this.tokens.splice(t, 0, {
                    id: transitionId,
                    lexeme: concated,
                    line: this.info.line,
                    char: this.info.char
                });
                concated = "";
                matchedConcatId = null;
            }
            ;
        }
        ;
    };
    ;
    BioGenerator.prototype.tokenize = function () {
        if (!this.data) {
            throw new generator_types_1.default.LexerError("Data source has not been set!");
        }
        ;
        var word = "";
        for (var i = 0; i < this.data.length; ++i) {
            var current = this.data[i];
            var next = this.data[i + 1];
            word += current;
            this.updateLineInfo(current);
            var temp = word + next;
            if (this.isValid(word) && this.isValid(temp)) {
                continue;
            }
            else if (this.isWordMatch(word) && !this.isValid(temp)) {
                this.getIdAndPush(word);
                word = "";
            }
            else {
                var split = word.split("");
                var consumed = split.shift();
                if (consumed && this.isWordMatch(consumed)) {
                    this.getIdAndPush(consumed);
                }
                else {
                    throw new generator_types_1.default.SyntaxError("Unexpected found in \"".concat(word, "\""), this.info);
                }
                ;
                word = split.join("");
            }
            ;
        }
        ;
        if (this.toConcat.size > 0) {
            this.repass();
        }
        ;
    };
    ;
    return BioGenerator;
}());
;
exports.default = BioGenerator;
