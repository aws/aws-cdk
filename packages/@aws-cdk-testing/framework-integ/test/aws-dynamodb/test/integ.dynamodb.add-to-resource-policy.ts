/**
 * Integration test for DynamoDB Table.addToResourcePolicy() method
 *
 * This test validates the fix for issue #35062: "(aws-dynamodb): `addToResourcePolicy` has no effect"
 *
 * WHAT WE'RE TESTING:
 * - The addToResourcePolicy() method was broken - it had "no effect" when called
 * - Resource policies weren't being added to the CloudFormation template
 * - This created a security gap where developers thought they were securing tables but policies weren't applied
 *
 * TEST VALIDATION:
 * 1. Creates a DynamoDB table without initial resource policy
 * 2. Calls addToResourcePolicy() to add IAM permissions (GetItem, PutItem, Query for account root)
 * 3. Verifies the policy actually gets added to the CloudFormation template with correct structure
 * 4. Ensures resource ARN isn't empty or wildcard (*) for security
 *
 * @see https://github.com/aws/aws-cdk/issues/35062
 */

import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Template } from 'aws-cdk-lib/assertions';

export class TestStack extends Stack {
    public readonly table: dynamodb.Table;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Create a DynamoDB table WITHOUT an initial resource policy
        this.table = new dynamodb.Table(this, 'TestTable', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            removalPolicy: RemovalPolicy.DESTROY,
        });

        // Add resource policy using addToResourcePolicy() method
        // This is the CORE functionality being tested for issue #35062
        this.table.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:Query'],
            principals: [new iam.AccountRootPrincipal()],
            resources: [this.table.policyResourceArn],
        }));

        // VALIDATION: Verify policyResourceArn is a CDK Token (not undefined or empty)
        if (!this.table.policyResourceArn) {
            throw new Error('policyResourceArn should not be undefined or empty');
        }

        // The policyResourceArn should be a CDK Token that will resolve to CloudFormation intrinsic functions
        const policyResourceArnStr = this.table.policyResourceArn.toString();
        if (!policyResourceArnStr.includes('Token')) {
            throw new Error(`policyResourceArn should be a CDK Token, got: ${policyResourceArnStr}`);
        }
    }
}

// Test Setup
const app = new App();
const stack = new TestStack(app, 'add-to-resource-policy-test-stack');

// Integration Test Configuration
new IntegTest(app, 'add-to-resource-policy-integ-test', {
    testCases: [stack],
});

// CRITICAL VALIDATION: Verify the CloudFormation template contains ResourcePolicy
// This validates that addToResourcePolicy() actually adds the policy to the template
const template = Template.fromStack(stack);

// 1. Validate that the DynamoDB table has a ResourcePolicy property with expected structure
template.hasResourceProperties('AWS::DynamoDB::Table', {
    ResourcePolicy: {
        PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: {
                        AWS: {
                            'Fn::Sub': 'arn:aws:iam::${AWS::AccountId}:root',
                        },
                    },
                    Action: [
                        'dynamodb:GetItem',
                        'dynamodb:PutItem',
                        'dynamodb:Query',
                    ],
                    // Note: We don't validate the exact Resource value here since it contains
                    // CloudFormation intrinsic functions that are complex to match exactly
                },
            ],
        },
    },
});

// 2. RESOURCE ARN VALIDATION: Verify the resource ARN is correctly structured
const tableResources = template.findResources('AWS::DynamoDB::Table');
const tableLogicalId = Object.keys(tableResources)[0];
const tableResource = tableResources[tableLogicalId];

// Verify ResourcePolicy exists and has the expected structure
if (!tableResource.Properties?.ResourcePolicy?.PolicyDocument?.Statement?.[0]?.Resource) {
    throw new Error('ResourcePolicy.PolicyDocument.Statement[0].Resource is missing');
}

const resourceValue = tableResource.Properties.ResourcePolicy.PolicyDocument.Statement[0].Resource;

// Validate that the resource uses Fn::Sub with the correct ARN pattern
if (!resourceValue['Fn::Sub']) {
    throw new Error('Resource should use Fn::Sub for CloudFormation intrinsic functions');
}

const [arnTemplate, substitutions] = resourceValue['Fn::Sub'];

// Validate ARN template structure
const expectedArnPattern = 'arn:${AWS::Partition}:dynamodb:${AWS::Region}:${AWS::AccountId}:table/${TableRef}';
if (arnTemplate !== expectedArnPattern) {
    throw new Error(`Resource ARN template should be "${expectedArnPattern}", got "${arnTemplate}"`);
}

// Validate that TableRef substitution points to the correct table
if (!substitutions?.TableRef?.Ref) {
    throw new Error('Resource should have TableRef substitution with Ref to table');
}

if (substitutions.TableRef.Ref !== tableLogicalId) {
    throw new Error(`TableRef should reference table logical ID "${tableLogicalId}", got "${substitutions.TableRef.Ref}"`);
}

// SECURITY VALIDATION: Ensure the resource is not a wildcard
if (arnTemplate.includes('*')) {
    throw new Error('Resource ARN should not contain wildcards - this is a security risk');
}
