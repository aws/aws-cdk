import { SSMPARAM_NO_INVALIDATE } from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import { StackStatus } from './cloudformation/stack-status';
import { debug } from '../../logging';
import { deserializeStructure } from '../../serialize';

export type Template = {
  Parameters?: Record<string, TemplateParameter>;
  [key: string]: any;
};

interface TemplateParameter {
  Type: string;
  Default?: any;
  Description?: string;
  [key: string]: any;
}

export type ResourceIdentifierProperties = CloudFormation.ResourceIdentifierProperties;
export type ResourceIdentifierSummaries = CloudFormation.ResourceIdentifierSummaries;
export type ResourcesToImport = CloudFormation.ResourcesToImport;

/**
 * Represents an (existing) Stack in CloudFormation
 *
 * Bundle and cache some information that we need during deployment (so we don't have to make
 * repeated calls to CloudFormation).
 */
export class CloudFormationStack {
  public static async lookup(
    cfn: CloudFormation, stackName: string, retrieveProcessedTemplate: boolean = false,
  ): Promise<CloudFormationStack> {
    try {
      const response = await cfn.describeStacks({ StackName: stackName }).promise();
      return new CloudFormationStack(cfn, stackName, response.Stacks && response.Stacks[0], retrieveProcessedTemplate);
    } catch (e: any) {
      if (e.code === 'ValidationError' && e.message === `Stack with id ${stackName} does not exist`) {
        return new CloudFormationStack(cfn, stackName, undefined);
      }
      throw e;
    }
  }

  /**
   * Return a copy of the given stack that does not exist
   *
   * It's a little silly that it needs arguments to do that, but there we go.
   */
  public static doesNotExist(cfn: CloudFormation, stackName: string) {
    return new CloudFormationStack(cfn, stackName);
  }

  /**
   * From static information (for testing)
   */
  public static fromStaticInformation(cfn: CloudFormation, stackName: string, stack: CloudFormation.Stack) {
    return new CloudFormationStack(cfn, stackName, stack);
  }

  private _template: any;

  protected constructor(
    private readonly cfn: CloudFormation, public readonly stackName: string, private readonly stack?: CloudFormation.Stack,
    private readonly retrieveProcessedTemplate: boolean = false,
  ) {
  }

  /**
   * Retrieve the stack's deployed template
   *
   * Cached, so will only be retrieved once. Will return an empty
   * structure if the stack does not exist.
   */
  public async template(): Promise<Template> {
    if (!this.exists) {
      return {};
    }

    if (this._template === undefined) {
      const response = await this.cfn.getTemplate({
        StackName: this.stackName,
        TemplateStage: this.retrieveProcessedTemplate ? 'Processed' : 'Original',
      }).promise();
      this._template = (response.TemplateBody && deserializeStructure(response.TemplateBody)) || {};
    }
    return this._template;
  }

  /**
   * Whether the stack exists
   */
  public get exists() {
    return this.stack !== undefined;
  }

  /**
   * The stack's ID
   *
   * Throws if the stack doesn't exist.
   */
  public get stackId() {
    this.assertExists();
    return this.stack!.StackId!;
  }

  /**
   * The stack's current outputs
   *
   * Empty object if the stack doesn't exist
   */
  public get outputs(): Record<string, string> {
    if (!this.exists) { return {}; }
    const result: { [name: string]: string } = {};
    (this.stack!.Outputs || []).forEach(output => {
      result[output.OutputKey!] = output.OutputValue!;
    });
    return result;
  }

  /**
   * The stack's status
   *
   * Special status NOT_FOUND if the stack does not exist.
   */
  public get stackStatus(): StackStatus {
    if (!this.exists) {
      return new StackStatus('NOT_FOUND', 'Stack not found during lookup');
    }
    return StackStatus.fromStackDescription(this.stack!);
  }

  /**
   * The stack's current tags
   *
   * Empty list of the stack does not exist
   */
  public get tags(): CloudFormation.Tags {
    return this.stack?.Tags || [];
  }

  /**
   * Return the names of all current parameters to the stack
   *
   * Empty list if the stack does not exist.
   */
  public get parameterNames(): string[] {
    return Object.keys(this.parameters);
  }

  /**
   * Return the names and values of all current parameters to the stack
   *
   * Empty object if the stack does not exist.
   */
  public get parameters(): Record<string, string> {
    if (!this.exists) { return {}; }
    const ret: Record<string, string> = {};
    for (const param of this.stack!.Parameters ?? []) {
      ret[param.ParameterKey!] = param.ParameterValue!;
    }
    return ret;
  }

