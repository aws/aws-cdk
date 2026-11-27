import { isLimitedStatement, judgeTemplate, MAX_CONDITION_VALUES, MAX_JUDGING_WORK } from '../src/condition-verdict';
import { expandingValues, largeTemplates } from './expanding-values';

// One template for every Condition below: the resources, parameters, mappings and
// conditions that the Condition values refer to
const template = {
  Conditions: { IsProd: { 'Fn::Equals': [{ Ref: 'AWS::AccountId' }, '111122223333'] } },
  Parameters: {
    AllowedEndpoint: { Type: 'String', AllowedValues: ['vpce-1a2b3c4d', 'vpce-5e6f7a8b'] },
    DefaultEndpoint: { Type: 'String', Default: 'vpce-1a2b3c4d' },
    FreeEndpoint: { Type: 'String' },
    OpenEndpoint: { Type: 'String', AllowedValues: ['vpce-1a2b3c4d', '*'] },
    StoredEndpoint: { Type: 'AWS::SSM::Parameter::Value<String>', AllowedValues: ['/net/vpce'] },
  },
  Mappings: {
    Endpoints: { 'us-east-1': { Endpoint: 'vpce-1a2b3c4d' }, 'us-west-2': { Endpoint: 'vpce-5e6f7a8b' } },
    OpenEndpoints: { 'us-east-1': { Endpoint: 'vpce-1a2b3c4d' }, 'us-west-2': { Endpoint: '*' } },
  },
  Resources: {
    Endpoint: { Type: 'AWS::EC2::VPCEndpoint', Properties: { ServiceName: 'com.amazonaws.us-east-1.s3', VpcId: 'vpc-1a2b3c4d' } },
    Topic: { Type: 'AWS::SNS::Topic', Properties: {} },
  },
};

const endpointRef = { 'aws:SourceVpce': { Ref: 'Endpoint' } };
const committedCondition = { StringEquals: endpointRef };
const ifEndpoint = (other: unknown) => ({ 'Fn::If': ['IsProd', 'vpce-5e6f7a8b', other] });
const findInOpenEndpoints = { 'Fn::FindInMap': ['OpenEndpoints', { Ref: 'AWS::Region' }, 'Endpoint'] };
const selectStar = { 'Fn::Select': ['0', ['*']] };

function allowAnyone(condition?: unknown): Record<string, unknown> {
  return {
    Effect: 'Allow',
    Principal: { AWS: '*' },
    Action: 's3:GetObject',
    Resource: 'arn:aws:s3:::example-bucket/*',
    ...(condition === undefined ? {} : { Condition: condition }),
  };
}

