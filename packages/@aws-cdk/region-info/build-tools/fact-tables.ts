export const AWS_CDK_METADATA = new Set([
  'us-east-2',
  'us-east-1',
  'us-west-1',
  'us-west-2',
  // 'us-gov-east-1',
  // 'us-gov-west-1',
  // 'us-iso-east-1',
  // 'us-isob-east-1',
  'af-south-1',
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
  'eu-south-1',
  'me-south-1',
  // 'me-central-1',
  'sa-east-1',
  // 'ap-south-2',
]);

/**
 * The hosted zone Id if using an alias record in Route53.
 *
 * @see https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region
 */
export const ROUTE_53_BUCKET_WEBSITE_ZONE_IDS: { [region: string]: string } = {
  'af-south-1': 'Z11KHD8FBVPUYU',
  'ap-east-1': 'ZNB98KWMFR0R6',
  'ap-northeast-1': 'Z2M4EHUR26P7ZW',
  'ap-northeast-2': 'Z3W03O7B5YMIYP',
  'ap-northeast-3': 'Z2YQB5RD63NC85',
  'ap-south-1': 'Z11RGJOFQNVJUP',
  'ap-south-2': 'Z02976202B4EZMXIPMXF7',
  'ap-southeast-1': 'Z3O0J2DXBE1FTB',
  'ap-southeast-2': 'Z1WCIGYICN2BYD',
  'ap-southeast-3': 'Z01613992JD795ZI93075',
  'ca-central-1': 'Z1QDHH18159H29',
  'cn-northwest-1': 'Z282HJ1KT0DH03',
  'eu-central-1': 'Z21DNDUVLTQW6Q',
  'eu-north-1': 'Z3BAZG2TWCNX0D',
  'eu-south-1': 'Z3IXVV8C73GIO3',
  'eu-west-1': 'Z1BKCTXD74EZPE',
  'eu-west-2': 'Z3GKZC51ZF0DB4',
  'eu-west-3': 'Z3R1K369G5AVDG',
  'me-south-1': 'Z1MPMWCPA7YB62',
  'me-central-1': 'Z06143092I8HRXZRUZROF',
  'sa-east-1': 'Z7KQH4QJS55SO',
  'us-east-1': 'Z3AQBSTGFYJSTF',
  'us-east-2': 'Z2O1EMRO9K5GLX',
  'us-gov-east-1': 'Z2NIFVYYW2VKV1',
  'us-gov-west-1': 'Z31GFT0UA1I2HV',
  'us-west-1': 'Z2F56UZL2M1ACD',
  'us-west-2': 'Z3BJ6K6RIION7M',
};

/**
 * The hosted zone Id of the Elastic Beanstalk environment.
 *
 * @see https://docs.aws.amazon.com/general/latest/gr/elasticbeanstalk.html
 */
