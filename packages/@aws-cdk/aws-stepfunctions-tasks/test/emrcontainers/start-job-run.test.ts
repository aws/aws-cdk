

/* import '@aws-cdk/assert-internal/jest';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { EmrContainersCreateVirtualCluster, ContainerProviderTypes, EksClusterInput } from '../../lib/emrcontainers/create-virtual-cluster';

const emrContainersVirtualClusterName = 'EMR Containers Virtual Cluster';
let stack: Stack;
let virtualClusterId: string;
/**
 * To do for testing
 * 1. Needs to test with(default) and without EksInfo and ContainerInfo, make sure it works without it - FINISHED
 * 2. Needs to test ALL supported integration patterns and throw errors when needed - Finished
 * 3. Need to finish testing for all policy statements - Finished
 */
/*
beforeEach(() => {
  stack = new Stack();
  virtualClusterId = 'PLACEHOLDER';
});
*/