const limiting: Array<[string, unknown]> = [
  ['StringEquals aws:SourceVpce = Ref to a VPC endpoint of the template', committedCondition],
  ...Object.entries({
    'aws:PrincipalOrgID': 'o-a1b2c3d4e5',
    'aws:SourceArn': 'arn:aws:sns:us-east-1:111122223333:topic',
    'aws:SourceVpc': 'vpc-1a2b3c4d',
    'aws:SourceVpce': 'vpce-1a2b3c4d',
    'aws:SourceOwner': '111122223333',
    'aws:SourceAccount': '111122223333',
    'aws:userid': 'AROAEXAMPLEID:session',
    's3:DataAccessPointArn': 'arn:aws:s3:us-east-1:111122223333:accesspoint/example',
    's3:DataAccessPointAccount': '111122223333',
  }).map(([key, value]): [string, unknown] => [`StringEquals ${key} = ${JSON.stringify(value)}`, { StringEquals: { [key]: value } }]),
  ['StringEqualsIgnoreCase aws:SourceVpc = a literal', { StringEqualsIgnoreCase: { 'aws:SourceVpc': 'vpc-1a2b3c4d' } }],
  ['StringLike aws:SourceVpce = a literal', { StringLike: { 'aws:SourceVpce': 'vpce-1a2b3c4d' } }],
  ['ArnEquals aws:SourceArn = a literal', { ArnEquals: { 'aws:SourceArn': 'arn:aws:sns:us-east-1:111122223333:topic' } }],
  ['ArnLike aws:SourceArn = a literal', { ArnLike: { 'aws:SourceArn': 'arn:aws:sns:us-east-1:111122223333:topic' } }],
  ['ForAnyValue:StringEquals aws:SourceVpc = a literal', { 'ForAnyValue:StringEquals': { 'aws:SourceVpc': 'vpc-1a2b3c4d' } }],
  ['StringEquals with the key in upper case', { StringEquals: { 'AWS:SOURCEVPCE': 'vpce-1a2b3c4d' } }],
  ['StringEquals aws:SourceAccount = [a literal, Ref AWS::AccountId]', { StringEquals: { 'aws:SourceAccount': ['111122223333', { Ref: 'AWS::AccountId' }] } }],
  ['ArnEquals aws:SourceArn = Fn::GetAtt of a resource of the template', { ArnEquals: { 'aws:SourceArn': { 'Fn::GetAtt': ['Topic', 'TopicArn'] } } }],
  ['ArnEquals aws:SourceArn = Fn::ImportValue', { ArnEquals: { 'aws:SourceArn': { 'Fn::ImportValue': 'SharedTopicArn' } } }],
  ['ArnEquals aws:SourceArn = Fn::Join of literals and pseudo parameters', {
    ArnEquals: { 'aws:SourceArn': { 'Fn::Join': [':', ['arn', { Ref: 'AWS::Partition' }, 'sns', { Ref: 'AWS::Region' }, { Ref: 'AWS::AccountId' }, 'topic']] } },
  }],
  ['ArnEquals aws:SourceArn = Fn::Sub of pseudo parameters and a resource attribute', {
    ArnEquals: { 'aws:SourceArn': { 'Fn::Sub': 'arn:${AWS::Partition}:sns:${AWS::Region}:${AWS::AccountId}:${Topic.TopicName}' } },
  }],
  ['StringEquals aws:SourceVpce = Fn::If with two literals', { StringEquals: { 'aws:SourceVpce': { 'Fn::If': ['IsProd', 'vpce-1a2b3c4d', 'vpce-5e6f7a8b'] } } }],
  ['StringEquals aws:SourceVpce = Fn::FindInMap over a map whose every entry is fixed', {
    StringEquals: { 'aws:SourceVpce': { 'Fn::FindInMap': ['Endpoints', { Ref: 'AWS::Region' }, 'Endpoint'] } },
  }],
  ['StringEquals aws:SourceVpce = Fn::Select with index "0" over literals', { StringEquals: { 'aws:SourceVpce': { 'Fn::Select': ['0', ['vpce-1a2b3c4d', 'vpce-5e6f7a8b']] } } }],
  ['StringEquals aws:SourceVpce = Fn::Select with index 0 over literals', { StringEquals: { 'aws:SourceVpce': { 'Fn::Select': [0, ['vpce-1a2b3c4d', 'vpce-5e6f7a8b']] } } }],
  ['StringEquals aws:SourceVpce = Ref to a String parameter whose AllowedValues are fixed', { StringEquals: { 'aws:SourceVpce': { Ref: 'AllowedEndpoint' } } }],
  ['the committed Condition beside Bool aws:SecureTransport', { ...committedCondition, Bool: { 'aws:SecureTransport': 'true' } }],
  ['the committed Condition beside StringLike aws:SourceArn = "*"', { ...committedCondition, StringLike: { 'aws:SourceArn': '*' } }],
  ['the committed Condition beside StringLike aws:SourceVpce = "*"', { ...committedCondition, StringLike: { 'aws:SourceVpce': '*' } }],
  ['the committed Condition beside ForAllValues:StringEquals aws:SourceVpc', { ...committedCondition, 'ForAllValues:StringEquals': { 'aws:SourceVpc': 'vpc-1a2b3c4d' } }],
  ['StringEquals aws:PrincipalOrgID = "o-exampleorgid"', { StringEquals: { 'aws:PrincipalOrgID': 'o-exampleorgid' } }],
  ['ArnEquals aws:SourceArn = Fn::Sub with a fixed variable', {
    ArnEquals: { 'aws:SourceArn': { 'Fn::Sub': ['arn:aws:sns:us-east-1:111122223333:${T}', { T: 'topic' }] } },
  }],
];

// Enough two-branch Fn::If parts for their Fn::Join to produce more strings than the bound
const ifParts = (count: number) => Array.from({ length: count }, (_, i) => ({ 'Fn::If': ['IsProd', `a${i}`, `b${i}`] }));
const partsOverBound = Math.floor(Math.log2(MAX_CONDITION_VALUES)) + 1;

