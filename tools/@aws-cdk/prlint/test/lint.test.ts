import * as linter from '../lint';
import * as path from 'path';

beforeAll(() => {
  process.env.REPO_ROOT = path.join(__dirname, '..', '..', '..', '..');
});

afterAll(() => {
  process.env.REPO_ROOT = undefined;
});

let mockCreateReview: (errorMessage: string) => Promise<any>;

describe('breaking changes format', () => {
  test('disallow variations to "BREAKING CHANGE:"', async () => {
    const issue = {
      number: 1,
      title: 'chore: some title',
      body: 'BREAKING CHANGES:',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }],
      user: {
        login: 'author',
      },
    };
    const prLinter = configureMock(issue, undefined);
    await expect(prLinter.validate()).rejects.toThrow(/'BREAKING CHANGE: ', variations are not allowed/);
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
    await expect(prLinter.validate()).rejects.toThrow(/description of the first breaking change should immediately follow/);
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
    await expect(prLinter.validate()).rejects.toThrow(/The title of this pull request must specify the module name that the first breaking change should be associated to./);
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
    expect(await prLinter.validate()).resolves; // not throw
  });
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
    expect(await prLinter.validate()).resolves;
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
    await expect(prLinter.validate()).rejects.toThrow(/The title of the pull request should omit 'aws-' from the name of modified packages. Use 's3' instead of 'aws-s3'./);
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
    expect(await prLinter.validate()).resolves;
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
    expect(await prLinter.validate()).resolves;
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
    expect(await prLinter.validate()).resolves;
  })
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
    await expect(prLinter.validate()).rejects.toThrow('Breaking changes in stable modules [s3] is disallowed.');
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
    await expect(prLinter.validate()).rejects.toThrow('Breaking changes in stable modules [lambda, ecs] is disallowed.');
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
    expect(await prLinter.validate()).resolves; // not throw
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
    await expect(prLinter.validate()).rejects.toThrow('Breaking changes in stable modules [s3] is disallowed.');
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
        filename: 'integ.some-integ-test.ts'
      },
      {
        filename: 'test/some-integ-test.integ.snapshot/integ.some-test.expected.json'
      },
      {
        filename: 'README.md'
      }
    ];
    const prLinter = configureMock(issue, files);
    expect(await prLinter.validate()).resolves;
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
        filename: 'some-test.test.ts'
      },
      {
        filename: 'test/some-integ-test.integ.snapshot/integ.some-test.expected.json'
      },
      {
        filename: 'README.md'
      }
    ];
    const prLinter = configureMock(issue, files);
    await expect(prLinter.validate()).rejects.toThrow(
      'The pull request linter fails with the following errors:' +
      '\n\n\t❌ Features must contain a change to an integration test file and the resulting snapshot.' +
      '\n\n<b>PRs must pass status checks before we can provide a meaningful review.</b>\n\n' +
      'If you would like to request an exemption from the status checks or clarification on feedback,' +
      ' please leave a comment on this PR containing `Exemption Request` and/or `Clarification Request`.'
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
        filename: 'some-test.test.ts'
      },
      {
        filename: 'integ.some-test.ts'
      },
      {
        filename: 'README.md'
      }
    ];
    const prLinter = configureMock(issue, files);
    await expect(prLinter.validate()).rejects.toThrow(
      'The pull request linter fails with the following errors:' +
      '\n\n\t❌ Features must contain a change to an integration test file and the resulting snapshot.' +
      '\n\n<b>PRs must pass status checks before we can provide a meaningful review.</b>\n\n' +
      'If you would like to request an exemption from the status checks or clarification on feedback,' +
      ' please leave a comment on this PR containing `Exemption Request` and/or `Clarification Request`.'
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
        filename: 'some-test.test.ts'
      },
      {
        filename: 'test/some-integ-test.integ.snapshot/integ.some-test.expected.json'
      },
      {
        filename: 'README.md'
      }
    ];
    const prLinter = configureMock(issue, files);
    await expect(prLinter.validate()).rejects.toThrow(
      'The pull request linter fails with the following errors:' +
      '\n\n\t❌ Fixes must contain a change to an integration test file and the resulting snapshot.' +
      '\n\n<b>PRs must pass status checks before we can provide a meaningful review.</b>\n\n' +
      'If you would like to request an exemption from the status checks or clarification on feedback,' +
      ' please leave a comment on this PR containing `Exemption Request` and/or `Clarification Request`.'
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
        filename: 'some-test.test.ts'
      },
      {
        filename: 'integ.some-test.ts'
      },
      {
        filename: 'README.md'
      }
    ];
    const prLinter = configureMock(issue, files);
    await expect(prLinter.validate()).rejects.toThrow(
      'The pull request linter fails with the following errors:' +
      '\n\n\t❌ Fixes must contain a change to an integration test file and the resulting snapshot.' +
      '\n\n<b>PRs must pass status checks before we can provide a meaningful review.</b>\n\n' +
      'If you would like to request an exemption from the status checks or clarification on feedback,' +
      ' please leave a comment on this PR containing `Exemption Request` and/or `Clarification Request`.'
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
        filename: 'some-test.test.ts'
      },
      {
        filename: 'README.md'
      }
    ];
    const prLinter = configureMock(issue, files);
    expect(await prLinter.validate()).resolves;
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
        filename: 'some-test.test.ts'
      },
      {
        filename: 'readme.md'
      }
    ];
    const prlinter = configureMock(issue, files);
    expect(await prlinter.validate()).resolves;
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
    const files = [ { filename: 'packages/aws-cdk/lib/cdk-toolkit.ts' } ];

    test('no label throws error', async () => {
      const prLinter = configureMock(issue, files);
      await expect(prLinter.validate()).rejects.toThrow(/CLI code has changed. A maintainer must/);
    });

    test('with label no error', async () => {
      labels.push({ name: 'pr-linter/cli-integ-tested' });
      const prLinter = configureMock(issue, files);
      await prLinter.validate();
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
      await prLinter.validate();
      // THEN: no exception
    })
  });
});


function configureMock(pr: linter.GitHubPr, prFiles?: linter.GitHubFile[]): linter.PullRequestLinter {
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
      }
    },

    listReviews(_props: { _owner: string, _repo: string, _pull_number: number }) {
      return { data: [{ id: 1111122222, user: { login: 'aws-cdk-automation' }, state: 'CHANGES_REQUESTED' }] };
    },

    dismissReview() {},
  };

  const issuesClient = {
    createComment() {},

    deleteComment() {},

    listComments() {
      return { data: [{ id: 1212121212, user: { login: 'aws-cdk-automation' }, body: 'The pull request linter fails with the following errors:' }] }
    }
  };
  return new linter.PullRequestLinter({
    owner: 'aws',
    repo: 'aws-cdk',
    number: 1000,

    // hax hax
    client: {
      pulls: pullsClient as any,
      issues: issuesClient as any,
      paginate: (method: any, args: any) => { return method(args).data },
    } as any,
  })
}
