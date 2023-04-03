import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
import * as eks from '../lib';
export declare function getClusterVersionConfig(scope: Construct): {
    version: eks.KubernetesVersion;
    kubectlLayer: lambda.ILayerVersion;
};
