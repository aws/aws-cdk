import * as fs from 'fs';
import { Construct } from 'constructs';

/**
 * The rule set determines the two key elements of a match: your game's team structure and size, and how to group players together for the best possible match.
 *
 * For example, a rule set might describe a match like this:
 * - Create a match with two teams of five players each, one team is the defenders and the other team the invaders.
 * - A team can have novice and experienced players, but the average skill of the two teams must be within 10 points of each other.
 * - If no match is made after 30 seconds, gradually relax the skill requirements.
 */
export abstract class RuleSetBody {

  /**
   * Matchmaking ruleSet body from a file
   * @returns `JsonFileRuleSetBody` with inline code.
   * @param path The path to the ruleSet body file
   */
  public static fromJsonFile(path: string): RuleSetBody {
    return new JsonFileRuleSetBody(path);
  }

  /**
   * Inline body for Matchmaking ruleSet
   * @returns `InlineRuleSetBody` with inline code.
   * @param body The actual ruleSet body (maximum 65535 characters)
   */
  public static fromInline(body: string): RuleSetBody {
    return new InlineRuleSetBody(body);
  }

  /**
    * Called when the matchmaking ruleSet is initialized to allow this object to bind
    * to the stack and add resources.
    *
    * @param scope The binding scope.
    */
  public abstract bind(scope: Construct): RuleSetBodyConfig;
}

/**
 * Result of binding `RuleSetBody` into a `MatchmakingRuleSet`.
 */
export interface RuleSetBodyConfig {
  /**
     * Inline ruleSet body.
     */
  readonly ruleSetBody: string;
}

/**
 * Matchmaking ruleSet body from an inline string.
 */
export class InlineRuleSetBody extends RuleSetBody {

  /**
   * @param path The ruleSet body.
   */
  constructor(private body: string) {
    super();

    if (body.length === 0) {
      throw new Error('Matchmaking ruleSet body cannot be empty');
    }

    if (body.length > 65535) {
      throw new Error(`Matchmaking ruleSet body cannot exceed 65535 characters, actual ${body.length}`);
    }
  }

  public bind(_scope: Construct): RuleSetBodyConfig {
    return {
      ruleSetBody: this.body,
    };
  }
}

/**
 * Matchmaking ruleSet body from aJSON File.
 */
export class JsonFileRuleSetBody extends RuleSetBody {
  /**
   * Json file body content
   */
  private content: string;

  /**
   * @param path The path to the ruleSert body file.
   */
  constructor(private path: string) {
    super();
    if (!fs.existsSync(path)) {
      throw new Error(`Matchmaking ruleSet path does not exist, please verify it, actual ${this.path}`);
    }

    if (!fs.lstatSync(path).isFile()) {
      throw new Error(`Matchmaking ruleSet path is not link to a single file, please verify your path, actual ${this.path}`);
    }
    const file = fs.readFileSync(path);

    if (file.toString().length > 65535) {
      throw new Error(`Matchmaking ruleSet body cannot exceed 65535 characters, actual ${file.toString().length}`);
    }

    this.content = file.toString();
  }

  public bind(_scope: Construct): RuleSetBodyConfig {
    return {
      ruleSetBody: this.content,
    };
  }
}