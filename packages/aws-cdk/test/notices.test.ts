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
  NoticesFormatter,
  WebsiteNoticeDataSource,
} from '../lib/notices';
import * as version from '../lib/version';
import { Configuration } from '../lib/settings';

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

describe(NoticesFormatter, () => {

  describe('format', () => {

    test('single version range', () => {

      expect(NoticesFormatter.format([BASIC_NOTICE])).toEqual(`
NOTICES         (What's this? https://github.com/aws/aws-cdk/wiki/CLI-Notices)

16603	Toggling off auto_delete_objects for Bucket empties the bucket

	Overview: If a stack is deployed with an S3 bucket with
	          auto_delete_objects=True, and then re-deployed with
	          auto_delete_objects=False, all the objects in the bucket
	          will be deleted.

	Affected versions: cli: <=1.126.0

	More information at: https://github.com/aws/aws-cdk/issues/16603


If you don’t want to see a notice anymore, use "cdk acknowledge <id>". For example, "cdk acknowledge 16603".`);
    });

    test('multiple version ranges', () => {

      expect(NoticesFormatter.format([MULTIPLE_AFFECTED_VERSIONS_NOTICE])).toEqual(`
NOTICES         (What's this? https://github.com/aws/aws-cdk/wiki/CLI-Notices)

17061	Error when building EKS cluster with monocdk import

	Overview: When using monocdk/aws-eks to build a stack containing an
	          EKS cluster, error is thrown about missing
	          lambda-layer-node-proxy-agent/layer/package.json.

	Affected versions: cli: <1.130.0 >=1.126.0

	More information at: https://github.com/aws/aws-cdk/issues/17061


If you don’t want to see a notice anymore, use "cdk acknowledge <id>". For example, "cdk acknowledge 17061".`);
    });

    test('showTotal', () => {

      expect(NoticesFormatter.format([BASIC_NOTICE], true)).toEqual(`
NOTICES         (What's this? https://github.com/aws/aws-cdk/wiki/CLI-Notices)

16603	Toggling off auto_delete_objects for Bucket empties the bucket

	Overview: If a stack is deployed with an S3 bucket with
	          auto_delete_objects=True, and then re-deployed with
	          auto_delete_objects=False, all the objects in the bucket
	          will be deleted.

	Affected versions: cli: <=1.126.0

	More information at: https://github.com/aws/aws-cdk/issues/16603


If you don’t want to see a notice anymore, use "cdk acknowledge <id>". For example, "cdk acknowledge 16603".

There are 1 unacknowledged notice(s).`);
    });

    test('showTotal even if zero', () => {

      expect(NoticesFormatter.format([], true)).toEqual('\n\nThere are 0 unacknowledged notice(s).');
    });

  });

});

