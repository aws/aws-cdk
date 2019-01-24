import cxapi = require('@aws-cdk/cx-api');
import { Stack } from './cloudformation/stack';
import { Construct } from './core/construct';
import { IConstruct, MetadataEntry, PATH_SEP } from './core/construct';
import { Environment } from './environment';
import { Program } from './program';
import { validateAndThrow } from './util/validation';

/**
 * Properties for an App
 */
export interface AppProps {
  /**
   * The AWS environment (account/region) where stacks in this app will be deployed.
   *
   * If not supplied, the `default-account` and `default-region` context parameters will be
   * used. If they are undefined, it will not be possible to deploy the stack.
   *
   * @default Automatically determined
   */
  env?: Environment;

  /**
   * The CDK Program instance in which this app will be defined.
   *
   * You don't have to pass this, it exists for testing purposes. Only
   * supply this parameter if you know what you are doing.
   *
   * @default Automatically created
   */
  program?: Program;
}

/**
 * Used as construct name if no ID is supplied for the App
 */
const DEFAULT_APP_NAME = 'App';

/**
 * An instance of your App
 */
export class App extends Construct {
  /**
   * True if the given construct is a default-named App
   */
  public static isDefaultApp(construct: IConstruct) {
    return App.isApp(construct) && construct.defaultAppName;
  }

  /**
   * True if the given construct is an App object
   */
  public static isApp(construct: IConstruct): construct is App {
    return (construct as any).defaultAppName !== undefined;
  }

  /**
   * The environment in which this stack is deployed.
   */
  public readonly env: Environment;

  /**
   * Whether the App id was supplied
   */
  private defaultAppName: boolean;

  /**
   * Whether validate() was already run or not
   */
  private validated: boolean;

  /**
   * Whether prepare() was already run or not
   */
  private prepared: boolean;

  /**
   * Initializes a CDK application.
   *
   * @param request Optional toolkit request (e.g. for tests)
   */
  constructor(id?: string, props: AppProps = {}) {
    // For tests, we use a fresh Program every time. Right now, we configure this as
    // an environment variable set by 'cdk-test'. If we were using Jest,
    // we could use Jest initialization to configure testing mode.
    const program = props.program || (process.env.CDK_TEST_MODE === '1'
        ? new Program()
        : Program.defaultInstance());

    super(program, id || DEFAULT_APP_NAME);

    this.env = props.env || {};
    this.defaultAppName = id === undefined;
    this.validated = false;
    this.prepared = false;
  }

  private get stacks() {
    const out: { [name: string]: Stack } = { };
    for (const child of this.node.children) {
      if (!Stack.isStack(child)) {
        throw new Error(`The child ${child.toString()} of App must be a Stack`);
      }

      out[child.node.id] = child as Stack;
    }
    return out;
  }

  /**
   * @deprecated
   */
  public run() {
    this.node.addWarning(`It's not necessary to call app.run() anymore`);
  }

  /**
   * Synthesize and validate a single stack
   * @param stackName The name of the stack to synthesize
   */
  public synthesizeStack(stackName: string): cxapi.SynthesizedStack {
    // Maintain the existing contract that `synthesizeStack` can be called
    // by consumers, and that it will prepare and validate the construct tree.
    if (!this.prepared) {
      this.node.prepareTree();
    }
    if (!this.validated) {
      validateAndThrow(this);
    }

    const stack = this.getStack(stackName);

    const account = stack.env.account || 'unknown-account';
    const region = stack.env.region || 'unknown-region';

    const environment: cxapi.Environment = {
      name: `${account}/${region}`,
      account,
      region
    };

    const missing = Object.keys(stack.missingContext).length ? stack.missingContext : undefined;
    return {
      name: stack.name,
      environment,
      missing,
      template: stack.toCloudFormation(),
      metadata: this.collectMetadata(stack),
      dependsOn: noEmptyArray(stack.dependencies().map(s => s.name)),
    };
  }

  /**
   * Synthesizes multiple stacks
   */
  public synthesizeStacks(stackNames: string[]): cxapi.SynthesizedStack[] {
    const ret: cxapi.SynthesizedStack[] = [];
    for (const stackName of stackNames) {
      ret.push(this.synthesizeStack(stackName));
    }
    return ret;
  }

  /**
   * Returns metadata for all constructs in the stack.
   */
  public collectMetadata(stack: Stack) {
    const output: { [id: string]: MetadataEntry[] } = { };

    // Add in App metadata into every stack
    output[PATH_SEP + this.node.path] = this.node.metadata;

    for (const construct of stack.node.findAll()) {
      if (construct.node.metadata.length > 0) {
        // Make the path absolute.
        output[PATH_SEP + construct.node.path] = construct.node.metadata.map(md => construct.node.resolve(md) as MetadataEntry);
      }
    }

    return output;
  }

  protected prepare() {
    this.prepared = true;
  }

  protected validate(): string[] {
    this.validated = true;
    if (numberOfAppsInProgram(this) > 1 && this.node.id === DEFAULT_APP_NAME) {
      return ['When constructing more than one App, all of them must have ids'];
    }
    return [];
  }

  /**
   * Synthesize the App
   */
  protected synthesize(): any {
    return {
      stacks: this.synthesizeStacks(Object.keys(this.stacks)),
    };
  }

  private getStack(stackname: string) {
    if (stackname == null) {
      throw new Error('Stack name must be defined');
    }

    const stack = this.stacks[stackname];
    if (!stack) {
      throw new Error(`Cannot find stack ${stackname}`);
    }
    return stack;
  }
}

function noEmptyArray<T>(xs: T[]): T[] | undefined {
  return xs.length > 0 ? xs : undefined;
}

/**
 * Cound the Apps in the construct tree
 */
function numberOfAppsInProgram(app: IConstruct): number {
  return findRoot(app).node.findAll().filter(App.isApp).length;
}

/**
 * Return the root of the construct tree
 */
function findRoot(current: IConstruct): IConstruct {
  while (current.node.scope !== undefined) {
    current = current.node.scope;
  }
  return current;
}