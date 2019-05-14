import codebuild = require('@aws-cdk/aws-codebuild');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');

/**
 * Start a CodeBuild build when an AWS CloudWatch events rule is triggered.
 */
export class CodeBuildProject implements events.IEventRuleTarget {
  constructor(private readonly project: codebuild.IProject) {
  }

  /**
   * Allows using build projects as event rule targets.
   */
  public bind(_rule: events.IEventRule): events.EventRuleTargetProperties {
    return {
      id: this.project.node.id,
      arn: this.project.projectArn,
      policyStatements: [new iam.PolicyStatement()
        .addAction('codebuild:StartBuild')
        .addResource(this.project.projectArn)
      ],
    };
  }
}
