import { requestResponseOnIdleDrafts, run, type DraftNode } from '../../request-response-on-idle-drafts';

const NOW = new Date('2026-10-28T00:00:00Z');

const MESSAGE = [
  'This draft PR has had no activity for 90 days.',
  '',
  'If you are still working on it, please leave a comment or push a commit, and mark it ready for review when it is done.',
  'If there is no response, this PR will be closed in 7 days.',
  '',
  'To keep a draft open longer, a maintainer can add the `no-autoclose` label.',
].join('\n');

interface DraftOptions {
  createdAt?: string;
  committedDate?: string;
  comments?: DraftNode['comments']['nodes'];
  labels?: string[];
  title?: string;
}

function draft(number: number, { createdAt = '2026-01-01T00:00:00Z', committedDate, comments = [], labels = [], title = `feat: draft ${number}` }: DraftOptions = {}): DraftNode {
  return {
    number,
    title,
    createdAt,
    labels: { nodes: labels.map((name) => ({ name })) },
    commits: { nodes: committedDate ? [{ commit: { committedDate } }] : [] },
    comments: { nodes: comments },
  };
}

/** A mock of the Octokit client that actions/github-script provides. */
function mockGithub(pages: DraftNode[] | DraftNode[][], { createComment = async (_params: { issue_number: number }): Promise<object> => ({}) } = {}) {
  const searchPages = (pages.length > 0 && Array.isArray(pages[0]) ? pages : [pages]) as DraftNode[][];
  return {
    graphql: jest.fn(async (_query: string, { cursor }: { cursor: string | null }) => {
      const index = cursor === null ? 0 : Number(cursor);
      const hasNextPage = index + 1 < searchPages.length;
      return { search: { pageInfo: { hasNextPage, endCursor: hasNextPage ? String(index + 1) : null }, nodes: searchPages[index] } };
    }),
    rest: {
      issues: {
        createComment: jest.fn(createComment),
        addLabels: jest.fn(async () => ({})),
      },
    },
  };
}

type MockGithub = ReturnType<typeof mockGithub>;

function runOn(github: MockGithub, overrides: { dryRun?: boolean } = {}) {
  return requestResponseOnIdleDrafts({ github: github as any, owner: 'aws', repo: 'aws-cdk', days: 90, dryRun: false, now: NOW, log: () => {}, ...overrides });
}

test('asks for a response on a draft with no commits or comments for 90 days', async () => {
  const github = mockGithub([draft(100, { committedDate: '2026-02-01T00:00:00Z' })]);

  const result = await runOn(github);

  expect(github.rest.issues.createComment).toHaveBeenCalledWith({ owner: 'aws', repo: 'aws-cdk', issue_number: 100, body: MESSAGE });
  expect(github.rest.issues.addLabels).toHaveBeenCalledWith({ owner: 'aws', repo: 'aws-cdk', issue_number: 100, labels: ['response-requested'] });
  expect(github.rest.issues.createComment.mock.invocationCallOrder[0])
    .toBeLessThan(github.rest.issues.addLabels.mock.invocationCallOrder[0]);
  expect(result.done).toEqual([{ number: 100, title: 'feat: draft 100', lastActivity: new Date('2026-02-01T00:00:00Z') }]);
});

test('searches only open drafts without the skip labels', async () => {
  const github = mockGithub([]);

  await runOn(github);

  expect(github.graphql).toHaveBeenCalledWith(expect.any(String), {
    q: 'repo:aws/aws-cdk is:pr is:open draft:true -label:response-requested -label:closing-soon -label:no-autoclose',
    cursor: null,
  });
});

test('leaves a draft alone when a person commented within 90 days', async () => {
  const github = mockGithub([draft(101, {
    committedDate: '2026-02-01T00:00:00Z',
    comments: [{ createdAt: '2026-10-01T00:00:00Z', author: { __typename: 'User', login: 'someone' } }],
  })]);

  const result = await runOn(github);

  expect(github.rest.issues.createComment).not.toHaveBeenCalled();
  expect(result.done).toEqual([]);
});

test('leaves a draft alone when it has a commit within 90 days', async () => {
  const github = mockGithub([draft(102, { committedDate: '2026-10-20T00:00:00Z' })]);

  const result = await runOn(github);

  expect(github.rest.issues.createComment).not.toHaveBeenCalled();
  expect(result.done).toEqual([]);
});

