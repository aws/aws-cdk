/* eslint-disable @aws-cdk/no-literal-partition */
export const AWS_CDK_METADATA = new Set([
  // Africa (Cape Town)
  'af-south-1',
  // Asia Pacific (Hong Kong)
  'ap-east-1',
  // Asia Pacific (Tokyo)
  'ap-northeast-1',
  // Asia Pacific (Seoul)
  'ap-northeast-2',
  // Asia Pacific (Osaka)
  // 'ap-northeast-3',
  // Asia Pacific (Mumbai)
  'ap-south-1',
  // Asia Pacific (Hyderabad)
  // 'ap-south-2',
  // Asia Pacific (Singapore)
  'ap-southeast-1',
  // Asia Pacific (Sydney)
  'ap-southeast-2',
  // Canada (Central)
  'ca-central-1',
  // China (Beijing)
  'cn-north-1',
  // China (Ningxia)
  'cn-northwest-1',
  // Europe (Frankfurt)
  'eu-central-1',
  // Europe (Zurich)
  // 'eu-central-2',
  // Europe (Stockholm)
  'eu-north-1',
  // Europe (Milan)
  'eu-south-1',
  // Europe (Spain)
  // 'eu-south-2',
  // Europe (Ireland)
  'eu-west-1',
  // Europe (London)
  'eu-west-2',
  // Europe (Paris)
  'eu-west-3',
  // Middle East (UAE)
  // 'me-central-1',
  // Middle East (Bahrain)
  'me-south-1',
  // South America (Sao Paulo)
  'sa-east-1',
  // US East (N. Virginia)
  'us-east-1',
  // US East (Ohio)
  'us-east-2',
  // AWS GovCloud (US-East)
  // 'us-gov-east-1',
  // AWS GovCloud (US-West)
  // 'us-gov-west-1',
  // AWS ISO (US-East)
  // 'us-iso-east-1',
  // AWS ISO (US-East)
  // 'us-isob-east-1',
  // US West (N. California)
  'us-west-1',
  // US West (Oregon)
  'us-west-2',
]);

/**
 * The hosted zone Id if using an alias record in Route53.
 *
 * @see https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region
 */
export const ROUTE_53_BUCKET_WEBSITE_ZONE_IDS: { [region: string]: string } = {
  // Africa (Cape Town)
  'af-south-1': 'Z11KHD8FBVPUYU',
  // Asia Pacific (Hong Kong)
  'ap-east-1': 'ZNB98KWMFR0R6',
  // Asia Pacific (Tokyo)
  'ap-northeast-1': 'Z2M4EHUR26P7ZW',
  // Asia Pacific (Seoul)
  'ap-northeast-2': 'Z3W03O7B5YMIYP',
  // Asia Pacific (Osaka)
  'ap-northeast-3': 'Z2YQB5RD63NC85',
  // Asia Pacific (Mumbai)
  'ap-south-1': 'Z11RGJOFQNVJUP',
  // Asia Pacific (Hyderabad)
  'ap-south-2': 'Z02976202B4EZMXIPMXF7',
  // Asia Pacific (Singapore)
  'ap-southeast-1': 'Z3O0J2DXBE1FTB',
  // Asia Pacific (Sydney)
  'ap-southeast-2': 'Z1WCIGYICN2BYD',
  // Asia Pacific (Jakarta)
  'ap-southeast-3': 'Z01846753K324LI26A3VV',
  // Asia Pacific (Melbourne)
  // 'ap-southeast-4': 'Z0312387243XT5FE14WFO',
  // Canada (Central)
  'ca-central-1': 'Z1QDHH18159H29',
  // China (Beijing)
  'cn-north-1': 'Z5CN8UMXT92WN',
  // China (Ningxia)
  'cn-northwest-1': 'Z282HJ1KT0DH03',
  // Europe (Frankfurt)
  'eu-central-1': 'Z21DNDUVLTQW6Q',
  // Europe (Zurich)
  'eu-central-2': 'Z030506016YDQGETNASS',
  // Europe (Stockholm)
  'eu-north-1': 'Z3BAZG2TWCNX0D',
  // Europe (Milan)
  'eu-south-1': 'Z3IXVV8C73GIO3',
  // Europe (Spain)
  'eu-south-2': 'Z0081959F7139GRJC19J',
  // Europe (Ireland)
  'eu-west-1': 'Z1BKCTXD74EZPE',
  // Europe (London)
  'eu-west-2': 'Z3GKZC51ZF0DB4',
  // Europe (Paris)
  'eu-west-3': 'Z3R1K369G5AVDG',
  // Middle East (UAE)
  'me-central-1': 'Z06143092I8HRXZRUZROF',
  // Middle East (Bahrain)
  'me-south-1': 'Z1MPMWCPA7YB62',
  // South America (Sao Paulo)
  'sa-east-1': 'Z7KQH4QJS55SO',
  // US East (N. Virginia)
  'us-east-1': 'Z3AQBSTGFYJSTF',
  // US East (Ohio)
  'us-east-2': 'Z2O1EMRO9K5GLX',
  // AWS GovCloud (US-East)
  'us-gov-east-1': 'Z2NIFVYYW2VKV1',
  // AWS GovCloud (US-West)
  'us-gov-west-1': 'Z31GFT0UA1I2HV',
  // US West (N. California)
  'us-west-1': 'Z2F56UZL2M1ACD',
  // US West (Oregon)
  'us-west-2': 'Z3BJ6K6RIION7M',
};

