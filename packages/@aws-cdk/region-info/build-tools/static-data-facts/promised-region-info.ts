import { IRegionInfo } from '../../lib/region-info-api';
import { AwsServiceNames } from './index';
import { servicePrincipal } from './service-principals';

export class PromisedRegionInfo {
  public readonly partition: Promise<string>;
  public readonly domainSuffix: Promise<string>;
  public readonly s3WebsiteEndpoint: Promise<string>;
  public readonly servicePrincipals: { [service: string]: Promise<string> };
  public readonly cdkMetadataResourcePresent: Promise<boolean>;

  constructor(public readonly name: string) {
    this.partition = Promise.resolve(this.name.startsWith('cn-') ? 'aws-cn' : 'aws');

    this.domainSuffix = this.partition.then(partition => {
      switch (partition) {
        case 'aws':
          return 'amazonaws.com';
        case 'aws-cn':
          return 'amazonaws.com.cn';
        default:
          throw new Error(`Domain unknown for partition ${partition}`);
      }
    });

    this.s3WebsiteEndpoint = s3WebsiteEndpoint(this);

    this.servicePrincipals = {};
    for (const service of AwsServiceNames) {
      this.servicePrincipals[service] = servicePrincipal(service, this);
    }

    this.cdkMetadataResourcePresent = Promise.resolve(AwsCdkMetadataResourceRegions.indexOf(this.name) > -1);
  }

  public async resolve(): Promise<IRegionInfo> {
    return {
      name: this.name,
      partition: await this.partition,
      s3WebsiteEndpoint: await this.s3WebsiteEndpoint,
      servicePrincipals: await resolveValues(this.servicePrincipals),
      cdkMetadataResourcePresent: await this.cdkMetadataResourcePresent,
    };
  }
}

const AwsCdkMetadataResourceRegions = [
  'us-east-2',
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'ap-south-1',
  // 'ap-northeast-3',
  'ap-northeast-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ca-central-1',
  'cn-north-1',
  'cn-northwest-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'sa-east-1',
];

/** The "Old"(er) AWS regions - those use different AWS S3 Website endpoint formats */
const AwsOldRegions = [
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'sa-east-1'
];

async function s3WebsiteEndpoint(region: PromisedRegionInfo): Promise<string> {
  return AwsOldRegions.indexOf(region.name) > -1
    ? `s3-website-${region.name}.${await region.domainSuffix}`
    : `s3-website.${region.name}.${await region.domainSuffix}`;
}

async function resolveValues<T>(map: { [key: string]: Promise<T> }): Promise<{ [key: string]: T }> {
  const result: { [key: string]: T } = {};
  for (const key of Object.keys(map)) {
    result[key] = await map[key];
  }
  return result;
}
