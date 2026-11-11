import type { Construct } from 'constructs';
import * as ec2 from '../../../aws-ec2';
import * as ssm from '../../../aws-ssm';
import { Validations } from '../../../core';

/**
 * Properties for BottleRocketImage
 */
export interface BottleRocketImageProps {
  /**
   * The Kubernetes version to use
   */
  readonly kubernetesVersion: string;
}

/**
 * Construct an Bottlerocket image from the latest AMI published in SSM
 */
export class BottleRocketImage implements ec2.IMachineImage {
  private readonly kubernetesVersion: string;

  private readonly amiParameterName: string;

  /**
   * Constructs a new instance of the BottleRocketImage class.
   */
  public constructor(props: BottleRocketImageProps) {
    this.kubernetesVersion = props.kubernetesVersion;

    // set the SSM parameter name
    this.amiParameterName = `/aws/service/bottlerocket/aws-k8s-${this.kubernetesVersion}/x86_64/latest/image_id`;
  }

  /**
   * Return the correct image
   */
  public getImage(scope: Construct): ec2.MachineImageConfig {
    Validations.of(scope).acknowledge({
      id: 'CloudFormation-Validate::W2506',
      reason: 'SSM parameter is typed as String instead of AWS::SSM::Parameter::Value<AWS::EC2::Image::Id> for historical reasons.',
    });
    const ami = ssm.StringParameter.valueForStringParameter(scope, this.amiParameterName);
    return {
      imageId: ami,
      osType: ec2.OperatingSystemType.LINUX,
      userData: ec2.UserData.custom(''),
    };
  }
}
