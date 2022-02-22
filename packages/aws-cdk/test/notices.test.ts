import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as nock from 'nock';
import {
  CachedDataSource,
  filterNotices,
  formatNotices,
  generateMessage,
  Notice,
  WebsiteNoticeDataSource,
} from '../lib/notices';
import * as version from '../lib/version';

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

describe('cli notices', () => {
  beforeAll(() => {
    jest
      .spyOn(version, 'versionNumber')
      .mockImplementation(() => '1.0.0');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe(formatNotices, () => {
    test('correct format', () => {
      const result = formatNotices([BASIC_NOTICE])[0];
      expect(result).toEqual(`16603	Toggling off auto_delete_objects for Bucket empties the bucket

	Overview: If a stack is deployed with an S3 bucket with
	          auto_delete_objects=True, and then re-deployed with
	          auto_delete_objects=False, all the objects in the bucket
	          will be deleted.

	Affected versions: cli: <=1.126.0

	More information at: https://github.com/aws/aws-cdk/issues/16603
`);
    });

    test('multiple affect versions', () => {
      const result = formatNotices([MULTIPLE_AFFECTED_VERSIONS_NOTICE])[0];
      expect(result).toEqual(`17061	Error when building EKS cluster with monocdk import

	Overview: When using monocdk/aws-eks to build a stack containing an
	          EKS cluster, error is thrown about missing
	          lambda-layer-node-proxy-agent/layer/package.json.

	Affected versions: cli: <1.130.0 >=1.126.0

	More information at: https://github.com/aws/aws-cdk/issues/17061
`);
    });
  });

  describe(filterNotices, () => {
    test('correctly filter notices on cli', () => {
      const notices = [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE];
      expect(filterNotices(notices, {
        cliVersion: '1.0.0',
      })).toEqual([BASIC_NOTICE]);

      expect(filterNotices(notices, {
        cliVersion: '1.129.0',
      })).toEqual([MULTIPLE_AFFECTED_VERSIONS_NOTICE]);

      expect(filterNotices(notices, {
        cliVersion: '1.126.0',
      })).toEqual(notices);

      expect(filterNotices(notices, {
        cliVersion: '1.130.0',
      })).toEqual([]);
    });

    test('correctly filter notices on framework', () => {
      const notices = [FRAMEWORK_2_1_0_AFFECTED_NOTICE];

      expect(filterNotices(notices, {
        outdir: path.join(__dirname, 'cloud-assembly-trees/built-with-2_12_0'),
      })).toEqual([]);

      expect(filterNotices(notices, {
        outdir: path.join(__dirname, 'cloud-assembly-trees/built-with-1_144_0'),
      })).toEqual([FRAMEWORK_2_1_0_AFFECTED_NOTICE]);
    });

    test('correctly filter notices on arbitrary modules', () => {
      const notices = [NOTICE_FOR_APIGATEWAYV2];

      // module-level match
      expect(filterNotices(notices, {
        outdir: path.join(__dirname, 'cloud-assembly-trees/experimental-module'),
      })).toEqual([NOTICE_FOR_APIGATEWAYV2]);

      // no apigatewayv2 in the tree
      expect(filterNotices(notices, {
        outdir: path.join(__dirname, 'cloud-assembly-trees/built-with-2_12_0'),
      })).toEqual([]);

      // module name mismatch: apigateway != apigatewayv2
      expect(filterNotices([NOTICE_FOR_APIGATEWAY], {
        outdir: path.join(__dirname, 'cloud-assembly-trees/experimental-module'),
      })).toEqual([]);

      // construct-level match
      expect(filterNotices([NOTICE_FOR_APIGATEWAYV2_CFN_STAGE], {
        outdir: path.join(__dirname, 'cloud-assembly-trees/experimental-module'),
      })).toEqual([NOTICE_FOR_APIGATEWAYV2_CFN_STAGE]);
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

    test('returns empty array when the server returns an unexpected status code', async () => {
      const result = await mockCall(500, {
        notices: [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE],
      });

      expect(result).toEqual([]);
    });

    test('returns empty array when the server returns an unexpected structure', async () => {
      const result = await mockCall(200, {
        foo: [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE],
      });

      expect(result).toEqual([]);
    });

    test('returns empty array when the server returns invalid json', async () => {
      const result = await mockCall(200, '-09aiskjkj838');

      expect(result).toEqual([]);
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
      const nonExistingFile = path.join(os.tmpdir(), 'cache.json');
      const dataSource = dataSourceWithDelegateReturning(freshData, nonExistingFile);

      const notices = await dataSource.fetch();

      expect(notices).toEqual(freshData);
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

    function dataSourceWithDelegateReturning(notices: Notice[], file: string = fileName, ignoreCache: boolean = false) {
      const delegate = {
        fetch: jest.fn(),
      };

      delegate.fetch.mockResolvedValue(notices);
      return new CachedDataSource(file, delegate, ignoreCache);
    }
  });

  describe(generateMessage, () => {
    test('does not show anything when there are no notices', async () => {
      const dataSource = createDataSource();
      dataSource.fetch.mockResolvedValue([]);

      const result = await generateMessage(dataSource, {
        acknowledgedIssueNumbers: [],
        outdir: '/tmp',
      });

      expect(result).toEqual('');
    });

    test('shows notices that pass the filter', async () => {
      const dataSource = createDataSource();
      dataSource.fetch.mockResolvedValue([BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE]);

      const result = await generateMessage(dataSource, {
        acknowledgedIssueNumbers: [17061],
        outdir: '/tmp',
      });

      expect(result).toEqual(`
NOTICES

16603	Toggling off auto_delete_objects for Bucket empties the bucket

	Overview: If a stack is deployed with an S3 bucket with
	          auto_delete_objects=True, and then re-deployed with
	          auto_delete_objects=False, all the objects in the bucket
	          will be deleted.

	Affected versions: cli: <=1.126.0

	More information at: https://github.com/aws/aws-cdk/issues/16603


If you don’t want to see a notice anymore, use "cdk acknowledge <id>". For example, "cdk acknowledge 16603".`);
    });

    function createDataSource() {
      return {
        fetch: jest.fn(),
      };
    }
  });
});
