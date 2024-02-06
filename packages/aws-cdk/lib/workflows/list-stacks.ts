
import { Environment } from '@aws-cdk/cx-api';
import { InitOptions, init as initialization } from './init';
import { DefaultSelection, ExtendedStackSelection, StackCollection } from '../api/cxapp/cloud-assembly';
import { CdkToolkit } from '../cdk-toolkit';
import { print } from '../logging';

let toolkit: CdkToolkit;

export async function init(options: InitOptions) {
  toolkit = await initialization(options);
}

export function initWithExistingToolkit(instance: CdkToolkit) {
  toolkit = instance;
}

export interface ListWorkflowOptions {
  readonly selectors: string[];
}

export type DependencyDetails = {
  id: string;
  dependencies: DependencyDetails[];
};

export type StackDetails = {
  id: string;
  name: string;
  environment: Environment;
  dependencies: DependencyDetails[];
};

export async function listWorkflow(options: ListWorkflowOptions): Promise<string> {
  const assembly = await toolkit.assembly();

  const stacks = await assembly.selectStacks({
    patterns: options.selectors,
  }, {
    extend: ExtendedStackSelection.Upstream,
    defaultBehavior: DefaultSelection.AllStacks,
  });

  toolkit.validateStacksSelected(stacks, options.selectors);
  toolkit.validateStacks(stacks);

  function calculateStackDependencies(collectionOfStacks: StackCollection): StackDetails[] {
    const allData: StackDetails[] = [];

    for (const stack of collectionOfStacks.stackArtifacts) {
      const data: StackDetails = {
        id: stack.id,
        name: stack.stackName,
        environment: stack.environment,
        dependencies: [],
      };

      for (const dependencyId of stack.dependencies.map(x => x.manifest.displayName ?? x.id)) {
        if (dependencyId.includes('.assets')) {
          continue;
        }

        const depStack = assembly.stackById(dependencyId);

        if (depStack.stackCount > 1) {
          throw new Error(`This command requires exactly one stack and we matched more than one: ${depStack.stackIds}`);
        }

        if (depStack.stackArtifacts[0].dependencies.length > 0 &&
          depStack.stackArtifacts[0].dependencies.filter((dep) => !(dep.manifest.displayName ?? dep.id).includes('.assets')).length > 0) {

          const stackWithDeps = calculateStackDependencies(depStack);

          for (const stackDetail of stackWithDeps) {
            data.dependencies.push({
              id: stackDetail.id,
              dependencies: stackDetail.dependencies,
            });
          }
        } else {
          data.dependencies?.push({
            id: depStack.stackArtifacts[0].id,
            dependencies: [],
          });
        }
      }

      allData.push(data);
    }

    return allData;
  }

  const result = calculateStackDependencies(stacks);

  // TODO remove this print in final pr
  print(JSON.stringify(result, null, 4));

  // StackDetails[] as serialized output
  return JSON.stringify(result);
}