/**
 * The hosted zone Id of the Elastic Beanstalk environment.
 *
 * @see https://docs.aws.amazon.com/general/latest/gr/elasticbeanstalk.html
 */
export const EBS_ENV_ENDPOINT_HOSTED_ZONE_IDS: { [region: string]: string } = {
  // Africa (Cape Town)
  'af-south-1': 'Z1EI3BVKMKK4AM',
  // Asia Pacific (Hong Kong)
  'ap-east-1': 'ZPWYUBWRU171A',
  // Asia Pacific (Tokyo)
  'ap-northeast-1': 'Z1R25G3KIG2GBW',
  // Asia Pacific (Seoul)
  'ap-northeast-2': 'Z3JE5OI70TWKCP',
  // Asia Pacific (Osaka)
  'ap-northeast-3': 'ZNE5GEY1TIAGY',
  // Asia Pacific (Mumbai)
  'ap-south-1': 'Z18NTBI3Y7N9TZ',
  // Asia Pacific (Singapore)
  'ap-southeast-1': 'Z16FZ9L249IFLT',
  // Asia Pacific (Sydney)
  'ap-southeast-2': 'Z2PCDNR3VC2G1N',
  // Asia Pacific (Jakarta)
  'ap-southeast-3': 'Z05913172VM7EAZB40TA8',
  // Canada (Central)
  'ca-central-1': 'ZJFCZL7SSZB5I',
  // Europe (Frankfurt)
  'eu-central-1': 'Z1FRNW7UH4DEZJ',
  // Europe (Stockholm)
  'eu-north-1': 'Z23GO28BZ5AETM',
  // Europe (Milan)
  'eu-south-1': 'Z10VDYYOA2JFKM',
  // Europe (Ireland)
  'eu-west-1': 'Z2NYPWQ7DFZAZH',
  // Europe (London)
  'eu-west-2': 'Z1GKAAAUGATPF1',
  // Europe (Paris)
  'eu-west-3': 'Z5WN6GAYWG5OB',
  // Middle East (Bahrain)
  'me-south-1': 'Z2BBTEKR2I36N2',
  // South America (Sao Paulo)
  'sa-east-1': 'Z10X7K2B4QSOFV',
  // US East (N. Virginia)
  'us-east-1': 'Z117KPS5GTRQ2G',
  // US East (Ohio)
  'us-east-2': 'Z14LCN19Q5QHIC',
  // AWS GovCloud (US-East)
  'us-gov-east-1': 'Z35TSARG0EJ4VU',
  // AWS GovCloud (US-West)
  'us-gov-west-1': 'Z4KAURWC4UUUG',
  // US West (N. California)
  'us-west-1': 'Z1LQECGX5PH1X',
  // US West (Oregon)
  'us-west-2': 'Z38NKT9BP95V3O',
};

enum Partition {
  Default = 'aws',
  Cn = 'aws-cn',
  UsGov = 'aws-us-gov',
  UsIso = 'aws-iso',
  UsIsoB = 'aws-iso-b',
}

interface Region { partition: Partition, domainSuffix: string }

