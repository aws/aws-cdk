import * as nock from 'nock';
import { formatNotices, filterNotices, WebsiteNoticeDataSource } from '../lib/notices';

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
      // TODO
    });
  });

  describe(WebsiteNoticeDataSource, () => {
    const dataSource = new WebsiteNoticeDataSource();

    test('returns data when download succeeds', async () => {
      nock('https://cli.cdk.dev-tools.aws.dev')
        .get('/notices.json')
        .reply(200, {
          notices: [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE],
        });

      const result = await dataSource.fetch();

      expect(result).toEqual([BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE]);
    });

    test('returns empty array when the server returns an unexpected status code', async () => {
      nock('https://cli.cdk.dev-tools.aws.dev')
        .get('/notices.json')
        .reply(500, {
          notices: [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE],
        });

      const result = await dataSource.fetch();

      expect(result).toEqual([]);
    });

    test('returns empty array when the server returns an unexpected structure', async () => {
      nock('https://cli.cdk.dev-tools.aws.dev')
        .get('/notices.json')
        .reply(200, {
          foo: [BASIC_NOTICE, MULTIPLE_AFFECTED_VERSIONS_NOTICE],
        });

      const result = await dataSource.fetch();

      expect(result).toEqual([]);
    });

    test('returns empty array when the server returns invalid json', async () => {
      nock('https://cli.cdk.dev-tools.aws.dev')
        .get('/notices.json')
        .reply(200, '-09aiskjkj838');

      const result = await dataSource.fetch();

      expect(result).toEqual([]);
    });
  });
});
