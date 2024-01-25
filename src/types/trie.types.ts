export interface TrieNode {
  children: Map<string, TrieNode>,
  isEndOfWord: boolean
};