import type { IConstruct } from 'constructs';
import type { IMixin } from '../mixins';

const MIXIN_METADATA_KEY = 'aws:cdk:analytics:mixin';
const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');
const ALLOWED_FQN_PREFIXES: ReadonlyArray<string> = [
  // SCOPES
  '@aws-cdk/', '@aws-cdk-containers/', '@aws-solutions-konstruk/', '@aws-solutions-constructs/', '@amzn/', '@cdklabs/',
  // PACKAGES
  'aws-rfdk.', 'aws-cdk-lib.', 'cdk8s.',
];

export function addMetadata(construct: IConstruct, mixin: IMixin) {
  let reportedValue = '*';
  const fqn = Object.getPrototypeOf(mixin).constructor[JSII_RUNTIME_SYMBOL]?.fqn;
  if (fqn && ALLOWED_FQN_PREFIXES.find(prefix => fqn.startsWith(prefix))) {
    reportedValue = fqn;
  }
  construct.node.addMetadata(MIXIN_METADATA_KEY, { mixin: reportedValue });
}

export function applyMixin(construct: IConstruct, mixin: IMixin) {
  addMetadata(construct, mixin);
  mixin.applyTo(construct);
}
