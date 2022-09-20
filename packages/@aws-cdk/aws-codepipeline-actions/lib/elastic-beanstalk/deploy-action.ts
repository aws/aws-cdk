import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Arn, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';
import { deployArtifactBounds } from '../common';

/**
 * Construction properties of the {@link ElasticBeanstalkDeployAction Elastic Beanstalk deploy CodePipeline Action}.
 */
export interface ElasticBeanstalkDeployActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The source to use as input for deployment.
   */
  readonly input: codepipeline.Artifact;

  /**
   * The name of the AWS Elastic Beanstalk application to deploy.
   */
  readonly applicationName: string;

  /**
   * The name of the AWS Elastic Beanstalk environment to deploy to.
   */
  readonly environmentName: string;
}

/**
 * something here
 */
export class ElasticBeanstalkDeployAction extends Action {
  private readonly applicationName: string;
  private readonly environmentName: string;

  constructor(props: ElasticBeanstalkDeployActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.DEPLOY,
      provider: 'ElasticBeanstalk',
      artifactBounds: deployArtifactBounds(),
      inputs: [props.input],
    });

    this.applicationName = props.applicationName;
    this.environmentName = props.environmentName;
  }

  protected bound(
    scope: Construct,
    _stage: codepipeline.IStage,
    options: codepipeline.ActionBindOptions,
  ): codepipeline.ActionConfig {
    const getArn = (resource: string, resourceName?: string): string => {
      const fullResourceName = resourceName ? `${this.applicationName.toLowerCase()}/${resourceName}` : `${this.applicationName.toLowerCase()}`;
      return Arn.format({
        service: 'elasticbeanstalk',
        resource,
        resourceName: fullResourceName,
      }, Stack.of(scope));
    };

    options.role.addToPrincipalPolicy(new PolicyStatement({
      resources: [getArn('application')],
      actions: [
        'elasticbeanstalk:CreateApplicationVersion',
        'elasticbeanstalk:DescribeEvents',
      ],
    }));

    options.role.addToPrincipalPolicy(new PolicyStatement({
      resources: [getArn('applicationversion', 'code-pipeline-*')],
      actions: [
        'elasticbeanstalk:CreateApplicationVersion',
        'elasticbeanstalk:DescribeApplicationVersions',
        'elasticbeanstalk:DescribeEnvironments',
        'elasticbeanstalk:DescribeEvents',
        'elasticbeanstalk:UpdateEnvironment',
      ],
    }));

    options.role.addToPrincipalPolicy(new PolicyStatement({
      resources: [getArn('configurationtemplate', '*')],
      actions: [
        'elasticbeanstalk:DescribeEvents',
        'elasticbeanstalk:UpdateEnvironment',
      ],
    }));

    options.role.addToPrincipalPolicy(new PolicyStatement({
      resources: [getArn('environment', this.environmentName.toLowerCase())],
      actions: [
        'elasticbeanstalk:DescribeEnvironments',
        'elasticbeanstalk:DescribeEvents',
        'elasticbeanstalk:UpdateEnvironment',
      ],
    }));

    // the Action's Role needs to read from the Bucket to get artifacts
    options.bucket.grantRead(options.role);

    return {
      configuration: {
        ApplicationName: this.applicationName,
        EnvironmentName: this.environmentName,
      },
    };
  }
}