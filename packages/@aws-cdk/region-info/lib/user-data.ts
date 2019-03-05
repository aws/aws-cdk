import fs = require('fs');
import jsonschema = require('jsonschema');
import { IRegionInfo } from './region-info-api';
import builtIns = require('./static.generated');

export interface IUserSuppliedRegionInfo {
  /**
   * The name of the AWS region, such as `us-east-1`.
   */
  readonly name: string;

  /**
   * The partition in which the region is located (e.g: `aws`, `aws-cn`, ...).
   *
   * @default aws
   */
  readonly partition?: string;

  /**
   * The name of the endpoint used for S3 Static Website hosting in the region.
   *
   * @default ''
   */
  readonly s3WebsiteEndpoint?: string;

  /**
   * A map from service name (e.g: `s3`, `sqs`, `application-autoscaling`, ...) to the service principal name for that
   * service in the region (e.g: `codedeploy.<region>.amazonaws.com`).
   *
   * @default {}
   */
  readonly servicePrincipals?: { [service: string]: string };

  /**
   * Whether the `AWS::CDK::Metadata` resource is present in the region or not.
   *
   * @default false
   */
  readonly cdkMetadataResourcePresent?: boolean;
}

// tslint:disable-next-line:no-var-requires
const schema: jsonschema.Schema = require('../schema/region-info.schema.json');

export function loadUserData(fromPath: string): { [name: string]: IRegionInfo } {
  if (!fs.existsSync(fromPath)) {
    return {};
  }
  let userDataArray = JSON.parse(fs.readFileSync(fromPath, { encoding: 'utf8' }));
  if (!Array.isArray(userDataArray)) {
    userDataArray = [userDataArray];
  }
  const validator = new jsonschema.Validator();
  const userData: { [name: string]: IRegionInfo } = {};
  let index = 0;
  for (const datum of userDataArray) {
    const result = validator.validate(datum, schema);
    if (!result.valid) {
      throw new Error(`Invalid region info in ${fromPath} at index ${index}:\n${result}`);
    }
    userData[datum.name] = makeUserData(datum);
    index++;
  }
  return userData;
}

function makeUserData(data: IUserSuppliedRegionInfo): IRegionInfo {
  const builtIn: IRegionInfo = builtIns[data.name] || {
    name: data.name,
    cdkMetadataResourcePresent: false,
    partition: 'aws',
    s3WebsiteEndpoint: '',
    servicePrincipals: {},
  };
  return {
    name:                       data.name,
    partition:                  firstNonNull(data.partition,                  builtIn.partition),
    s3WebsiteEndpoint:          firstNonNull(data.s3WebsiteEndpoint,          builtIn.s3WebsiteEndpoint),
    servicePrincipals:          mergeDefault(data.servicePrincipals,          builtIn.servicePrincipals),
    cdkMetadataResourcePresent: firstNonNull(data.cdkMetadataResourcePresent, builtIn.cdkMetadataResourcePresent),
  };
}

function firstNonNull<T>(...values: Array<T | undefined>): T {
  for (const value of values) {
    if (value != null) {
      return value;
    }
  }
  throw new Error('None of the provided values is non-null!');
}

function mergeDefault<T>(value: { [key: string]: T } | undefined, defaults: { [key: string]: T }) {
  return { ...defaults, ...value };
}
