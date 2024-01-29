declare class TrieTree {
    private root;
    constructor();
    /**
     * @method initNode
     * @description
     * Initializes an empty trie node.
     */
    private initNode;
    /**
     * @method insert
     * @param word
     * @description
     * Inserts word into trie by breaking up each character into its own node.
     */
    insert(word: string): void;
    /**
     * @method search
     * @param word
     * @description
     * Checks whether a word exists within the tree.
     */
    search(word: string): boolean;
}
export default TrieTree;
