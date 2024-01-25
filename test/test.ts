import BioGenerator from "../src/generator";
import fs from "node:fs";

enum MyTokens {
  GREET_CONSTRUCT = 1,
  HELLO,
  HOW,
  DOO,
  OSPECIAL,
};

enum SQLTokens {
  CREATE = 1,
  TABLE,
  OPENING_PARENTHESIS,
  CLOSING_PARENTHESIS,
  SEMICOLON,
  SEPERATOR
};

enum RepeatingSource {
  HELPPPP = 1,
  PEOPLE,
  HII,
  II
};


class Test {
  constructor () {};

  public test1() {
    const generator = new BioGenerator<MyTokens>();

    generator.source = "HELLO WORLD HOW DO YOUU DOOOOO!!!!!";
    
    generator.defineTokenRule(MyTokens.OSPECIAL, "OO!");
    generator.defineTokenRule(MyTokens.DOO, "O!");
    generator.defineTokenRule(MyTokens.HELLO, "HELLO");
    generator.defineTokenRule(MyTokens.HOW, "HOW");
    generator.defineTokenRule(MyTokens.DOO, "DOO");
    generator.tokenize();
    const tokens = generator.retrieve;
    console.log(tokens);
  };

  /**
   * Sql string test.
   */

  public test2() {
   const schema = fs.readFileSync("./test/test.sql", { encoding: "utf-8" });

    const generator = new BioGenerator<SQLTokens>();

    generator.source = schema; 

    generator.defineTokenRule(SQLTokens.CREATE, "create");
    generator.defineTokenRule(SQLTokens.TABLE, "table");
    generator.defineTokenRule(SQLTokens.SEMICOLON, ";");
    generator.defineTokenRule(SQLTokens.SEPERATOR, ",");
    generator.defineTokenRule(SQLTokens.OPENING_PARENTHESIS, "(");
    generator.defineTokenRule(SQLTokens.CLOSING_PARENTHESIS, ")");
    generator.tokenize();
    
    const tokens = generator.retrieve;

    console.log(tokens);
  };

  public test3() {
    const generator = new BioGenerator<RepeatingSource>();

    generator.source = "HELOOOOHELPPPPPPEOPLE,HOWWWWDOYOUUDOOOO   HIIIII"

    generator.defineTokenRule(RepeatingSource.HELPPPP, "helpppp");
    generator.defineTokenRule(RepeatingSource.HII, "hii");
    generator.defineTokenRule(RepeatingSource.II, "ii");
    generator.defineTokenRule(RepeatingSource.PEOPLE, "people");
    generator.tokenize();
    const tokens = generator.retrieve;

    console.log(tokens);
  };
};

const tests = new Test();

tests.test1();
tests.test2();
tests.test3();
