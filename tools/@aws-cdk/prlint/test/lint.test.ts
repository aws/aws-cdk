import * as path from 'path';
import * as linter from '../lint';

let mockRemoveLabel = jest.fn();
let mockAddLabel = jest.fn();

let mockListReviews = jest.fn().mockImplementation((_props: { _owner: string, _repo: string, _pull_number: number }) => {
  return { data: [{ id: 1111122222, user: { login: 'aws-cdk-automation' }, state: 'CHANGES_REQUESTED' }] };
});
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation();
  process.env.REPO_ROOT = path.join(__dirname, '..', '..', '..', '..');
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  process.env.REPO_ROOT = undefined;
  jest.resetAllMocks();
});

let mockCreateReview: (errorMessage: string) => Promise<any>;
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
    const issue: Subset<linter.GitHubPr> = {
      number: 1,
      title: 'chore: some title',
      body: 'BREAKING CHANGES:',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow(/'BREAKING CHANGE: ', variations are not allowed/);
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
    await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow(/description of the first breaking change should immediately follow/);
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
    await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow(/The title of this pull request must specify the module name that the first breaking change should be associated to./);
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
    expect(await prLinter.validatePullRequestTarget(SHA)).resolves; // not throw
  });
});

test('disallow PRs from main branch of fork', async () => {
  const issue: Subset<linter.GitHubPr> = {
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
  await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow(/Pull requests from `main` branch of a fork cannot be accepted. Please reopen this contribution from another branch on your fork./);
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
    expect(await prLinter.validatePullRequestTarget(SHA)).resolves;
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
    await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow(/The title of the pull request should omit 'aws-' from the name of modified packages. Use 's3' instead of 'aws-s3'./);
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
    expect(await prLinter.validatePullRequestTarget(SHA)).resolves;
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
    expect(await prLinter.validatePullRequestTarget(SHA)).resolves;
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
    expect(await prLinter.validatePullRequestTarget(SHA)).resolves;
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
    expect(await prLinter.validatePullRequestTarget(SHA)).resolves;
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
    await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow('Breaking changes in stable modules [s3] is disallowed.');
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
    await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow('Breaking changes in stable modules [lambda, ecs] is disallowed.');
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
    expect(await prLinter.validatePullRequestTarget(SHA)).resolves; // not throw
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
    await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow('Breaking changes in stable modules [s3] is disallowed.');
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
    expect(await prLinter.validatePullRequestTarget(SHA)).resolves;
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
    await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow(
      'The pull request linter fails with the following errors:' +
      '\n\n\t❌ Features must contain a change to an integration test file and the resulting snapshot.' +
      '\n\n<b>PRs must pass status checks before we can provide a meaningful review.</b>\n\n' +
      'If you would like to request an exemption from the status checks or clarification on feedback,' +
      ' please leave a comment on this PR containing `Exemption Request` and/or `Clarification Request`.',
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
    await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow(
      'The pull request linter fails with the following errors:' +
      '\n\n\t❌ Features must contain a change to an integration test file and the resulting snapshot.' +
      '\n\n<b>PRs must pass status checks before we can provide a meaningful review.</b>\n\n' +
      'If you would like to request an exemption from the status checks or clarification on feedback,' +
      ' please leave a comment on this PR containing `Exemption Request` and/or `Clarification Request`.',
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
    await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow(
      'The pull request linter fails with the following errors:' +
      '\n\n\t❌ Fixes must contain a change to an integration test file and the resulting snapshot.' +
      '\n\n<b>PRs must pass status checks before we can provide a meaningful review.</b>\n\n' +
      'If you would like to request an exemption from the status checks or clarification on feedback,' +
      ' please leave a comment on this PR containing `Exemption Request` and/or `Clarification Request`.',
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
    await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow(
      'The pull request linter fails with the following errors:' +
      '\n\n\t❌ Fixes must contain a change to an integration test file and the resulting snapshot.' +
      '\n\n<b>PRs must pass status checks before we can provide a meaningful review.</b>\n\n' +
      'If you would like to request an exemption from the status checks or clarification on feedback,' +
      ' please leave a comment on this PR containing `Exemption Request` and/or `Clarification Request`.',
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
    expect(await prLinter.validatePullRequestTarget(SHA)).resolves;
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
    expect(await prlinter.validatePullRequestTarget(SHA)).resolves;
  });

  describe('CLI file changed', () => {
    const labels: linter.GitHubLabel[] = [];
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
      await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow(/CLI code has changed. A maintainer must/);
    });

    test('with label no error', async () => {
      labels.push({ name: 'pr-linter/cli-integ-tested' });
      const prLinter = configureMock(issue, files);
      await prLinter.validatePullRequestTarget(SHA);
      // THEN: no exception
    });

    test('with aws-cdk-automation author', async () => {
      // GIVEN: Remove exemption
      labels.pop();
      // Verify no labels added
      expect(labels).toEqual([]);
      issue.user.login = 'aws-cdk-automation';

      // WHEN
      const prLinter = configureMock(issue, files);
      await prLinter.validatePullRequestTarget(SHA);
      // THEN: no exception
    });
  });

  describe('assess needs review from status event', () => {
    const pr = {
      draft: false,
      mergeable_state: 'behind',
      number: 1234,
      labels: [{ name: 'p2' }],
    };
    beforeEach(() => {
      mockListReviews.mockImplementation(() => {
        return {
          data: [{ id: 1111122222, user: { login: 'aws-cdk-automation' }, state: 'DISMISSED' }],
        };
      });
    });

    test('needs a review', async () => {
      // WHEN
      const prLinter = configureMock(pr);
      await prLinter.validateStatusEvent(pr as any, {
        sha: SHA,
        context: linter.CODE_BUILD_CONTEXT,
        state: 'success',
      } as any);

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
      const prLinter = configureMock(pr);
      await prLinter.validateStatusEvent(pr as any, {
        sha: SHA,
        context: linter.CODE_BUILD_CONTEXT,
        state: 'success',
      } as any);

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
      const prLinter = configureMock(pr);
      await prLinter.validateStatusEvent(pr as any, {
        sha: SHA,
        context: linter.CODE_BUILD_CONTEXT,
        state: 'success',
      } as any);

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
      const prLinter = configureMock(pr);
      await prLinter.validateStatusEvent(pr as any, {
        sha: SHA,
        context: linter.CODE_BUILD_CONTEXT,
        state: 'success',
      } as any);

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
            { id: 1111122222, user: { login: 'aws-cdk-automation' }, state: 'CHANGES_REQUESTED' },
            { id: 1111122223, user: { login: 'someuser' }, author_association: 'MEMBER', state: 'CHANGES_REQUESTED' },
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
      const prLinter = configureMock(pr);
      await prLinter.validateStatusEvent(pr as any, {
        sha: SHA,
        context: linter.CODE_BUILD_CONTEXT,
        state: 'success',
      } as any);

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
      const prLinter = configureMock(pr);
      await prLinter.validateStatusEvent(pr as any, {
        sha: SHA,
        context: linter.CODE_BUILD_CONTEXT,
        state: 'success',
      } as any);

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
            { id: 1111122223, user: { login: 'pahud' }, state: 'APPROVED' },
          ],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr);
      await prLinter.validateStatusEvent(pr as any, {
        sha: SHA,
        context: linter.CODE_BUILD_CONTEXT,
        state: 'success',
      } as any);

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
            { id: 1111122223, user: { login: 'pahud' }, state: 'COMMENTED' },
            { id: 1111122223, user: { login: 'pahud' }, state: 'APPROVED' },
          ],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr);
      await prLinter.validateStatusEvent(pr as any, {
        sha: SHA,
        context: linter.CODE_BUILD_CONTEXT,
        state: 'success',
      } as any);

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

    test('trusted community member can "request changes" on p2 PR by commenting', async () => {
      // GIVEN
      mockListReviews.mockImplementation(() => {
        return {
          data: [
            { id: 1111122223, user: { login: 'pahud' }, state: 'COMMENTED' },
          ],
        };
      });
      (pr as any).labels = [
        {
          name: 'pr/needs-community-review',
        },
      ];

      // WHEN
      const prLinter = configureMock(pr);
      await prLinter.validateStatusEvent(pr as any, {
        sha: SHA,
        context: linter.CODE_BUILD_CONTEXT,
        state: 'success',
      } as any);

      // THEN
      expect(mockRemoveLabel.mock.calls[0][0]).toEqual({
        issue_number: 1234,
        name: 'pr/needs-community-review',
        owner: 'aws',
        repo: 'aws-cdk',
      });
      expect(mockAddLabel.mock.calls).toEqual([]);
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
      const prLinter = configureMock(pr);
      await prLinter.validateStatusEvent(pr as any, {
        sha: SHA,
        context: linter.CODE_BUILD_CONTEXT,
        state: 'success',
      } as any);

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
      await expect(prLinter.validatePullRequestTarget(SHA)).rejects.toThrow();

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
});

function configureMock(pr: Subset<linter.GitHubPr>, prFiles?: linter.GitHubFile[]): linter.PullRequestLinter {
  const pullsClient = {
    get(_props: { _owner: string, _repo: string, _pull_number: number, _user: { _login: string} }) {
      return { data: pr };
    },

    listFiles(_props: { _owner: string, _repo: string, _pull_number: number }) {
      return { data: prFiles ?? [] };
    },

    createReview(errorMessage: string) {
      return {
        promise: () => mockCreateReview(errorMessage),
      };
    },

    listReviews: mockListReviews,

    dismissReview() {},

    update() {},
  };

  const issuesClient = {
    createComment() {},

    deleteComment() {},

    listComments() {
      return { data: [{ id: 1212121212, user: { login: 'aws-cdk-automation' }, body: 'The pull request linter fails with the following errors:' }] };
    },

    removeLabel: mockRemoveLabel,
    addLabels: mockAddLabel,
  };

  const reposClient = {
    listCommitStatusesForRef() {
      return {
        data: [{
          context: linter.CODE_BUILD_CONTEXT,
          state: 'success',
        }],
      };
    },
  };

  const searchClient = {
    issuesAndPullRequests() {},
  };
  return new linter.PullRequestLinter({
    owner: 'aws',
    repo: 'aws-cdk',
    number: 1000,

    // hax hax
    client: {
      pulls: pullsClient as any,
      issues: issuesClient as any,
      search: searchClient as any,
      repos: reposClient as any,
      paginate: (method: any, args: any) => { return method(args).data; },
    } as any,
  });
}