const notLimiting: Array<[string, unknown]> = [
  ['no Condition', undefined],
  ['an empty Condition', {}],
  ['StringEqualsIfExists aws:SourceVpce', { StringEqualsIfExists: { 'aws:SourceVpce': 'vpce-1a2b3c4d' } }],
  ['ForAllValues:StringEquals aws:SourceVpc', { 'ForAllValues:StringEquals': { 'aws:SourceVpc': 'vpc-1a2b3c4d' } }],
  ['StringNotEquals aws:SourceVpce', { StringNotEquals: { 'aws:SourceVpce': 'vpce-1a2b3c4d' } }],
  ['ArnNotLike aws:SourceArn', { ArnNotLike: { 'aws:SourceArn': 'arn:aws:sns:us-east-1:111122223333:topic' } }],
  ['StringLike aws:SourceVpc = "vpc-*"', { StringLike: { 'aws:SourceVpc': 'vpc-*' } }],
  ['StringLike aws:SourceVpce = "vpce-1a2b3c4?"', { StringLike: { 'aws:SourceVpce': 'vpce-1a2b3c4?' } }],
  ['StringEquals aws:SourceAccount = a policy variable', { StringEquals: { 'aws:SourceAccount': '${aws:PrincipalAccount}' } }],
  ['StringEquals aws:userid = "anonymous"', { StringEquals: { 'aws:userid': 'anonymous' } }],
  ['StringEqualsIgnoreCase aws:userid = "ANONYMOUS"', { StringEqualsIgnoreCase: { 'aws:userid': 'ANONYMOUS' } }],
  ['StringEquals aws:userid = [a role session, "anonymous"]', { StringEquals: { 'aws:userid': ['AROAEXAMPLEID:session', 'anonymous'] } }],
  ['StringEqualsIgnoreCase aws:userid = "anonymous" written with a long s', { StringEqualsIgnoreCase: { 'aws:userid': 'anonymouſ' } }],
  ['StringEquals aws:userid = Fn::Join of a literal and the stack name', { StringEquals: { 'aws:userid': { 'Fn::Join': ['', ['anonym', { Ref: 'AWS::StackName' }]] } } }],
  ['Null aws:SourceVpce', { Null: { 'aws:SourceVpce': 'false' } }],
  ['Bool aws:SecureTransport alone', { Bool: { 'aws:SecureTransport': 'true' } }],
  ['IpAddress aws:SourceIp', { IpAddress: { 'aws:SourceIp': '10.0.0.0/8' } }],
  ['StringEquals aws:SourceIp', { StringEquals: { 'aws:SourceIp': '10.0.0.1' } }],
  ...['aws:SourceVpcArn', 'aws:PrincipalAccount', 'aws:PrincipalArn'].map((key): [string, unknown] =>
    [`StringEquals ${key}, a key outside the list`, { StringEquals: { [key]: 'arn:aws:iam::111122223333:role/Example' } }]),
  ['an operator name in lower case', { stringequals: { 'aws:SourceVpce': 'vpce-1a2b3c4d' } }],
  ['StringEquals aws:SourceAccount = [a literal, a literal with ?]', { StringEquals: { 'aws:SourceAccount': ['111122223333', '1111?2223333'] } }],
  ...Object.entries({
    'an empty string': '',
    'an empty list': [],
    'a number': 111122223333,
    'a boolean': true,
    'null': null,
    'a list inside the list': [['vpce-1a2b3c4d']],
    'an empty object': {},
  }).map(([title, value]): [string, unknown] => [`StringEquals aws:SourceVpce = ${title}`, { StringEquals: { 'aws:SourceVpce': value } }]),
  ['StringEquals aws:SourceVpce = Fn::If with a "*" branch', { StringEquals: { 'aws:SourceVpce': { 'Fn::If': ['IsProd', 'vpce-1a2b3c4d', '*'] } } }],
  ['StringEquals aws:SourceVpce = Fn::If with an AWS::NoValue branch', { StringEquals: { 'aws:SourceVpce': { 'Fn::If': ['IsProd', 'vpce-1a2b3c4d', { Ref: 'AWS::NoValue' }] } } }],
  ['StringLike aws:SourceVpce = Fn::FindInMap over a map with a "*" entry', { StringLike: { 'aws:SourceVpce': findInOpenEndpoints } }],
  ['StringLike aws:SourceVpce = Fn::FindInMap over a map the template does not define', {
    StringLike: { 'aws:SourceVpce': { 'Fn::FindInMap': ['Missing', { Ref: 'AWS::Region' }, 'Endpoint'] } },
  }],
  ['StringLike aws:SourceVpce = Fn::FindInMap with literal keys that select no entry', {
    StringLike: { 'aws:SourceVpce': { 'Fn::FindInMap': ['Endpoints', 'eu-west-1', 'Endpoint'] } },
  }],
  ['StringLike aws:SourceArn = Fn::Select with index "0" over ["*"]', { StringLike: { 'aws:SourceArn': selectStar } }],
  ['StringLike aws:SourceArn = Fn::Select with index 0 over ["*"]', { StringLike: { 'aws:SourceArn': { 'Fn::Select': [0, ['*']] } } }],
  ['StringLike aws:SourceArn = Fn::Select with a Ref index over ["*"]', { StringLike: { 'aws:SourceArn': { 'Fn::Select': [{ Ref: 'FreeEndpoint' }, ['*']] } } }],
  ['StringLike aws:SourceArn = Fn::Select over Fn::Split of a string with a "*" part', {
    StringLike: { 'aws:SourceArn': { 'Fn::Select': ['0', { 'Fn::Split': [',', 'arn:aws:sns:us-west-2:111122223333:t,*'] }] } },
  }],
  ['StringLike aws:SourceArn = Fn::Select over an empty list', { StringLike: { 'aws:SourceArn': { 'Fn::Select': ['0', []] } } }],
  ['ArnLike aws:SourceArn = Fn::Join with a "*" part', {
    ArnLike: { 'aws:SourceArn': { 'Fn::Join': ['', ['arn:aws:sns:*:', { Ref: 'AWS::AccountId' }, ':t']] } },
  }],
  ['StringEquals aws:SourceAccount = Fn::Join that forms a policy variable', { StringEquals: { 'aws:SourceAccount': { 'Fn::Join': ['', ['$', '{aws:PrincipalAccount}']] } } }],
  ['StringEquals aws:userid = Fn::Sub with an escaped policy variable', { StringEquals: { 'aws:userid': { 'Fn::Sub': '${!aws:userid}' } } }],
  ['StringEquals aws:SourceVpce = Fn::Sub with an unknown variable', { StringEquals: { 'aws:SourceVpce': { 'Fn::Sub': '${Unknown}' } } }],
  ['StringEquals aws:SourceVpce = Ref to a parameter without AllowedValues, with a fixed Default', { StringEquals: { 'aws:SourceVpce': { Ref: 'DefaultEndpoint' } } }],
  ['StringEquals aws:SourceVpce = Ref to a parameter without AllowedValues or Default', { StringEquals: { 'aws:SourceVpce': { Ref: 'FreeEndpoint' } } }],
  ['StringEquals aws:SourceVpce = Ref to a parameter whose AllowedValues hold "*"', { StringEquals: { 'aws:SourceVpce': { Ref: 'OpenEndpoint' } } }],
  ['StringEquals aws:SourceVpce = Ref AWS::NoValue', { StringEquals: { 'aws:SourceVpce': { Ref: 'AWS::NoValue' } } }],
  ['StringEquals aws:SourceVpce = Ref to a name the template does not define', { StringEquals: { 'aws:SourceVpce': { Ref: 'MissingEndpoint' } } }],
  ['StringEquals aws:SourceVpce = Fn::GetAtt of a resource the template does not define', { StringEquals: { 'aws:SourceVpce': { 'Fn::GetAtt': ['MissingEndpoint', 'Id'] } } }],
  ['StringEquals aws:SourceVpce = Fn::Base64', { StringEquals: { 'aws:SourceVpce': { 'Fn::Base64': 'vpce-1a2b3c4d' } } }],
  ['the whole Condition as Fn::If', {
    'Fn::If': ['IsProd', { StringEquals: { 'aws:SourceVpce': 'vpce-1a2b3c4d' } }, { StringEquals: { 'aws:SourceVpce': 'vpce-5e6f7a8b' } }],
  }],
  ['the StringEquals block as Fn::If', {
    StringEquals: { 'Fn::If': ['IsProd', { 'aws:SourceVpce': 'vpce-1a2b3c4d' }, { 'aws:SourceVpce': 'vpce-5e6f7a8b' }] },
  }],
  ['StringEquals aws:SourceVpce = a value that produces more strings than the bound', {
    StringEquals: { 'aws:SourceVpce': { 'Fn::Join': ['', ifParts(partsOverBound)] } },
  }],
  ['ArnLike aws:SourceArn = Fn::Sub with a "*" variable', {
    ArnLike: { 'aws:SourceArn': { 'Fn::Sub': ['arn:aws:sns:us-east-1:111122223333:${T}', { T: '*' }] } },
  }],
  ['ArnLike aws:SourceArn = Fn::Sub with a variable whose Fn::If has a "*" branch', {
    ArnLike: { 'aws:SourceArn': { 'Fn::Sub': ['arn:aws:sns:us-east-1:111122223333:${T}', { T: { 'Fn::If': ['IsProd', 't', '*'] } }] } },
  }],
  ...Object.entries({
    'Fn::If with a "*" branch': ifEndpoint('*'),
    'Fn::FindInMap over a map with a "*" entry': findInOpenEndpoints,
    'Fn::Select over ["*"]': selectStar,
  }).map(([title, second]): [string, unknown] =>
    [`StringLike aws:SourceVpce = [a literal, ${title}]`, { StringLike: { 'aws:SourceVpce': ['vpce-1a2b3c4d', second] } }]),
  ...Object.entries({
    'Fn::FindInMap over a map with a "*" entry': findInOpenEndpoints,
    'Fn::Select over ["*"]': selectStar,
  }).map(([title, part]): [string, unknown] =>
    [`ArnLike aws:SourceArn = Fn::Join with ${title} as a part`, { ArnLike: { 'aws:SourceArn': { 'Fn::Join': ['', ['arn:aws:sns:us-east-1:111122223333:', part]] } } }]),
  ['StringLike aws:SourceVpce = Ref to a Systems Manager parameter type', { StringLike: { 'aws:SourceVpce': { Ref: 'StoredEndpoint' } } }],
  ['StringLike aws:SourceVpce = a dynamic reference', { StringLike: { 'aws:SourceVpce': '{{resolve:ssm:/net/vpce}}' } }],
];

