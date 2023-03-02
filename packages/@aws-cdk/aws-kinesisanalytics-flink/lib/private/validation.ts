import * as ec2 from '@aws-cdk/aws-ec2';
import * as core from '@aws-cdk/core';

interface ValidatedProps {
  applicationName?: string;
  parallelism?: number;
  parallelismPerKpu?: number;
  vpc?: ec2.IVpc;
  vpcSubnets?: ec2.SubnetSelection;
  securityGroups?: ec2.ISecurityGroup[];
}

/**
 * Early validation for the props used to create FlinkApplications.
 */
export function validateFlinkApplicationProps(props: ValidatedProps) {
  validateApplicationName(props.applicationName);
  validateParallelism(props.parallelism);
  validateParallelismPerKpu(props.parallelismPerKpu);
  validateVpcProps(props);
}

function validateApplicationName(applicationName?: string) {
  if (applicationName === undefined || core.Token.isUnresolved(applicationName)) {
    return;
  }

  if (applicationName.length === 0) {
    throw new Error('applicationName cannot be empty. It must contain at least 1 character.');
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(applicationName)) {
    throw new Error(`applicationName may only contain letters, numbers, underscores, hyphens, and periods. Name: ${applicationName}`);
  }

  if (applicationName.length > 128) {
    throw new Error(`applicationName max length is 128. Name: ${applicationName} is ${applicationName.length} characters.`);
  }
}

function validateParallelism(parallelism?: number) {
  if (parallelism === undefined || core.Token.isUnresolved(parallelism)) {
    return;
  }

  if (parallelism < 1) {
    throw new Error('parallelism must be at least 1');
  }
}

function validateParallelismPerKpu(parallelismPerKpu?: number) {
  if (parallelismPerKpu === undefined || core.Token.isUnresolved(parallelismPerKpu)) {
    return;
  }

  if (parallelismPerKpu < 1) {
    throw new Error('parallelismPerKpu must be at least 1');
  }
}

function validateVpcProps({ vpc, securityGroups = [], vpcSubnets }: ValidatedProps) {
  if (!vpc) {
    if (vpcSubnets) {
      throw new Error('vpc prop required when passing vpcSubnets');
    }

    if (securityGroups.length > 0) {
      throw new Error('vpc prop required when passing securityGroups');
    }
  }
}