export const PARTITION_MAP: { [region: string]: Region } = {
  'default': { partition: Partition.Default, domainSuffix: 'amazonaws.com' },
  'cn-': { partition: Partition.Cn, domainSuffix: 'amazonaws.com.cn' },
  'us-gov-': { partition: Partition.UsGov, domainSuffix: 'amazonaws.com' },
  'us-iso-': { partition: Partition.UsIso, domainSuffix: 'c2s.ic.gov' },
  'us-isob-': { partition: Partition.UsIsoB, domainSuffix: 'sc2s.sgov.gov' },
};

export const CR_DEFAULT_RUNTIME_MAP: Record<Partition, string> = {
  [Partition.Default]: 'nodejs18.x',
  [Partition.Cn]: 'nodejs18.x',
  [Partition.UsGov]: 'nodejs18.x',
  [Partition.UsIso]: 'nodejs18.x',
  [Partition.UsIsoB]: 'nodejs18.x',
};

// https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html#access-logging-bucket-permissions
// https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/enable-access-logs.html#attach-bucket-policy
// Any not listed regions use the service principal "logdelivery.elasticloadbalancing.amazonaws.com"
export const ELBV2_ACCOUNTS: { [region: string]: string } = {
  // Africa (Cape Town)
  'af-south-1': '098369216593',
  // Asia Pacific (Hong Kong)
  'ap-east-1': '754344448648',
  // Asia Pacific (Tokyo)
  'ap-northeast-1': '582318560864',
  // Asia Pacific (Seoul)
  'ap-northeast-2': '600734575887',
  // Asia Pacific (Osaka)
  'ap-northeast-3': '383597477331',
  // Asia Pacific (Mumbai)
  'ap-south-1': '718504428378',
  // Asia Pacific (Singapore)
  'ap-southeast-1': '114774131450',
  // Asia Pacific (Sydney)
  'ap-southeast-2': '783225319266',
  // Asia Pacific (Jakarta)
  'ap-southeast-3': '589379963580',
  // Canada (Central)
  'ca-central-1': '985666609251',
  // China (Beijing)
  'cn-north-1': '638102146993',
  // China (Ningxia)
  'cn-northwest-1': '037604701340',
  // Europe (Frankfurt)
  'eu-central-1': '054676820928',
  // Europe (Stockholm)
  'eu-north-1': '897822967062',
  // Europe (Milan)
  'eu-south-1': '635631232127',
  // Europe (Ireland)
  'eu-west-1': '156460612806',
  // Europe (London)
  'eu-west-2': '652711504416',
  // Europe (Paris)
  'eu-west-3': '009996457667',
  // Middle East (Bahrain)
  'me-south-1': '076674570225',
  // South America (Sao Paulo)
  'sa-east-1': '507241528517',
  // US East (N. Virginia)
  'us-east-1': '127311923021',
  // US East (Ohio)
  'us-east-2': '033677994240',
  // AWS GovCloud (US-East)
  'us-gov-east-1': '190560391635',
  // AWS GovCloud (US-West)
  'us-gov-west-1': '048591011584',
  // AWS ISO (US-East)
  'us-iso-east-1': '770363063475',
  'us-isob-east-1': '740734521339',
  // AWS ISO (US-West)
  'us-iso-west-1': '121062877647',
  // US West (N. California)
  'us-west-1': '027434742980',
  // US West (Oregon)
  'us-west-2': '797873946194',
};

// https://aws.amazon.com/releasenotes/available-deep-learning-containers-images
export const DLC_REPOSITORY_ACCOUNTS: { [region: string]: string } = {
  // Asia Pacific (Hong Kong)
  'ap-east-1': '871362719292',
  // Asia Pacific (Tokyo)
  'ap-northeast-1': '763104351884',
  // Asia Pacific (Seoul)
  'ap-northeast-2': '763104351884',
  // Asia Pacific (Mumbai)
  'ap-south-1': '763104351884',
  // Asia Pacific (Singapore)
  'ap-southeast-1': '763104351884',
  // Asia Pacific (Sydney)
  'ap-southeast-2': '763104351884',
  // Canada (Central)
  'ca-central-1': '763104351884',
  // China (Beijing)
  'cn-north-1': '727897471807',
  // China (Ningxia)
  'cn-northwest-1': '727897471807',
  // Europe (Frankfurt)
  'eu-central-1': '763104351884',
  // Europe (Stockholm)
  'eu-north-1': '763104351884',
  // Europe (Ireland)
  'eu-west-1': '763104351884',
  // Europe (London)
  'eu-west-2': '763104351884',
  // Europe (Paris)
  'eu-west-3': '763104351884',
  // Middle East (Bahrain)
  'me-south-1': '217643126080',
  // South America (Sao Paulo)
  'sa-east-1': '763104351884',
  // US East (N. Virginia)
  'us-east-1': '763104351884',
  // US East (Ohio)
  'us-east-2': '763104351884',
  // US West (N. California)
  'us-west-1': '763104351884',
  // US West (Oregon)
  'us-west-2': '763104351884',
};

