import * as path from 'path';
import * as futils from './file-utils';

let cfnTypeToL1Mapping: { [type: string]: string };

/**
 * Returns the fully-qualified name
 * (that is, including the NPM package name)
 * of a class that corresponds to this CloudFormation type,
 * or undefined if the given type was not found.
 *
 * For example, lookup("AWS::S3::Bucket")
 * returns "@aws-cdk/aws-s3.CfnBucket".
 */
export function lookup(cfnType: string): string | undefined {
  if (!cfnTypeToL1Mapping) {
    cfnTypeToL1Mapping = loadCfnTypeToL1Mapping();
  }

  return cfnTypeToL1Mapping[cfnType];
}

function loadCfnTypeToL1Mapping(): any {
  return futils.readJsonSync(path.join(__dirname, '..', 'cfn-types-2-classes.json'));
}
