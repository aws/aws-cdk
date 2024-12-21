/* eslint-disable import/order */
import * as https from 'https';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as nock from 'nock';
import * as logging from '../lib/logging';
import {
  CachedDataSource,
  Notice,
  Notices,
  NoticesFilter,
  FilteredNotice,
  WebsiteNoticeDataSource,
  BootstrappedEnvironment,
} from '../lib/notices';
import * as version from '../lib/version';
import { Context, Settings } from '../lib/settings';

const BASIC_BOOTSTRAP_NOTICE = {
  title: 'Exccessive permissions on file asset publishing role',
  issueNumber: 16600,
  overview: 'FilePublishingRoleDefaultPolicy has too many permissions',
  components: [{
    name: 'bootstrap',
    version: '<25',
  }],
  schemaVersion: '1',
};

const BOOTSTRAP_NOTICE_V10 = {
  title: 'Bootstrap version 10 is no good',
  issueNumber: 16600,
  overview: 'overview',
  components: [{
    name: 'bootstrap',
    version: '=10',
  }],
  schemaVersion: '1',
};

const BOOTSTRAP_NOTICE_V11 = {
  title: 'Bootstrap version 11 is no good',
  issueNumber: 16600,
  overview: 'overview',
  components: [{
    name: 'bootstrap',
    version: '=11',
  }],
  schemaVersion: '1',
};

const BASIC_DYNAMIC_NOTICE = {
  title: 'Toggling off auto_delete_objects for Bucket empties the bucket',
  issueNumber: 16603,
  overview: '{resolve:DYNAMIC1} this is a notice with dynamic values {resolve:DYNAMIC2}',
  components: [{
    name: 'cli',
    version: '<=1.126.0',
  }],
  schemaVersion: '1',
};

const BASIC_NOTICE = {
  title: 'Toggling off auto_delete_objects for Bucket empties the bucket',
  issueNumber: 16603,
  overview: 'If a stack is deployed with an S3 bucket with auto_delete_objects=True, and then re-deployed with auto_delete_objects=False, all the objects in the bucket will be deleted.',
  components: [{
    name: 'cli',
    version: '<=1.126.0',
  }],
  schemaVersion: '1',
};

const BASIC_WARNING_NOTICE = {
  title: 'Toggling off auto_delete_objects for Bucket empties the bucket',
  issueNumber: 16603,
  overview: 'If a stack is deployed with an S3 bucket with auto_delete_objects=True, and then re-deployed with auto_delete_objects=False, all the objects in the bucket will be deleted.',
  components: [{
    name: 'cli',
    version: '<=1.126.0',
  }],
  schemaVersion: '1',
  severity: 'warning',
};

const BASIC_ERROR_NOTICE = {
  title: 'Toggling off auto_delete_objects for Bucket empties the bucket',
  issueNumber: 16603,
  overview: 'If a stack is deployed with an S3 bucket with auto_delete_objects=True, and then re-deployed with auto_delete_objects=False, all the objects in the bucket will be deleted.',
  components: [{
    name: 'cli',
    version: '<=1.126.0',
  }],
  schemaVersion: '1',
  severity: 'error',
};

const MULTIPLE_AFFECTED_VERSIONS_NOTICE = {
  title: 'Error when building EKS cluster with monocdk import',
  issueNumber: 17061,
  overview: 'When using monocdk/aws-eks to build a stack containing an EKS cluster, error is thrown about missing lambda-layer-node-proxy-agent/layer/package.json.',
  components: [{
    name: 'cli',
    version: '<1.130.0 >=1.126.0',
  }],
  schemaVersion: '1',
};

const FRAMEWORK_2_1_0_AFFECTED_NOTICE = {
  title: 'Regression on module foobar',
  issueNumber: 1234,
  overview: 'Some bug description',
  components: [{
    name: 'framework',
    version: '<= 2.1.0',
  }],
  schemaVersion: '1',
};

const NOTICE_FOR_APIGATEWAYV2 = {
  title: 'Regression on module foobar',
  issueNumber: 1234,
  overview: 'Some bug description',
  components: [{
    name: '@aws-cdk/aws-apigatewayv2-alpha.',
    version: '<= 2.13.0-alpha.0',
  }],
  schemaVersion: '1',
};

