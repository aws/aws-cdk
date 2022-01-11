import { Default } from '../lib';

const region = 'bermuda-triangle-42';
const urlSuffix = '.nowhere.null';

describe('servicePrincipal', () => {
  for (const suffix of ['', '.amazonaws.com', '.amazonaws.com.cn']) {
    for (const service of ['states', 'ssm']) {
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

});


describe('spot-check some service principals', () => {
  test('ssm', () => {
    expect(Default.servicePrincipal('ssm.amazonaws.com', 'us-east-1', 'x')).toBe('ssm.amazonaws.com');
    expect(Default.servicePrincipal('ssm.amazonaws.com', 'eu-north-1', 'x')).toBe('ssm.amazonaws.com');
    expect(Default.servicePrincipal('ssm.amazonaws.com', 'ap-east-1', 'x')).toBe('ssm.ap-east-1.amazonaws.com');
    expect(Default.servicePrincipal('ssm.amazonaws.com', 'eu-south-1', 'x')).toBe('ssm.eu-south-1.amazonaws.com');
  });
});
