export const AWS_OLDER_REGIONS = new Set([
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'us-gov-west-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'sa-east-1',
  'eu-west-1',
]);

export const AWS_CDK_METADATA = new Set([
  'us-east-2',
  'us-east-1',
  'us-west-1',
  'us-west-2',
  // 'us-gov-east-1',
  // 'us-gov-west-1',
  // 'us-iso-east-1',
  // 'us-isob-east-1',
  // 'af-south-1',
  'ap-south-1',
  'ap-east-1',
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
  // 'eu-south-1',
  'me-south-1',
  'sa-east-1',
]);

/**
 * The hosted zone Id if using an alias record in Route53.
 *
 * @see https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_website_region_endpoints
 */
export const ROUTE_53_BUCKET_WEBSITE_ZONE_IDS: { [region: string]: string } = {
  'us-east-2': 'Z2O1EMRO9K5GLX',
  'us-east-1': 'Z3AQBSTGFYJSTF',
  'us-west-1': 'Z2F56UZL2M1ACD',
  'us-west-2': 'Z3BJ6K6RIION7M',
  'us-gov-east-1': 'Z2NIFVYYW2VKV1',
  'us-gov-west-1': 'Z31GFT0UA1I2HV',
  'af-south-1': 'Z11KHD8FBVPUYU',
  'ap-east-1': 'ZNB98KWMFR0R6',
  'ap-south-1': 'Z11RGJOFQNVJUP',
  'ap-northeast-3': 'Z2YQB5RD63NC85',
  'ap-northeast-2': 'Z3W03O7B5YMIYP',
  'ap-southeast-1': 'Z3O0J2DXBE1FTB',
  'ap-southeast-2': 'Z1WCIGYICN2BYD',
  'ap-northeast-1': 'Z2M4EHUR26P7ZW',
  'ca-central-1': 'Z1QDHH18159H29',
  'eu-central-1': 'Z21DNDUVLTQW6Q',
  'eu-west-1': 'Z1BKCTXD74EZPE',
  'eu-west-2': 'Z3GKZC51ZF0DB4',
  'eu-west-3': 'Z3R1K369G5AVDG',
  'eu-north-1': 'Z3BAZG2TWCNX0D',
  'eu-south-1': 'Z3IXVV8C73GIO3',
  'sa-east-1': 'Z7KQH4QJS55SO',
  'me-south-1': 'Z1MPMWCPA7YB62',
};

interface Region { partition: string, domainSuffix: string }

export const PARTITION_MAP: { [region: string]: Region } = {
  'default': { partition: 'aws', domainSuffix: 'amazonaws.com' },
  'cn-': { partition: 'aws-cn', domainSuffix: 'amazonaws.com.cn' },
  'us-gov-': { partition: 'aws-us-gov', domainSuffix: 'amazonaws.com' },
  'us-iso-': { partition: 'aws-iso', domainSuffix: 'c2s.ic.gov' },
  'us-isob-': { partition: 'aws-iso-b', domainSuffix: 'sc2s.sgov.gov' },
};

// https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html#access-logging-bucket-permissions
export const ELBV2_ACCOUNTS: { [region: string]: string } = {
  'us-east-1': '127311923021',
  'us-east-2': '033677994240',
  'us-west-1': '027434742980',
  'us-west-2': '797873946194',
  'af-south-1': '098369216593',
  'ca-central-1': '985666609251',
  'eu-central-1': '054676820928',
  'eu-west-1': '156460612806',
  'eu-west-2': '652711504416',
  'eu-west-3': '009996457667',
  'eu-south-1': '635631232127',
  'eu-north-1': '897822967062',
  'ap-east-1': '754344448648',
  'ap-northeast-1': '582318560864',
  'ap-northeast-2': '600734575887',
  'ap-northeast-3': '383597477331',
  'ap-southeast-1': '114774131450',
  'ap-southeast-2': '783225319266',
  'ap-south-1': '718504428378',
  'me-south-1': '076674570225',
  'sa-east-1': '507241528517',
  'us-gov-west-1': '048591011584',
  'us-gov-east-1': '190560391635',
  'cn-north-1': '638102146993',
  'cn-northwest-1': '037604701340',
};

// https://aws.amazon.com/releasenotes/available-deep-learning-containers-images
export const DLC_REPOSITORY_ACCOUNTS: { [region: string]: string } = {
  'us-east-1': '763104351884',
  'us-east-2': '763104351884',
  'us-west-1': '763104351884',
  'us-west-2': '763104351884',
  'ca-central-1': '763104351884',
  'eu-west-1': '763104351884',
  'eu-west-2': '763104351884',
  'eu-west-3': '763104351884',
  'eu-central-1': '763104351884',
  'eu-north-1': '763104351884',
  'sa-east-1': '763104351884',
  'ap-south-1': '763104351884',
  'ap-northeast-1': '763104351884',
  'ap-northeast-2': '763104351884',
  'ap-southeast-1': '763104351884',
  'ap-southeast-2': '763104351884',

  'ap-east-1': '871362719292',
  'me-south-1': '217643126080',

  'cn-north-1': '727897471807',
  'cn-northwest-1': '727897471807',
};

// https://docs.aws.amazon.com/app-mesh/latest/userguide/envoy.html
export const APPMESH_ECR_ACCOUNTS: { [region: string]: string } = {
  'ap-northeast-1': '840364872350',
  'ap-northeast-2': '840364872350',
  'ap-south-1': '840364872350',
  'ap-southeast-1': '840364872350',
  'ap-southeast-2': '840364872350',
  'ca-central-1': '840364872350',
  'eu-central-1': '840364872350',
  'eu-north-1': '840364872350',
  'eu-south-1': '422531588944',
  'eu-west-1': '840364872350',
  'eu-west-2': '840364872350',
  'eu-west-3': '840364872350',
  'sa-east-1': '840364872350',
  'us-east-1': '840364872350',
  'us-east-2': '840364872350',
  'us-west-1': '840364872350',
  'us-west-2': '840364872350',

  'me-south-1': '772975370895',
  'ap-east-1': '856666278305',

};
