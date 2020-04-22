import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as crypto from 'crypto';
import { ConstructNode, IConstruct, ISynthesisSession } from '../construct-compat';
import { Stack } from '../stack';

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
export function addStackArtifactToCloudAsm(
  session: ISynthesisSession,
  stack: Stack,
  stackProps: Partial<cxapi.AwsCloudFormationStackProperties>,
  additionalStackDependencies: string[]) {

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

  const properties: cxapi.AwsCloudFormationStackProperties = {
    templateFile: stack.templateFile,
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
      output[ConstructNode.PATH_SEP + node.node.path] = node.node.metadata.map(md => stack.resolve(md) as cxschema.MetadataEntry);
    }

    for (const child of node.node.children) {
      visit(child);
    }
  }

  function findParentStack(node: IConstruct): Stack | undefined {
    if (node instanceof Stack && node.nestedStackParent === undefined) {
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