export const EBS_ENV_ENDPOINT_HOSTED_ZONE_IDS: { [region: string]: string } = {
  'af-south-1': 'Z1EI3BVKMKK4AM',
  'ap-east-1': 'ZPWYUBWRU171A',
  'ap-northeast-1': 'Z1R25G3KIG2GBW',
  'ap-northeast-2': 'Z3JE5OI70TWKCP',
  'ap-northeast-3': 'ZNE5GEY1TIAGY',
  'ap-south-1': 'Z18NTBI3Y7N9TZ',
  'ap-southeast-1': 'Z16FZ9L249IFLT',
  'ap-southeast-2': 'Z2PCDNR3VC2G1N',
  'ca-central-1': 'ZJFCZL7SSZB5I',
  'eu-central-1': 'Z1FRNW7UH4DEZJ',
  'eu-north-1': 'Z23GO28BZ5AETM',
  'eu-south-1': 'Z10VDYYOA2JFKM',
  'eu-west-1': 'Z2NYPWQ7DFZAZH',
  'eu-west-2': 'Z1GKAAAUGATPF1',
  'eu-west-3': 'Z5WN6GAYWG5OB',
  'me-south-1': 'Z2BBTEKR2I36N2',
  'sa-east-1': 'Z10X7K2B4QSOFV',
  'us-east-1': 'Z117KPS5GTRQ2G',
  'us-east-2': 'Z14LCN19Q5QHIC',
  'us-gov-east-1': 'Z35TSARG0EJ4VU',
  'us-gov-west-1': 'Z4KAURWC4UUUG',
  'us-west-1': 'Z1LQECGX5PH1X',
  'us-west-2': 'Z38NKT9BP95V3O',
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
// https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/enable-access-logs.html#attach-bucket-policy
// Any not listed regions use the service principal "logdelivery.elasticloadbalancing.amazonaws.com"
export const ELBV2_ACCOUNTS: { [region: string]: string } = {
  'af-south-1': '098369216593',
  'ap-east-1': '754344448648',
  'ap-northeast-1': '582318560864',
  'ap-northeast-2': '600734575887',
  'ap-northeast-3': '383597477331',
  'ap-south-1': '718504428378',
  'ap-southeast-1': '114774131450',
  'ap-southeast-2': '783225319266',
  'ap-southeast-3': '589379963580',
  'ca-central-1': '985666609251',
  'cn-north-1': '638102146993',
  'cn-northwest-1': '037604701340',
  'eu-central-1': '054676820928',
  'eu-north-1': '897822967062',
  'eu-south-1': '635631232127',
  'eu-west-1': '156460612806',
  'eu-west-2': '652711504416',
  'eu-west-3': '009996457667',
  'me-south-1': '076674570225',
  'sa-east-1': '507241528517',
  'us-east-1': '127311923021',
  'us-east-2': '033677994240',
  'us-gov-east-1': '190560391635',
  'us-gov-west-1': '048591011584',
  'us-west-1': '027434742980',
  'us-west-2': '797873946194',
  'us-iso-east-1': '770363063475',
  'us-iso-west-1': '121062877647',
  'us-isob-east-1': '740734521339',
};

// https://aws.amazon.com/releasenotes/available-deep-learning-containers-images
export const DLC_REPOSITORY_ACCOUNTS: { [region: string]: string } = {
  'ap-east-1': '871362719292',
  'ap-northeast-1': '763104351884',
  'ap-northeast-2': '763104351884',
  'ap-south-1': '763104351884',
  'ap-southeast-1': '763104351884',
  'ap-southeast-2': '763104351884',
  'ca-central-1': '763104351884',
  'cn-north-1': '727897471807',
  'cn-northwest-1': '727897471807',
  'eu-central-1': '763104351884',
  'eu-north-1': '763104351884',
  'eu-west-1': '763104351884',
  'eu-west-2': '763104351884',
  'eu-west-3': '763104351884',
  'me-south-1': '217643126080',
  'sa-east-1': '763104351884',
  'us-east-1': '763104351884',
  'us-east-2': '763104351884',
  'us-west-1': '763104351884',
  'us-west-2': '763104351884',
};

// https://docs.aws.amazon.com/app-mesh/latest/userguide/envoy.html
// https://docs.amazonaws.cn/app-mesh/latest/userguide/envoy.html
export const APPMESH_ECR_ACCOUNTS: { [region: string]: string } = {
  'af-south-1': '924023996002',
  'ap-east-1': '856666278305',
  'ap-northeast-1': '840364872350',
  'ap-northeast-2': '840364872350',
  'ap-northeast-3': '840364872350',
  'ap-south-1': '840364872350',
  'ap-southeast-1': '840364872350',
  'ap-southeast-2': '840364872350',
  'ap-southeast-3': '909464085924',
  'ca-central-1': '840364872350',
  'cn-north-1': '919366029133',
  'cn-northwest-1': '919830735681',
  'eu-central-1': '840364872350',
  'eu-north-1': '840364872350',
  'eu-south-1': '422531588944',
  'eu-west-1': '840364872350',
  'eu-west-2': '840364872350',
  'eu-west-3': '840364872350',
  'me-south-1': '772975370895',
  'sa-east-1': '840364872350',
  'us-east-1': '840364872350',
  'us-east-2': '840364872350',
  'us-west-1': '840364872350',
  'us-west-2': '840364872350',
};

// https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
export const CLOUDWATCH_LAMBDA_INSIGHTS_ARNS: { [key: string]: any } = {
  '1.0.143.0': {
    x86_64: {
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:21',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:21',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:20',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:21',
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:13',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension:13',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:21',
      // Asia Pacific (Osaka)
      'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:194566237122:layer:LambdaInsightsExtension:2',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:20',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:21',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:21',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:31',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:20',
      // China (Beijing)
      'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:488211338238:layer:LambdaInsightsExtension:14',
      // China (Ningxia)
      'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:488211338238:layer:LambdaInsightsExtension:14',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:21',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:21',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:21',
      // Europe (Milan)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension:13',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:20',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:20',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension:13',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:20',
    },
  },
  '1.0.135.0': {
    arm64: {
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension-Arm64:2',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:2',
    },
    x86_64: {
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:18',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:18',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:18',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:18',
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:11',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension:11',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:18',
      // Asia Pacific (Osaka)
      'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:194566237122:layer:LambdaInsightsExtension:1',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:18',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:18',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:18',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:25',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:18',
      // China (Beijing)
      'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:488211338238:layer:LambdaInsightsExtension:11',
      // China (Ningxia)
      'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:488211338238:layer:LambdaInsightsExtension:11',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:18',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:18',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:18',
      // Europe (Milan)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension:11',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:18',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:18',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension:11',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:18',
    },
  },
  '1.0.119.0': {
    arm64: {
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
    },
    x86_64: {
      // US East (N. Virginia)
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:16',
      // US East (Ohio)
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:16',
      // US West (N. California)
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:16',
      // US West (Oregon)
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:16',
      // Africa (Cape Town)
      'af-south-1': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:9',
      // Asia Pacific (Hong Kong)
      'ap-east-1': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension:9',
      // Asia Pacific (Mumbai)
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:16',
      // Asia Pacific (Seoul)
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:16',
      // Asia Pacific (Singapore)
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:16',
      // Asia Pacific (Sydney)
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:16',
      // Asia Pacific (Tokyo)
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:23',
      // Canada (Central)
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:16',
      // China (Beijing)
      'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:488211338238:layer:LambdaInsightsExtension:9',
      // China (Ningxia)
      'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:488211338238:layer:LambdaInsightsExtension:9',
      // Europe (Frankfurt)
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:16',
      // Europe (Ireland)
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:16',
      // Europe (London)
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:16',
      // Europe (Milan)
      'eu-south-1': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension:9',
      // Europe (Paris)
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:16',
      // Europe (Stockholm)
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:16',
      // Middle East (Bahrain)
      'me-south-1': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension:9',
      // South America (Sao Paulo)
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:16',
    },
  },
  '1.0.98.0': {
    x86_64: {
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:14',
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:14',
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:14',
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:14',
      'af-south-1': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:8',
      'ap-east-1': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension:8',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:14',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:14',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:14',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:14',
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:14',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:14',
      'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:488211338238:layer:LambdaInsightsExtension:8',
      'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:488211338238:layer:LambdaInsightsExtension:8',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:14',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:14',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:14',
      'eu-south-1': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension:8',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:14',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:14',
      'me-south-1': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension:8',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:14',
    },
  },
  '1.0.89.0': {
    x86_64: {
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:12',
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:12',
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:12',
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:12',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:12',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:12',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:12',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:12',
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:12',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:12',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:12',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:12',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:12',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:12',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:12',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:12',
    },
  },
  '1.0.86.0': {
    x86_64: {
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:11',
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:11',
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:11',
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:11',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:11',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:11',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:11',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:11',
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:11',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:11',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:11',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:11',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:11',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:11',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:11',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:11',
    },
  },
  '1.0.54.0': {
    x86_64: {
      'us-east-1': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:2',
      'us-east-2': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:2',
      'us-west-1': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:2',
      'us-west-2': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:2',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:2',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:2',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:2',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:2',
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:2',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:2',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:2',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:2',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:2',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:2',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:2',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:2',
    },
  },
};

// https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html#using-iam-rs-vpc
export const FIREHOSE_CIDR_BLOCKS: { [region: string]: string } = {
  'af-south-1': '13.244.121.224',
  'ap-east-1': '18.162.221.32',
  'ap-northeast-1': '13.113.196.224',
  'ap-northeast-2': '13.209.1.64',
  'ap-northeast-3': '13.208.177.192',
  'ap-south-1': '13.232.67.32',
  'ap-southeast-1': '13.228.64.192',
  'ap-southeast-2': '13.210.67.224',
  'ap-southeast-3': '108.136.221.64',
  'ca-central-1': '35.183.92.128',
  'cn-north-1': '52.81.151.32',
  'cn-northwest-1': '161.189.23.64',
  'eu-central-1': '35.158.127.160',
  'eu-north-1': '13.53.63.224',
  'eu-south-1': '15.161.135.128',
  'eu-west-1': '52.19.239.192',
  'eu-west-2': '18.130.1.96',
  'eu-west-3': '35.180.1.96',
  'me-south-1': '15.185.91.0',
  'sa-east-1': '18.228.1.128',
  'us-east-1': '52.70.63.192',
  'us-east-2': '13.58.135.96',
  'us-gov-east-1': '18.253.138.96',
  'us-gov-west-1': '52.61.204.160',
  'us-west-1': '13.57.135.192',
  'us-west-2': '52.89.255.224',
};

const ADOT_LAMBDA_LAYER_JAVA_SDK_ARNS: { [version: string]: { [arch: string]: { [region: string]: string } } } = {
  '1.21.0': {
    x86_64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-21-0:1',
    },
    arm64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-21-0:1',
    },
  },
  '1.19.0': {
    x86_64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
    },
    arm64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:2',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-19-0:1',
    },
  },
};

