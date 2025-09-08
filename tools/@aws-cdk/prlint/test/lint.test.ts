import * as path from 'path';
import { GitHubFile, GitHubLabel, GitHubPr } from '../github';
import { CODECOV_CHECKS } from '../constants';
import { PullRequestLinter } from '../lint';
import { createOctomock, OctoMock } from './octomock';

type GitHubFileName = Omit<GitHubFile, 'deletions' | 'additions'>;

let mockRemoveLabel = jest.fn();
let mockAddLabel = jest.fn();

let mockListReviews = jest.fn().mockImplementation((_props: { _owner: string, _repo: string, _pull_number: number }) => {
  return { data: [{ id: 1111122222, user: { login: 'aws-cdk-automation' }, state: 'CHANGES_REQUESTED' }] };
});

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation();
  jest.spyOn(PullRequestLinter.prototype as any, 'getTrustedCommunityMembers').mockImplementation(() => ['trusted1', 'trusted2', 'trusted3'])
  process.env.REPO_ROOT = path.join(__dirname, '..', '..', '..', '..');
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  process.env.REPO_ROOT = undefined;
  jest.resetAllMocks();
});

let mockCreateReview: (errorMessage: string) => Promise<any> = jest.fn();
const SHA = 'ABC';

type Subset<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? Subset<K[attr]>
    : K[attr] extends object | null
      ? Subset<K[attr]> | null
      : K[attr] extends object | null | undefined
        ? Subset<K[attr]> | null | undefined
        : K[attr];
};

