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
  private _assumeRoleStatement: iam.PolicyStatement | undefined;

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

  /**
   * Make sure the Role has sts:AssumeRole permissions to the given ARN
   *
   * Will add a new PolicyStatement to the Role if necessary, otherwise add resources to the existing
   * PolicyStatement.
   *
   * Normally this would have been many `grantAssume()` calls (which would get deduplicated by the
   * policy minimization logic), but we have to account for old pipelines that don't have policy
   * minimization enabled.
   */
  public addAssumeRole(roleArn: string) {
    if (!this._assumeRoleStatement) {
      this._assumeRoleStatement = new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
      });

      this.addToPrincipalPolicy(this._assumeRoleStatement);
    }

    // Chunk into multiple statements to facilitate overflowing into overflow policies.
    // Ideally we would do one ARN per statement and have policy minimization do its job, but that would make
    // the situation A LOT worse if minimization is not enabled (which it isn't by default). So find a middle
    // ground in pre-minimization chunking: reduce overhead while still allowing splitting.
    const MAX_ARNS_PER_STATEMENT = 10;

    this._assumeRoleStatement.addResources(roleArn);
    if (this._assumeRoleStatement.resources.length >= MAX_ARNS_PER_STATEMENT) {
      // Next call to this function will create a new statement
      this._assumeRoleStatement = undefined;
    }
  }
}