describe('isLimitedStatement', () => {
  test.each(limiting)('an Allow statement for Principal { AWS: "*" } is limited by %s', (_, condition) => {
    expect(isLimitedStatement(allowAnyone(condition), template)).toBe(true);
  });

  test.each(notLimiting)('an Allow statement for Principal { AWS: "*" } is not limited by %s', (_, condition) => {
    expect(isLimitedStatement(allowAnyone(condition), template)).toBe(false);
  });

  test.each<[string, Record<string, unknown>]>([
    ['a Deny statement', { ...allowAnyone(committedCondition), Effect: 'Deny' }],
    ['a statement with Effect "allow"', { ...allowAnyone(committedCondition), Effect: 'allow' }],
    ['a statement without Principal', { Effect: 'Allow', Action: 's3:GetObject', Resource: '*', Condition: committedCondition }],
    ['a statement with Principal and NotPrincipal', { ...allowAnyone(committedCondition), NotPrincipal: { AWS: 'arn:aws:iam::111122223333:role/Example' } }],
    ['a statement with only NotPrincipal', { Effect: 'Allow', NotPrincipal: { AWS: '*' }, Action: 's3:GetObject', Resource: '*', Condition: committedCondition }],
  ])('%s with the committed Condition is not limited', (_, statement) => {
    expect(isLimitedStatement(statement, template)).toBe(false);
  });

  test('judges the Condition whatever the Principal names', () => {
    expect(isLimitedStatement({ ...allowAnyone(committedCondition), Principal: { AWS: [] } }, template)).toBe(true);
  });

  test.each<[string, unknown, boolean]>([
    ['a Fn::Join that produces as many strings as the bound', { 'Fn::Join': ['', ifParts(partsOverBound - 1)] }, true],
    ['Fn::GetAtt in its "LogicalId.Attribute" form', { 'Fn::GetAtt': 'Endpoint.Id' }, true],
    ['Fn::GetAtt in its string form without an attribute', { 'Fn::GetAtt': 'Endpoint' }, false],
    ['Fn::FindInMap with literal keys that select no entry and a fixed DefaultValue', { 'Fn::FindInMap': ['Endpoints', 'eu-west-1', 'Endpoint', { DefaultValue: 'vpce-1a2b3c4d' }] }, true],
    ['Fn::FindInMap with a "*" DefaultValue', { 'Fn::FindInMap': ['Endpoints', 'us-east-1', 'Endpoint', { DefaultValue: '*' }] }, false],
    ['Fn::Select over Fn::Split of a deploy-time value', { 'Fn::Select': ['1', { 'Fn::Split': [':', { 'Fn::GetAtt': ['Topic', 'TopicArn'] }] }] }, true],
    ['Fn::Select over Fn::Split whose delimiter spans two joined literals and leaves an empty part', {
      'Fn::Select': ['0', { 'Fn::Split': [',,', { 'Fn::Join': ['', ['vpce-1a2b3c4d,', ',']] }] }],
    }, false],
    ['Fn::Sub with ${!...} text beside a fixed value', { 'Fn::Sub': 'vpce-${!x}' }, false],
    ['a Fn::Join of literals whose string has 65,536 characters', { 'Fn::Join': ['', ['vpce-', 'v'.repeat(65536 - 5)]] }, true],
    ['a Fn::Join of literals whose string has 65,537 characters', { 'Fn::Join': ['', ['vpce-', 'v'.repeat(65537 - 5)]] }, false],
    ['a literal Fn::Sub that doubles its variable 40 times', expandingValues.doublingSub(40), false],
    // Each deploy-time value counts as the longest a parameter value or custom resource response can be
    ['a Fn::Join of 16 Ref AWS::Region, as long as a fixed string may be', { 'Fn::Join': ['', Array(16).fill({ Ref: 'AWS::Region' })] }, true],
    ['a Fn::Join of 17 Ref AWS::Region, longer than a fixed string may be', { 'Fn::Join': ['', Array(17).fill({ Ref: 'AWS::Region' })] }, false],
    ['a Fn::Sub of "vpce-${AWS::StackId}" repeated 1,000 times', expandingValues.stackIdRepeats(), false],
    ['a Fn::ImportValue doubled 16 times', expandingValues.importValueDoubled(), false],
    ['a Fn::Join of short texts that forms a dynamic reference at its start', { 'Fn::Join': ['', ['{', { 'Fn::Join': ['', ['{', 'resolve:ssm:/x}}']] }]] }, false],
    ['a Fn::Join of short texts that forms a dynamic reference at its end', { 'Fn::Join': ['', [{ 'Fn::Join': ['', ['vpce-1{', '{']] }, 'resolve:ssm:/x}}']] }, false],
    ['Fn::Sub with a parameter whose AllowedValues are fixed', { 'Fn::Sub': '${AllowedEndpoint}' }, true],
    ['Fn::Sub with an unclosed variable', { 'Fn::Sub': 'vpce-${AWS::Region' }, false],
    ['an intrinsic with a second key', { Ref: 'Endpoint', Extra: 'x' }, false],
  ])('StringEquals aws:SourceVpce = %s', (_, value, limited) => {
    expect(isLimitedStatement(allowAnyone({ StringEquals: { 'aws:SourceVpce': value } }), template)).toBe(limited);
  });

  test.each<[string, unknown, boolean]>([
    ['a Fn::Join of literals', { 'Fn::Join': [':', ['AROAEXAMPLEID', 'session']] }, true],
    ['a Fn::Join of short literals that forms "anonymous"', { 'Fn::Join': ['', ['anon', { 'Fn::Join': ['', ['y', 'mous']] }]] }, false],
    ['Ref AWS::AccountId', { Ref: 'AWS::AccountId' }, false],
    ['Fn::GetAtt of a resource of the template', { 'Fn::GetAtt': ['Topic', 'TopicName'] }, false],
    ['Fn::Sub with a pseudo parameter', { 'Fn::Sub': 'AROAEXAMPLEID:${AWS::StackName}' }, false],
  ])('StringEquals aws:userid = %s, which is fixed only as literal text', (_, value, limited) => {
    expect(isLimitedStatement(allowAnyone({ StringEquals: { 'aws:userid': value } }), template)).toBe(limited);
  });
});