  /**
   * Return the termination protection of the stack
   */
  public get terminationProtection(): boolean | undefined {
    return this.stack?.EnableTerminationProtection;
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
 * @param cfn           a CloudFormation client
 * @param stackName     the name of the Stack the ChangeSet belongs to
 * @param changeSetName the name of the ChangeSet
 * @param fetchAll      if true, fetches all pages of the change set description.
 *
 * @returns       CloudFormation information about the ChangeSet
 */
async function describeChangeSet(
  cfn: CloudFormation,
  stackName: string,
  changeSetName: string,
  { fetchAll }: { fetchAll: boolean },
): Promise<CloudFormation.DescribeChangeSetOutput> {
  const response = await cfn.describeChangeSet({ StackName: stackName, ChangeSetName: changeSetName }).promise();

  // If fetchAll is true, traverse all pages from the change set description.
  while (fetchAll && response.NextToken != null) {
    const nextPage = await cfn.describeChangeSet({
      StackName: stackName,
      ChangeSetName: response.ChangeSetId ?? changeSetName,
      NextToken: response.NextToken,
    }).promise();

    // Consolidate the changes
    if (nextPage.Changes != null) {
      response.Changes = response.Changes != null
        ? response.Changes.concat(nextPage.Changes)
        : nextPage.Changes;
    }

    // Forward the new NextToken
    response.NextToken = nextPage.NextToken;
  }

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
 * @param cfn           a CloudFormation client
 * @param stackName     the name of the Stack that the ChangeSet belongs to
 * @param changeSetName the name of the ChangeSet
 * @param fetchAll      if true, fetches all pages of the ChangeSet before returning.
 *
 * @returns       the CloudFormation description of the ChangeSet
 */
// eslint-disable-next-line max-len
export async function waitForChangeSet(
  cfn: CloudFormation,
  stackName: string,
  changeSetName: string,
  { fetchAll }: { fetchAll: boolean },
): Promise<CloudFormation.DescribeChangeSetOutput> {
  debug('Waiting for changeset %s on stack %s to finish creating...', changeSetName, stackName);
  const ret = await waitFor(async () => {
    const description = await describeChangeSet(cfn, stackName, changeSetName, { fetchAll });
    // The following doesn't use a switch because tsc will not allow fall-through, UNLESS it is allows
    // EVERYWHERE that uses this library directly or indirectly, which is undesirable.
    if (description.Status === 'CREATE_PENDING' || description.Status === 'CREATE_IN_PROGRESS') {
      debug('Changeset %s on stack %s is still creating', changeSetName, stackName);
      return undefined;
    }

    if (description.Status === 'CREATE_COMPLETE' || changeSetHasNoChanges(description)) {
      return description;
    }

    // eslint-disable-next-line max-len
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
  const noChangeErrorPrefixes = [
    // Error message for a regular template
    'The submitted information didn\'t contain changes.',
    // Error message when a Transform is involved (see #10650)
    'No updates are to be performed.',
  ];

  return description.Status === 'FAILED'
    && noChangeErrorPrefixes.some(p => (description.StatusReason ?? '').startsWith(p));
}

/**
 * Waits for a CloudFormation stack to stabilize in a complete/available state
 * after a delete operation is issued.
 *
 * Fails if the stack is in a FAILED state. Will not fail if the stack was
 * already deleted.
 *
 * @param cfn        a CloudFormation client
 * @param stackName      the name of the stack to wait for after a delete
 *
 * @returns     the CloudFormation description of the stabilized stack after the delete attempt
 */
export async function waitForStackDelete(
  cfn: CloudFormation,
  stackName: string): Promise<CloudFormationStack | undefined> {

  const stack = await stabilizeStack(cfn, stackName);
  if (!stack) { return undefined; }

  const status = stack.stackStatus;
  if (status.isFailure) {
    throw new Error(`The stack named ${stackName} is in a failed state. You may need to delete it from the AWS console : ${status}`);
  } else if (status.isDeleted) {
    return undefined;
  }
  return stack;
}

/**
 * Waits for a CloudFormation stack to stabilize in a complete/available state
 * after an update/create operation is issued.
 *
 * Fails if the stack is in a FAILED state, ROLLBACK state, or DELETED state.
 *
 * @param cfn        a CloudFormation client
 * @param stackName      the name of the stack to wait for after an update
 *
 * @returns     the CloudFormation description of the stabilized stack after the update attempt
 */
export async function waitForStackDeploy(
  cfn: CloudFormation,
  stackName: string): Promise<CloudFormationStack | undefined> {

  const stack = await stabilizeStack(cfn, stackName);
  if (!stack) { return undefined; }

  const status = stack.stackStatus;

  if (status.isCreationFailure) {
    throw new Error(`The stack named ${stackName} failed creation, it may need to be manually deleted from the AWS console: ${status}`);
  } else if (!status.isDeploySuccess) {
    throw new Error(`The stack named ${stackName} failed to deploy: ${status}`);
  }

  return stack;
}

/**
 * Wait for a stack to become stable (no longer _IN_PROGRESS), returning it
 */
export async function stabilizeStack(cfn: CloudFormation, stackName: string) {
  debug('Waiting for stack %s to finish creating or updating...', stackName);
  return waitFor(async () => {
    const stack = await CloudFormationStack.lookup(cfn, stackName);
    if (!stack.exists) {
      debug('Stack %s does not exist', stackName);
      return null;
    }
    const status = stack.stackStatus;
    if (status.isInProgress) {
      debug('Stack %s has an ongoing operation in progress and is not stable (%s)', stackName, status);
      return undefined;
    } else if (status.isReviewInProgress) {
      // This may happen if a stack creation operation is interrupted before the ChangeSet execution starts. Recovering
      // from this would requiring manual intervention (deleting or executing the pending ChangeSet), and failing to do
      // so will result in an endless wait here (the ChangeSet wont delete or execute itself). Instead of blocking
      // "forever" we proceed as if the stack was existing and stable. If there is a concurrent operation that just
      // hasn't finished proceeding just yet, either this operation or the concurrent one may fail due to the other one
      // having made progress. Which is fine. I guess.
      debug('Stack %s is in REVIEW_IN_PROGRESS state. Considering this is a stable status (%s)', stackName, status);
    }

    return stack;
  });
}

/**
 * The set of (formal) parameters that have been declared in a template
 */
export class TemplateParameters {
  public static fromTemplate(template: Template) {
    return new TemplateParameters(template.Parameters || {});
  }

  constructor(private readonly params: Record<string, TemplateParameter>) {
  }

  /**
   * Calculate stack parameters to pass from the given desired parameter values
   *
   * Will throw if parameters without a Default value or a Previous value are not
   * supplied.
   */
  public supplyAll(updates: Record<string, string | undefined>): ParameterValues {
    return new ParameterValues(this.params, updates);
  }

  /**
   * From the template, the given desired values and the current values, calculate the changes to the stack parameters
   *
   * Will take into account parameters already set on the template (will emit
   * 'UsePreviousValue: true' for those unless the value is changed), and will
   * throw if parameters without a Default value or a Previous value are not
   * supplied.
   */
  public updateExisting(updates: Record<string, string | undefined>, previousValues: Record<string, string>): ParameterValues {
    return new ParameterValues(this.params, updates, previousValues);
  }
}

/**
 * The set of parameters we're going to pass to a Stack
 */
export class ParameterValues {
  public readonly values: Record<string, string> = {};
  public readonly apiParameters: CloudFormation.Parameter[] = [];

  constructor(
    private readonly formalParams: Record<string, TemplateParameter>,
    updates: Record<string, string | undefined>,
    previousValues: Record<string, string> = {}) {

    const missingRequired = new Array<string>();

    for (const [key, formalParam] of Object.entries(this.formalParams)) {
      // Check updates first, then use the previous value (if available), then use
      // the default (if available).
      //
      // If we don't find a parameter value using any of these methods, then that's an error.
      const updatedValue = updates[key];
      if (updatedValue !== undefined) {
        this.values[key] = updatedValue;
        this.apiParameters.push({ ParameterKey: key, ParameterValue: updates[key] });
        continue;
      }

      if (key in previousValues) {
        this.values[key] = previousValues[key];
        this.apiParameters.push({ ParameterKey: key, UsePreviousValue: true });
        continue;
      }

      if (formalParam.Default !== undefined) {
        this.values[key] = formalParam.Default;
        continue;
      }

      // Oh no
      missingRequired.push(key);
    }

    if (missingRequired.length > 0) {
      throw new Error(`The following CloudFormation Parameters are missing a value: ${missingRequired.join(', ')}`);
    }

    // Just append all supplied overrides that aren't really expected (this
    // will fail CFN but maybe people made typos that they want to be notified
    // of)
    const unknownParam = ([key, _]: [string, any]) => this.formalParams[key] === undefined;
    const hasValue = ([_, value]: [string, any]) => !!value;
    for (const [key, value] of Object.entries(updates).filter(unknownParam).filter(hasValue)) {
      this.values[key] = value!;
      this.apiParameters.push({ ParameterKey: key, ParameterValue: value });
    }
  }

  /**
   * Whether this set of parameter updates will change the actual stack values
   */
  public hasChanges(currentValues: Record<string, string>): ParameterChanges {
    // If any of the parameters are SSM parameters, deploying must always happen
    // because we can't predict what the values will be. We will allow some
    // parameters to opt out of this check by having a magic string in their description.
    if (Object.values(this.formalParams).some(p => p.Type.startsWith('AWS::SSM::Parameter::') && !p.Description?.includes(SSMPARAM_NO_INVALIDATE))) {
      return 'ssm';
    }

    // Otherwise we're dirty if:
    // - any of the existing values are removed, or changed
    if (Object.entries(currentValues).some(([key, value]) => !(key in this.values) || value !== this.values[key])) {
      return true;
    }

    // - any of the values we're setting are new
    if (Object.keys(this.values).some(key => !(key in currentValues))) {
      return true;
    }

    return false;
  }
}

export type ParameterChanges = boolean | 'ssm';
