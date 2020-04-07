// tests for the L1 escape hatches (overrides). those are in the IAM module
// because we want to verify them end-to-end, as a complement to the unit
// tests in the @aws-cdk/core module
import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import * as iam from '../lib';

// tslint:disable:object-literal-key-quotes

describe('IAM escape hatches', () => {
  test('addPropertyOverride should allow overriding supported properties', () => {
    const stack = new Stack();
    const user = new iam.User(stack, 'user', {
      userName: 'MyUserName',
    });

    const cfn = user.node.findChild('Resource') as iam.CfnUser;
    cfn.addPropertyOverride('UserName', 'OverriddenUserName');

    expect(stack).toMatchTemplate({
      'Resources': {
        'user2C2B57AE': {
          'Type': 'AWS::IAM::User',
          'Properties': {
            'UserName': 'OverriddenUserName'
          }
        }
      }
    });
  });

  test('addPropertyOverrides should allow specifying arbitrary properties', () => {
    // GIVEN
    const stack = new Stack();
    const user = new iam.User(stack, 'user', { userName: 'MyUserName' });
    const cfn = user.node.findChild('Resource') as iam.CfnUser;

    // WHEN
    cfn.addPropertyOverride('Hello.World', 'Boom');

    // THEN
    expect(stack).toMatchTemplate({
      'Resources': {
        'user2C2B57AE': {
          'Type': 'AWS::IAM::User',
          'Properties': {
            'UserName': 'MyUserName',
            'Hello': {
              'World': 'Boom'
            }
          }
        }
      }
    });
  });

  test('addOverride should allow overriding properties', () => {
    // GIVEN
    const stack = new Stack();
    const user = new iam.User(stack, 'user', { userName: 'MyUserName' });
    const cfn = user.node.findChild('Resource') as iam.CfnUser;
    cfn.cfnOptions.updatePolicy = { useOnlineResharding: true };

    // WHEN
    cfn.addOverride('Properties.Hello.World', 'Bam');
    cfn.addOverride('Properties.UserName', 'HA!');
    cfn.addOverride('Joob.Jab', 'Jib');
    cfn.addOverride('Joob.Jab', 'Jib');
    cfn.addOverride('UpdatePolicy.UseOnlineResharding.Type', 'None');

    // THEN
    expect(stack).toMatchTemplate({
      'Resources': {
        'user2C2B57AE': {
          'Type': 'AWS::IAM::User',
          'Properties': {
            'UserName': 'HA!',
            'Hello': {
              'World': 'Bam'
            }
          },
          'Joob': {
            'Jab': 'Jib'
          },
          'UpdatePolicy': {
            'UseOnlineResharding': {
              'Type': 'None'
            }
          }
        }
      }
    });
  });
});
