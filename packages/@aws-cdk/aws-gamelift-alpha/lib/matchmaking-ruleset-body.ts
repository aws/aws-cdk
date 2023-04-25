import * as fs from 'fs';
import { Construct } from 'constructs';

/**
 * Interface to represent Matchmaking RuleSet schema
 */
export interface IRuleSetBody {}

/**
 * Interface to represent output result of a RuleSetContent binding
 */
export interface RuleSetBodyConfig {
  /**
  * Inline ruleSet body.
  */
  readonly ruleSetBody: string;
}

/**
 * Interface to represent a Matchmaking RuleSet content
 */
export interface IRuleSetContent {

  /**
   * RuleSet body content
   *
   * @attribute
   */
  readonly content: IRuleSetBody;

  /**
    * Called when the matchmaking ruleSet is initialized to allow this object to bind
    * to the stack and add resources.
    *
    * @param _scope The binding scope.
    */
  bind(_scope: Construct): RuleSetBodyConfig;
}

/**
 * Properties for a new matchmaking ruleSet content
 */
export interface RuleSetContentProps {

  /**
   * RuleSet body content
   *
   * @default use a default empty RuleSet body
   */
  readonly content?: IRuleSetBody;
}

/**
 * The rule set determines the two key elements of a match: your game's team structure and size, and how to group players together for the best possible match.
 *
 * For example, a rule set might describe a match like this:
 * - Create a match with two teams of five players each, one team is the defenders and the other team the invaders.
 * - A team can have novice and experienced players, but the average skill of the two teams must be within 10 points of each other.
 * - If no match is made after 30 seconds, gradually relax the skill requirements.
 */
export class RuleSetContent implements IRuleSetContent {

  /**
   * Matchmaking ruleSet body from a file
   * @returns `RuleSetContentBase` based on JSON file content.
   * @param path The path to the ruleSet body file
   */
  public static fromJsonFile(path: string): IRuleSetContent {
    if (!fs.existsSync(path)) {
      throw new Error(`RuleSet path does not exist, please verify it, actual ${path}`);
    }

    if (!fs.lstatSync(path).isFile()) {
      throw new Error(`RuleSet path is not link to a single file, please verify your path, actual ${path}`);
    }
    const file = fs.readFileSync(path);

    return this.fromInline(file.toString());
  }

  /**
   * Inline body for Matchmaking ruleSet
   * @returns `RuleSetContent` with inline code.
   * @param body The actual ruleSet body (maximum 65535 characters)
   */
  public static fromInline(body: string): IRuleSetContent {
    if (body && body.length > 65535) {
      throw new Error(`RuleSet body cannot exceed 65535 characters, actual ${body.length}`);
    }
    try {
      return new RuleSetContent({
        content: JSON.parse(body),
      });
    } catch {
      throw new Error('RuleSet body has an invalid Json format');
    }
  }

  /**
   * RuleSet body content
   */
  public readonly content: IRuleSetBody;

  constructor(props: RuleSetContentProps) {
    this.content = props.content || {};
  }

  /**
    * Called when the matchmaking ruleSet is initialized to allow this object to bind
    * to the stack and add resources.
    *
    * @param _scope The binding scope.
    */
  public bind(_scope: Construct): RuleSetBodyConfig {
    return {
      ruleSetBody: JSON.stringify(this.content),
    };
  }
}
