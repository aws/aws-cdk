
import '@jsii/check-node/run';
import { Environment } from '@aws-cdk/cx-api';
import { DefaultSelection, ExtendedStackSelection, StackCollection } from './api/cxapp/cloud-assembly';
import { CdkToolkit } from './cdk-toolkit';

/**
 * Options for List Stacks
 */
export interface ListStacksOptions {
  /**
   * Stacks to list
   *
   * @default - All stacks are listed
   */
  readonly selectors: string[];
}

/**
 * Type to store stack dependencies recursively
 */
export type DependencyDetails = {
  id: string;
  dependencies: DependencyDetails[];
};

/**
 * Type to store stack and their dependencies
 */
export type StackDetails = {
  id: string;
  name: string;
  environment: Environment;
  dependencies: DependencyDetails[];
};

/**
 * List Stacks
 *
 * @param toolkit cdk toolkit
 * @param options list stacks options
 * @returns StackDetails[]
 */
export async function listStacks(toolkit: CdkToolkit, options: ListStacksOptions): Promise<StackDetails[]> {
  const assembly = await toolkit.assembly();

  const stacks = await assembly.selectStacks({
    patterns: options.selectors,
  }, {
    extend: ExtendedStackSelection.Upstream,
    defaultBehavior: DefaultSelection.AllStacks,
  });

  function calculateStackDependencies(collectionOfStacks: StackCollection): StackDetails[] {
    const allData: StackDetails[] = [];

    for (const stack of collectionOfStacks.stackArtifacts) {
      const data: StackDetails = {
        id: stack.displayName ?? stack.id,
        name: stack.stackName,
        environment: stack.environment,
        dependencies: [],
      };

      for (const dependencyId of stack.dependencies.map(x => x.id)) {
        if (dependencyId.includes('.assets')) {
          continue;
        }

        const depStack = assembly.stackById(dependencyId);

        if (depStack.stackArtifacts[0].dependencies.length > 0 &&
          depStack.stackArtifacts[0].dependencies.filter((dep) => !(dep.id).includes('.assets')).length > 0) {

          const stackWithDeps = calculateStackDependencies(depStack);

          for (const stackDetail of stackWithDeps) {
            data.dependencies.push({
              id: stackDetail.id,
              dependencies: stackDetail.dependencies,
            });
          }
        } else {
          data.dependencies.push({
            id: depStack.stackArtifacts[0].displayName ?? depStack.stackArtifacts[0].id,
            dependencies: [],
          });
        }
      }

      allData.push(data);
    }

    return allData;
  }

  return calculateStackDependencies(stacks);
}
