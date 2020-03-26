import { CloudFormation } from 'aws-sdk';
import { debug } from '../../logging';
import { deserializeStructure } from '../../serialize';
import { StackStatus } from './cloudformation/stack-status';

export type Template = {
  Parameters?: Record<string, TemplateParameter>;
  [key: string]: any;
};

interface TemplateParameter {
  Default?: any;
  [key: string]: any;
}

/**
 * Represents an existing class in CloudFormation
 *
 * Bundle and cache some information that we need during deployment (so we don't have to make
 * repeated calls to CloudFormation).
 */
export class CloudFormationStack {
  public static async lookup(cfn: CloudFormation, stackName: string): Promise<CloudFormationStack> {
    try {
      const response = await cfn.describeStacks({ StackName: stackName }).promise();
      return new CloudFormationStack(cfn, stackName, response.Stacks && response.Stacks[0]);
    } catch (e) {
      if (e.code === 'ValidationError' && e.message === `Stack with id ${stackName} does not exist`) {
        return new CloudFormationStack(cfn, stackName, undefined);
      }
      throw e;
    }
  }

  private _template: any;

  protected constructor(private readonly cfn: CloudFormation, public readonly stackName: string, private readonly stack?: CloudFormation.Stack) {
  }

  public async template(): Promise<Template> {
    if (this._template === undefined) {
      const response = await this.cfn.getTemplate({ StackName: this.stackName, TemplateStage: 'Original' }).promise();
      this._template = (response.TemplateBody && deserializeStructure(response.TemplateBody)) || {};
    }
    return this._template;
  }

  public get exists() {
    return this.stack !== undefined;
  }

  public get stackId() {
    this.assertExists();
    return this.stack!.StackId!;
  }

  public get outputs(): Record<string, string> {
    this.assertExists();
    const result: { [name: string]: string } = {};
    (this.stack!.Outputs || []).forEach(output => {
      result[output.OutputKey!] = output.OutputValue!;
    });
    return result;
  }

  public get stackStatus(): StackStatus {
    if (!this.exists) {
      return new StackStatus('NOT_FOUND', `Stack not found during lookup`);
    }
    return StackStatus.fromStackDescription(this.stack!);
  }

  public get tags(): CloudFormation.Tags {
    this.assertExists();
    return this.stack!.Tags || [];
  }

  /**
   * Return the names of all parameters
   */
  public get parameterNames(): string[] {
    return this.exists ? (this.stack!.Parameters || []).map(p => p.ParameterKey!) : [];
  }

  private assertExists() {
    if (!this.exists) {
      throw new Error(`No stack named '${this.stackName}'`);
    }
  }
}

/**
 * Describe a changeset in CloudFormation, regardless of its current state.
 *
 * @param cfn       a CloudFormation client
 * @param stackName   the name of the Stack the ChangeSet belongs to
 * @param changeSetName the name of the ChangeSet
 *
 * @returns       CloudFormation information about the ChangeSet
 */
async function describeChangeSet(cfn: CloudFormation, stackName: string, changeSetName: string): Promise<CloudFormation.DescribeChangeSetOutput> {
  const response = await cfn.describeChangeSet({ StackName: stackName, ChangeSetName: changeSetName }).promise();
  return response;
}

/**
 * Waits for a function to return non-+undefined+ before returning.
 *
 * @param valueProvider a function that will return a value that is not +undefined+ once the wait should be over
 * @param timeout     the time to wait between two calls to +valueProvider+
 *
 * @returns       the value that was returned by +valueProvider+
 */
async function waitFor<T>(valueProvider: () => Promise<T | null | undefined>, timeout: number = 5000): Promise<T | undefined> {
  while (true) {
    const result = await valueProvider();
    if (result === null) {
      return undefined;
    } else if (result !== undefined) {
      return result;
    }
    await new Promise(cb => setTimeout(cb, timeout));
  }
}

/**
 * Waits for a ChangeSet to be available for triggering a StackUpdate.
 *
 * Will return a changeset that is either ready to be executed or has no changes.
 * Will throw in other cases.
 *
 * @param cfn       a CloudFormation client
 * @param stackName   the name of the Stack that the ChangeSet belongs to
 * @param changeSetName the name of the ChangeSet
 *
 * @returns       the CloudFormation description of the ChangeSet
 */
