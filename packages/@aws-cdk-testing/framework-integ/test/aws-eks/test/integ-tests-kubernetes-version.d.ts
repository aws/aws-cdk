import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as eks from 'aws-cdk-lib/aws-eks';
export declare function getClusterVersionConfig(scope: Construct): {
    version: eks.KubernetesVersion;
    kubectlLayer: lambda.ILayerVersion;
};