// https://docs.aws.amazon.com/app-mesh/latest/userguide/envoy.html
// https://docs.amazonaws.cn/app-mesh/latest/userguide/envoy.html
export const APPMESH_ECR_ACCOUNTS: { [region: string]: string } = {
  // Africa (Cape Town)
  'af-south-1': '924023996002',
  // Asia Pacific (Hong Kong)
  'ap-east-1': '856666278305',
  // Asia Pacific (Tokyo)
  'ap-northeast-1': '840364872350',
  // Asia Pacific (Seoul)
  'ap-northeast-2': '840364872350',
  // Asia Pacific (Osaka)
  'ap-northeast-3': '840364872350',
  // Asia Pacific (Mumbai)
  'ap-south-1': '840364872350',
  // Asia Pacific (Singapore)
  'ap-southeast-1': '840364872350',
  // Asia Pacific (Sydney)
  'ap-southeast-2': '840364872350',
  // Asia Pacific (Jakarta)
  'ap-southeast-3': '909464085924',
  // Canada (Central)
  'ca-central-1': '840364872350',
  // China (Beijing)
  'cn-north-1': '919366029133',
  // China (Ningxia)
  'cn-northwest-1': '919830735681',
  // Europe (Frankfurt)
  'eu-central-1': '840364872350',
  // Europe (Stockholm)
  'eu-north-1': '840364872350',
  // Europe (Milan)
  'eu-south-1': '422531588944',
  // Europe (Ireland)
  'eu-west-1': '840364872350',
  // Europe (London)
  'eu-west-2': '840364872350',
  // Europe (Paris)
  'eu-west-3': '840364872350',
  // Middle East (Bahrain)
  'me-south-1': '772975370895',
  // South America (Sao Paulo)
  'sa-east-1': '840364872350',
  // US East (N. Virginia)
  'us-east-1': '840364872350',
  // US East (Ohio)
  'us-east-2': '840364872350',
  // US West (N. California)
  'us-west-1': '840364872350',
  // US West (Oregon)
  'us-west-2': '840364872350',
};