// tslint:disable-next-line:max-line-length
export async function waitForChangeSet(cfn: CloudFormation, stackName: string, changeSetName: string): Promise<CloudFormation.DescribeChangeSetOutput> {
  debug('Waiting for changeset %s on stack %s to finish creating...', changeSetName, stackName);
  const ret = await waitFor(async () => {
    const description = await describeChangeSet(cfn, stackName, changeSetName);
    // The following doesn't use a switch because tsc will not allow fall-through, UNLESS it is allows
    // EVERYWHERE that uses this library directly or indirectly, which is undesirable.
    if (description.Status === 'CREATE_PENDING' || description.Status === 'CREATE_IN_PROGRESS') {
      debug('Changeset %s on stack %s is still creating', changeSetName, stackName);
      return undefined;
    }

    if (description.Status === 'CREATE_COMPLETE' || changeSetHasNoChanges(description)) {
      return description;
    }

    // tslint:disable-next-line:max-line-length
    throw new Error(`Failed to create ChangeSet ${changeSetName} on ${stackName}: ${description.Status || 'NO_STATUS'}, ${description.StatusReason || 'no reason provided'}`);
  });

  if (!ret) {
    throw new Error('Change set took too long to be created; aborting');
  }

  return ret;
}

/**
 * Return true if the given change set has no changes
 *
 * This must be determined from the status, not the 'Changes' array on the
 * object; the latter can be empty because no resources were changed, but if
 * there are changes to Outputs, the change set can still be executed.
 */
export function changeSetHasNoChanges(description: CloudFormation.DescribeChangeSetOutput) {
  return description.Status === 'FAILED'
      && description.StatusReason
      && description.StatusReason.startsWith('The submitted information didn\'t contain changes.');
}

/**
 * Waits for a CloudFormation stack to stabilize in a complete/available state.
 *
 * @param cfn        a CloudFormation client
 * @param stackName      the name of the stack to wait for
 * @param failOnDeletedStack whether to fail if the awaited stack is deleted.
 *
 * @returns     the CloudFormation description of the stabilized stack
 */
export async function waitForStack(cfn: CloudFormation,
                                   stackName: string,
                                   failOnDeletedStack: boolean = true): Promise<CloudFormationStack | undefined> {
  debug('Waiting for stack %s to finish creating or updating...', stackName);
  return waitFor(async () => {
    const stack = await CloudFormationStack.lookup(cfn, stackName);
    if (!stack.exists) {
      debug('Stack %s does not exist', stackName);
      return null;
    }
    const status = stack.stackStatus;
    if (!status.isStable) {
      debug('Stack %s is still not stable (%s)', stackName, status);
      return undefined;
    }
    if (status.isCreationFailure) {
      throw new Error(`The stack named ${stackName} failed creation, it may need to be manually deleted from the AWS console: ${status}`);
    } else if (!status.isSuccess) {
      throw new Error(`The stack named ${stackName} is in a failed state: ${status}`);
    } else if (status.isDeleted) {
      if (failOnDeletedStack) { throw new Error(`The stack named ${stackName} was deleted`); }
      return null;
    }
    return stack;
  });
}

export class TemplateParameters {
  public static fromTemplate(template: Template) {
    return new TemplateParameters(template.Parameters || {});
  }

  constructor(private readonly params: Record<string, TemplateParameter>) {
  }

  /**
   * Return the set of CloudFormation parameters to pass to the CreateStack or UpdateStack API
   *
   * Will take into account parameters already set on the template (will emit
   * 'UsePreviousValue: true' for those unless the value is changed), and will
   * throw if parameters without a Default value or a Previous value are not
   * supplied.
   */
  public makeApiParameters(updates: Record<string, string | undefined>, prevParams: string[]): CloudFormation.Parameter[] {
    const missingRequired = new Array<string>();

    const ret: CloudFormation.Parameter[] = [];
    for (const [key, param] of Object.entries(this.params)) {

      if (key in updates && updates[key]) {
        ret.push({ ParameterKey: key, ParameterValue: updates[key] });
      } else if (prevParams.includes(key)) {
        ret.push({ ParameterKey: key, UsePreviousValue: true });
      } else if (param.Default === undefined) {
        missingRequired.push(key);
      }
    }

    if (missingRequired.length > 0) {
      throw new Error(`The following CloudFormation Parameters are missing a value: ${missingRequired.join(', ')}`);
    }

    return ret;
  }
}