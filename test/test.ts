import BioGenerator from "../src/generator";
import BioTester from "../lib/testing";
import fs from "node:fs";
import { SQLTokens, MyTokens, LangTokens } from "./test.enums";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";

function singleStringTest() {
  const generator = new BioGenerator<MyTokens>();

  generator.source = "HELLO WORLD HOW DO YOUU DOOOOO!!!!!";


  generator.defineTokenRules([
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

  generator.defineCollections([
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

  generator.defineConcat(MyTokens.ALPHABET, MyTokens.WORD);

  generator.tokenize();
  const tokens = generator.retrieve;
  console.log(JSON.stringify(tokens, null, 2));
  return tokens;
};

function sqlSchemaTest() {
  const schema = fs.readFileSync("./test/test.sql", { encoding: "utf-8" });

  const generator = new BioGenerator<SQLTokens>();

  generator.source = schema; 

  generator.defineTokenRules([
    {
      id: SQLTokens.CREATE_TABLE,
      value: "CREATE TABLE"
    },
    {
      id: SQLTokens.PRIMARY_KEY,
      value: "PRIMARY KEY"
    },
    {
      id: SQLTokens.REFERENCES,
      value: "REFERENCES"
    },
    {
      id: SQLTokens.NOT_NULL,
      value: "NOT NULL"
    },
    {
      id: SQLTokens.TEXT,
      value: "TEXT"
    },
    {
      id: SQLTokens.VARCHAR,
      value: "VARCHAR"
    },
    {
      id: SQLTokens.INT,
      value: "INT"
    },
    {
      id: SQLTokens.UNIQUE,
      value: "UNIQUE"
    },
    {
      id: SQLTokens.SEMICOLON,
      value: ";"
    },
    {
      id: SQLTokens.SEPERATOR,
      value: ","
    },
    {
      id: SQLTokens.OPENING_PARENTHESIS,
      value: "("
    },
    {
      id: SQLTokens.CLOSING_PARENTHESIS,
      value: ")"
    }
  ]);

  generator.defineCollections([
    {
      id: SQLTokens.ALPHABET,
      value: alphabet + "_",
      ignore: false
    },
    {
      id: SQLTokens.NUMBER,
      value: numbers,
      ignore: false
    },
    {
      id: SQLTokens.WS,
      value: " ",
      ignore: true
    },
    {
      id: SQLTokens.WS,
      value: "\n",
      ignore: true
    },
  ]);

  generator.defineConcat(SQLTokens.NUMBER);
  generator.defineConcat(SQLTokens.ALPHABET, SQLTokens.LITERAL);
  generator.tokenize();
  const tokens = generator.retrieve;

  console.log(tokens);

  return tokens;
};

function languageTest() {
  const data = fs.readFileSync("./test/lang_test.txt", { encoding: "utf-8" });

  const generator = new BioGenerator<LangTokens>({ caseSensitive: true });

  generator.source = data;

  generator.defineTokenRules([
    {
      id: LangTokens.FUNCTION,
      value: "func"
    },
    {
      id: LangTokens.CONSTANT,
      value: "const"
    },
    {
      id: LangTokens.VARIABLE,
      value: "let"
    },
    {
      id: LangTokens.IF,
      value: "if"
    },
    {
      id: LangTokens.STRING,
      value: "String"
    },
    {
      id: LangTokens.INT,
      value: "Int"
    },
    {
      id: LangTokens.OPEN_PARENTHESIS,
      value: "("
    },
    {
      id: LangTokens.CLOSE_PARENTHESIS,
      value: ")"
    },
    {
      id: LangTokens.BLOCK_OPEN,
      value: "{"
    },
    {
      id: LangTokens.BLOCK_CLOSE,
      value: "}"
    },
    {
      id: LangTokens.SEMICOLON,
      value: ";"
    },
    {
      id: LangTokens.EQUAL,
      value: "="
    },
    {
      id: LangTokens.DOUBLE_QUOTE,
      value: `"`
    }
  ]);

  generator.defineCollections([
    {
      id: LangTokens.ALPHABET,
      value: alphabet + alphabet.toUpperCase(),
      ignore: false
    },
    {
      id: LangTokens.NUMBER,
      value: numbers,
      ignore: false
    },
    {
      id: LangTokens.WS,
      value: "\n",
      ignore: true
    },
    {
      id: LangTokens.WS,
      value: " ",
      ignore: true
    },
  ]);

  generator.defineConcat(LangTokens.ALPHABET);
  generator.tokenize();

  const tokens = generator.retrieve;

  console.log(tokens);

  return tokens;
};

const tester = new BioTester();

tester.test(["hello", "how", "doo", "oo!"], singleStringTest());


const sqlSchema = sqlSchemaTest();

// what we expect in order
tester.test([
  "create table",
  "(",
  "int",
  "primary key",
  "varchar",
  "unique",
  "not null",
  ")",
  ";",
  "create table",
  "(",
  "int",
  "primary key",
  "varchar",
  "unique",
  "not null",
  "text",
  "not null",
  "int",
  "references",
  "(",
  ")",
  ")",
  ";",
  "create table",
  "(",
  "int",
  "primary key",
  "varchar",
  "not null",
  "text",
  "not null",
  "int",
  "references",
  "(",
  ")",
  ")",
  ";"
], sqlSchema)

tester.test([
  "func",
  "hello",
  "(",
  ")",
  "{",
  "let",
  "hi",
  "Int",
  ";",
  "const",
  "String",
  "=",
  `"`,
  `"`,
  ";",
  "if",
  "(",
  ")",
  "{",
  "const",
  "Int",
  ";",
  "}",
  ";",
  "}",
  ";"
  ], languageTest())