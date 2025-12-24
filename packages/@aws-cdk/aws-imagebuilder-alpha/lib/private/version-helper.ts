import * as cdk from 'aws-cdk-lib';
import { LATEST_VERSION } from './constants';

interface LatestArnConfig {
  readonly arn: string;
  readonly name: string;
  readonly version: string;
}

interface LatestVersionsConfig {
  readonly latest: LatestArnConfig;
  readonly major: LatestArnConfig;
  readonly minor: LatestArnConfig;
  readonly patch: LatestArnConfig;
}

const constructVersionArn = (arn: string, versionMutation: (version: string) => string): LatestArnConfig => {
  const arnSplit = cdk.Fn.split(':', arn);
  const resourceNameVersion = cdk.Fn.select(5, arnSplit);
  const resourceNameVersionSplit = cdk.Fn.split('/', resourceNameVersion);
  const resourceType = cdk.Fn.select(0, resourceNameVersionSplit);
  const resourceName = cdk.Fn.select(1, resourceNameVersionSplit);
  const resourceVersion = cdk.Fn.select(2, resourceNameVersionSplit);
  const newResourceVersion = versionMutation(resourceVersion);
  const newResourceArn = cdk.Fn.join(':', [
    cdk.Fn.select(0, arnSplit), // arn
    cdk.Fn.select(1, arnSplit), // aws
    cdk.Fn.select(2, arnSplit), // imagebuilder
    cdk.Fn.select(3, arnSplit), // us-east-1
    cdk.Fn.select(4, arnSplit), // 123456789012
    cdk.Fn.join('/', [
      resourceType, // <resource-type>
      resourceName, // <resource-name>
      newResourceVersion, // <resource-version>
    ]),
  ]);

  return { arn: newResourceArn, name: resourceName, version: newResourceVersion };
};

const constructWorkflowVersionArn = (arn: string, versionMutation: (version: string) => string): LatestArnConfig => {
  const arnSplit = cdk.Fn.split(':', arn);
  const workflowTypeNameVersion = cdk.Fn.select(5, arnSplit);
  const workflowTypeNameVersionSplit = cdk.Fn.split('/', workflowTypeNameVersion);
  const resourceType = cdk.Fn.select(0, workflowTypeNameVersionSplit);
  const workflowType = cdk.Fn.select(1, workflowTypeNameVersionSplit);
  const workflowName = cdk.Fn.select(2, workflowTypeNameVersionSplit);
  const workflowVersion = cdk.Fn.select(3, workflowTypeNameVersionSplit);
  const newWorkflowVersion = versionMutation(workflowVersion);
  const newWorkflowArn = cdk.Fn.join(':', [
    cdk.Fn.select(0, arnSplit), // arn
    cdk.Fn.select(1, arnSplit), // aws
    cdk.Fn.select(2, arnSplit), // imagebuilder
    cdk.Fn.select(3, arnSplit), // us-east-1
    cdk.Fn.select(4, arnSplit), // 123456789012
    cdk.Fn.join('/', [
      resourceType, // <resource-type>
      workflowType, // <workflow-type>
      workflowName, // <workflow-name>
      newWorkflowVersion, // <workflow-version>
    ]),
  ]);

  return { arn: newWorkflowArn, name: workflowName, version: newWorkflowVersion };
};

const constructLatestVersionArn = (
  arn: string,
  arnConstructor: (arn: string, versionMutation: (version: string) => string) => LatestArnConfig = constructVersionArn,
): LatestArnConfig => {
  return arnConstructor(arn, (_version) => LATEST_VERSION);
};

const constructLatestMajorVersionArn = (
  arn: string,
  arnConstructor: (arn: string, versionMutation: (version: string) => string) => LatestArnConfig = constructVersionArn,
): LatestArnConfig => {
  return arnConstructor(arn, (version) => {
    const versionSplit = cdk.Fn.split('.', version);
    return cdk.Fn.join('.', [cdk.Fn.select(0, versionSplit), 'x', 'x']);
  });
};

const constructLatestMinorVersionArn = (
  arn: string,
  arnConstructor: (arn: string, versionMutation: (version: string) => string) => LatestArnConfig = constructVersionArn,
): LatestArnConfig => {
  return (arnConstructor ?? constructVersionArn)(arn, (version) => {
    const versionSplit = cdk.Fn.split('.', version);
    return cdk.Fn.join('.', [cdk.Fn.select(0, versionSplit), cdk.Fn.select(1, versionSplit), 'x']);
  });
};

const constructLatestPatchVersionArn = (
  arn: string,
  arnConstructor: (arn: string, versionMutation: (version: string) => string) => LatestArnConfig = constructVersionArn,
): LatestArnConfig => {
  return arnConstructor(arn, (version) => version);
};

export const getLatestResourceVersions = (resourceArn: string): LatestVersionsConfig => {
  return {
    latest: constructLatestVersionArn(resourceArn),
    major: constructLatestMajorVersionArn(resourceArn),
    minor: constructLatestMinorVersionArn(resourceArn),
    patch: constructLatestPatchVersionArn(resourceArn),
  };
};

export const getLatestWorkflowVersions = (workflowArn: string): LatestVersionsConfig => {
  return {
    latest: constructLatestVersionArn(workflowArn, constructWorkflowVersionArn),
    major: constructLatestMajorVersionArn(workflowArn, constructWorkflowVersionArn),
    minor: constructLatestMinorVersionArn(workflowArn, constructWorkflowVersionArn),
    patch: constructLatestPatchVersionArn(workflowArn, constructWorkflowVersionArn),
  };
};