const ADOT_LAMBDA_LAYER_JAVA_AUTO_INSTRUMENTATION_ARNS: {
  [version: string]: { [arch: string]: { [region: string]: string } };
} = {
  '1.21.0': {
    x86_64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-21-0:1',
    },
    arm64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-21-0:1',
    },
  },
  '1.19.2': {
    x86_64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-amd64-ver-1-19-2:1',
    },
    arm64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-agent-arm64-ver-1-19-2:1',
    },
  },
};

const ADOT_LAMBDA_LAYER_JAVASCRIPT_SDK_ARNS: { [version: string]: { [arch: string]: { [region: string]: string } } } = {
  '1.8.0': {
    x86_64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-8-0:2',
    },
    arm64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-8-0:2',
    },
  },
  '1.7.0': {
    x86_64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-amd64-ver-1-7-0:2',
    },
    arm64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-nodejs-arm64-ver-1-7-0:2',
    },
  },
};

const ADOT_LAMBDA_LAYER_PYTHON_SDK_ARNS: { [version: string]: { [arch: string]: { [region: string]: string } } } = {
  '1.15.0': {
    x86_64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-15-0:2',
    },
    arm64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-15-0:2',
    },
  },
  '1.13.0': {
    x86_64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-13-0:1',
    },
    arm64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-arm64-ver-1-13-0:1',
    },
  },
};

const ADOT_LAMBDA_LAYER_GENERIC_ARNS: { [version: string]: { [arch: string]: { [region: string]: string } } } = {
  '0.68.0': {
    x86_64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-68-0:1',
    },
    arm64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-68-0:1',
    },
  },
  '0.62.1': {
    x86_64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
      'us-west-2': 'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-62-1:1',
    },
    arm64: {
      'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'ap-south-1': 'arn:aws:lambda:ap-south-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'ca-central-1': 'arn:aws:lambda:ca-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'eu-central-1': 'arn:aws:lambda:eu-central-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'eu-north-1': 'arn:aws:lambda:eu-north-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'eu-west-1': 'arn:aws:lambda:eu-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'eu-west-2': 'arn:aws:lambda:eu-west-2:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'eu-west-3': 'arn:aws:lambda:eu-west-3:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'sa-east-1': 'arn:aws:lambda:sa-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'us-east-1': 'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'us-east-2': 'arn:aws:lambda:us-east-2:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
      'us-west-1': 'arn:aws:lambda:us-west-1:901920570463:layer:aws-otel-collector-arm64-ver-0-62-1:1',
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