describe('breaking changes format', () => {
  test('disallow variations to "BREAKING CHANGE:"', async () => {
    const issue: Subset<GitHubPr> = {
      number: 1,
      title: 'chore: some title',
      body: 'BREAKING CHANGES:',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(/'BREAKING CHANGE: ', variations are not allowed/);
  });

  test('the first breaking change should immediately follow "BREAKING CHANGE:"', async () => {
    const issue = {
      number: 1,
      title: 'chore(cdk-build-tools): some title',
      body: `BREAKING CHANGE:\x20
             * **module:** another change`,
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(/description of the first breaking change should immediately follow/);
  });

  test('invalid title', async () => {
    const issue = {
      number: 1,
      title: 'chore(): some title',
      body: 'BREAKING CHANGE: this breaking change',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(/The title of this pull request must specify the module name that the first breaking change should be associated to./);
  });

  test('valid title', async () => {
    const issue = {
      number: 1,
      title: 'chore(cdk-build-tools): some title',
      body: 'BREAKING CHANGE: this breaking change',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    expect(legacyValidatePullRequestTarget(await prLinter)).resolves; // not throw
  });
});

test('disallow PRs from main branch of fork', async () => {
  const issue: Subset<GitHubPr> = {
    number: 1,
    title: 'chore: some title',
    body: 'making a pr from main of my fork',
    labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }],
    user: {
      login: 'author',
    },
    head: {
      label: 'author:main',
      ref: 'main'
    }
  };
  const prLinter = configureMock(issue, undefined);
  await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(/Pull requests from `main` branch of a fork cannot be accepted. Please reopen this contribution from another branch on your fork./);
});

describe('commit message format', () => {
  test('valid scope', async () => {
    const issue = {
      number: 1,
      title: 'chore(s3): some title',
      body: '',
      labels: [],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    expect(legacyValidatePullRequestTarget(await prLinter)).resolves;
  });

  test('invalid scope with aws- prefix', async () => {
    const issue = {
      number: 1,
      title: 'fix(aws-s3): some title',
      body: '',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-integ-test' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(/The title scope of the pull request should omit 'aws-' from the name of modified packages. Use 's3' instead of 'aws-s3'./);
  });

  test('invalid scope with capital letters', async () => {
    const issue = {
      number: 1,
      title: 'fix(S3): some title',
      body: '',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-integ-test' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(prLinter.validatePullRequestTarget()).resolves.toEqual(expect.objectContaining({
      requestChanges: expect.objectContaining({
        failures: ["The title scope of the pull request should be entirely in lowercase. Use 's3' instead."],
      }),
    }));
  });

  test('valid scope with aws- in summary and body', async () => {
    const issue = {
      number: 1,
      title: 'docs(s3): something aws-s3',
      body: 'something aws-s3',
      labels: [],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    expect(legacyValidatePullRequestTarget(await prLinter)).resolves;
  });

  test('valid with missing scope', async () => {
    const issue = {
      number: 1,
      title: 'docs: something aws-s3',
      body: '',
      labels: [],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    expect(legacyValidatePullRequestTarget(await prLinter)).resolves;
  });

  test('valid with aws-cdk-lib as a scope', async () => {
    const issue = {
      number: 1,
      title: 'fix(aws-cdk-lib): some title',
      body: '',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-integ-test' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    expect(legacyValidatePullRequestTarget(await prLinter)).resolves;
  });

  test.each(['core', 'prlint', 'awslint'])('valid scope for packages that dont use aws- prefix', async (scope) => {
    const issue = {
      number: 1,
      title: `chore(${scope}): some title`,
      body: '',
      labels: [],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    expect(legacyValidatePullRequestTarget(await prLinter)).resolves;
  });

  test('invalid with capital letters in prefix', async () => {
    const issue = {
      number: 1,
      title: 'Revert(s3): some title',
      body: '',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-integ-test' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(prLinter.validatePullRequestTarget()).resolves.toEqual(expect.objectContaining({
      requestChanges: expect.objectContaining({
        failures: ['The title prefix of this pull request must be one of "feat|fix|build|chore|ci|docs|style|refactor|perf|test|revert"'],
      }),
    }));
  });

  test('invalid capitalized title', async () => {
    const issue = {
      number: 1,
      title: 'fix(aws-cdk-lib): Some title',
      body: '',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-integ-test' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(/The first word of the pull request title should not be capitalized. If the title starts with a CDK construct, it should be in backticks "``"/);
  });

  test('valid capitalized title with backticks', async () => {
    const issue = {
      number: 1,
      title: 'fix(aws-cdk-lib): `CfnConstruct`',
      body: '',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-integ-test' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    expect(legacyValidatePullRequestTarget(await prLinter)).resolves;
  });
});

describe('ban breaking changes in stable modules', () => {
  test('breaking change in stable module', async () => {
    const issue = {
      number: 1,
      title: 'chore(s3): some title',
      body: 'BREAKING CHANGE: this breaking change',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow('Breaking changes in stable modules [s3] is disallowed.');
  });

  test('breaking changes multiple in stable modules', async () => {
    const issue = {
      number: 1,
      title: 'chore(lambda): some title',
      body: `
        BREAKING CHANGE: this breaking change
        continued message
        * **ecs**: further breaking in ecs
      `,
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow('Breaking changes in stable modules [lambda, ecs] is disallowed.');
  });

  test('unless exempt-breaking-change label added', async () => {
    const issue = {
      number: 1,
      title: 'chore(lambda): some title',
      body: `
        BREAKING CHANGE: this breaking change
        continued message
      `,
      labels: [{ name: 'pr-linter/exempt-breaking-change' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    expect(legacyValidatePullRequestTarget(await prLinter)).resolves; // not throw
  });

  test('with additional "closes" footer', async () => {
    const issue = {
      number: 1,
      title: 'chore(s3): some title',
      body: `
        description of the commit

        closes #123456789

        BREAKING CHANGE: this breaking change
      `,
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow('Breaking changes in stable modules [s3] is disallowed.');
  });
});

describe('integration tests required on features', () => {
  test('integ files changed', async () => {
    const issue = {
      number: 1,
      title: 'feat(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: [],
      user: {
        login: 'author',
      },
    };
    const files = [
      {
        filename: 'integ.some-integ-test.ts',
      },
      {
        filename: 'test/some-integ-test.integ.snapshot/integ.some-test.expected.json',
      },
      {
        filename: 'README.md',
      },
    ];
    const prLinter = configureMock(issue, files);
    expect(legacyValidatePullRequestTarget(await prLinter)).resolves;
  });

  test('integ files not changed in feat', async () => {
    const issue = {
      number: 1,
      title: 'feat(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: [],
      user: {
        login: 'author',
      },
    };
    const files = [
      {
        filename: 'some-test.test.ts',
      },
      {
        filename: 'test/some-integ-test.integ.snapshot/integ.some-test.expected.json',
      },
      {
        filename: 'README.md',
      },
    ];
    const prLinter = configureMock(issue, files);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(
      'Features must contain a change to an integration test file and the resulting snapshot.'
    );
  });

  test('integ snapshots not changed in feat', async () => {
    const issue = {
      number: 1,
      title: 'feat(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: [],
      user: {
        login: 'author',
      },
    };
    const files = [
      {
        filename: 'some-test.test.ts',
      },
      {
        filename: 'integ.some-test.ts',
      },
      {
        filename: 'README.md',
      },
    ];
    const prLinter = configureMock(issue, files);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(
      'Features must contain a change to an integration test file and the resulting snapshot.'
    );
  });

  test('integ files not changed in fix', async () => {
    const issue = {
      number: 1,
      title: 'fix(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: [],
      user: {
        login: 'author',
      },
    };
    const files = [
      {
        filename: 'some-test.test.ts',
      },
      {
        filename: 'test/some-integ-test.integ.snapshot/integ.some-test.expected.json',
      },
      {
        filename: 'README.md',
      },
    ];
    const prLinter = configureMock(issue, files);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(
      'Fixes must contain a change to an integration test file and the resulting snapshot.'
    );
  });

  test('integ snapshots not changed in fix', async () => {
    const issue = {
      number: 1,
      title: 'fix(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: [],
      user: {
        login: 'author',
      },
    };
    const files = [
      {
        filename: 'some-test.test.ts',
      },
      {
        filename: 'integ.some-test.ts',
      },
      {
        filename: 'README.md',
      },
    ];
    const prLinter = configureMock(issue, files);
    await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(
      'Fixes must contain a change to an integration test file and the resulting snapshot.'
    );
  });

  test('integ files not changed, pr exempt', async () => {
    const issue = {
      number: 1,
      title: 'feat(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: [{ name: 'pr-linter/exempt-integ-test' }],
      user: {
        login: 'author',
      },
    };
    const files = [
      {
        filename: 'some-test.test.ts',
      },
      {
        filename: 'README.md',
      },
    ];
    const prLinter = configureMock(issue, files);
    expect(legacyValidatePullRequestTarget(await prLinter)).resolves;
  });

  test('integ files not changed, not a feature', async () => {
    const issue = {
      number: 1,
      title: 'chore(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: [],
      user: {
        login: 'author',
      },
    };
    const files = [
      {
        filename: 'some-test.test.ts',
      },
      {
        filename: 'readme.md',
      },
    ];
    const prlinter = configureMock(issue, files);
    expect(legacyValidatePullRequestTarget(await prlinter)).resolves;
  });

  describe('CLI file changed', () => {
    const labels: GitHubLabel[] = [];
    const issue = {
      number: 23,
      title: 'chore(cli): change the help or something',
      body: `
        description of the commit
        closes #123456789
      `,
      labels,
      user: {
        login: 'author',
      },
    };
    const files = [{ filename: 'packages/aws-cdk/lib/cdk-toolkit.ts' }];

    test('no label throws error', async () => {
      const prLinter = configureMock(issue, files);
      await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(/CLI code has changed. A maintainer must/);
    });

    test('with label no error', async () => {
      labels.push({ name: 'pr-linter/cli-integ-tested' });
      const prLinter = configureMock(issue, files);
      // THEN: no exception
      await legacyValidatePullRequestTarget(prLinter);
    });

    test('with aws-cdk-automation author', async () => {
      // GIVEN: Remove exemption
      labels.pop();
      // Verify no labels added
      expect(labels).toEqual([]);
      issue.user.login = 'aws-cdk-automation';

      // WHEN
      const prLinter = configureMock(issue, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN: no exception
    });
  });

  describe('assess needs review', () => {
    const pr = {
      title: 'chore(s3): something',
      draft: false,
      mergeable_state: 'behind',
      number: 1234,
      labels: [{ name: 'p2' }],
    };
    const files = [
      {
        filename: 'some-test.test.ts',
      },
      {
        filename: 'readme.md',
      },
    ];
    beforeEach(() => {
      mockListReviews.mockImplementation(() => {
        return {
          data: [{ id: 1111122222, user: { login: 'aws-cdk-automation' }, state: 'DISMISSED' }],
        };
      });
    });

    test('needs a review', async () => {
      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockAddLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        labels: ['pr/needs-community-review'],
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockRemoveLabel.mock.calls).toEqual([]);
    });

    test('needs a review and is p1', async () => {
      // WHEN
      pr.labels = [{ name: 'p1' }];
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockAddLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        labels: ['pr/needs-maintainer-review'],
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockRemoveLabel.mock.calls).toEqual([]);
    });

    test('does not need a review because of request changes', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [{ id: 1111122222, user: { login: 'aws-cdk-automation' }, state: 'CHANGES_REQUESTED' }],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockRemoveLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        name: 'pr/needs-community-review',
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockAddLabel.mock.calls).toEqual([]);
    });

    test('needs a review because of exemption request', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [{ id: 1111122222, user: { login: 'aws-cdk-automation' }, state: 'CHANGES_REQUESTED' }],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr-linter/exemption-requested',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockAddLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        labels: ['pr/needs-community-review'],
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockRemoveLabel.mock.calls).toEqual([]);
    });

    test('does not need a review if member has requested changes', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122222, user: { login: 'aws-cdk-automation' }, state: 'CHANGES_REQUESTED', submitted_at: '2019-11-17T17:43:43Z'},
            { id: 1111122223, user: { login: 'someuser' }, author_association: 'MEMBER', state: 'CHANGES_REQUESTED', submitted_at: '2019-11-18T17:43:43Z' },
          ],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr-linter/exemption-requested',
        },
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockRemoveLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        name: 'pr/needs-community-review',
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockAddLabel.mock.calls).toEqual([]);
    });

    test('does not need a review if member has approved', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122223, user: { login: 'someuser' }, author_association: 'MEMBER', state: 'APPROVED' },
          ],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockRemoveLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        name: 'pr/needs-community-review',
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockAddLabel.mock.calls).toEqual([]);
    });

    test('needs a maintainer review if a community member has approved p2', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122223, user: { login: 'trusted1' }, state: 'APPROVED' },
          ],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockRemoveLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        name: 'pr/needs-community-review',
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockAddLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        labels: ['pr/needs-maintainer-review'],
        owner: 'aws',
        repo: 'aws-cdk',
      });
    });

    test('needs a maintainer review if a community member has approved p2, regardless of other community reviews', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122223, user: { login: 'trusted1' }, state: 'APPROVED', submitted_at: '2019-11-18T17:43:43Z' },
            { id: 1111122224, user: { login: 'trusted2' }, state: 'CHANGES_REQUESTED', submitted_at: '2019-11-17T18:43:43Z' },
            { id: 1111122225, user: { login: 'trusted3' }, state: 'COMMENTED', submitted_at: '2019-11-17T19:43:43Z' },
          ],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockRemoveLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        name: 'pr/needs-community-review',
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockAddLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        labels: ['pr/needs-maintainer-review'],
        owner: 'aws',
        repo: 'aws-cdk',
      });
    });

    test('trusted community member can "request changes" on p2 PR by requesting changes', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122223, user: { login: 'trusted1' }, state: 'CHANGES_REQUESTED', submitted_at: '2019-11-17T17:43:43Z' },
          ],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockRemoveLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        name: 'pr/needs-community-review',
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockAddLabel.mock.calls).toEqual([]);
    });

    test('trusted community member can comment after requesting changes without dismissing', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122223, user: { login: 'trusted1' }, state: 'CHANGES_REQUESTED', submitted_at: '2019-11-17T17:43:43Z' },
            { id: 1111122224, user: { login: 'trusted1' }, state: 'COMMENTED', submitted_at: '2019-11-18T17:43:43Z' },
          ],
        };
      });
      (pr as any).labels = [];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockRemoveLabel.mock.calls).toEqual([]);
      expect(mockAddLabel.mock.calls).toEqual([]);
    });

    test('trusted community member comments dont mark as "changes requested"', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122223, user: { login: 'trusted1' }, state: 'COMMENTED', submitted_at: '2019-11-17T17:43:43Z' },
          ],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockRemoveLabel.mock.calls).toEqual([]);
      expect(mockAddLabel.mock.calls).toEqual([]);
    });

    test('trusted community members can change own review from approval to requesting changes',  async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122223, user: { login: 'trusted1' }, state: 'APPROVED', submitted_at: '2019-11-17T17:43:43Z' },
            { id: 1111122224, user: { login: 'trusted1' }, state: 'CHANGES_REQUESTED', submitted_at: '2019-11-18T17:43:43Z' },
          ]
        }
      });
      (pr as any).labels = [
        {
          name: 'pr/needs-maintainer-review',
        }
      ];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockRemoveLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        name: 'pr/needs-maintainer-review',
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockAddLabel.mock.calls).toEqual([]);
    });

    test('trusted community members can change own review from requesting changes to approval', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122223, user: { login: 'trusted1' }, state: 'CHANGES_REQUESTED', submitted_at: '2019-11-17T17:43:43Z' },
            { id: 1111122224, user: { login: 'trusted1' }, state: 'APPROVED', submitted_at: '2019-11-18T17:43:43Z' },
          ]
        }
      });
      (pr as any).labels = [];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockRemoveLabel.mock.calls).toEqual([]);
      expect(mockAddLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        labels: ['pr/needs-maintainer-review'],
        owner: 'aws',
        repo: 'aws-cdk',
      });
    });

    test('untrusted community member approval has no affect', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122223, user: { login: 'untrusted' }, state: 'APPROVED' },
          ],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr, files);
      await legacyValidatePullRequestTarget(prLinter);

      // THEN
      expect(mockRemoveLabel.mock.calls).toEqual([]);
      expect(mockAddLabel.mock.calls).toEqual([]);
    });

    test('review happens even if linter fails', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122222, user: { login: 'aws-cdk-automation' }, state: 'CHANGES_REQUESTED' },
            { id: 1111122223, user: { login: 'someuser' }, author_association: 'MEMBER', state: 'CHANGES_REQUESTED' },
          ],
        };
      });
      (pr as any).title = 'blah';
      (pr as any).labels = [
        {
          name: 'pr-linter/exemption-requested',
        },
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr);
      await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow();

      // THEN
      expect(mockRemoveLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        name: 'pr/needs-community-review',
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockAddLabel.mock.calls).toEqual([]);
    });
  });

  describe('with existing Exemption Request comment', () => {
    const issue: Subset<GitHubPr> = {
      number: 1,
      title: 'fix: some title',
      body: '',
      labels: [{ name: 'pr-linter/exempt-test' }],
      user: {
        login: 'author',
      },
    };

    test('valid exemption request comment', async () => {
      const comments = [
        { id: 1234, login: 'author', body: 'Exemption Request' }
      ];

      const prLinter = configureMock(issue, undefined, comments);
      await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(
        'Fixes must contain a change to an integration test file and the resulting snapshot.'
      );
    });

    test('valid exemption request with additional context', async () => {
      const comments = [
        { id: 1234, login: 'author', body: 'Exemption Request: \nThe reason is blah blah blah.' }
      ];

      const prLinter = configureMock(issue, undefined, comments);
      await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(
        'Fixes must contain a change to an integration test file and the resulting snapshot.\n' +
        'A exemption request has been requested. Please wait for a maintainer\'s review.',
      );
    });

    test('valid exemption request with middle exemption request', async () => {
      const comments = [
        { id: 1234, login: 'author', body: 'Random content - Exemption Request - hello world' }
      ];

      const prLinter = configureMock(issue, undefined, comments);
      await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow(
        'Fixes must contain a change to an integration test file and the resulting snapshot.\n' +
        'A exemption request has been requested. Please wait for a maintainer\'s review.',
      );
    });

    test('exemption only counts if requested by PR author', async () => {
      const comments = [
        { id: 1234, login: 'bert', body: 'Random content - Exemption Request - hello world' }
      ];

      const prLinter = configureMock(issue, undefined, comments);
      await expect(prLinter.validatePullRequestTarget()).resolves.toEqual(expect.objectContaining({
        requestChanges: expect.objectContaining({
          exemptionRequest: false,
        }),
      }));
    });

    test('bot does not trigger on its own exemption requests', async () => {
      const comments = [
        { id: 1234, login: 'aws-cdk-automation', body: 'Random content - Exemption Request - hello world' }
      ];

      const prLinter = configureMock(issue, undefined, comments);
      await expect(prLinter.validatePullRequestTarget()).resolves.toEqual(expect.objectContaining({
        requestChanges: expect.objectContaining({
          exemptionRequest: false,
        }),
      }));
    });
  });

  describe('metadata file changed', () => {
    const files: GitHubFileName[] = [{
      filename: 'packages/aws-cdk-lib/region-info/build-tools/metadata.ts',
    }];

    test('with aws-cdk-automation author', async () => {
      const pr = {
        title: 'chore: update regions',
        number: 1234,
        labels: [],
        user: {
          login: 'aws-cdk-automation',
        },
      };

      const prLinter = configureMock(pr, files);
      await expect(legacyValidatePullRequestTarget(prLinter)).resolves;
    });

    test('with another author', async () => {
      const pr = {
        title: 'chore: update regions',
        number: 1234,
        labels: [],
        user: {
          login: 'johndoe',
        },
      };

      const prLinter = configureMock(pr, files);
      await expect(legacyValidatePullRequestTarget(prLinter)).rejects.toThrow();
    });
  });

  describe('PR size check', () => {
    const pr = {
      title: 'chore: update regions',
      number: 1234,
      labels: [],
      user: {
        login: 'aws-cdk-automation',
      },
    };

    test('PR too large', async () => {
      const files: GitHubFile[] = [{
        filename: 'packages/aws-cdk/foo.ts',
        additions: 1001,
        deletions: 1002,
      }];

      const prLinter = configureMock(pr, files);

      await expect(prLinter.validatePullRequestTarget()).resolves.toEqual(expect.objectContaining({
        requestChanges: {
          exemptionRequest: false,
          failures: [
            'The number of lines added (1001) is greater than 1000',
            'The number of lines removed (1002) is greater than 1000',
          ]
        }
      }));
    });

    test('PR size within bounds', async () => {
      const files: GitHubFile[] = [{
        filename: 'packages/aws-cdk/foo.ts',
        additions: 1000,
        deletions: 1000,
      }];

      const prLinter = configureMock(pr, files);

      await expect(prLinter.validatePullRequestTarget()).resolves.toEqual(expect.objectContaining({
        requestChanges: undefined,
      }));
    });

    test('PR exempt from size check', async () => {
      const files: GitHubFile[] = [{
        filename: 'packages/aws-cdk/foo.ts',
        additions: 2000,
        deletions: 111,
      }];

      const exemptPr = {
        ...pr,
        labels: [
          { name: 'pr-linter/exempt-size-check' },
        ],
      }

      const prLinter = configureMock(exemptPr, files);

      await expect(prLinter.validatePullRequestTarget()).resolves.toEqual(expect.objectContaining({
        requestChanges: undefined,
      }));
    });

    test('Only CLI is subject to verification', async () => {
      const files: GitHubFile[] = [{
        filename: 'packages/aws-cdk-lib/foo.ts',
        additions: 1001,
        deletions: 1002,
      }];

      const prLinter = configureMock(pr, files);

      await expect(prLinter.validatePullRequestTarget()).resolves.toEqual(expect.objectContaining({
        requestChanges: undefined
      }));
    });

    test('Tests are exempt', async () => {
      const files: GitHubFile[] = [{
        filename: 'packages/aws-cdk/test/bootstrap.test.ts',
        additions: 1001,
        deletions: 1002,
      }];

      const prLinter = configureMock(pr, files);

      await expect(prLinter.validatePullRequestTarget()).resolves.toEqual(expect.objectContaining({
        requestChanges: undefined
      }));
    });
  });
});

