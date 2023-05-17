import { Default } from '../lib';

const region = 'bermuda-triangle-42';
const urlSuffix = '.nowhere.null';

describe('servicePrincipal', () => {
  for (const suffix of ['', '.amazonaws.com', '.amazonaws.com.cn']) {
    for (const service of ['codedeploy', 'states']) {
      test(`${service}${suffix}`, () => {
        expect(Default.servicePrincipal(`${service}${suffix}`, region, urlSuffix)).toBe(`${service}.${region}.amazonaws.com`);
      });
    }
    for (const service of ['logs']) {
      test(`${service}${suffix}`, () => {
        expect(Default.servicePrincipal(`${service}${suffix}`, region, urlSuffix)).toBe(`${service}.${region}.${urlSuffix}`);
      });
    }

    for (const service of ['ec2']) {
      test(`${service}${suffix}`, () => {
        expect(Default.servicePrincipal(`${service}${suffix}`, region, urlSuffix)).toBe(`${service}.amazonaws.com`);
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

  for (const cnRegion of ['cn-north-1', 'cn-northwest-1']) {
    test(`Exceptions: codedeploy in ${cnRegion}`, () => {
      expect(Default.servicePrincipal('codedeploy', cnRegion, 'amazonaws.com.cn')).toBe(`codedeploy.${cnRegion}.amazonaws.com.cn`);
    });
  }
});


describe('spot-check some service principals', () => {
  test('ssm', () => {
    // SSM has advertised in its documentation that it is regional after a certain point, but that
    // documentation only applies to SSM Inventory, not SSM Automation. Plus, there is no need for
    // a different service principal, as all accounts are (at least currently) included in the global
    // one.
    expectServicePrincipals('ssm.amazonaws.com', {
      'us-east-1': 'ssm.amazonaws.com',
      'eu-north-1': 'ssm.amazonaws.com',
      'ap-east-1': 'ssm.amazonaws.com',
      'eu-south-1': 'ssm.amazonaws.com',
    });
  });

  test('EMR', () => {
    expectServicePrincipals('elasticmapreduce.amazonaws.com', {
      'us-east-1': 'elasticmapreduce.amazonaws.com',
      'cn-north-1': 'elasticmapreduce.EXTENSION', // amazonaws.com.cn in China
      'us-iso-east-1': 'elasticmapreduce.amazonaws.com',
    });
  });

  function expectServicePrincipals(principal: string, regionMap: Record<string, string>) {
    expect(Object.fromEntries(Object.keys(regionMap).map(reg => [reg, Default.servicePrincipal(principal, reg, 'EXTENSION')]))).toEqual(regionMap);
  }
});