test('ignores comments from bots and automation accounts', async () => {
  const github = mockGithub([draft(103, {
    committedDate: '2026-02-01T00:00:00Z',
    comments: [
      { createdAt: '2026-10-01T00:00:00Z', author: { __typename: 'Bot', login: 'github-actions' } },
      { createdAt: '2026-10-02T00:00:00Z', author: { __typename: 'User', login: 'aws-cdk-automation' } },
      { createdAt: '2026-10-03T00:00:00Z', author: null },
    ],
  })]);

  const result = await runOn(github);

  expect(result.done).toEqual([{ number: 103, title: 'feat: draft 103', lastActivity: new Date('2026-02-01T00:00:00Z') }]);
});

test('skips a draft with no-autoclose even if search returns it', async () => {
  const github = mockGithub([draft(104, { committedDate: '2026-02-01T00:00:00Z', labels: ['no-autoclose'] })]);

  const result = await runOn(github);

  expect(github.rest.issues.createComment).not.toHaveBeenCalled();
  expect(result.done).toEqual([]);
});

test('dry run makes no comments or labels', async () => {
  const github = mockGithub([draft(105, { committedDate: '2026-02-01T00:00:00Z' })]);

  const result = await runOn(github, { dryRun: true });

  expect(github.rest.issues.createComment).not.toHaveBeenCalled();
  expect(github.rest.issues.addLabels).not.toHaveBeenCalled();
  expect(result.done.map((p) => p.number)).toEqual([105]);
});

test('acts on every idle draft, oldest first', async () => {
  const github = mockGithub([
    draft(106, { createdAt: '2026-03-01T00:00:00Z' }),
    draft(107, { createdAt: '2026-01-01T00:00:00Z' }),
  ]);

  const result = await runOn(github);

  expect(github.rest.issues.createComment.mock.calls.map(([params]) => params.issue_number)).toEqual([107, 106]);
  expect(result.done.map((p) => p.number)).toEqual([107, 106]);
});

test('records an error and continues when a write fails', async () => {
  const github = mockGithub([
    draft(108, { createdAt: '2026-01-01T00:00:00Z' }),
    draft(109, { createdAt: '2026-01-02T00:00:00Z' }),
  ], {
    createComment: async ({ issue_number }: { issue_number: number }) => {
      if (issue_number === 108) {
        throw new Error('Resource not accessible by integration');
      }
      return {};
    },
  });

  const result = await runOn(github);

  expect(github.rest.issues.addLabels).toHaveBeenCalledTimes(1);
  expect(github.rest.issues.addLabels).toHaveBeenCalledWith(expect.objectContaining({ issue_number: 109 }));
  expect(result.errors).toEqual([{ number: 108, error: 'Resource not accessible by integration' }]);
  expect(result.done.map((p) => p.number)).toEqual([109]);
});

test('follows search pagination', async () => {
  const github = mockGithub([
    [draft(110, { createdAt: '2026-10-20T00:00:00Z' })],
    [draft(111, { createdAt: '2026-10-21T00:00:00Z' })],
  ]);

  const result = await runOn(github);

  expect(github.graphql.mock.calls.map(([, vars]) => vars.cursor)).toEqual([null, '1']);
  expect(result.scanned).toEqual(2);
});

describe('run', () => {
  function mockCore() {
    const summary: Record<string, jest.Mock> = {
      addHeading: jest.fn(() => summary),
      addRaw: jest.fn(() => summary),
      addTable: jest.fn(() => summary),
      write: jest.fn(async () => summary),
    };
    return { info: jest.fn(), setFailed: jest.fn(), summary };
  }

  const ENV = ['DAYS_THRESHOLD', 'DRY_RUN'];
  let saved: Record<string, string | undefined>;
  beforeEach(() => {
    saved = Object.fromEntries(ENV.map((k) => [k, process.env[k]]));
    ENV.forEach((k) => delete process.env[k]);
  });
  afterEach(() => {
    ENV.forEach((k) => {
      if (saved[k] === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = saved[k];
      }
    });
  });

  test('passes PR titles to the summary table as data', async () => {
    const github = mockGithub([draft(112, { title: 'fix: a | b \\ c' })]);
    const core = mockCore();
    process.env.DRY_RUN = 'true';

    await run({ github: github as any, context: { repo: { owner: 'aws', repo: 'aws-cdk' } } as any, core: core as any });

    expect(core.summary.addTable).toHaveBeenCalledWith([
      expect.any(Array),
      ['#112', 'fix: a | b \\ c', '2026-01-01T00:00:00.000Z'],
    ]);
    expect(core.summary.write).toHaveBeenCalled();
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('fails the job when a write fails', async () => {
    const github = mockGithub([draft(113)], { createComment: async (): Promise<object> => { throw new Error('boom'); } });
    const core = mockCore();

    await run({ github: github as any, context: { repo: { owner: 'aws', repo: 'aws-cdk' } } as any, core: core as any });

    expect(core.setFailed).toHaveBeenCalledWith('Failed on 1 draft(s)');
  });
});
