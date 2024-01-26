import BioGenerator from "../src/generator";
import BioTester from "../lib/testing";
import fs from "node:fs";
import { SQLTokens, MyTokens, RepeatingSource } from "./test.enums";

function singleStringTest() {
  const generator = new BioGenerator<MyTokens>();

  generator.source = "HELLO WORLD HOW DO YOUU DOOOOO!!!!!";


  generator.defineTokenRules([
    {
      id: MyTokens.OSPECIAL,
      value: "OO!",
    },
    {
      id: MyTokens.DOO,
      value: "O!"
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
      value: "DOO"
    }
  ]);

  generator.definePatternRule(MyTokens.ALPHABET, "[a-zA-Z]");
  generator.definePatternRule(MyTokens.WS, "[ \t]+")
  generator.tokenize();
  return generator.retrieve;
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

  generator.definePatternRule(SQLTokens.ALPHABET, "[a-zA-Z_]");
  generator.definePatternRule(SQLTokens.NUMBER, "[0-9]");
  generator.definePatternRule(SQLTokens.WS, "[ \t]+", false)

  generator.tokenize();
  console.log(generator.retrieve)
  return generator.retrieve;
};

function repeatingStringTest() {
  const generator = new BioGenerator<RepeatingSource>();

  generator.source = "HELOOOOHELPPPPPPEOPLE,HOWWWWDOYOUUDOOOO   HIIIII"

  generator.defineTokenRules([
    {
      id: RepeatingSource.HELPPPP,
      value: "helpppp"
    },
    {
      id: RepeatingSource.HII,
      value: "hii"
    },
    {
      id: RepeatingSource.II,
      value: "ii"
    },
    {
      id: RepeatingSource.PEOPLE,
      value: "people"
    }
  ]);

  generator.tokenize();
  return generator.retrieve;
};

const tester = new BioTester();

// tester.test(["hello", "how", "doo", "oo!"], singleStringTest());
tester.test(["create table", "create table", "create table"], sqlSchemaTest())

tester.execute();

const tokens = sqlSchemaTest();

fs.writeFileSync("./a.json", JSON.stringify(tokens, null, 2));

