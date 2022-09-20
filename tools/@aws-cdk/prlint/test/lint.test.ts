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
      title: 'chore: some title',
      body: 'BREAKING CHANGES:',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }]
    };
    const prLinter = configureMock(issue, undefined);
    await expect(prLinter.validate()).rejects.toThrow(/'BREAKING CHANGE: ', variations are not allowed/);
  });

  test('the first breaking change should immediately follow "BREAKING CHANGE:"', async () => {
    const issue = {
      title: 'chore(cdk-build-tools): some title',
      body: `BREAKING CHANGE:\x20
             * **module:** another change`,
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }]
    };
    const prLinter = configureMock(issue, undefined);
    await expect(prLinter.validate()).rejects.toThrow(/description of the first breaking change should immediately follow/);
  });

  test('invalid title', async () => {
    const issue = {
      title: 'chore(): some title',
      body: 'BREAKING CHANGE: this breaking change',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }]
    };
    const prLinter = configureMock(issue, undefined);
    await expect(prLinter.validate()).rejects.toThrow(/The title of this pull request must specify the module name that the first breaking change should be associated to./);
  });

  test('valid title', async () => {
    const issue = {
      title: 'chore(cdk-build-tools): some title',
      body: 'BREAKING CHANGE: this breaking change',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }]
    };
    const prLinter = configureMock(issue, undefined);
    expect(await prLinter.validate()).resolves; // not throw
  });
});

describe('ban breaking changes in stable modules', () => {
  test('breaking change in stable module', async () => {
    const issue = {
      title: 'chore(s3): some title',
      body: 'BREAKING CHANGE: this breaking change',
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }]
    };
    const prLinter = configureMock(issue, undefined);
    await expect(prLinter.validate()).rejects.toThrow('Breaking changes in stable modules [s3] is disallowed.');
  });

  test('breaking changes multiple in stable modules', async () => {
    const issue = {
      title: 'chore(lambda): some title',
      body: `
        BREAKING CHANGE: this breaking change
        continued message
        * **ecs**: further breaking in ecs
      `,
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }]
    };
    const prLinter = configureMock(issue, undefined);
    await expect(prLinter.validate()).rejects.toThrow('Breaking changes in stable modules [lambda, ecs] is disallowed.');
  });

  test('unless exempt-breaking-change label added', async () => {
    const issue = {
      title: 'chore(lambda): some title',
      body: `
        BREAKING CHANGE: this breaking change
        continued message
      `,
      labels: [{ name: 'pr-linter/exempt-breaking-change' }],
    };
    const prLinter = configureMock(issue, undefined);
    expect(await prLinter.validate()).resolves; // not throw
  });

  test('with additional "closes" footer', async () => {
    const issue = {
      title: 'chore(s3): some title',
      body: `
        description of the commit

        closes #123456789

        BREAKING CHANGE: this breaking change
      `,
      labels: [{ name: 'pr-linter/exempt-test' }, { name: 'pr-linter/exempt-readme' }]
    };
    const prLinter = configureMock(issue, undefined);
    await expect(prLinter.validate()).rejects.toThrow('Breaking changes in stable modules [s3] is disallowed.');
  });
});

describe('integration tests required on features', () => {
  test('integ files changed', async () => {
    const issue = {
      title: 'feat(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: []
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
      title: 'feat(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: []
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
      'The Pull Request Linter fails with the following errors:' +
      '\n\n\t❌ Features must contain a change to an integration test file and the resulting snapshot.' +
      '\n\nPRs must pass status checks before we can provide a meaningful review.'
      );
  });

  test('integ snapshots not changed in feat', async () => {
    const issue = {
      title: 'feat(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: []
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
      'The Pull Request Linter fails with the following errors:' +
      '\n\n\t❌ Features must contain a change to an integration test file and the resulting snapshot.' +
      '\n\nPRs must pass status checks before we can provide a meaningful review.'
      );
  });

  test('integ files not changed in fix', async () => {
    const issue = {
      title: 'fix(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: []
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
      'The Pull Request Linter fails with the following errors:' +
      '\n\n\t❌ Fixes must contain a change to an integration test file and the resulting snapshot.' +
      '\n\nPRs must pass status checks before we can provide a meaningful review.'
      );
  });

  test('integ snapshots not changed in fix', async () => {
    const issue = {
      title: 'fix(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: []
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
      'The Pull Request Linter fails with the following errors:' +
      '\n\n\t❌ Fixes must contain a change to an integration test file and the resulting snapshot.' +
      '\n\nPRs must pass status checks before we can provide a meaningful review.'
      );
  });

  test('integ files not changed, pr exempt', async () => {
    const issue = {
      title: 'feat(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: [{ name: 'pr-linter/exempt-integ-test' }]
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
      title: 'chore(s3): some title',
      body: `
        description of the commit

        closes #123456789
      `,
      labels: []
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
});


function configureMock(issue: any, prFiles: any[] | undefined): linter.PullRequestLinter {
  const client = {
    get(_props: { _owner: string, _repo: string, _pull_number: number }) {
      return { data: issue };
    },

    listFiles(_props: { _owner: string, _repo: string, _pull_number: number }) {
      return { data: prFiles };
    },

    createReview(errorMessage: string) {
      return {
        promise: () => mockCreateReview(errorMessage),
      }
    },

    listReviews(_props: { _owner: string, _repo: string, _pull_number: number }) {
      return { data:  [{ id: 1111122222, user: { login: 'github-actions[bot]' }, state: 'CHANGES_REQUESTED' }] };
    },

    dismissReview() {},

  }
  return new linter.PullRequestLinter({
    owner: 'aws',
    repo: 'aws-cdk',
    number: 1000,
    client
  })
}
