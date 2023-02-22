import * as crypto from 'crypto';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Node, IConstruct } from 'constructs';
import { ISynthesisSession } from './types';
import { Stack } from '../stack';
import { Token } from '../token';

/**
 * Shared logic of writing stack artifact to the Cloud Assembly
 *
 * This logic is shared between StackSyntheses.
 *
 * It could have been a protected method on a base class, but it
 * uses `Partial<cxapi.AwsCloudFormationStackProperties>` in the
 * parameters (which is convenient so I can remain typesafe without
 * copy/pasting), and jsii will choke on this type.
 */
export function addStackArtifactToAssembly(
  session: ISynthesisSession,
  stack: Stack,
  stackProps: Partial<cxschema.AwsCloudFormationStackProperties>,
  additionalStackDependencies: string[]) {

  // nested stack tags are applied at the AWS::CloudFormation::Stack resource
  // level and are not needed in the cloud assembly.
  if (stack.tags.hasTags()) {
    stack.node.addMetadata(cxschema.ArtifactMetadataEntryType.STACK_TAGS, stack.tags.renderTags());
  }

  const deps = [
    ...stack.dependencies.map(s => s.artifactId),
    ...additionalStackDependencies,
  ];
  const meta = collectStackMetadata(stack);

  // backwards compatibility since originally artifact ID was always equal to
  // stack name the stackName attribute is optional and if it is not specified
  // the CLI will use the artifact ID as the stack name. we *could have*
  // always put the stack name here but wanted to minimize the risk around
  // changes to the assembly manifest. so this means that as long as stack
  // name and artifact ID are the same, the cloud assembly manifest will not
  // change.
  const stackNameProperty = stack.stackName === stack.artifactId
    ? { }
    : { stackName: stack.stackName };

  const properties: cxschema.AwsCloudFormationStackProperties = {
    templateFile: stack.templateFile,
    terminationProtection: stack.terminationProtection,
    tags: nonEmptyDict(stack.tags.tagValues()),
    validateOnSynth: session.validateOnSynth,
    ...stackProps,
    ...stackNameProperty,
  };

  // add an artifact that represents this stack
  session.assembly.addArtifact(stack.artifactId, {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: stack.environment,
    properties,
    dependencies: deps.length > 0 ? deps : undefined,
    metadata: Object.keys(meta).length > 0 ? meta : undefined,
    displayName: stack.node.path,
  });
}

/**
 * Collect the metadata from a stack
 */
function collectStackMetadata(stack: Stack) {
  const output: { [id: string]: cxschema.MetadataEntry[] } = { };

  visit(stack);

  return output;

  function visit(node: IConstruct) {
    // break off if we reached a node that is not a child of this stack
    const parent = findParentStack(node);
    if (parent !== stack) {
      return;
    }

    if (node.node.metadata.length > 0) {
      // Make the path absolute
      output[Node.PATH_SEP + node.node.path] = node.node.metadata.map(md => stack.resolve(md) as cxschema.MetadataEntry);
    }

    for (const child of node.node.children) {
      visit(child);
    }
  }

  function findParentStack(node: IConstruct): Stack | undefined {
    if (Stack.isStack(node) && node.nestedStackParent === undefined) {
      return node;
    }

    if (!node.node.scope) {
      return undefined;
    }

    return findParentStack(node.node.scope);
  }
}

/**
 * Hash a string
 */
export function contentHash(content: string) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Throw an error message about binding() if we don't have a value for x.
 *
 * This replaces the ! assertions we would need everywhere otherwise.
 */
export function assertBound<A>(x: A | undefined): asserts x is NonNullable<A> {
  if (x === null && x === undefined) {
    throw new Error('You must call bindStack() first');
  }
}

function nonEmptyDict<A>(xs: Record<string, A>) {
  return Object.keys(xs).length > 0 ? xs : undefined;
}

/**
 * A "replace-all" function that doesn't require us escaping a literal string to a regex
 */
function replaceAll(s: string, search: string, replace: string) {
  return s.split(search).join(replace);
}

export class StringSpecializer {
  constructor(private readonly stack: Stack, private readonly qualifier: string) {
  }

  /**
   * Function to replace placeholders in the input string as much as possible
   *
   * We replace:
   * - ${Qualifier}: always
   * - ${AWS::AccountId}, ${AWS::Region}: only if we have the actual values available
   * - ${AWS::Partition}: never, since we never have the actual partition value.
   */
  public specialize(s: string): string {
    s = replaceAll(s, '${Qualifier}', this.qualifier);
    return cxapi.EnvironmentPlaceholders.replace(s, {
      region: resolvedOr(this.stack.region, cxapi.EnvironmentPlaceholders.CURRENT_REGION),
      accountId: resolvedOr(this.stack.account, cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT),
      partition: cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
    });
  }

  /**
   * Specialize only the qualifier
   */
  public qualifierOnly(s: string): string {
    return replaceAll(s, '${Qualifier}', this.qualifier);
  }
}

/**
 * Return the given value if resolved or fall back to a default
 */
export function resolvedOr<A>(x: string, def: A): string | A {
  return Token.isUnresolved(x) ? def : x;
}
