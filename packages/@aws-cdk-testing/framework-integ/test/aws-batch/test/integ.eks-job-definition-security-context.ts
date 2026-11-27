/*
 * Integration test for the Amazon EKS security context settings of AWS Batch job definitions:
 * container Linux capabilities and seccomp profile, and the pod-level security context.
 * Registering a job definition needs no compute environment or EKS cluster.
 */

import { ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as batch from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'batch-eks-job-definition-security-context');

new batch.EksJobDefinition(stack, 'RestrictedJobDefn', {
  container: new batch.EksContainerDefinition(stack, 'RestrictedContainer', {
    image: ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:2023'),
    runAsUser: 1000,
    linuxCapabilitiesToDrop: ['ALL'],
    linuxCapabilitiesToAdd: ['NET_BIND_SERVICE'],
    seccompProfile: batch.EksSeccompProfile.runtimeDefault(),
  }),
  podSecurityContext: {
    fsGroup: 2000,
    runAsUser: 1000,
    runAsGroup: 3000,
    runAsNonRoot: true,
    seccompProfile: batch.EksSeccompProfile.localhost('profiles/audit.json'),
  },
});

new batch.EksJobDefinition(stack, 'UnconfinedJobDefn', {
  container: new batch.EksContainerDefinition(stack, 'UnconfinedContainer', {
    image: ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:2023'),
    seccompProfile: batch.EksSeccompProfile.unconfined(),
  }),
});

new integ.IntegTest(app, 'BatchEksJobDefinitionSecurityContextTest', {
  testCases: [stack],
});
