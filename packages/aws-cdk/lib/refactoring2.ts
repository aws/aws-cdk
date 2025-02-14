import { createHash } from 'crypto';
import type * as cxapi from '@aws-cdk/cx-api';
import { Environment } from '@aws-cdk/cx-api';
import {
  type CreateStackRefactorCommandInput,
  ResourceLocation,
  StackDefinition,
} from '@aws-sdk/client-cloudformation';
import { ResourceMapping } from '@aws-sdk/client-cloudformation/dist-types/models/models_0';
import { CloudFormationStack, ICloudFormationClient, SdkProvider, Template } from './api';
import { Mode } from './api/plugin';
import { info } from './logging';

export class AmbiguityError extends Error {
  constructor(public readonly pairs: [ResourceLocation[], ResourceLocation[]][]) {
    super(`Ambiguous pairs: ${JSON.stringify(pairs)}`);
  }
}

// TODO rename
export interface StackFoo {
  readonly environment: cxapi.Environment;
  readonly stackName: string;
  readonly template: Template;
}

/**
 * Performs a refactor if any resources were renamed or moved across stacks
 */
export async function tryRefactor(after: StackFoo[], sdkProvider: SdkProvider): Promise<void> {
  const before = await maloca(after, sdkProvider);
  const stackGroups: Map<string, [StackFoo[], StackFoo[]]> = new Map();
  const environments: Map<string, Environment> = new Map();

  // TODO Remove duplication
  before.forEach(stack => {
    const key = hashObject(stack.environment);
    environments.set(key, stack.environment);
    if (stackGroups.has(key)) {
      stackGroups.get(key)![0].push(stack);
    } else {
      stackGroups.set(key, [[stack], []]);
    }
  });

  after.forEach(stack => {
    const key = hashObject(stack.environment);
    environments.set(key, stack.environment);
    if (stackGroups.has(key)) {
      stackGroups.get(key)![1].push(stack);
    } else {
      stackGroups.set(key, [[], [stack]]);
    }
  });

  for (let [key, [oldStacks, newStacks]] of stackGroups.entries()) {
    const environment = environments.get(key)!;
    const cfnClient = (await sdkProvider.forEnvironment(environment, Mode.ForWriting, {
      // TODO use a parameterized ARN
      // eslint-disable-next-line @cdklabs/no-literal-partition
      assumeRoleArn: 'arn:aws:iam::669420849322:role/cdk-hnb659fds-deploy-role-669420849322-us-east-2',
    })).sdk.cloudFormation();

    await doRefactor(cfnClient, makeCommandInput(oldStacks, newStacks));
  }
}

async function maloca(stacks: StackFoo[], sdkProvider: SdkProvider): Promise<StackFoo[]> {
  // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
  return (await Promise.all(stacks.map(async s => {
    const cfn = (await sdkProvider.forEnvironment(s.environment, Mode.ForWriting, {
      // TODO use a parameterized ARN
      // eslint-disable-next-line @cdklabs/no-literal-partition
      assumeRoleArn: 'arn:aws:iam::669420849322:role/cdk-hnb659fds-deploy-role-669420849322-us-east-2',
    })).sdk.cloudFormation();

    const cfnStack = await CloudFormationStack.lookup(cfn, s.stackName, true);

    if (cfnStack.exists) {
      const result: StackFoo = {
        environment: s.environment,
        template: await cfnStack.template(),
        stackName: s.stackName,
      };

      return result;
    } else {
      return undefined;
    }
  }))).filter(Boolean) as StackFoo[];
}

async function doRefactor(cfnClient: ICloudFormationClient, input: CreateStackRefactorCommandInput): Promise<void> {
  if (input.ResourceMappings?.length === 0) {
    return;
  }

  const stackRefactor = await cfnClient.createStackRefactor(input);

  info(`Stack refactor created: ${stackRefactor.StackRefactorId}`);

  await cfnClient.waitUntilStackRefactorCreateComplete({
    StackRefactorId: stackRefactor.StackRefactorId,
  });

  info('Stack refactor creation completed');

  await cfnClient.executeStackRefactor({
    StackRefactorId: stackRefactor.StackRefactorId,
  });

  info('Stack refactor execution started');

  await cfnClient.waitUntilStackRefactorExecuteComplete({
    StackRefactorId: stackRefactor.StackRefactorId,
  });

  info('Stack refactoring complete');
}

function makeCommandInput(before: StackFoo[], after: StackFoo[]): CreateStackRefactorCommandInput {
  const mappings = computeMappings(
    removeCommonResources(
      merge(
        buildRecord(before.flatMap(index)),
        buildRecord(after.flatMap(index)),
      ),
    ),
  );

  const stackDefinitions = applyMappings(mappings, before, after);

  return {
    StackDefinitions: stackDefinitions,
    ResourceMappings: mappings,
  };
}

function computeMappings(x: Record<string, [ResourceLocation[], ResourceLocation[]]>): ResourceMapping[] {
  const ambiguousPairs = Object.values(x)
    .filter(([before, after]) =>
      before.length > 1 || after.length > 1,
    );
  if (ambiguousPairs.length > 0) {
    throw new AmbiguityError(ambiguousPairs);
  }

  return Object.values(x)
    .filter(([before, after]) =>
      before.length === 1 && after.length === 1 &&
      (before[0].LogicalResourceId !== after[0].LogicalResourceId
       || before[0].StackName !== after[0].StackName),
    )
    .map(([before, after]) => ({
      Source: before[0],
      Destination: after[0],
    }));
}