describe('isLimitedStatement on large values', () => {
  // Judging stays well within the default test timeout; a cost that grows with the square of the
  // number of parts takes many seconds at these sizes
  const timeLimitMs = 5000;
  const literals = (count: number, prefix: string) => Array.from({ length: count }, (_, i) => `${prefix}${i}`);

  function judgeTimed(value: unknown): { limited: boolean; ms: number } {
    const start = Date.now();
    const limited = isLimitedStatement(allowAnyone({ StringEquals: { 'aws:SourceVpce': value } }), template);
    return { limited, ms: Date.now() - start };
  }

  test('a Fn::Join whose parts can produce far more strings than the bound is not fixed, without building them', () => {
    const select = { 'Fn::Select': ['0', literals(256, 'vpce-')] };

    const { limited, ms } = judgeTimed({ 'Fn::Join': ['', [...literals(3000, 'p'), select, select]] });

    expect(limited).toBe(false);
    expect(ms).toBeLessThan(timeLimitMs);
  });

  test('a Fn::Join of 40,000 literals is judged in time', () => {
    // One character each, so that the joined string stays within the longest a fixed value may be
    const { limited, ms } = judgeTimed({ 'Fn::Join': ['', Array(40000).fill('v')] });

    expect(limited).toBe(true);
    expect(ms).toBeLessThan(timeLimitMs);
  });

  test('a Fn::Sub with 40,000 references to one variable is judged in time', () => {
    const { limited, ms } = judgeTimed({ 'Fn::Sub': ['${T}'.repeat(40000), { T: 'v' }] });

    expect(limited).toBe(true);
    expect(ms).toBeLessThan(timeLimitMs);
  });

  test('a Fn::Sub with 40,000 references to a variable whose value has many parts is judged in time', () => {
    // A one-character value from 1,000 parts, so that the whole string stays within the longest a fixed value may be
    const { limited, ms } = judgeTimed({ 'Fn::Sub': ['${T}'.repeat(40000), { T: { 'Fn::Join': ['', ['v', ...Array(999).fill('')]] } }] });

    expect(limited).toBe(true);
    expect(ms).toBeLessThan(timeLimitMs);
  });

  // Values whose judging would take far more work than the template's size: each is not fixed, in time
  test.each<[string, unknown]>([
    ['Fn::Split over Fn::Sub doubling its variable 26 times', expandingValues.nestedSubUnderSplit()],
    ['Fn::Split over Fn::Sub with 20,000 references to a 6,500-part Fn::Join', expandingValues.repeatedJoinUnderSplit()],
    ['Fn::Join of 100,000 literals after a part with 256 strings', expandingValues.longJoinAfterWidePart()],
  ])('%s is not fixed, in time', (_, value) => {
    const { limited, ms } = judgeTimed(value);

    expect(limited).toBe(false);
    expect(ms).toBeLessThan(timeLimitMs);
  });
});

