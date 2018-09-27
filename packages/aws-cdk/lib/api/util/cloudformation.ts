import { CloudFormation } from 'aws-sdk';
import { debug } from '../../logging';
import { StackStatus } from './cloudformation/stack-status';

/**
 * Describe a changeset in CloudFormation, regardless of it's current state.
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
 * Describes a stack in CloudFormation, regardless of it's current state.
 *
 * @param cfn     a CloudFormation client
 * @param stackName the name of the stack to be described
 *
 * @returns +undefined+ if the stack does not exist or is deleted, and the CloudFormation stack description otherwise
 */
export async function describeStack(cfn: CloudFormation, stackName: string): Promise<CloudFormation.Stack | undefined> {
  try {
    const response = await cfn.describeStacks({ StackName: stackName }).promise();
    return response.Stacks && response.Stacks[0];
  } catch (e) {
    if (e.code === 'ValidationError' && e.message === `Stack with id ${stackName} does not exist`) {
      return undefined;
    }
    throw e;
  }
}

/**
 * Checks whether a stack exists in CloudFormation.
 *
 * @param cfn     a CloudFormation client
 * @param stackName the name of the stack to be checked for
 *
 * @returns     +true+ if the stack exists, regardless of it's current state
 */
export async function stackExists(cfn: CloudFormation, stackName: string): Promise<boolean> {
  const description = await describeStack(cfn, stackName);
  return description !== undefined;
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
 * @param cfn       a CloudFormation client
 * @param stackName   the name of the Stack that the ChangeSet belongs to
 * @param changeSetName the name of the ChangeSet
 *
 * @returns       the CloudFormation description of the ChangeSet
 */
// tslint:disable-next-line:max-line-length
export async function waitForChangeSet(cfn: CloudFormation, stackName: string, changeSetName: string): Promise<CloudFormation.DescribeChangeSetOutput | undefined> {
  debug('Waiting for changeset %s on stack %s to finish creating...', changeSetName, stackName);
  return waitFor(async () => {
    const description = await describeChangeSet(cfn, stackName, changeSetName);
    // The following doesn't use a switch because tsc will not allow fall-through, UNLESS it is allows
    // EVERYWHERE that uses this library directly or indirectly, which is undesirable.
    if (description.Status === 'CREATE_PENDING' || description.Status === 'CREATE_IN_PROGRESS') {
      debug('Changeset %s on stack %s is still creating', changeSetName, stackName);
      return undefined;
    } else if (description.Status === 'CREATE_COMPLETE') {
      return description;
    } else if (description.Status === 'FAILED') {
      if (description.StatusReason && description.StatusReason.startsWith('The submitted information didn\'t contain changes.')) {
        return description;
      }
    }
    // tslint:disable-next-line:max-line-length
    throw new Error(`Failed to create ChangeSet ${changeSetName} on ${stackName}: ${description.Status || 'NO_STATUS'}, ${description.StatusReason || 'no reason provided'}`);
  });
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
                                   failOnDeletedStack: boolean = true): Promise<CloudFormation.Stack | undefined> {
  debug('Waiting for stack %s to finish creating or updating...', stackName);
  return waitFor(async () => {
    const description = await describeStack(cfn, stackName);
    if (!description) {
      debug('Stack %s does not exist', stackName);
      return null;
    }
    const status = StackStatus.fromStackDescription(description);
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
      return undefined;
    }
    return description;
  });
}
