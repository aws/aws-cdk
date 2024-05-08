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