const NOTICE_FOR_APIGATEWAY = {
  title: 'Regression on module foobar',
  issueNumber: 1234,
  overview: 'Some bug description',
  components: [{
    name: '@aws-cdk/aws-apigateway',
    version: '<= 2.13.0-alpha.0',
  }],
  schemaVersion: '1',
};

const NOTICE_FOR_APIGATEWAYV2_CFN_STAGE = {
  title: 'Regression on module foobar',
  issueNumber: 1234,
  overview: 'Some bug description',
  components: [{
    name: 'aws-cdk-lib.aws_apigatewayv2.CfnStage',
    version: '<= 2.13.0-alpha.0',
  }],
  schemaVersion: '1',
};

describe(FilteredNotice, () => {
  describe('format', () => {
    test('resolves dynamic values', () => {
      const filteredNotice = new FilteredNotice(BASIC_DYNAMIC_NOTICE);
      filteredNotice.addDynamicValue('DYNAMIC1', 'dynamic-value1');
      filteredNotice.addDynamicValue('DYNAMIC2', 'dynamic-value2');

      expect(filteredNotice.format()).toMatchInlineSnapshot(`
"16603	Toggling off auto_delete_objects for Bucket empties the bucket

	Overview: dynamic-value1 this is a notice with dynamic values
	          dynamic-value2

	Affected versions: cli: <=1.126.0

	More information at: https://github.com/aws/aws-cdk/issues/16603
"
`);
    });

    test('single version range', () => {
      expect(new FilteredNotice(BASIC_NOTICE).format()).toMatchInlineSnapshot(`
"16603	Toggling off auto_delete_objects for Bucket empties the bucket

	Overview: If a stack is deployed with an S3 bucket with
	          auto_delete_objects=True, and then re-deployed with
	          auto_delete_objects=False, all the objects in the bucket
	          will be deleted.

	Affected versions: cli: <=1.126.0

	More information at: https://github.com/aws/aws-cdk/issues/16603
"
`);
    });

    test('multiple version ranges', () => {
      expect(new FilteredNotice(MULTIPLE_AFFECTED_VERSIONS_NOTICE).format()).toMatchInlineSnapshot(`
"17061	Error when building EKS cluster with monocdk import

	Overview: When using monocdk/aws-eks to build a stack containing an
	          EKS cluster, error is thrown about missing
	          lambda-layer-node-proxy-agent/layer/package.json.

	Affected versions: cli: <1.130.0 >=1.126.0

	More information at: https://github.com/aws/aws-cdk/issues/17061
"
`);
    });
  });
});