// https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
export const CLOUDWATCH_LAMBDA_INSIGHTS_ARNS: { [key: string]: any } = {
  '1.0.229.0': {
    arm64: {
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension-Arm64:2',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension-Arm64:2',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:11',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension-Arm64:4',
      // Asia Pacific (Osaka)
      'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:194566237122:layer:LambdaInsightsExtension-Arm64:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension-Arm64:7',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:5',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension-Arm64:5',
      // Asia Pacific (Jakarta)
      'ap-southeast-3': 'arn:aws:lambda:ap-southeast-3:439286490199:layer:LambdaInsightsExtension-Arm64:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension-Arm64:3',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension-Arm64:5',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension-Arm64:3',
      // Europe (Spain)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension-Arm64:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension-Arm64:5',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:5',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension-Arm64:3',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension-Arm64:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension-Arm64:3',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension-Arm64:5',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension-Arm64:7',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension-Arm64:3',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:5',
    },
    x86_64: {
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:28',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension:28',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:60',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:37',
      // Asia Pacific (Osaka)
      'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:194566237122:layer:LambdaInsightsExtension:19',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:36',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:891564319516:layer:LambdaInsightsExtension:10',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:38',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:38',
      // Asia Pacific (Jakarta)
      'ap-southeast-3': 'arn:aws:lambda:ap-southeast-3:439286490199:layer:LambdaInsightsExtension:14',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:37',
      // China (Beijing)
      'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:488211338238:layer:LambdaInsightsExtension:29',
      // China (Ningxia)
      'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:488211338238:layer:LambdaInsightsExtension:29',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:38',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:033019950311:layer:LambdaInsightsExtension:11',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:35',
      // Europe (Milan)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension:28',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:352183217350:layer:LambdaInsightsExtension:12',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:38',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:38',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:37',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:732604637566:layer:LambdaInsightsExtension:11',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension:28',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:37',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:38',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:38',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:38',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:38',
    },
  },
  '1.0.178.0': {
    x86_64: {
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:25',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension:25',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:50',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:32',
      // Asia Pacific (Osaka)
      'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:194566237122:layer:LambdaInsightsExtension:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:31',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:891564319516:layer:LambdaInsightsExtension:8',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:33',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:33',
      // Asia Pacific (Jakarta)
      'ap-southeast-3': 'arn:aws:lambda:ap-southeast-3:439286490199:layer:LambdaInsightsExtension:11',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:32',
      // China (Beijing)
      'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:488211338238:layer:LambdaInsightsExtension:26',
      // China (Ningxia)
      'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:488211338238:layer:LambdaInsightsExtension:26',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:35',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:033019950311:layer:LambdaInsightsExtension:7',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:30',
      // Europe (Milan)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension:25',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:352183217350:layer:LambdaInsightsExtension:10',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:33',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:33',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:32',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:732604637566:layer:LambdaInsightsExtension:9',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension:25',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:32',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:35',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:33',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:33',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:33',
    },
  },
  '1.0.143.0': {
    x86_64: {
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:13',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension:13',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:32',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:20',
      // Asia Pacific (Osaka)
      'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:194566237122:layer:LambdaInsightsExtension:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:21',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:21',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:21',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:20',
      // China (Beijing)
      'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:488211338238:layer:LambdaInsightsExtension:14',
      // China (Ningxia)
      'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:488211338238:layer:LambdaInsightsExtension:14',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:21',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:20',
      // Europe (Milan)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension:13',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:21',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:21',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:20',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension:13',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:20',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:21',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:21',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:20',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:21',
    },
  },
  '1.0.135.0': {
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Asia Pacific (Mumbai)
    },
    x86_64: {
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:11',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension:11',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:25',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:18',
      // Asia Pacific (Osaka)
      'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:194566237122:layer:LambdaInsightsExtension:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:18',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:18',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:18',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:18',
      // China (Beijing)
      'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:488211338238:layer:LambdaInsightsExtension:11',
      // China (Ningxia)
      'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:488211338238:layer:LambdaInsightsExtension:11',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:18',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:18',
      // Europe (Milan)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension:11',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:18',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:18',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:18',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension:11',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:18',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:18',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:18',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:18',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:18',
    },
  },
  '1.0.119.0': {
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
    },
    x86_64: {
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:9',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension:9',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:23',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:16',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:16',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:16',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:16',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:16',
      // China (Beijing)
      'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:488211338238:layer:LambdaInsightsExtension:9',
      // China (Ningxia)
      'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:488211338238:layer:LambdaInsightsExtension:9',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:16',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:16',
      // Europe (Milan)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension:9',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:16',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:16',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:16',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension:9',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:16',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:16',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:16',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:16',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:16',
    },
  },
  '1.0.98.0': {
    x86_64: {
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:8',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension:8',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:14',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:14',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:14',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:14',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:14',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:14',
      // China (Beijing)
      'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:488211338238:layer:LambdaInsightsExtension:8',
      // China (Ningxia)
      'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:488211338238:layer:LambdaInsightsExtension:8',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:14',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:14',
      // Europe (Milan)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension:8',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:14',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:14',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:14',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension:8',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:14',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:14',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:14',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:14',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:14',
    },
  },
  '1.0.89.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:12',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:12',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:12',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:12',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:12',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:12',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:12',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:12',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:12',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:12',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:12',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:12',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:12',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:12',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:12',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:12',
    },
  },
  '1.0.86.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:11',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:11',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:11',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:11',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:11',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:11',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:11',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:11',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:11',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:11',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:11',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:11',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:11',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:11',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:11',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:11',
    },
  },
  '1.0.54.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:2',
    },
  },
};