describe('isLimitedStatement on large templates', () => {
  // Each takes several seconds or more if the template data it reads again and again is not charged
  const timeLimitMs = 5000;

  test.each<[string, () => { template: unknown; condition: unknown }]>([
    ['Refs to a parameter whose AllowedValues hold 125,000 strings and then a number, from 18,000 Condition entries', () => largeTemplates.parameterListRefs(125000, 18000)],
    ['30,000 Refs to a parameter whose value is a 20,000-character literal, after 300 mapping entries of that length', () => largeTemplates.longLiteralRefs(30000, 300, 20000)],
    ['500 Fn::FindInMap lookups over a mapping of 100,000 entries that find nothing', () => largeTemplates.findInMapMisses(500, 100000)],
    ['500 Fn::FindInMap lookups with non-literal keys over a mapping of 100,000 empty entries', () => largeTemplates.emptyEntryLookups(500, 100000)],
    ['Fn::Split over a Fn::Sub with 2,000 references to a 500,000-character literal', () => largeTemplates.splitOfLongLiteral(2000, 500000)],
  ])('%s: not limited, in time', (_, build) => {
    const { template: large, condition } = build();
    const start = Date.now();

    const limited = isLimitedStatement(allowAnyone(condition), large);

    expect(limited).toBe(false);
    expect(Date.now() - start).toBeLessThan(timeLimitMs);
  });

  // Both take milliseconds; reading long literals through the cache, or without charging their length, takes seconds
  test('long literals read many times are judged within a second', () => {
    const start = Date.now();

    const results = [largeTemplates.longLiteralRefs(30000, 1500, 16384), largeTemplates.longLiteralReads(100000, 1000000)]
      .map(({ template: large, condition }) => isLimitedStatement(allowAnyone(condition), large));

    expect(results).toEqual([false, false]);
    expect(Date.now() - start).toBeLessThan(1000);
  });
});

