"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TrieTree = /** @class */ (function () {
    function TrieTree() {
        this.root = this.initNode();
    }
    ;
    /**
     * @method initNode
     * @description
     * Initializes an empty trie node.
     */
    TrieTree.prototype.initNode = function () {
        return {
            children: new Map()
        };
    };
    ;
    /**
     * @method insert
     * @param word
     * @description
     * Inserts word into trie by breaking up each character into its own node.
     */
    TrieTree.prototype.insert = function (word) {
        var node = this.root;
        for (var i = 0; i < word.length; ++i) {
            var current = word[i];
            if (!node.children.has(current)) {
                var child = this.initNode();
                node.children.set(current, child);
            }
            ;
            node = node.children.get(current);
        }
        ;
    };
    ;
    /**
     * @method search
     * @param word
     * @description
     * Checks whether a word exists within the tree.
     */
    TrieTree.prototype.search = function (word) {
        var node = this.root;
        for (var _i = 0, word_1 = word; _i < word_1.length; _i++) {
            var char = word_1[_i];
            if (!node.children.has(char)) {
                return false;
            }
            ;
            node = node.children.get(char);
        }
        ;
        return true;
    };
    ;
    return TrieTree;
}());
;
exports.default = TrieTree;
