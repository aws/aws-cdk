import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';
export declare function addDefaultCapacityProvider(cluster: ecs.Cluster, stack: cdk.Stack, vpc: ec2.Vpc, props?: Omit<ecs.AsgCapacityProviderProps, 'autoScalingGroup'>): void;
