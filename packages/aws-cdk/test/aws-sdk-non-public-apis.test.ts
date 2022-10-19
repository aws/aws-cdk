// The ECS hotswapping functionality in lib/api/hotswap/ecs-services.ts
// uses some non-public APIs of the JS AWS SDK for waiting on the deployment to finish.
// These unit tests are here to confirm the non-public elements are present and working as expected,
// and do not get changed in a new version of the aws-sdk package

import * as AWS from 'aws-sdk';

let ecsService: AWS.ECS;
beforeEach(() => {
  ecsService = new AWS.ECS();
});

test("the 'waiters' API is available in the current AWS SDK", () => {
  const waiters = (ecsService as any).api?.waiters;

  expect(waiters).not.toBeUndefined();
  expect(typeof waiters).toBe('object');
});

test("the 'ResourceWaiter' API is available in the current AWS SDK", () => {
  const resourceWaiter = new (AWS as any).ResourceWaiter(ecsService, 'servicesStable');

  // make sure the 'wait' method is available
  expect(typeof resourceWaiter.wait).toBe('function');
});
