import { join } from 'path';
import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

describe('grant Permissions', () => {
  test('grant should not throw error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const grantResources = [
      { custom: 'success' },
    ];
    const when = () => {
      api.grant(role, grantResources, 'appsync:graphql');
    };

    // THEN
    expect(when).not.toThrow();
  });

  test('grant provides correct CUSTOM permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const grantResources = [
      { custom: 'types/Mutation/fields/addTest' },
    ];
    api.grant(role, grantResources, 'appsync:graphql');

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/types/Mutation/fields/addTest',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('grant provides correct TYPE (no FIELD) permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const grantResources = [
      { type: 'Mutation' },
    ];
    api.grant(role, grantResources, 'appsync:graphql');

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/types/Mutation/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('grant provides correct TYPE and FIELD permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const grantResources = [
      { type: 'Mutation',
        field: 'addTest',
      },
    ];
    api.grant(role, grantResources, 'appsync:graphql');

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/types/Mutation/fields/addTest',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('grant provides correct NO TYPE permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const grantResources = [
      { },
    ];
    api.grant(role, grantResources, 'appsync:graphql');

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('grant provides correct FIELD but no TYPE permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const grantResources = [
      { field: 'garbage' },
    ];
    api.grant(role, grantResources, 'appsync:graphql');

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });
});

describe('grantMutation Permissions', () => {

  test('grantMutation should not throw error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const when = () => {
      api.grantMutation(role);
    };

    // THEN
    expect(when).not.toThrow();
  });

  test('grantMutation provides correct with NO FIELD permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    api.grantMutation(role);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/types/Mutation/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('grantMutation provides correct FIELD permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    api.grantMutation(role, ['addTest']);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/types/Mutation/fields/addTest',
                ],
              ],
            },
          },
        ],
      },
    });
  });
});

describe('grantQuery Permissions', () => {

  test('grantQuery should not throw error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const when = () => {
      api.grantQuery(role);
    };

    // THEN
    expect(when).not.toThrow();
  });

  test('grantQuery provides correct with NO FIELD permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    api.grantQuery(role);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/types/Query/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('grantQuery provides correct FIELD permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    api.grantQuery(role, ['getTest']);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/types/Query/fields/getTest',
                ],
              ],
            },
          },
        ],
      },
    });
  });
});

describe('grantSubscription Permissions', () => {

  test('grantSubscription should not throw error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const when = () => {
      api.grantSubscription(role);
    };

    // THEN
    expect(when).not.toThrow();
  });

  test('grantSubscription provides correct with NO FIELD permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    api.grantSubscription(role);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/types/Subscription/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('grantSubscription provides correct FIELD permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    api.grantSubscription(role, ['subscribe']);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/types/Subscription/fields/subscribe',
                ],
              ],
            },
          },
        ],
      },
    });
  });
});

describe('grantType Permissions', () => {

  test('grantType should not throw error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const when = () => {
      api.grantType(role, 'custom');
    };

    // THEN
    expect(when).not.toThrow();
  });

  test('grantType provides correct with NO FIELD permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    api.grantType(role, 'customType');

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/types/customType/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('grantType provides correct FIELD permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    api.grantType(role, 'customType', ['attribute']);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/types/customType/fields/attribute',
                ],
              ],
            },
          },
        ],
      },
    });
  });
});

describe('grantFullAccess Permissions', () => {
  test('grantFullAccess should not throw error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    const when = () => {
      api.grantFullAccess(role);
    };

    // THEN
    expect(when).not.toThrow();
  });

  test('grantFullAccess provides correct ', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    // WHEN
    api.grantFullAccess(role);

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'appsync:graphql',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':appsync:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':apis/',
                  {
                    'Fn::GetAtt': [
                      'API62EA1CFF',
                      'ApiId',
                    ],
                  },
                  '/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });
});