describe(NoticesFilter, () => {

  describe('filter', () => {

    test('cli', async () => {

      const notices = [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE];

      // doesn't matter for this test because our data only has CLI notices
      const outDir = path.join(__dirname, 'cloud-assembly-trees', 'built-with-2_12_0');

      expect(NoticesFilter.filter({ data: notices, outDir, cliVersion: '1.0.0' })).toEqual([BASIC_NOTICE]);
      expect(NoticesFilter.filter({ data: notices, outDir, cliVersion: '1.129.0' })).toEqual([MULTIPLE_AFFECTED_VERSIONS_NOTICE]);
      expect(NoticesFilter.filter({ data: notices, outDir, cliVersion: '1.126.0' })).toEqual([BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE]);
      expect(NoticesFilter.filter({ data: notices, outDir, cliVersion: '1.130.0' })).toEqual([]);

    });

    test('framework', () => {

      const notices = [FRAMEWORK_2_1_0_AFFECTED_NOTICE];

      // doesn't matter for this test because our data only has framework notices
      const cliVersion = '1.0.0';

      expect(NoticesFilter.filter({ data: notices, cliVersion, outDir: path.join(__dirname, 'cloud-assembly-trees', 'built-with-2_12_0') })).toEqual([]);
      expect(NoticesFilter.filter({ data: notices, cliVersion, outDir: path.join(__dirname, 'cloud-assembly-trees', 'built-with-1_144_0') })).toEqual([FRAMEWORK_2_1_0_AFFECTED_NOTICE]);

    });

    test('module', () => {

      // doesn't matter for this test because our data only has framework notices
      const cliVersion = '1.0.0';

      // module-level match
      expect(NoticesFilter.filter({ data: [NOTICE_FOR_APIGATEWAYV2], cliVersion, outDir: path.join(__dirname, 'cloud-assembly-trees', 'experimental-module') })).toEqual([NOTICE_FOR_APIGATEWAYV2]);

      // no apigatewayv2 in the tree
      expect(NoticesFilter.filter({ data: [NOTICE_FOR_APIGATEWAYV2], cliVersion, outDir: path.join(__dirname, 'cloud-assembly-trees', 'built-with-2_12_0') })).toEqual([]);

      // module name mismatch: apigateway != apigatewayv2
      expect(NoticesFilter.filter({ data: [NOTICE_FOR_APIGATEWAY], cliVersion, outDir: path.join(__dirname, 'cloud-assembly-trees', 'experimental-module') })).toEqual([]);

      // construct-level match
      expect(NoticesFilter.filter({ data: [NOTICE_FOR_APIGATEWAYV2_CFN_STAGE], cliVersion, outDir: path.join(__dirname, 'cloud-assembly-trees', 'experimental-module') })).toEqual([NOTICE_FOR_APIGATEWAYV2_CFN_STAGE]);

    });

    test('bootstrap', () => {

      // doesn't matter for this test because our data only has bootstrap notices
      const outDir = path.join(__dirname, 'cloud-assembly-trees', 'built-with-2_12_0');
      const cliVersion = '1.0.0';

      expect(NoticesFilter.filter({ data: [BASIC_BOOTSTRAP_NOTICE], cliVersion, outDir, bootstrapVersion: 22 })).toEqual([BASIC_BOOTSTRAP_NOTICE]);

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
    const debugSpy = jest.spyOn(logging, 'debug');

    if (fs.existsSync('does-not-exist.json')) {
      fs.unlinkSync('does-not-exist.json');
    }

    const dataSource = dataSourceWithDelegateReturning(freshData, 'does-not-exist.json');

    const notices = await dataSource.fetch();

    expect(notices).toEqual(freshData);
    expect(debugSpy).not.toHaveBeenCalled();

    debugSpy.mockRestore();

    if (fs.existsSync('does-not-exist.json')) {
      fs.unlinkSync('does-not-exist.json');
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

    jest.clearAllMocks();
  });

  describe('shouldDisplay', () => {

    test('default is true', () => {
      expect(Notices.create({ configuration: new Configuration() }).shouldDisplay()).toBeTruthy();
    });

    test('is controlled by settings', () => {

      const settings: any = { notices: false };
      const configuration = new Configuration();
      (configuration.settings as any) = { get: (s_path: string[]) => settings[s_path[0]] };

      expect(Notices.create({ configuration }).shouldDisplay()).toBeFalsy();

    });
  });

  describe('bootstrapVersion', () => {

    test('can only be set to a single value', () => {

      const notices = Notices.create({ configuration: new Configuration() });
      expect(() => notices.bootstrapVersion = 10).not.toThrow();
      expect(() => notices.bootstrapVersion = 10).not.toThrow();
      expect(() => notices.bootstrapVersion = 11).toThrow(/Cannot change bootstrap version once set/);

    });

  });

  describe('refresh', () => {

    test('filters out acknowledged notices by default', async () => {

      // within the affected version range of both notices
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.126.0');

      const context: any = { 'acknowledged-issue-numbers': [MULTIPLE_AFFECTED_VERSIONS_NOTICE.issueNumber] };
      const configuration = new Configuration();
      (configuration.context as any) = { get: (key: string) => context[key] };

      const notices = Notices.create({ configuration });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenCalledWith(NoticesFormatter.format([BASIC_NOTICE]));
      expect(print).toHaveBeenCalledTimes(1);

    });

    test('preserves acknowledged notices if requested', async () => {

      // within the affected version range of both notices
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.126.0');

      const context: any = { 'acknowledged-issue-numbers': [MULTIPLE_AFFECTED_VERSIONS_NOTICE.issueNumber] };
      const configuration = new Configuration();
      (configuration.context as any) = { get: (key: string) => context[key] };

      const notices = Notices.create({ configuration, includeAcknowlegded: true });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenCalledWith(NoticesFormatter.format([BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE]));
      expect(print).toHaveBeenCalledTimes(1);

    });

  });

  describe('display', () => {

    test('nothing when there are no notices', async () => {

      const print = jest.spyOn(logging, 'print');

      Notices.create({ configuration: new Configuration() }).display();
      expect(print).toHaveBeenCalledWith('');
      expect(print).toHaveBeenCalledTimes(1);

    });

    test('total count when show total is true', async () => {

      const print = jest.spyOn(logging, 'print');

      Notices.create({ configuration: new Configuration() }).display({ showTotal: true });
      expect(print).toHaveBeenCalledWith('\n\nThere are 0 unacknowledged notice(s).');
      expect(print).toHaveBeenCalledTimes(1);

    });

    test('only relevant notices', async () => {

      // within the affected version range of the notice
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.0.0');

      const notices = Notices.create({ configuration: new Configuration() });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenCalledWith(NoticesFormatter.format([BASIC_NOTICE]));
      expect(print).toHaveBeenCalledTimes(1);

    });

    test('only unacknowledged notices', async () => {

      // within the affected version range of both notices
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.126.0');

      const context: any = { 'acknowledged-issue-numbers': [MULTIPLE_AFFECTED_VERSIONS_NOTICE.issueNumber] };
      const configuration = new Configuration();
      (configuration.context as any) = { get: (key: string) => context[key] };

      const notices = Notices.create({ configuration });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenCalledWith(NoticesFormatter.format([BASIC_NOTICE]));
      expect(print).toHaveBeenCalledTimes(1);

    });

    test('can include acknowledged notices if requested', async () => {

      // within the affected version range of both notices
      jest.spyOn(version, 'versionNumber').mockImplementation(() => '1.126.0');

      const context: any = { 'acknowledged-issue-numbers': [MULTIPLE_AFFECTED_VERSIONS_NOTICE.issueNumber] };
      const configuration = new Configuration();
      (configuration.context as any) = { get: (key: string) => context[key] };

      const notices = Notices.create({ configuration, includeAcknowlegded: true });
      await notices.refresh({
        dataSource: { fetch: async () => [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE] },
      });

      const print = jest.spyOn(logging, 'print');

      notices.display();
      expect(print).toHaveBeenCalledWith(NoticesFormatter.format([BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE]));
      expect(print).toHaveBeenCalledTimes(1);

    });

  });
});