describe(NoticesFilter, () => {
  describe('filter', () => {
    test('cli', async () => {
      const notices = [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE];

      // doesn't matter for this test because our data only has CLI notices
      const outDir = path.join(__dirname, 'cloud-assembly-trees', 'built-with-2_12_0');

      expect(NoticesFilter.filter({ data: notices, bootstrappedEnvironments: [], outDir, cliVersion: '1.0.0' }).map(f => f.notice)).toEqual([BASIC_NOTICE]);
      expect(NoticesFilter.filter({ data: notices, bootstrappedEnvironments: [], outDir, cliVersion: '1.129.0' }).map(f => f.notice)).toEqual([MULTIPLE_AFFECTED_VERSIONS_NOTICE]);
      expect(NoticesFilter.filter({ data: notices, bootstrappedEnvironments: [], outDir, cliVersion: '1.126.0' }).map(f => f.notice)).toEqual([BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE]);
      expect(NoticesFilter.filter({ data: notices, bootstrappedEnvironments: [], outDir, cliVersion: '1.130.0' }).map(f => f.notice)).toEqual([]);
    });

    test('framework', () => {
      const notices = [FRAMEWORK_2_1_0_AFFECTED_NOTICE];

      // doesn't matter for this test because our data only has framework notices
      const cliVersion = '1.0.0';

      expect(NoticesFilter.filter({ data: notices, cliVersion, bootstrappedEnvironments: [], outDir: path.join(__dirname, 'cloud-assembly-trees', 'built-with-2_12_0') }).map(f => f.notice)).toEqual([]);
      expect(NoticesFilter.filter({ data: notices, cliVersion, bootstrappedEnvironments: [], outDir: path.join(__dirname, 'cloud-assembly-trees', 'built-with-1_144_0') }).map(f => f.notice)).toEqual([FRAMEWORK_2_1_0_AFFECTED_NOTICE]);
    });

    test('module', () => {
      // doesn't matter for this test because our data only has framework notices
      const cliVersion = '1.0.0';

      // module-level match
      expect(NoticesFilter.filter({ data: [NOTICE_FOR_APIGATEWAYV2], cliVersion, bootstrappedEnvironments: [], outDir: path.join(__dirname, 'cloud-assembly-trees', 'experimental-module') }).map(f => f.notice)).toEqual([NOTICE_FOR_APIGATEWAYV2]);

      // no apigatewayv2 in the tree
      expect(NoticesFilter.filter({ data: [NOTICE_FOR_APIGATEWAYV2], cliVersion, bootstrappedEnvironments: [], outDir: path.join(__dirname, 'cloud-assembly-trees', 'built-with-2_12_0') }).map(f => f.notice)).toEqual([]);

      // module name mismatch: apigateway != apigatewayv2
      expect(NoticesFilter.filter({ data: [NOTICE_FOR_APIGATEWAY], cliVersion, bootstrappedEnvironments: [], outDir: path.join(__dirname, 'cloud-assembly-trees', 'experimental-module') }).map(f => f.notice)).toEqual([]);

      // construct-level match
      expect(NoticesFilter.filter({ data: [NOTICE_FOR_APIGATEWAYV2_CFN_STAGE], cliVersion, bootstrappedEnvironments: [], outDir: path.join(__dirname, 'cloud-assembly-trees', 'experimental-module') }).map(f => f.notice)).toEqual([NOTICE_FOR_APIGATEWAYV2_CFN_STAGE]);
    });

    test('bootstrap', () => {
      // doesn't matter for this test because our data only has bootstrap notices
      const outDir = path.join(__dirname, 'cloud-assembly-trees', 'built-with-2_12_0');
      const cliVersion = '1.0.0';

      const bootstrappedEnvironments: BootstrappedEnvironment[] = [
        {
          // affected
          bootstrapStackVersion: 22,
          environment: {
            account: 'account',
            region: 'region1',
            name: 'env1',
          },
        },
        {
          // affected
          bootstrapStackVersion: 21,
          environment: {
            account: 'account',
            region: 'region2',
            name: 'env2',
          },
        },
        {
          // not affected
          bootstrapStackVersion: 28,
          environment: {
            account: 'account',
            region: 'region3',
            name: 'env3',
          },
        },
      ];

      expect(NoticesFilter.filter({
        data: [BASIC_BOOTSTRAP_NOTICE],
        cliVersion,
        outDir,
        bootstrappedEnvironments: bootstrappedEnvironments,
      }).map(f => f.notice)).toEqual([BASIC_BOOTSTRAP_NOTICE]);
    });

    test('ignores invalid bootstrap versions', () => {
      // doesn't matter for this test because our data only has bootstrap notices
      const outDir = path.join(__dirname, 'cloud-assembly-trees', 'built-with-2_12_0');
      const cliVersion = '1.0.0';

      expect(NoticesFilter.filter({
        data: [BASIC_BOOTSTRAP_NOTICE],
        cliVersion,
        outDir,
        bootstrappedEnvironments: [{ bootstrapStackVersion: NaN, environment: { account: 'account', region: 'region', name: 'env' } }],
      }).map(f => f.notice)).toEqual([]);
    });
  });
});

