import type { TrieNode } from "./types/trie.types";

class TrieTree {
  private root: TrieNode;

  constructor () {
    this.root = this.initNode();
  };

  /**
   * @method initNode
   * @description
   * Initializes an empty trie node.
   */

  private initNode(): TrieNode {
    return {
      children: new Map()
    };
  };

 /**
  * @method insert
  * @param word
  * @description
  * Inserts word into trie by breaking up each character into its own node.
  */

  public insert(word: string) {
    let node = this.root;

    for (let i = 0; i < word.length; ++i) {
      const current = word[i];

      if (!node.children.has(current)) {
        const child = this.initNode();
        node.children.set(current, child);
      };

      node = node.children.get(current) as TrieNode;
    };
  };

  /**
   * @method search
   * @param word 
   * @description
   * Checks wether a word exists within the tree.
   */

  public search(word: string): boolean {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        return false;
      };

      node = node.children.get(char) as TrieNode;

    };

    return true;
  };
};

export default TrieTree;
