import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
  stack = new cdk.Stack();
});

describe('When import an ECS Service', () => {
  test('with serviceArnWithCluster', () => {
    // GIVEN
    const clusterName = 'cluster-name';
    const serviceName = 'my-http-service';
    const region = 'service-region';
    const account = 'service-account';
    const serviceArn = `arn:aws:ecs:${region}:${account}:service/${clusterName}/${serviceName}`;

    // WHEN
    const service = ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', serviceArn);

    // THEN
    expect(service.serviceArn).toEqual(serviceArn);
    expect(service.serviceName).toEqual(serviceName);
    expect(service.env.account).toEqual(account);
    expect(service.env.region).toEqual(region);

    expect(service.cluster.clusterName).toEqual(clusterName);
    expect(service.cluster.env.account).toEqual(account);
    expect(service.cluster.env.region).toEqual(region);
  });

  test('throws an expection if no resourceName provided on fromServiceArnWithCluster', () => {
    expect(() => {
      ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', 'arn:aws:ecs:service-region:service-account:service');
    }).toThrowError(/Missing resource Name from service ARN/);
  });

  test('throws an expection if not using cluster arn format on fromServiceArnWithCluster', () => {
    expect(() => {
      ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', 'arn:aws:ecs:service-region:service-account:service/my-http-service');
    }).toThrowError(/is not using the ARN cluster format/);
  });
});
