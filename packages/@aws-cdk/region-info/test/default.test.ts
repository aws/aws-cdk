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
    for (const service of ['sns', 'sqs']) {
      test(`${service}${suffix}`, () => {
        expect(Default.servicePrincipal(`${service}${suffix}`, region, urlSuffix)).toBe(`${service}.amazonaws.com`);
      });
    }

    for (const service of ['application-autoscaling', 'autoscaling', 'ec2', 'events', 'lambda', 'foo-service']) {
      test(`${service}${suffix}`, () => {
        expect(Default.servicePrincipal(`${service}${suffix}`, region, urlSuffix)).toBe(`${service}.${urlSuffix}`);
      });
    }
  }

  test('with an "exotic" DNS suffix (.local)', () => {
    expect(Default.servicePrincipal('foo-service.local', region, urlSuffix)).toBe('foo-service.local');
  });
});