// https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html#using-iam-rs-vpc
export const FIREHOSE_CIDR_BLOCKS: { [region: string]: string } = {
  // Africa (Cape Town)
  'af-south-1': '13.244.121.224',
  // Asia Pacific (Hong Kong)
  'ap-east-1': '18.162.221.32',
  // Asia Pacific (Tokyo)
  'ap-northeast-1': '13.113.196.224',
  // Asia Pacific (Seoul)
  'ap-northeast-2': '13.209.1.64',
  // Asia Pacific (Osaka)
  'ap-northeast-3': '13.208.177.192',
  // Asia Pacific (Mumbai)
  'ap-south-1': '13.232.67.32',
  // Asia Pacific (Hyderabad)
  'ap-south-2': '18.60.192.128',
  // Asia Pacific (Singapore)
  'ap-southeast-1': '13.228.64.192',
  // Asia Pacific (Sydney)
  'ap-southeast-2': '13.210.67.224',
  // Asia Pacific (Jakarta)
  'ap-southeast-3': '108.136.221.64',
  // Canada (Central)
  'ca-central-1': '35.183.92.128',
  // China (Beijing)
  'cn-north-1': '52.81.151.32',
  // China (Ningxia)
  'cn-northwest-1': '161.189.23.64',
  // Europe (Frankfurt)
  'eu-central-1': '35.158.127.160',
  // Europe (Zurich)
  'eu-central-2': '16.62.183.32',
  // Europe (Stockholm)
  'eu-north-1': '13.53.63.224',
  // Europe (Milan)
  'eu-south-1': '15.161.135.128',
  // Europe (Spain)
  'eu-south-2': '18.100.71.96',
  // Europe (Ireland)
  'eu-west-1': '52.19.239.192',
  // Europe (London)
  'eu-west-2': '18.130.1.96',
  // Europe (Paris)
  'eu-west-3': '35.180.1.96',
  // Middle East (UAE)
  'me-central-1': '3.28.159.32',
  // Middle East (Bahrain)
  'me-south-1': '15.185.91.0',
  // South America (Sao Paulo)
  'sa-east-1': '18.228.1.128',
  // US East (N. Virginia)
  'us-east-1': '52.70.63.192',
  // US East (Ohio)
  'us-east-2': '13.58.135.96',
  // AWS GovCloud (US-East)
  'us-gov-east-1': '18.253.138.96',
  // AWS GovCloud (US-West)
  'us-gov-west-1': '52.61.204.160',
  // US West (N. California)
  'us-west-1': '13.57.135.192',
  // US West (Oregon)
  'us-west-2': '52.89.255.224',
};

// https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets_lambda.html#retrieving-secrets_lambda_ARNs
export const PARAMS_AND_SECRETS_LAMBDA_LAYER_ARNS: { [version: string]: { [arch: string]: { [region: string]: string } } } = {
  '1.0.103': {
    x86_64: {
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:317013901791:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:768336418462:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:133490724326:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:738900069198:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Asia Pacific (Osaka)
      'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:576959938190:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:176022468876:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:070087711984:layer:AWS-Parameters-and-Secrets-Lambda-Extension:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:044395824272:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:665172237481:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Asia Pacific (Jakarta)
      'ap-southeast-3': 'arn:aws:lambda:ap-southeast-3:490737872127:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:200266452380:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // China (Beijing)
      'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:287114880934:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // China (Ningxia)
      'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:287310001119:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:187925254637:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:772501565639:layer:AWS-Parameters-and-Secrets-Lambda-Extension:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:427196147048:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Europe (Milan)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:325218067255:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:524103009944:layer:AWS-Parameters-and-Secrets-Lambda-Extension:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:015030872274:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:133256977650:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:780235371811:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:858974508948:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:832021897121:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:933737806257:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:590474943231:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // AWS GovCloud (US-East)
      'us-gov-east-1': 'arn:aws-us-gov:lambda:us-gov-east-1:129776340158:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // AWS GovCloud (US-West)
      'us-gov-west-1': 'arn:aws-us-gov:lambda:us-gov-west-1:127562683043:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:997803712105:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4',
    },
    arm64: {
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:317013901791:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:1',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:768336418462:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:1',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:133490724326:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:738900069198:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:176022468876:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:044395824272:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:665172237481:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4',
      // Asia Pacific (Jakarta)
      'ap-southeast-3': 'arn:aws:lambda:ap-southeast-3:490737872127:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:200266452380:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:187925254637:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:427196147048:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:1',
      // Europe (Milan)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:325218067255:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:015030872274:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:133256977650:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:780235371811:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:1',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:832021897121:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:933737806257:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:590474943231:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:997803712105:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4',
    },
  },
};

const ADOT_LAMBDA_LAYER_JAVA_SDK_ARNS: { [version: string]: { [arch: string]: { [region: string]: string } } } = {
  '1.28.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // Israel (Tel Aviv)
      'il-central-1': 'arn:aws:lambda:il-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-28-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // Israel (Tel Aviv)
      'il-central-1': 'arn:aws:lambda:il-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-28-0:1',
    },
  },
  '1.26.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-26-0:2',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-26-0:2',
    },
  },
  '1.24.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-24-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-24-0:1',
    },
  },
  '1.23.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-23-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-23-0:1',
    },
  },
  '1.21.1': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-1:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-1:1',
    },
  },
  '1.21.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
    },
  },
  '1.19.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
    },
  },
};

