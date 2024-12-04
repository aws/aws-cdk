import { Change, DescribeChangeSetOutput } from '@aws-sdk/client-cloudformation';

export function template(resources: {[key: string]: any}) {
  return { Resources: resources };
}

export function resource(type: string, properties: {[key: string]: any}) {
  return { Type: type, Properties: properties };
}

export function role(properties: {[key: string]: any}) {
  return resource('AWS::IAM::Role', properties);
}

export function policy(properties: {[key: string]: any}) {
  return resource('AWS::IAM::Policy', properties);
}

export function poldoc(...statements: any[]) {
  return {
    Version: '2012-10-17',
    Statement: statements,
  };
}

export function largeSsoPermissionSet() {
  return template({
    MySsoPermissionSet: resource(
      'AWS::SSO::PermissionSet',
      {
        CustomerManagedPolicyReferences: [
          {
            Name: 'arn:aws:iam::aws:role/Silly',
            Path: '/my',
          },
          {
            Name: 'LIFE',
          },
        ],
        InlinePolicy: {
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'VisualEditor0',
              Effect: 'Allow',
              Action: 'iam:CreateServiceLinkedRole',
              Resource: [
                '*',
              ],
            },
          ],
        },
        InstanceArn: 'arn:aws:sso:::instance/ssoins-1111111111111111',
        ManagedPolicies: {
          'Fn::If': [
            'SomeCondition',
            ['then-managed-policy-arn'],
            ['else-managed-policy-arn'],
          ],
        },
        Name: 'PleaseWork',
        PermissionsBoundary: {
          CustomerManagedPolicyReference: {
            Name: 'why',
            Path: {
              'Fn::If': [
                'SomeCondition',
                '/how',
                '/work',
              ],
            },
          },
        },
      },
    ),
  });
}
export const ssmParam = {
  Type: 'AWS::SSM::Parameter',
  Properties: {
    Name: 'mySsmParameterFromStack',
    Type: 'String',
    Value: {
      Ref: 'SsmParameterValuetestbugreportC9',
    },
  },
};

export function sqsQueueWithArgs(args: { waitTime: number; queueName?: string }) {
  return {
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName: {
        Ref: args.queueName ?? 'SsmParameterValuetestbugreportC9',
      },
      ReceiveMessageWaitTimeSeconds: args.waitTime,
    },
  };
}

export const ssmParamFromChangeset: Change = {
  Type: 'Resource',
  ResourceChange: {
    Action: 'Modify',
    LogicalResourceId: 'mySsmParameter',
    PhysicalResourceId: 'mySsmParameterFromStack',
    ResourceType: 'AWS::SSM::Parameter',
    Replacement: 'False',
    Scope: [
      'Properties',
    ],
    Details: [
      {
        Target: {
          Attribute: 'Properties',
          Name: 'Value',
          RequiresRecreation: 'Never',
          Path: '/Properties/Value',
          BeforeValue: 'changedddd',
          AfterValue: 'sdflkja',
          AttributeChangeType: 'Modify',
        },
        Evaluation: 'Static',
        ChangeSource: 'DirectModification',
      },
    ],
    BeforeContext: '{"Properties":{"Value":"changedddd","Type":"String","Name":"mySsmParameterFromStack"},"Metadata":{"aws:cdk:path":"cdkbugreport/mySsmParameter/Resource"}}',
    AfterContext: '{"Properties":{"Value":"sdflkja","Type":"String","Name":"mySsmParameterFromStack"},"Metadata":{"aws:cdk:path":"cdkbugreport/mySsmParameter/Resource"}}',
  },
};

