import prIssueCheck, { buildMissingReferenceMessage, validateIssueReferences } from '../../pr-issue-check';

// --- Mock factories ---

function createMockCore() {
  return {
    setFailed: jest.fn(),
    warning: jest.fn(),
  };
}

function createMockContext(body: string) {
  return {
    payload: {
      pull_request: {
        body,
        number: 42,
      },
    },
    repo: { owner: 'test-owner', repo: 'test-repo' },
  };
}

interface MockIssue {
  state: string;
  pull_request?: Record<string, unknown>;
}

function createMockGithub({ issues = {}, existingComments = [] }: { issues?: Record<number, MockIssue>; existingComments?: Array<{ id: number; user: { type: string }; body: string }> } = {}) {
  return {
    rest: {
      issues: {
        get: jest.fn(async ({ issue_number }: { issue_number: number }) => {
          const issue = issues[issue_number];
          if (!issue) {
            const err: Error & { status?: number } = new Error('Not Found');
            err.status = 404;
            throw err;
          }
          return { data: issue };
        }),
        listComments: jest.fn(async () => ({ data: existingComments })),
        createComment: jest.fn(async () => ({})),
        updateComment: jest.fn(async () => ({})),
        deleteComment: jest.fn(async () => ({})),
      },
    },
  };
}

async function run(body: string, opts: { issues?: Record<number, MockIssue>; existingComments?: Array<{ id: number; user: { type: string }; body: string }> } = {}) {
  const core = createMockCore();
  const context = createMockContext(body);
  const github = createMockGithub(opts);
  await prIssueCheck({ github, context, core });
  return { core, github };
}

// --- SHOULD PASS (no comment, no failure) ---

describe('should pass', () => {
  test('standard template with open issue', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Closes #2.',
      '',
      '### Reason for this change',
      'Test',
    ].join('\n');
    const { core, github } = await run(body, { issues: { 2: { state: 'open' } } });
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).not.toHaveBeenCalled();
  });

  test('closed issue should pass', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Closes #6.',
      '',
      '### Reason for this change',
      'Test',
    ].join('\n');
    const { core, github } = await run(body, { issues: { 6: { state: 'closed' } } });
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).not.toHaveBeenCalled();
  });

  test('multiple issue references', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Closes #2, Fixes #3.',
      '',
      '### Reason for this change',
      'Test',
    ].join('\n');
    const { core } = await run(body, {
      issues: { 2: { state: 'open' }, 3: { state: 'open' } },
    });
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('Fixes keyword', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Fixes #2.',
    ].join('\n');
    const { core } = await run(body, { issues: { 2: { state: 'open' } } });
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('Resolves keyword', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Resolves #3.',
    ].join('\n');
    const { core } = await run(body, { issues: { 3: { state: 'open' } } });
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('bare issue number without keyword', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      '#2',
    ].join('\n');
    const { core } = await run(body, { issues: { 2: { state: 'open' } } });
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('issue number in the heading line', async () => {
    const body = [
      '### Issue #2',
      '',
      '### Reason for this change',
      'Test',
    ].join('\n');
    const { core } = await run(body, { issues: { 2: { state: 'open' } } });
    expect(core.setFailed).not.toHaveBeenCalled();
  });
});

// --- SHOULD FAIL — wrong location ---

describe('should comment - issue in wrong location', () => {
  test('issue ref in Reason section instead of Issue section', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'N/A',
      '',
      '### Reason for this change',
      '',
      'This fixes #2.',
    ].join('\n');
    const { core, github } = await run(body);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('not in the expected location'),
      }),
    );
  });

  test('issue ref only in Description section', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'No issue.',
      '',
      '### Description of changes',
      '',
      'Related to #3.',
    ].join('\n');
    const { core, github } = await run(body);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('not in the expected location'),
      }),
    );
  });
});

// --- SHOULD COMMENT — has heading but missing issue number ---

describe('should comment - template present but no issue number', () => {
  test('heading present with no issue number text', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'No issue linked.',
      '',
      '### Reason for this change',
      'Test',
    ].join('\n');
    const { core, github } = await run(body);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('missing a valid issue number'),
      }),
    );
  });

  test('heading present with N/A and no issue ref anywhere', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'N/A',
      '',
      '### Reason for this change',
      'Test',
    ].join('\n');
    const { core, github } = await run(body);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('missing a valid issue number'),
      }),
    );
  });
});

// --- SHOULD COMMENT — no template at all ---

describe('should comment - no template structure', () => {
  test('completely empty body', async () => {
    const { core, github } = await run('');
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('does not follow the correct template structure'),
      }),
    );
  });

  test('random freeform text without template', async () => {
    const body = "Hey, here's my change. I updated the README.";
    const { core, github } = await run(body);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('does not follow the correct template structure'),
      }),
    );
  });

  test('only a checklist without template', async () => {
    const body = [
      '- [x] Updated docs',
      '- [ ] Added tests',
    ].join('\n');
    const { core, github } = await run(body);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('does not follow the correct template structure'),
      }),
    );
  });
});

