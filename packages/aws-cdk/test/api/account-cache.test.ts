import { bockfs } from '@aws-cdk/cdk-build-tools';
import { AccountAccessKeyCache } from '../../lib/api/aws-auth/account-cache';

afterAll(() => {
  bockfs.restore();
});

test('uses the resolver when the file cannot be read', async () => {
  const cache = new AccountAccessKeyCache('/foo/account-cache.json');
  const account = {
    accountId: 'abc',
    partition: 'aws',
  };
  const result = await cache.fetch('abcdef', () => Promise.resolve(account));

  expect(result).toEqual(account);
});

test('gets cached value', async () => {
  const account = {
    accountId: 'xyz',
    partition: 'aws',
  };

  bockfs({
    '/foo/account-cache.json': `${JSON.stringify({
      abcdef: account,
    })}`,
  });

  const cache = new AccountAccessKeyCache(bockfs.path('/foo/account-cache.json'));
  const result = await cache.fetch('abcdef', () => Promise.resolve({
    accountId: 'xyz',
    partition: 'aws',
  }));

  expect(result).toEqual(account);
});
