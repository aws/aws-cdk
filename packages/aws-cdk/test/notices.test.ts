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

describe('cli notices', () => {
  describe(formatNotices, () => {
    test('correct format', () => {
      expect(formatNotices([BASIC_NOTICE])).toEqual([
        [
          `${BASIC_NOTICE.issueNumber}\t${BASIC_NOTICE.title}`,
          `\tOverview: ${BASIC_NOTICE.overview}`,
          '\tAffected versions: cli: <=1.126.0',
          `\tMore information at: https://github.com/aws/aws-cdk/issues/${BASIC_NOTICE.issueNumber}`,
        ].join('\n\n'),
      ]);
    });

    test('multiple affect versions', () => {
      expect(formatNotices([MULTIPLE_AFFECTED_VERSIONS_NOTICE])).toEqual([
        [
          `${MULTIPLE_AFFECTED_VERSIONS_NOTICE.issueNumber}\t${MULTIPLE_AFFECTED_VERSIONS_NOTICE.title}`,
          `\tOverview: ${MULTIPLE_AFFECTED_VERSIONS_NOTICE.overview}`,
          '\tAffected versions: cli: <1.130.0 >=1.126.0',
          `\tMore information at: https://github.com/aws/aws-cdk/issues/${MULTIPLE_AFFECTED_VERSIONS_NOTICE.issueNumber}`,
        ].join('\n\n'),
      ]);
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
        frameworkVersion: '2.0.0',
      })).toEqual([FRAMEWORK_2_1_0_AFFECTED_NOTICE]);

      expect(filterNotices(notices, {
        frameworkVersion: '2.2.0',
      })).toEqual([]);

      expect(filterNotices(notices, {
        outdir: path.join(__dirname, 'cloud-assembly-trees/built-with-2_12_0'),
      })).toEqual([]);

      expect(filterNotices(notices, {
        outdir: path.join(__dirname, 'cloud-assembly-trees/built-with-1_144_0'),
      })).toEqual([FRAMEWORK_2_1_0_AFFECTED_NOTICE]);
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
      const print = jest.fn();
      dataSource.fetch.mockResolvedValue([]);

      await generateMessage(dataSource, {
        temporarilySuppressed: false,
        permanentlySuppressed: false,
        acknowledgedIssueNumbers: [],
        outdir: '/tmp',
      }, print);

      expect(print).not.toHaveBeenCalled();
    });

    test('does not show anything when no notices pass the filter', async () => {
      const dataSource = createDataSource();
      const print = jest.fn();
      dataSource.fetch.mockResolvedValue([BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE]);

      await generateMessage(dataSource, {
        temporarilySuppressed: true,
        permanentlySuppressed: false,
        acknowledgedIssueNumbers: [],
        outdir: '/tmp',
      }, print);

      expect(print).not.toHaveBeenCalled();
    });

    test('shows notices that pass the filter', async () => {
      const dataSource = createDataSource();
      const print = jest.fn();
      dataSource.fetch.mockResolvedValue([BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE]);

      await generateMessage(dataSource, {
        temporarilySuppressed: false,
        permanentlySuppressed: false,
        acknowledgedIssueNumbers: [17061],
        outdir: '/tmp',
      }, print);

      expect(print).toHaveBeenCalledTimes(1);
      expect(print).toHaveBeenCalledWith(`
NOTICES

16603\tToggling off auto_delete_objects for Bucket empties the bucket

\tOverview: If a stack is deployed with an S3 bucket with auto_delete_objects=True, and then re-deployed with auto_delete_objects=False, all the objects in the bucket will be deleted.

\tAffected versions: cli: <=1.126.0

\tMore information at: https://github.com/aws/aws-cdk/issues/16603

If you don’t want to see a notice anymore, use "cdk acknowledge <id>". For example, "cdk acknowledge 16603".`);
    });

    function createDataSource() {
      return {
        fetch: jest.fn(),
      };
    }
  });
});