// --- SHOULD COMMENT — invalid issue references ---

describe('should comment - invalid issue references', () => {
  test('non-existent issue', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Closes #999999.',
    ].join('\n');
    const { core, github } = await run(body, { issues: {} });
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('#999999 (does not exist)'),
      }),
    );
  });

  test('PR number instead of issue', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Closes #1.',
    ].join('\n');
    const { core, github } = await run(body, {
      issues: { 1: { state: 'open', pull_request: {} } },
    });
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('#1 (is a pull request, not an issue)'),
      }),
    );
  });

  test('mix of valid and non-existent issue', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Closes #2, Closes #999999.',
    ].join('\n');
    const { core, github } = await run(body, {
      issues: { 2: { state: 'open' } },
    });
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('#999999 (does not exist)'),
      }),
    );
  });

  test('HTTP 410 Gone treated as non-existent', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Closes #50.',
    ].join('\n');
    const github = createMockGithub();
    github.rest.issues.get.mockRejectedValue(Object.assign(new Error('Gone'), { status: 410 }));
    const core = createMockCore();
    const context = createMockContext(body);
    await prIssueCheck({ github, context, core });
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('#50 (does not exist)'),
      }),
    );
  });
});

// --- EDGE CASES ---

describe('edge cases', () => {
  test('greeting before template pushes issue out of first two lines', async () => {
    const body = [
      "Hi team, here's my PR!",
      '',
      '### Issue # (if applicable)',
      '',
      'Closes #2.',
      '',
      '### Reason for this change',
      'Test',
    ].join('\n');
    const { core, github } = await run(body);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('not in the expected location'),
      }),
    );
  });

  test('issue number zero', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Closes #0.',
    ].join('\n');
    const { core } = await run(body, { issues: {} });
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('very large issue number', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Closes #2147483647.',
    ].join('\n');
    const { core } = await run(body, { issues: {} });
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('leading zeros parsed as valid issue number', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'Closes #0002.',
    ].join('\n');
    const { core } = await run(body, { issues: { 2: { state: 'open' } } });
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('hash in URL fragment matched as issue number', async () => {
    const body = [
      '### Issue # (if applicable)',
      '',
      'See https://github.com/org/repo/blob/main/file.ts#123',
    ].join('\n');
    const { core } = await run(body, { issues: {} });
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('freeform text with GitHub-appended template below', async () => {
    const body = [
      "Hey, here's my change. I updated the README.",
      '### Issue # (if applicable)',
      '',
      '',
      '### Reason for this change',
      '',
      '### Description of changes',
    ].join('\n');
    const { core, github } = await run(body);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining('does not follow the correct template structure'),
      }),
    );
  });
});

// --- COMMENT MANAGEMENT ---

describe('comment management', () => {
  test('updates existing bot comment instead of creating new one', async () => {
    const existingComment = {
      id: 100,
      user: { type: 'Bot' },
      body: '<!-- pr-issue-check-bot -->\nold message',
    };
    const body = '';
    const core = createMockCore();
    const context = createMockContext(body);
    const github = createMockGithub({ existingComments: [existingComment] });
    await prIssueCheck({ github, context, core });
    expect(github.rest.issues.updateComment).toHaveBeenCalledWith(
      expect.objectContaining({ comment_id: 100 }),
    );
    expect(github.rest.issues.createComment).not.toHaveBeenCalled();
  });

  test('deletes bot comment when check passes', async () => {
    const existingComment = {
      id: 200,
      user: { type: 'Bot' },
      body: '<!-- pr-issue-check-bot -->\nold warning',
    };
    const body = [
      '### Issue # (if applicable)',
      '',
      'Closes #2.',
    ].join('\n');
    const core = createMockCore();
    const context = createMockContext(body);
    const github = createMockGithub({
      issues: { 2: { state: 'open' } },
      existingComments: [existingComment],
    });
    await prIssueCheck({ github, context, core });
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(github.rest.issues.deleteComment).toHaveBeenCalledWith(
      expect.objectContaining({ comment_id: 200 }),
    );
  });

  test('handles comment creation failure gracefully', async () => {
    const body = '';
    const core = createMockCore();
    const context = createMockContext(body);
    const github = createMockGithub();
    github.rest.issues.createComment.mockRejectedValue(new Error('rate limited'));
    await prIssueCheck({ github, context, core });
    expect(core.warning).toHaveBeenCalledWith(expect.stringContaining('rate limited'));
    expect(core.setFailed).not.toHaveBeenCalled();
  });
});
