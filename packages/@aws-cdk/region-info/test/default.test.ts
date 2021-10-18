import { Default } from '../lib';

const region = 'bermuda-triangle-42';
const urlSuffix = '.nowhere.null';

describe('servicePrincipal', () => {
  for (const suffix of ['', '.amazonaws.com', '.amazonaws.com.cn']) {
    for (const service of ['states']) {
      test(`${service}${suffix}`, () => {
        expect(Default.servicePrincipal(`${service}${suffix}`, region, urlSuffix)).toBe(`${service}.${region}.amazonaws.com`);
      });
    }
    for (const service of ['codedeploy', 'logs']) {
      test(`${service}${suffix}`, () => {
        expect(Default.servicePrincipal(`${service}${suffix}`, region, urlSuffix)).toBe(`${service}.${region}.${urlSuffix}`);
      });
    }

    for (const service of ['ec2']) {
      test(`${service}${suffix}`, () => {
        expect(Default.servicePrincipal(`${service}${suffix}`, region, urlSuffix)).toBe(`${service}.${urlSuffix}`);
      });
    }

    for (const service of ['autoscaling', 'lambda', 'events', 'sns', 'sqs', 'foo-service']) {
      test(`${service}${suffix}`, () => {
        expect(Default.servicePrincipal(`${service}${suffix}`, region, urlSuffix)).toBe(`${service}.amazonaws.com`);
      });
    }

  }

  test('with an "exotic" DNS suffix (.local)', () => {
    expect(Default.servicePrincipal('foo-service.local', region, urlSuffix)).toBe('foo-service.local');
  });

  test('Exceptions: states in us-iso-east-1', () => {
    expect(Default.servicePrincipal('states.amazonaws.com', 'us-iso-east-1', 'c2s.ic.gov')).toBe('states.amazonaws.com');
  });

  test('Exceptions: states in us-isob-east-1', () => {
    expect(Default.servicePrincipal('states.amazonaws.com', 'us-isob-east-1', 'sc2s.sgov.gov')).toBe('states.amazonaws.com');
  });

  for (const service of ['cloudhsm', 'config', 'workspaces']) {
    test(`Exceptions: ${service}.amazonaws.com is us-iso-east-1`, () => {
      expect(Default.servicePrincipal(`${service}.amazonaws.com`, 'us-iso-east-1', 'c2s.ic.gov')).toBe(`${service}.c2s.ic.gov`);
    });
  }

  for (const ssm_region of ['ap-east-1', 'eu-central-1', 'eu-west-1', 'us-east-1', 'us-west-1']) {
    test(`Region for ssm: ssm.${ssm_region}.amazonaws.com`, () => {
      expect(Default.servicePrincipal('ssm', ssm_region, urlSuffix)).toBe(`ssm.${ssm_region}.amazonaws.com`);
    });
  }
});
