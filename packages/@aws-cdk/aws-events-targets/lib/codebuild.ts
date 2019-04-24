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
  public asEventRuleTarget(_ruleArn: string, _ruleId: string): events.EventRuleTargetProps {
    return {
      id: this.project.node.id,
      arn: this.project.projectArn,
      roleArn: this.getCreateRole().roleArn,
    };
  }

  /**
   * Gets or creates an IAM role associated with this CodeBuild project to allow
   * CloudWatch Events to start builds for this project.
   */
  private getCreateRole() {
    const scope = this.project.node.stack;
    const id = `@aws-cdk/aws-events-targets.CodeBuildProject:Role:${this.project.node.uniqueId}`;
    const exists = scope.node.tryFindChild(id) as iam.Role;
    if (exists) {
      return exists;
    }

    const role = new iam.Role(scope, id, {
      assumedBy: new iam.ServicePrincipal('events.amazonaws.com')
    });

    role.addToPolicy(new iam.PolicyStatement()
      .addAction('codebuild:StartBuild')
      .addResource(this.project.projectArn));

    return role;
  }
}
