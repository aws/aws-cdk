import * as iam from '@aws-cdk/aws-iam';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { ArnFormat, Stack } from '@aws-cdk/core';
import { Construct, IDependable } from 'constructs';

/**
 * Role which will be reused across asset jobs
 *
 * Has some '*' resources to save IAM policy space, and will not
 * actually add policies that look like policies that were already added.
 */
export class AssetSingletonRole extends iam.Role {
  private _rejectDuplicates = false;

  constructor(scope: Construct, id: string, props: iam.RoleProps) {
    super(scope, id, props);

    // Logging permissions
    this.addToPolicy(new iam.PolicyStatement({
      resources: [Stack.of(this).formatArn({
        service: 'logs',
        resource: 'log-group',
        arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        resourceName: '/aws/codebuild/*',
      })],
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
    }));

    // CodeBuild report groups
    this.addToPolicy(new iam.PolicyStatement({
      actions: [
        'codebuild:CreateReportGroup',
        'codebuild:CreateReport',
        'codebuild:UpdateReport',
        'codebuild:BatchPutTestCases',
        'codebuild:BatchPutCodeCoverages',
      ],
      resources: [Stack.of(this).formatArn({
        service: 'codebuild',
        resource: 'report-group',
        resourceName: '*',
      })],
    }));

    // CodeBuild start/stop
    this.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        'codebuild:BatchGetBuilds',
        'codebuild:StartBuild',
        'codebuild:StopBuild',
      ],
    }));

    this._rejectDuplicates = true;
  }

  public addToPrincipalPolicy(statement: PolicyStatement): iam.AddToPrincipalPolicyResult {
    const json = statement.toStatementJson();
    const acts = JSON.stringify(json.Action);

    // These have already been added with wildcard resources on creation
    const alreadyAdded = [
      '["logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents"]',
      '["codebuild:CreateReportGroup","codebuild:CreateReport","codebuild:UpdateReport","codebuild:BatchPutTestCases","codebuild:BatchPutCodeCoverages"]',
      '["codebuild:BatchGetBuilds","codebuild:StartBuild","codebuild:StopBuild"]',
    ];

    if (this._rejectDuplicates && alreadyAdded.includes(acts)) {
      // Pretend we did it
      return { statementAdded: true, policyDependable: new class implements IDependable { } };
    }

    // These are added in duplicate (specifically these come from
    // Project#bindToCodePipeline) -- the original singleton asset role didn't
    // have these, and they're not necessary either, so in order to not cause
    // unnecessary diffs, recognize and drop them there as well.
    if (acts === '["kms:Decrypt","kms:Encrypt","kms:ReEncrypt*","kms:GenerateDataKey*"]') {
      // Pretend we did it
      return { statementAdded: true, policyDependable: new class implements IDependable { } };
    }

    return super.addToPrincipalPolicy(statement);
  }
}