describe('judgeTemplate work budget', () => {
  const limited = allowAnyone(committedCondition);
  const withStatements = (statements: unknown[]) => ({
    Resources: { ...template.Resources, BucketPolicy: { Type: 'AWS::S3::BucketPolicy', Properties: { PolicyDocument: { Statement: statements } } } },
  });
  const wide = { 'Fn::Select': ['0', Array.from({ length: MAX_CONDITION_VALUES }, (_, i) => `vpce-${i}`)] };

  test('a value whose strings would outnumber the bound takes little of the budget, so later statements are still judged', () => {
    // Each of these would take MAX_CONDITION_VALUES² units if the product were built before the bound is checked
    const overBound = Array.from({ length: Math.ceil(MAX_JUDGING_WORK / MAX_CONDITION_VALUES ** 2) + 1 }, () =>
      allowAnyone({ StringEquals: { 'aws:SourceVpce': { 'Fn::Join': ['', [wide, wide]] } } }));

    const verdicts = judgeTemplate(withStatements([...overBound, limited]));

    expect(verdicts.get('BucketPolicy')?.limitedStatements).toEqual(new Set([overBound.length]));
  });

  test('a statement judged after the budget is spent is not limited', () => {
    const expanding = allowAnyone({ StringEquals: { 'aws:SourceVpce': expandingValues.longJoinAfterWidePart() } });

    expect(judgeTemplate(withStatements([limited, expanding, limited]))).toEqual(new Map([
      ['BucketPolicy', { statementIsList: true, limitedStatements: new Set([0]) }],
    ]));
  });

  test('judging stops once the budget is spent, whatever number of statements follows', () => {
    const expanding = allowAnyone({ StringEquals: { 'aws:SourceVpce': expandingValues.longJoinAfterWidePart() } });
    const start = Date.now();

    const verdicts = judgeTemplate(withStatements([expanding, ...Array(3000000).fill(null), limited]));

    expect(verdicts).toEqual(new Map());
    expect(Date.now() - start).toBeLessThan(5000);
  });
});