export function queueFromChangeset(args: { beforeContextWaitTime?: string; afterContextWaitTime?: string } ): Change {
  return {
    Type: 'Resource',
    ResourceChange: {
      PolicyAction: 'ReplaceAndDelete',
      Action: 'Modify',
      LogicalResourceId: 'Queue',
      PhysicalResourceId: 'https://sqs.us-east-1.amazonaws.com/012345678901/newValuechangedddd',
      ResourceType: 'AWS::SQS::Queue',
      Replacement: 'True',
      Scope: [
        'Properties',
      ],
      Details: [
        {
          Target: {
            Attribute: 'Properties',
            Name: 'ReceiveMessageWaitTimeSeconds',
            RequiresRecreation: 'Never',
            Path: '/Properties/ReceiveMessageWaitTimeSeconds',
            BeforeValue: args.beforeContextWaitTime ?? '20',
            AfterValue: args.afterContextWaitTime ?? '20',
            AttributeChangeType: 'Modify',
          },
          Evaluation: 'Static',
          ChangeSource: 'DirectModification',
        },
        {
          Target: {
            Attribute: 'Properties',
            Name: 'QueueName',
            RequiresRecreation: 'Always',
            Path: '/Properties/QueueName',
            BeforeValue: 'newValuechangedddd',
            AfterValue: 'newValuesdflkja',
            AttributeChangeType: 'Modify',
          },
          Evaluation: 'Static',
          ChangeSource: 'DirectModification',
        },
      ],
      BeforeContext: `{"Properties":{"QueueName":"newValuechangedddd","ReceiveMessageWaitTimeSeconds":"${args.beforeContextWaitTime ?? '20'}"},"Metadata":{"aws:cdk:path":"cdkbugreport/Queue/Resource"},"UpdateReplacePolicy":"Delete","DeletionPolicy":"Delete"}`,
      AfterContext: `{"Properties":{"QueueName":"newValuesdflkja","ReceiveMessageWaitTimeSeconds":"${args.afterContextWaitTime ?? '20'}"},"Metadata":{"aws:cdk:path":"cdkbugreport/Queue/Resource"},"UpdateReplacePolicy":"Delete","DeletionPolicy":"Delete"}`,
    },
  };
}

export const changeSet: DescribeChangeSetOutput = {
  Changes: [
    queueFromChangeset({}),
    ssmParamFromChangeset,
  ],
  ChangeSetName: 'newesteverr2223',
  ChangeSetId: 'arn:aws:cloudformation:us-east-1:012345678901:changeSet/newesteverr2223/3cb73e2d-d1c4-4331-9255-c978e496b6d1',
  StackId: 'arn:aws:cloudformation:us-east-1:012345678901:stack/cdkbugreport/af695110-1570-11ef-a065-0eb1173d997f',
  StackName: 'cdkbugreport',
  Parameters: [
    {
      ParameterKey: 'BootstrapVersion',
      ParameterValue: '/cdk-bootstrap/000000000/version',
      ResolvedValue: '20',
    },
    {
      ParameterKey: 'SsmParameterValuetestbugreportC9',
      ParameterValue: 'testbugreport',
      ResolvedValue: 'sdflkja',
    },
  ],
  ExecutionStatus: 'AVAILABLE',
  Status: 'CREATE_COMPLETE',
};

export const changeSetWithMissingChanges = {
  Changes: [
    {
      Type: undefined,
      ResourceChange: undefined,
    },
  ],
};

const copyOfssmChange = JSON.parse(JSON.stringify(ssmParamFromChangeset));
copyOfssmChange.ResourceChange.ResourceType = undefined;
copyOfssmChange.ResourceChange.Details[0].Evaluation = undefined;
const copyOfQueueChange = JSON.parse(JSON.stringify(queueFromChangeset({})));
copyOfQueueChange.ResourceChange.Details[0].Target = undefined;
copyOfQueueChange.ResourceChange.ResourceType = undefined;
const afterContext = JSON.parse(copyOfQueueChange.ResourceChange?.AfterContext);
afterContext.Properties.QueueName = undefined;
copyOfQueueChange.ResourceChange.AfterContext = afterContext;
const beforeContext = JSON.parse(copyOfQueueChange.ResourceChange?.BeforeContext);
beforeContext.Properties.Random = 'nice';
beforeContext.Properties.QueueName = undefined;
copyOfQueueChange.ResourceChange.BeforeContext = beforeContext;

export const changeSetWithPartiallyFilledChanges: DescribeChangeSetOutput = {
  Changes: [
    copyOfssmChange,
    copyOfQueueChange,
  ],
};

export const changeSetWithUndefinedDetails: DescribeChangeSetOutput = {
  Changes: [
    {
      Type: 'Resource',
      ResourceChange: {
        PolicyAction: 'ReplaceAndDelete',
        Action: 'Modify',
        LogicalResourceId: 'Queue',
        PhysicalResourceId: 'https://sqs.us-east-1.amazonaws.com/012345678901/newValuechangedddd',
        ResourceType: undefined,
        Replacement: 'True',
        Scope: [
          'Properties',
        ],
        Details: undefined,
      },
    },
  ],
};

