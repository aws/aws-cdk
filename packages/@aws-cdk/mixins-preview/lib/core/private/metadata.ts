import type { IConstruct } from 'constructs';
import { IMixin } from '../mixins';

const MIXIN_METADATA_KEY = 'aws:cdk:analytics:mixin';
const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');
const ALLOWED_FQN_PREFIXES: ReadonlyArray<string> = [
  // SCOPES
  '@aws-cdk/', '@aws-cdk-containers/', '@aws-solutions-konstruk/', '@aws-solutions-constructs/', '@amzn/', '@cdklabs/',
  // PACKAGES
  'aws-rfdk.', 'aws-cdk-lib.', 'cdk8s.',
];

export function addMetadata(construct: IConstruct, mixin: IMixin) {
  const fqn = Object.getPrototypeOf(mixin).constructor[JSII_RUNTIME_SYMBOL]?.fqn;
  if (fqn) {
    if (ALLOWED_FQN_PREFIXES.find(prefix => fqn.startsWith(prefix))) {
      construct.node.addMetadata(MIXIN_METADATA_KEY, { mixin: fqn });
    } else {
      construct.node.addMetadata(MIXIN_METADATA_KEY, { mixin: '*' });
    }
  }
}