describe(WebsiteNoticeDataSource, () => {
  const dataSource = new WebsiteNoticeDataSource();

  test('returns data when download succeeds', async () => {
    const result = await mockCall(200, {
      notices: [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE],
    });

    expect(result).toEqual([BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE]);
  });

  test('returns appropriate error when the server returns an unexpected status code', async () => {
    const result = mockCall(500, {
      notices: [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE],
    });

    await expect(result).rejects.toThrow(/500/);
  });

  test('returns appropriate error when the server returns an unexpected structure', async () => {
    const result = mockCall(200, {
      foo: [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE],
    });

    await expect(result).rejects.toThrow(/key is missing/);
  });

  test('returns appropriate error when the server returns invalid json', async () => {
    const result = mockCall(200, '-09aiskjkj838');

    await expect(result).rejects.toThrow(/Failed to parse/);
  });

  test('returns appropriate error when HTTPS call throws', async () => {
    const mockGet = jest.spyOn(https, 'get')
      .mockImplementation(() => { throw new Error('No connection'); });

    const result = dataSource.fetch();

    await expect(result).rejects.toThrow(/No connection/);

    mockGet.mockRestore();
  });

  test('returns appropriate error when the request has an error', async () => {
    nock('https://cli.cdk.dev-tools.aws.dev')
      .get('/notices.json')
      .replyWithError('DNS resolution failed');

    const result = dataSource.fetch();

    await expect(result).rejects.toThrow(/DNS resolution failed/);
  });

  test('returns appropriate error when the connection stays idle for too long', async () => {
    nock('https://cli.cdk.dev-tools.aws.dev')
      .get('/notices.json')
      .delayConnection(3500)
      .reply(200, {
        notices: [BASIC_NOTICE],
      });

    const result = dataSource.fetch();

    await expect(result).rejects.toThrow(/timed out/);
  });

  test('returns empty array when the request takes too long to finish', async () => {
    nock('https://cli.cdk.dev-tools.aws.dev')
      .get('/notices.json')
      .delayBody(3500)
      .reply(200, {
        notices: [BASIC_NOTICE],
      });

    const result = dataSource.fetch();

    await expect(result).rejects.toThrow(/timed out/);
  });

  function mockCall(statusCode: number, body: any): Promise<Notice[]> {
    nock('https://cli.cdk.dev-tools.aws.dev')
      .get('/notices.json')
      .reply(statusCode, body);

    return dataSource.fetch();
  }
});

