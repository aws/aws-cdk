import * as crypto from 'crypto';
import { Node, IConstruct } from 'constructs';
import { ISynthesisSession } from './types';
import * as cxschema from '../../../cloud-assembly-schema';
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

  const stackTags = stack.tags.tagValues();

  // nested stack tags are applied at the AWS::CloudFormation::Stack resource
  // level and are not needed in the cloud assembly.
  if (Object.entries(stackTags).length > 0) {
    for (const [k, v] of Object.entries(stackTags)) {
      if (Token.isUnresolved(k) || Token.isUnresolved(v)) {
        throw new Error(`Stack tags may not contain deploy-time values (tag: ${k}=${v}). Apply tags containing deploy-time values to resources only, avoid tagging stacks.`);
      }
    }

    stack.node.addMetadata(
      cxschema.ArtifactMetadataEntryType.STACK_TAGS,
      Object.entries(stackTags).map(([key, value]) => ({ Key: key, Value: value })));
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
    tags: nonEmptyDict(stackTags),
    validateOnSynth: session.validateOnSynth,
    notificationArns: stack._notificationArns,
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
