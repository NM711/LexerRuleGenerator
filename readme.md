# BioGen - Tokenizing Simplified

### Description

As a someone who has recently gotten into interpreters and language design I have needed to build lexers,
which by themselves are quite easy to build but, they are also quite annoying. So I decided to make this
tool, in order to simplify the tokenization process in future projects.

BioGen is a relatively simple lexer rule generator it provides an easy to use api, in which you can declare
different token rules, transitions, and also set different options related to them.
At the heart of BioGen, a trie tree (prefix tree) is used by the program in order to store the rules we declare, it also allows us to do deterministic searching depending on the given input.

Let us take the word "hello", the lexer splits the string and checks wether the first character is valid
with any first node within the tree. If it is, the character is appended to a new string, in which we now,
append the next character to and test, this processes is repeated until the character or word, does or does not match with any rule stored within the trie. If it does not match an error is thrown

```
  // "p" is not included in "hello", and "help" does not exist in tree,
  // unexpected error is thrown.
  hello => h (T) => e (T) => l (T) => p (F) 

  // "hello" was able to get to the very end of the tree node without straying off its path,
  // in this case it is valid and it gets tokenized

  hello => h (T) => e (T) => l (T) => l (T) => o (T)
```

### Initial Setup

```bash
  npm install biogen
```

```ts
  import BioGenerator from "biogen"

  enum MyTokens {
    HELLO = 1,
    WS,
    HOW,
    DOO,
    OSPECIAL,
    ALPHABET,
    WORD
  };

  const lexer = new BioGenerator<MyTokens>();
```

## API

### Setting The Source

```ts
  // sets input

  lexer.source = "HELLO WORLD HOW DO YOUU DOOOOO!!!!!";
```

### Token Definitions

```ts
  // sets an array of rules to match
  
  lexer.defineTokenRules([
    {
      id: MyTokens.OSPECIAL,
      value: "O!"
    },
    {
      id: MyTokens.OSPECIAL,
      value: "OO!",
    },
 
    {
      id: MyTokens.HELLO,
      value: "HELLO"
    },
    {
      id: MyTokens.HOW,
      value: "HOW"
    },
    {
      id: MyTokens.DOO,
      value: 'DO'
    },
    {
      id: MyTokens.DOO,
      value: "DOO"
    }
  ]);
```

**Please Note** that the longest rule will always be matched first, for example
when the program is put in a situation where, "OO!" or "O!" need to be tokenized, and there is only one
given match "OO!" will be tokenized, whilst "O!" does not.

### Collections
Collections are strings which represent a sequence of characters, 
or single characters, which get split into an array. 
After being split each character is pushed to the rule map, in order to match input characters with the
provided rule sequence.

```ts
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  // This will add whitespace as a collection rule which if matched, is to be ignored.
  // It will also add the alphabet + "!" to be tokenized and given the alphabet id, in this case
  // alphabet characters are not to be ignored.

  lexer.defineCollections([
    {
      id: MyTokens.ALPHABET,
      value: alphabet + "!",
      ignore: false
    },
    {
      id: MyTokens.WS,
      value: " ",
      ignore: true
    },
  ]);
```

### Token Concatenation

In order to concatenate different tokens, ideally tokens that are associated to a collection. You can define
the id of the token to be concatenated, you can also add a transition which updates the id of the newly formed
token.

At the moment tokens can only be concatenated or merged, if they are of the same id.

Below is an example.


```ts
  // tokens that are together, that are of id ALPHABET, are concatenated to form another token whose id
  // is defined as WORD.

  lexer.defineConcat(MyTokens.ALPHABET, MyTokens.WORD);
```

### Running The Tokenizer

```ts
  lexer.tokenize();
  const tokens = lexer.retrieve;
  console.log(tokens);
```

#### **Output**

```json
[
  {
    "id": 1,
    "lexeme": "hello",
    "line": 1,
    "char": 5
  },
  {
    "id": 7,
    "lexeme": "world",
    "line": 1,
    "char": 11
  },
  {
    "id": 3,
    "lexeme": "how",
    "line": 1,
    "char": 15
  },
  {
    "id": 4,
    "lexeme": "do",
    "line": 1,
    "char": 18
  },
  {
    "id": 7,
    "lexeme": "youu",
    "line": 1,
    "char": 23
  },
  {
    "id": 4,
    "lexeme": "doo",
    "line": 1,
    "char": 27
  },
  {
    "id": 5,
    "lexeme": "oo!",
    "line": 1,
    "char": 31
  }
]
```

## Testing

If you wish to run tests the created tests,
you can clone the repository, do the following:

```bash
  git clone https://github.com/NM711/LexerRuleGenerator.git

  cd /home/YOUR-PATH/LexerRuleGenerator

  npm install

  npm run test
```
