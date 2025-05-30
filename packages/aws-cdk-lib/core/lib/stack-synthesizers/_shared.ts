import * as crypto from 'crypto';
import { Node, IConstruct } from 'constructs';
import { ISynthesisSession } from './types';
import * as cxschema from '../../../cloud-assembly-schema';
import { UnscopedValidationError } from '../errors';
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
    const resolvedTags = Object.entries(stackTags).filter(([k, v]) => !(Token.isUnresolved(k) || Token.isUnresolved(v)));
    const unresolvedTags = Object.entries(stackTags).filter(([k, v]) => Token.isUnresolved(k) || Token.isUnresolved(v));

    if (unresolvedTags.length > 0) {
      const rendered = unresolvedTags.map(([k, v]) => `${Token.isUnresolved(k) ? '<TOKEN>': k}=${Token.isUnresolved(v) ? '<TOKEN>' : v}`).join(', ');
      stack.node.addMetadata(
        cxschema.ArtifactMetadataEntryType.WARN,
        `Ignoring stack tags that contain deploy-time values (found: ${rendered}). Apply tags containing deploy-time values to resources only, avoid tagging stacks (for example using { excludeResourceTypes: ['aws:cdk:stack'] }).`,
      );
    }

    if (resolvedTags.length > 0) {
      stack.node.addMetadata(
        cxschema.ArtifactMetadataEntryType.STACK_TAGS,
        resolvedTags.map(([key, value]) => ({ Key: key, Value: value })));
    }
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
      output[Node.PATH_SEP + node.node.path] = node.node.metadata.map(md => {
        // If Annotations include a token, the message is resolved and output as `[object Object]` after synth
        // because the message will be object type using 'Ref' or 'Fn::Join'.
        // It would be easier for users to understand if the message from Annotations were output in token form,
        // rather than in `[object Object]` or the object type.
        // Therefore, we don't resolve the message if it's from Annotations.
        if ([
          cxschema.ArtifactMetadataEntryType.ERROR,
          cxschema.ArtifactMetadataEntryType.WARN,
          cxschema.ArtifactMetadataEntryType.INFO,
        ].includes(md.type as cxschema.ArtifactMetadataEntryType)) {
          return md;
        }

        const resolved = stack.resolve(md);
        return resolved as cxschema.MetadataEntry;
      });
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
    throw new UnscopedValidationError('You must call bindStack() first');
  }
}

function nonEmptyDict<A>(xs: Record<string, A>) {
  return Object.keys(xs).length > 0 ? xs : undefined;
}