function removeCommonResources(
  m: Record<string, [ResourceLocation[], ResourceLocation[]]>,
): Record<string, [ResourceLocation[], ResourceLocation[]]> {
  const result: Record<string, [ResourceLocation[], ResourceLocation[]]> = {};
  for (const [hash, [before, after]] of Object.entries(m)) {
    const common = before.filter(b =>
      after.some(a => eq(a, b)),
    );
    result[hash] = [
      before.filter(b =>
        !common.some(c => eq(b, c)),
      ),
      after.filter(a =>
        !common.some(c => eq(a, c)),
      ),
    ];
  }

  function eq(a: ResourceLocation, b: ResourceLocation): boolean {
    return a.LogicalResourceId === b.LogicalResourceId && a.StackName === b.StackName;
  }

  return result;
}

function merge(
  m1: Record<string, ResourceLocation[]>,
  m2: Record<string, ResourceLocation[]>,
): Record<string, [ResourceLocation[], ResourceLocation[]]> {
  const result: Record<string, [ResourceLocation[], ResourceLocation[]]> = {};

  for (const [hash, locations] of Object.entries(m1)) {
    if (hash in m2) {
      result[hash] = [locations, m2[hash]];
    } else {
      result[hash] = [locations, []];
    }
  }

  for (const [hash, locations] of Object.entries(m2)) {
    if (!(hash in m1)) {
      result[hash] = [[], locations];
    }
  }

  return result;
}

// TODO rename
function buildRecord(entries: [string, ResourceLocation][]): Record<string, ResourceLocation[]> {
  const result: Record<string, ResourceLocation[]> = {};

  for (const [hash, location] of entries) {
    if (hash in result) {
      result[hash].push(location);
    } else {
      result[hash] = [location];
    }
  }

  return result;
}

function index(stack: StackFoo): [string, ResourceLocation][] {
  return Object
    .entries(stack.template.Resources)
    .map(([logicalId, resource]) => {
      const hash = hashObject(resource);
      const location: ResourceLocation = {
        StackName: stack.stackName,
        LogicalResourceId: logicalId,
      };
      return [hash, location];
    });
}

function hashObject(obj: any): string {
  const hash = createHash('sha256');

  function addToHash(value: any) {
    if (typeof value === 'object') {
      if (value == null) {
        addToHash('null');
      } else if (Array.isArray(value)) {
        value.forEach(addToHash);
      } else {
        Object.keys(value).sort().forEach(key => {
          hash.update(key);
          addToHash(value[key]);
        });
      }
    } else {
      hash.update(typeof value + value.toString());
    }
  }

  const { Metadata, ...rest } = obj;
  addToHash(rest);

  return hash.digest('hex');
}

function applyMappings(
  mappings: ResourceMapping[],
  oldStacks: StackFoo[],
  newStacks: StackFoo[],
): StackDefinition[] {
  const oldTemplates = byName(oldStacks);
  const newTemplates = byName(newStacks);

  const stacksToSend: Set<StackDefinition> = new Set();

  mappings.forEach(mapping => {
    // Source always come from what's there before
    const sourceStackName = mapping.Source?.StackName ?? '';
    const destinationStackName = mapping.Destination?.StackName ?? '';
    const sourceTemplate = oldTemplates[sourceStackName];

    const sourceLogicalId = mapping.Source?.LogicalResourceId ?? '';
    const destinationLogicalId = mapping.Destination?.LogicalResourceId ?? '';

    if (sourceStackName === destinationStackName) {
      sourceTemplate.Resources[destinationLogicalId] = sourceTemplate.Resources[sourceLogicalId];
      delete sourceTemplate.Resources[sourceLogicalId];

      stacksToSend.add({
        StackName: sourceStackName,
        TemplateBody: JSON.stringify(sourceTemplate),
      });
    } else {
      let destinationTemplate: any;
      if (oldTemplates[destinationStackName]) {
        // Destination stack already exists.
        // Move resource from source to destination.
        destinationTemplate = oldTemplates[destinationStackName];
        destinationTemplate.Resources[destinationLogicalId] = sourceTemplate.Resources[sourceLogicalId];
        delete sourceTemplate.Resources[sourceLogicalId];
      } else {
        // Destination stack doesn't exist yet.
        // Don't touch anything, just make sure the template will be sent to the API
        destinationTemplate = newTemplates[destinationStackName];
      }

      stacksToSend.add({
        StackName: sourceStackName,
        TemplateBody: JSON.stringify(sourceTemplate),
      });

      stacksToSend.add({
        StackName: destinationStackName,
        TemplateBody: JSON.stringify(destinationTemplate),
      });
    }
  });

  return Array.from(stacksToSend);

  function byName(stacks: StackFoo[]) {
    return Object.fromEntries(
      stacks.map(s =>
        ([s.stackName, JSON.parse(JSON.stringify(s.template))]),
      ),
    );
  }
}
