import codebuild = require('@aws-cdk/aws-codebuild');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import { singletonEventRole } from './util';

/**
 * Start a CodeBuild build when an AWS CloudWatch events rule is triggered.
 */
export class CodeBuildProject implements events.IRuleTarget {
  constructor(private readonly project: codebuild.IProject) {
  }

  /**
   * Allows using build projects as event rule targets.
   */
  public bind(_rule: events.IRule): events.RuleTargetProps {
    return {
      id: this.project.node.id,
      arn: this.project.projectArn,
      role: singletonEventRole(this.project, [new iam.PolicyStatement()
        .addAction('codebuild:StartBuild')
        .addResource(this.project.projectArn)
      ]),
    };
  }
}