// this is the output of describechangeset with --include-property-values
export const changeSetWithIamChanges: DescribeChangeSetOutput = {
  Changes: [
    {
      Type: 'Resource',
      ResourceChange: {
        Action: 'Modify',
        LogicalResourceId: 'MyRoleDefaultPolicy',
        PhysicalResourceId: 'cdkbu-MyRol-6q4vdfo8rIJG',
        ResourceType: 'AWS::IAM::Policy',
        Replacement: 'False',
        Scope: [
          'Properties',
        ],
        Details: [
          {
            Target: {
              Attribute: 'Properties',
              Name: 'PolicyDocument',
              RequiresRecreation: 'Never',
              Path: '/Properties/PolicyDocument',
              BeforeValue: '{"Version":"2012-10-17","Statement":[{"Action":["sqs:DeleteMessage","sqs:GetQueueAttributes","sqs:ReceiveMessage","sqs:SendMessage"],"Resource":"arn:aws:sqs:us-east-1:012345678901:sdflkja","Effect":"Allow"}]}',
              AfterValue: '{"Version":"2012-10-17","Statement":[{"Action":["sqs:DeleteMessage","sqs:GetQueueAttributes","sqs:ReceiveMessage","sqs:SendMessage"],"Resource":"arn:aws:sqs:us-east-1:012345678901:newAndDifferent","Effect":"Allow"}]}',
              AttributeChangeType: 'Modify',
            },
            Evaluation: 'Static',
            ChangeSource: 'DirectModification',
          },
          {
            Target: {
              Attribute: 'Properties',
              Name: 'Roles',
              RequiresRecreation: 'Never',
              Path: '/Properties/Roles/0',
              BeforeValue: 'sdflkja',
              AfterValue: '{{changeSet:KNOWN_AFTER_APPLY}}',
              AttributeChangeType: 'Modify',
            },
            Evaluation: 'Dynamic',
            ChangeSource: 'DirectModification',
          },
          {
            Target: {
              Attribute: 'Properties',
              Name: 'Roles',
              RequiresRecreation: 'Never',
              Path: '/Properties/Roles/0',
              BeforeValue: 'sdflkja',
              AfterValue: '{{changeSet:KNOWN_AFTER_APPLY}}',
              AttributeChangeType: 'Modify',
            },
            Evaluation: 'Static',
            ChangeSource: 'ResourceReference',
            CausingEntity: 'MyRole',
          },
        ],
        BeforeContext: '{"Properties":{"PolicyDocument":{"Version":"2012-10-17","Statement":[{"Action":["sqs:DeleteMessage","sqs:GetQueueAttributes","sqs:ReceiveMessage","sqs:SendMessage"],"Resource":"arn:aws:sqs:us-east-1:012345678901:sdflkja","Effect":"Allow"}]},"Roles":["sdflkja"],"PolicyName":"MyRoleDefaultPolicy"},"Metadata":{"aws:cdk:path":"cdkbugreport2/MyRole/DefaultPolicy/Resource"}}',
        AfterContext: '{"Properties":{"PolicyDocument":{"Version":"2012-10-17","Statement":[{"Action":["sqs:DeleteMessage","sqs:GetQueueAttributes","sqs:ReceiveMessage","sqs:SendMessage"],"Resource":"arn:aws:sqs:us-east-1:012345678901:newAndDifferent","Effect":"Allow"}]},"Roles":["{{changeSet:KNOWN_AFTER_APPLY}}"],"PolicyName":"MyRoleDefaultPolicy"},"Metadata":{"aws:cdk:path":"cdkbugreport2/MyRole/DefaultPolicy/Resource"}}',
      },
    },
    {
      Type: 'Resource',
      ResourceChange: {
        PolicyAction: 'ReplaceAndDelete',
        Action: 'Modify',
        LogicalResourceId: 'MyRole',
        PhysicalResourceId: 'sdflkja',
        ResourceType: 'AWS::IAM::Role',
        Replacement: 'True',
        Scope: [
          'Properties',
        ],
        Details: [
          {
            Target: {
              Attribute: 'Properties',
              Name: 'RoleName',
              RequiresRecreation: 'Always',
              Path: '/Properties/RoleName',
              BeforeValue: 'sdflkja',
              AfterValue: 'newAndDifferent',
              AttributeChangeType: 'Modify',
            },
            Evaluation: 'Static',
            ChangeSource: 'DirectModification',
          },
        ],
        BeforeContext: '{"Properties":{"RoleName":"sdflkja","Description":"This is a custom role for my Lambda function","AssumeRolePolicyDocument":{"Version":"2012-10-17","Statement":[{"Action":"sts:AssumeRole","Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"}}]}},"Metadata":{"aws:cdk:path":"cdkbugreport2/MyRole/Resource"}}',
        AfterContext: '{"Properties":{"RoleName":"newAndDifferent","Description":"This is a custom role for my Lambda function","AssumeRolePolicyDocument":{"Version":"2012-10-17","Statement":[{"Action":"sts:AssumeRole","Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"}}]}},"Metadata":{"aws:cdk:path":"cdkbugreport2/MyRole/Resource"}}',
      },
    },
    {
      Type: 'Resource',
      ResourceChange: {
        PolicyAction: 'ReplaceAndDelete',
        Action: 'Modify',
        LogicalResourceId: 'Queue',
        PhysicalResourceId: 'https://sqs.us-east-1.amazonaws.com/012345678901/newValuesdflkja',
        ResourceType: 'AWS::SQS::Queue',
        Replacement: 'True',
        Scope: [
          'Properties',
        ],
        Details: [
          {
            Target: {
              Attribute: 'Properties',
              Name: 'QueueName',
              RequiresRecreation: 'Always',
              Path: '/Properties/QueueName',
              BeforeValue: 'newValuesdflkja',
              AfterValue: 'newValuenewAndDifferent',
              AttributeChangeType: 'Modify',
            },
            Evaluation: 'Static',
            ChangeSource: 'DirectModification',
          },
        ],
        BeforeContext: '{"Properties":{"QueueName":"newValuesdflkja","ReceiveMessageWaitTimeSeconds":"20"},"Metadata":{"aws:cdk:path":"cdkbugreport2/Queue/Resource"},"UpdateReplacePolicy":"Delete","DeletionPolicy":"Delete"}',
        AfterContext: '{"Properties":{"QueueName":"newValuenewAndDifferent","ReceiveMessageWaitTimeSeconds":"20"},"Metadata":{"aws:cdk:path":"cdkbugreport2/Queue/Resource"},"UpdateReplacePolicy":"Delete","DeletionPolicy":"Delete"}',
      },
    },
    {
      Type: 'Resource',
      ResourceChange: {
        Action: 'Modify',
        LogicalResourceId: 'mySsmParameter',
        PhysicalResourceId: 'mySsmParameterFromStack',
        ResourceType: 'AWS::SSM::Parameter',
        Replacement: 'False',
        Scope: [
          'Properties',
        ],
        Details: [
          {
            Target: {
              Attribute: 'Properties',
              Name: 'Value',
              RequiresRecreation: 'Never',
              Path: '/Properties/Value',
              BeforeValue: 'sdflkja',
              AfterValue: 'newAndDifferent',
              AttributeChangeType: 'Modify',
            },
            Evaluation: 'Static',
            ChangeSource: 'DirectModification',
          },
        ],
        BeforeContext: '{"Properties":{"Value":"sdflkja","Type":"String","Name":"mySsmParameterFromStack"},"Metadata":{"aws:cdk:path":"cdkbugreport2/mySsmParameter/Resource"}}',
        AfterContext: '{"Properties":{"Value":"newAndDifferent","Type":"String","Name":"mySsmParameterFromStack"},"Metadata":{"aws:cdk:path":"cdkbugreport2/mySsmParameter/Resource"}}',
      },
    },
  ],
  ChangeSetName: 'newIamStuff',
  ChangeSetId: 'arn:aws:cloudformation:us-east-1:012345678901:changeSet/newIamStuff/b19829fe-20d6-43ba-83b2-d22c42c00d08',
  StackId: 'arn:aws:cloudformation:us-east-1:012345678901:stack/cdkbugreport2/c4cd77c0-15f7-11ef-a7a6-0affeddeb3e1',
  StackName: 'cdkbugreport2',
  Parameters: [
    {
      ParameterKey: 'BootstrapVersion',
      ParameterValue: '/cdk-bootstrap/hnb659fds/version',
      ResolvedValue: '20',
    },
    {
      ParameterKey: 'SsmParameterValuetestbugreportC9',
      ParameterValue: 'testbugreport',
      ResolvedValue: 'newAndDifferent',
    },
  ],
  ExecutionStatus: 'AVAILABLE',
  Status: 'CREATE_COMPLETE',
  NotificationARNs: [],
  RollbackConfiguration: {},
  Capabilities: [
    'CAPABILITY_NAMED_IAM',
  ],
  IncludeNestedStacks: false,
};