describe(CachedDataSource, () => {
  const fileName = path.join(os.tmpdir(), 'cache.json');
  const cachedData = [BASIC_NOTICE];
  const freshData = [MULTIPLE_AFFECTED_VERSIONS_NOTICE];

  beforeEach(() => {
    fs.writeFileSync(fileName, '');
  });

  test('retrieves data from the delegate cache when the file is empty', async () => {
    const dataSource = dataSourceWithDelegateReturning(freshData);

    const notices = await dataSource.fetch();

    expect(notices).toEqual(freshData);
  });

  test('retrieves data from the file when the data is still valid', async () => {
    fs.writeJsonSync(fileName, {
      notices: cachedData,
      expiration: Date.now() + 10000,
    });
    const dataSource = dataSourceWithDelegateReturning(freshData);

    const notices = await dataSource.fetch();

    expect(notices).toEqual(cachedData);
  });

  test('retrieves data from the delegate when the data is expired', async () => {
    fs.writeJsonSync(fileName, {
      notices: cachedData,
      expiration: 0,
    });
    const dataSource = dataSourceWithDelegateReturning(freshData);

    const notices = await dataSource.fetch();

    expect(notices).toEqual(freshData);
  });

  test('retrieves data from the delegate when the file cannot be read', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-test'));
    try {
      const debugSpy = jest.spyOn(logging, 'debug');

      const dataSource = dataSourceWithDelegateReturning(freshData, `${tmpDir}/does-not-exist.json`);

      const notices = await dataSource.fetch();

      expect(notices).toEqual(freshData);
      expect(debugSpy).not.toHaveBeenCalled();

      debugSpy.mockRestore();
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test('retrieved data from the delegate when it is configured to ignore the cache', async () => {
    fs.writeJsonSync(fileName, {
      notices: cachedData,
      expiration: Date.now() + 10000,
    });
    const dataSource = dataSourceWithDelegateReturning(freshData, fileName, true);

    const notices = await dataSource.fetch();

    expect(notices).toEqual(freshData);
  });

  test('error in delegate gets turned into empty result by cached source', async () => {
    // GIVEN
    const delegate = {
      fetch: jest.fn().mockRejectedValue(new Error('fetching failed')),
    };
    const dataSource = new CachedDataSource(fileName, delegate, true);

    // WHEN
    const notices = await dataSource.fetch();

    // THEN
    expect(notices).toEqual([]);
  });

  function dataSourceWithDelegateReturning(notices: Notice[], file: string = fileName, ignoreCache: boolean = false) {
    const delegate = {
      fetch: jest.fn(),
    };

    delegate.fetch.mockResolvedValue(notices);
    return new CachedDataSource(file, delegate, ignoreCache);
  }
});

describe(Notices, () => {
  beforeEach(() => {
    // disable caching
    jest.spyOn(CachedDataSource.prototype as any, 'save').mockImplementation((_: any) => Promise.resolve());
    jest.spyOn(CachedDataSource.prototype as any, 'load').mockImplementation(() => Promise.resolve({ expiration: 0, notices: [] }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('addBootstrapVersion', () => {
    test('can add multiple values', async () => {
      const notices = Notices.create({ context: new Context() });
      notices.addBootstrappedEnvironment({ bootstrapStackVersion: 10, environment: { account: 'account', region: 'region', name: 'env' } });
      notices.addBootstrappedEnvironment({ bootstrapStackVersion: 11, environment: { account: 'account', region: 'region', name: 'env' } });

      await notices.refresh({
        dataSource: { fetch: async () => [BOOTSTRAP_NOTICE_V10, BOOTSTRAP_NOTICE_V11] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenCalledWith(new FilteredNotice(BOOTSTRAP_NOTICE_V10).format());
      expect(print).toHaveBeenCalledWith(new FilteredNotice(BOOTSTRAP_NOTICE_V11).format());
    });

    test('deduplicates', async () => {
      const notices = Notices.create({ context: new Context() });
      notices.addBootstrappedEnvironment({ bootstrapStackVersion: 10, environment: { account: 'account', region: 'region', name: 'env' } });
      notices.addBootstrappedEnvironment({ bootstrapStackVersion: 10, environment: { account: 'account', region: 'region', name: 'env' } });

      // mock cli version number
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.0.0');

      notices.display();

      const filter = jest.spyOn(NoticesFilter, 'filter');
      notices.display();

      expect(filter).toHaveBeenCalledTimes(1);
      expect(filter).toHaveBeenCalledWith({
        bootstrappedEnvironments: [{
          bootstrapStackVersion: 10,
          environment: {
            account: 'account',
            region: 'region',
            name: 'env',
          },
        }],
        cliVersion: '1.0.0',
        data: [],
        outDir: 'cdk.out',
      });
    });
  });

  describe('refresh', () => {
    test('deduplicates notices', async () => {
      // within the affected version range of the notice
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.0.0');

      const notices = Notices.create({ context: new Context() });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE, BASIC_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenCalledWith(new FilteredNotice(BASIC_NOTICE).format());
    });

    test('clears notices if empty', async () => {
      // within the affected version range of the notice
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.0.0');

      const notices = Notices.create({ context: new Context() });
      await notices.refresh({
        dataSource: { fetch: async () => [] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display({ showTotal: true });
      expect(print).toHaveBeenNthCalledWith(1, '');
      expect(print).toHaveBeenNthCalledWith(2, 'There are 0 unacknowledged notice(s).');
      expect(print).toHaveBeenCalledTimes(2);
    });

    test('doesnt throw', async () => {
      const notices = Notices.create({ context: new Context() });
      await notices.refresh({
        dataSource: {
          fetch: async () => {
            throw new Error('Should not fail refresh');
          },
        },
      });
    });

    test('does nothing when we shouldnt display', async () => {
      let refreshCalled = false;
      const notices = Notices.create({ context: new Context(), shouldDisplay: false });
      await notices.refresh({
        dataSource: {
          fetch: async () => {
            refreshCalled = true;
            return Promise.resolve([]);
          },
        },
      });

      expect(refreshCalled).toBeFalsy();
    });

    test('filters out acknowledged notices by default', async () => {
      // within the affected version range of both notices
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.126.0');

      const context = new Context({ bag: new Settings({ 'acknowledged-issue-numbers': [MULTIPLE_AFFECTED_VERSIONS_NOTICE.issueNumber] }) });

      const notices = Notices.create({ context });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenNthCalledWith(4, new FilteredNotice(BASIC_NOTICE).format());
      expect(print).toHaveBeenNthCalledWith(6, 'If you don’t want to see a notice anymore, use \"cdk acknowledge <id>\". For example, \"cdk acknowledge 16603\".');
    });

    test('preserves acknowledged notices if requested', async () => {
      // within the affected version range of both notices
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.126.0');

      const context = new Context({ bag: new Settings({ 'acknowledged-issue-numbers': [MULTIPLE_AFFECTED_VERSIONS_NOTICE.issueNumber] }) });

      const notices = Notices.create({ context, includeAcknowledged: true });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenCalledWith(new FilteredNotice(BASIC_NOTICE).format());
      expect(print).toHaveBeenCalledWith(new FilteredNotice(MULTIPLE_AFFECTED_VERSIONS_NOTICE).format());
    });
  });

  describe('display', () => {
    test('notices envelop', async () => {
      // within the affected version range of the notice
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.0.0');

      const notices = Notices.create({ context: new Context() });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE, BASIC_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenNthCalledWith(2, 'NOTICES         (What\'s this? https://github.com/aws/aws-cdk/wiki/CLI-Notices)');
      expect(print).toHaveBeenNthCalledWith(6, 'If you don’t want to see a notice anymore, use \"cdk acknowledge <id>\". For example, \"cdk acknowledge 16603\".');
    });

    test('deduplicates notices', async () => {
      // within the affected version range of the notice
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.0.0');

      const notices = Notices.create({ context: new Context() });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE, BASIC_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenNthCalledWith(4, new FilteredNotice(BASIC_NOTICE).format());
      expect(print).toHaveBeenNthCalledWith(6, 'If you don’t want to see a notice anymore, use \"cdk acknowledge <id>\". For example, \"cdk acknowledge 16603\".');
    });

    test('does nothing when we shouldnt display', async () => {
      const notices = Notices.create({ context: new Context(), shouldDisplay: false });
      await notices.refresh({ dataSource: { fetch: async () => [BASIC_NOTICE] } });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenCalledTimes(0);
    });

    test('nothing when there are no notices', async () => {
      const print = jest.spyOn(logging, 'print');

      Notices.create({ context: new Context() }).display();
      expect(print).toHaveBeenCalledTimes(0);
    });

    test('total count when show total is true', async () => {
      const print = jest.spyOn(logging, 'print');

      Notices.create({ context: new Context() }).display({ showTotal: true });
      expect(print).toHaveBeenNthCalledWith(2, 'There are 0 unacknowledged notice(s).');
    });

    test('warning', async () => {
      // within the affected version range of the notice
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.0.0');

      const notices = Notices.create({ context: new Context() });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_WARNING_NOTICE] },
      });

      const warning = jest.spyOn(logging, 'warning');

      notices.display();
      expect(warning).toHaveBeenNthCalledWith(1, new FilteredNotice(BASIC_NOTICE).format());
      expect(warning).toHaveBeenCalledTimes(1);
    });

    test('error', async () => {
      // within the affected version range of the notice
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.0.0');

      const notices = Notices.create({ context: new Context() });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_ERROR_NOTICE] },
      });

      const error = jest.spyOn(logging, 'error');

      notices.display();
      expect(error).toHaveBeenNthCalledWith(1, new FilteredNotice(BASIC_NOTICE).format());
      expect(error).toHaveBeenCalledTimes(1);
    });

    test('only relevant notices', async () => {
      // within the affected version range of the notice
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.0.0');

      const notices = Notices.create({ context: new Context() });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenNthCalledWith(4, new FilteredNotice(BASIC_NOTICE).format());
    });

    test('only unacknowledged notices', async () => {
      // within the affected version range of both notices
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.126.0');

      const context = new Context({ bag: new Settings({ 'acknowledged-issue-numbers': [MULTIPLE_AFFECTED_VERSIONS_NOTICE.issueNumber] }) });

      const notices = Notices.create({ context });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenNthCalledWith(4, new FilteredNotice(BASIC_NOTICE).format());
    });

    test('can include acknowledged notices if requested', async () => {
      // within the affected version range of both notices
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.126.0');

      const context = new Context({ bag: new Settings({ 'acknowledged-issue-numbers': [MULTIPLE_AFFECTED_VERSIONS_NOTICE.issueNumber] }) });
      const notices = Notices.create({ context, includeAcknowledged: true });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenNthCalledWith(4, new FilteredNotice(BASIC_NOTICE).format());
      expect(print).toHaveBeenNthCalledWith(6, new FilteredNotice(MULTIPLE_AFFECTED_VERSIONS_NOTICE).format());
    });
  });
});
