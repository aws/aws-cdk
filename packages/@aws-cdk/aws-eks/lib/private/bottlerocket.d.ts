import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct } from 'constructs';
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
export declare class BottleRocketImage implements ec2.IMachineImage {
    private readonly kubernetesVersion;
    private readonly amiParameterName;
    /**
     * Constructs a new instance of the BottleRocketImage class.
     */
    constructor(props: BottleRocketImageProps);
    /**
     * Return the correct image
     */
    getImage(scope: Construct): ec2.MachineImageConfig;
}