describe('judgeTemplate', () => {
  const policy = (type: string, statement: unknown) => ({ Type: type, Properties: { PolicyDocument: { Version: '2012-10-17', Statement: statement } } });
  const limited = allowAnyone(committedCondition);
  const notLimited = allowAnyone();

  test('names the limited statements of each policy resource by logical ID and index', () => {
    const verdicts = judgeTemplate({
      Resources: {
        ...template.Resources,
        BucketPolicy: policy('AWS::S3::BucketPolicy', [notLimited, limited, limited]),
        TopicPolicy: policy('AWS::SNS::TopicPolicy', limited),
        QueuePolicy: policy('AWS::SQS::QueuePolicy', [notLimited]),
      },
    });

    expect(verdicts).toEqual(new Map([
      ['BucketPolicy', { statementIsList: true, limitedStatements: new Set([1, 2]) }],
      ['TopicPolicy', { statementIsList: false, limitedStatements: new Set([0]) }],
    ]));
  });

  test.each([
    'AWS::S3::BucketPolicy', 'AWS::SNS::TopicPolicy', 'AWS::SNS::TopicInlinePolicy', 'AWS::SQS::QueuePolicy', 'AWS::SQS::QueueInlinePolicy',
  ])('judges %s', (type) => {
    expect(judgeTemplate({ Resources: { ...template.Resources, Policy: policy(type, [limited]) } }).has('Policy')).toBe(true);
  });

  test('leaves out other resource types and resources without a statement', () => {
    expect(judgeTemplate({
      Resources: {
        ...template.Resources,
        Key: policy('AWS::KMS::Key', [limited]),
        Role: policy('AWS::IAM::Policy', [limited]),
        Empty: { Type: 'AWS::S3::BucketPolicy', Properties: { PolicyDocument: {} } },
        NoProperties: { Type: 'AWS::S3::BucketPolicy' },
      },
    })).toEqual(new Map());
  });

  test('judges no statement of a template with a logical ID that is not alphanumeric', () => {
    expect(judgeTemplate({
      Resources: {
        ...template.Resources,
        BucketPolicy: policy('AWS::S3::BucketPolicy', [limited]),
        'BucketPolicy/Properties/PolicyDocument/Statement/0/Principal': policy('AWS::S3::BucketPolicy', [notLimited]),
      },
    })).toEqual(new Map());
  });

  test.each([null, [], 'template', { Resources: [] }])('judges no statement of %j', (value) => {
    expect(judgeTemplate(value)).toEqual(new Map());
  });
});