describe('for any PR', () => {
  const ARBITRARY_PR = {
    title: 'chore: update regions',
    number: 1234,
    labels: [],
    user: {
      login: 'johndoe',
    },
  };

  const ARBITRARY_FILES: GitHubFileName[] = [{
    filename: 'README.md',
  }];

  test('deletes old comments', async () => {
    const comments = [
      {
        id: 1111,
        login: 'aws-cdk-automation',
        body: 'The pull request linter is failing',
      },
      {
        id: 2222,
        login: 'aws-cdk-automation',
        body: 'More things about the pull request linter',
      },
    ];

    const prLinter = configureMock(ARBITRARY_PR, ARBITRARY_FILES, comments);

    await expect(prLinter.validatePullRequestTarget()).resolves.toEqual(expect.objectContaining({
      deleteComments: [
        // For some reason our configureMock always adds this at the top
        expect.objectContaining({ id: 1000 }),
        expect.objectContaining({ id: 1111 }),
        expect.objectContaining({ id: 2222 }),
      ],
    }));
  });

  test('missing CodeCov run does not lead to request changes', async () => {
    // Not ideal, but https://github.com/aws/aws-cdk/issues/33136
    // GIVEN
    const prLinter = configureMock(ARBITRARY_PR, ARBITRARY_FILES);
    prLinter.octomock.checks.listForRef.mockReturnValue({ data: [] });

    // WHEN
    const result = await prLinter.validatePullRequestTarget();

    // THEN
    expect(result.requestChanges).toBeUndefined();
  });

  test('failing CodeCov runs lead to a failure', async () => {
    // GIVEN
    const prLinter = configureMock(ARBITRARY_PR, ARBITRARY_FILES);
    prLinter.octomock.checks.listForRef.mockReturnValue({
      data: CODECOV_CHECKS.map((name, i) => ({
        name,
        // All are success except one
        conclusion: i == 0 ? 'failure' : 'success',
        started_at: '2020-01-01T00:00:00Z',
      })),
    });

    // WHEN
    const result = await prLinter.validatePullRequestTarget();

    // THEN
    expect(result.requestChanges?.failures).toContainEqual(
      expect.stringContaining('CodeCov is indicating a drop in code coverage'),
    );
  });
});

