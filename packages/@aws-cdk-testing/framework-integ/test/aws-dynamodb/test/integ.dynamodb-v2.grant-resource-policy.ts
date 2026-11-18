import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';

/*
 * TableV2.grant() to the account root adds a statement to the table's resource policy.
 * The statement uses '*' as its resource, so the table does not depend on itself.
 */

const app = new App();
const stack = new Stack(app, 'aws-cdk-dynamodb-v2-grant-resource-policy');

const table = new dynamodb.TableV2(stack, 'Table', {
  partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
  removalPolicy: RemovalPolicy.DESTROY,
});
table.grant(new iam.AccountRootPrincipal(), 'dynamodb:GetItem', 'dynamodb:Query');

const integ = new IntegTest(app, 'TableV2GrantResourcePolicyIntegTest', {
  testCases: [stack],
});

integ.assertions.awsApiCall('DynamoDB', 'getResourcePolicy', { ResourceArn: table.tableArn })
  .expect(ExpectedResult.objectLike({
    Policy: Match.serializedJson(Match.objectLike({
      Statement: Match.arrayWith([
        Match.objectLike({ Action: Match.arrayWith(['dynamodb:GetItem', 'dynamodb:Query']) }),
      ]),
    })),
  }));