const ADOT_LAMBDA_LAYER_JAVA_AUTO_INSTRUMENTATION_ARNS: {
  [version: string]: { [arch: string]: { [region: string]: string } };
} = {
  '1.28.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // Israel (Tel Aviv)
      'il-central-1': 'arn:aws:lambda:il-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // Israel (Tel Aviv)
      'il-central-1': 'arn:aws:lambda:il-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-0:1',
    },
  },
  '1.26.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-26-0:2',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-26-0:2',
    },
  },
  '1.24.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-24-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-24-0:1',
    },
  },
  '1.23.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-23-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-23-0:1',
    },
  },
  '1.21.1': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-1:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-1:1',
    },
  },
  '1.21.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
    },
  },
  '1.19.2': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
    },
  },
};

const ADOT_LAMBDA_LAYER_JAVASCRIPT_SDK_ARNS: { [version: string]: { [arch: string]: { [region: string]: string } } } = {
  '1.15.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // Israel (Tel Aviv)
      'il-central-1': 'arn:aws:lambda:il-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-15-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // Israel (Tel Aviv)
      'il-central-1': 'arn:aws:lambda:il-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-15-0:1',
    },
  },
  '1.13.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-13-0:2',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-13-0:2',
    },
  },
  '1.12.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-12-0:1',
    },
  },
  '1.9.1': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-9-1:2',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-9-1:2',
    },
  },
  '1.8.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
    },
  },
  '1.7.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
    },
  },
};

const ADOT_LAMBDA_LAYER_PYTHON_SDK_ARNS: { [version: string]: { [arch: string]: { [region: string]: string } } } = {
  '1.19.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // Israel (Tel Aviv)
      'il-central-1': 'arn:aws:lambda:il-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-19-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // Israel (Tel Aviv)
      'il-central-1': 'arn:aws:lambda:il-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-19-0:1',
    },
  },
  '1.18.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-18-0:2',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-18-0:2',
    },
  },
  '1.17.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-17-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-17-0:1',
    },
  },
  '1.16.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-16-0:2',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-16-0:2',
    },
  },
  '1.15.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
    },
  },
  '1.13.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
    },
  },
};

const ADOT_LAMBDA_LAYER_GENERIC_ARNS: { [version: string]: { [arch: string]: { [region: string]: string } } } = {
  '0.80.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // Israel (Tel Aviv)
      'il-central-1': 'arn:aws:lambda:il-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-80-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // Israel (Tel Aviv)
      'il-central-1': 'arn:aws:lambda:il-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-80-0:1',
    },
  },
  '0.78.2': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-78-2:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-78-2:1',
    },
  },
  '0.74.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-74-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Asia Pacific (Hyderabad)
      'ap-south-2': 'arn:aws:lambda:ap-south-2:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Europe (Zurich)
      'eu-central-2': 'arn:aws:lambda:eu-central-2:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Europe (Spain)
      'eu-south-2': 'arn:aws:lambda:eu-south-2:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // Middle East (UAE)
      'me-central-1': 'arn:aws:lambda:me-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-74-0:1',
    },
  },
  '0.72.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-72-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-72-0:1',
    },
  },
  '0.70.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-70-0:4',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-70-0:4',
    },
  },
  '0.68.0': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
    },
  },
  '0.62.1': {
    x86_64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
    },
    arm64: {
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
    },
  },
};

export const ADOT_LAMBDA_LAYER_ARNS: { [key: string]: any } = {
  JAVA_SDK: ADOT_LAMBDA_LAYER_JAVA_SDK_ARNS,
  JAVA_AUTO_INSTRUMENTATION: ADOT_LAMBDA_LAYER_JAVA_AUTO_INSTRUMENTATION_ARNS,
  JAVASCRIPT_SDK: ADOT_LAMBDA_LAYER_JAVASCRIPT_SDK_ARNS,
  PYTHON_SDK: ADOT_LAMBDA_LAYER_PYTHON_SDK_ARNS,
  GENERIC: ADOT_LAMBDA_LAYER_GENERIC_ARNS,
};