function configureMock(pr: Subset<GitHubPr>, prFiles?: GitHubFileName[], existingComments?: Array<{ id: number, login: string, body: string }>): PullRequestLinter & { octomock: OctoMock } {
  const octomock = createOctomock();

  octomock.pulls.get.mockImplementation((_props: { _owner: string, _repo: string, _pull_number: number, _user: { _login: string} }) => ({
    data: { ...pr, base: { ref: 'main', ...pr?.base }, head: { sha: 'ABC', ...pr?.head }},
  }));
  octomock.pulls.listFiles.mockImplementation((_props: { _owner: string, _repo: string, _pull_number: number }) => ({
    data: prFiles ?? [],
  }));
  octomock.pulls.createReview.mockImplementation((errorMessage) => {
    return {
      promise: () => mockCreateReview(errorMessage),
    };
  });
  octomock.pulls.listReviews = mockListReviews;
  octomock.issues.listComments.mockImplementation(() => {
    const data = [{ id: 1000, user: { login: 'aws-cdk-automation' }, body: 'The pull request linter fails with the following errors:' }];
    if (existingComments) {
      existingComments.forEach(comment => data.push({ id: comment.id, user: { login: comment.login }, body: comment.body }));
    }
    return { data };
  });
  octomock.issues.addLabels = mockAddLabel;
  octomock.issues.removeLabel = mockRemoveLabel;

  // We need to pretend that all CodeCov checks are passing by default, otherwise
  // the linter will complain about these even in tests that aren't testing for this.
  octomock.checks.listForRef.mockImplementation(() => ({
    data: CODECOV_CHECKS.map(name => ({
      name,
      conclusion: 'success',
      started_at: '2020-01-01T00:00:00Z',
    })),
  }));

  // Mock workflow runs to simulate successful CodeBuild jobs
  octomock.actions.listWorkflowRuns.mockImplementation(() => ({
    data: {
      workflow_runs: [
        {
          head_sha: SHA,
          status: 'completed',
          conclusion: 'success',
        },
      ],
    },
  }));

  const linter = new PullRequestLinter({
    owner: 'aws',
    repo: 'aws-cdk',
    number: 1000,
    linterLogin: 'aws-cdk-automation',

    // hax hax
    client: octomock as any,
  });
  // Stick the octomock on the linter, that will be useful in tests
  (linter as any).octomock = octomock;
  return linter as any;
}

/**
 * Interface-compatible implementation of validatePullRequestTarget before the refactor
 *
 * Previously, one method did 3 things:
 *
 * - Evaluate rules
 * - Apply changes to the PR
 * - Throw an exception
 *
 * We pulled those things apart, but many tests are still expecting all things to happen together
 * so it's easier to bundle them back up into a legacy compat functin.
 *
 * This is just so we can mass-replace code in the tests and move on with our
 * lives. It's not recommended to write new code using this!
 *
 * @deprecated Assert on the contents of `LinterActions` instead.
 */
async function legacyValidatePullRequestTarget(prLinter: PullRequestLinter) {
  const actions = await prLinter.validatePullRequestTarget();
  await prLinter.executeActions(actions);
  prLinter.actionsToException(actions);
}
