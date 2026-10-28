'use strict';

const { requestResponseOnIdleDrafts } = require('../../request-response-on-idle-drafts');

const NOW = new Date('2026-10-28T00:00:00Z');

const MESSAGE = [
  'This draft PR has had no activity for 90 days.',
  '',
  'If you are still working on it, please leave a comment or push a commit, and mark it ready for review when it is done.',
  'If there is no response, this PR will be closed in about a week. You can reopen it at any time.',
  '',
  'To keep a draft open longer, a maintainer can add the `no-autoclose` label.',
].join('\n');

function makeApi(drafts) {
  const calls = [];
  const api = async (path, init = {}) => {
    calls.push({ path, method: init.method ?? 'GET', body: init.body });
    if (path === '/graphql') {
      return { data: { search: { pageInfo: { hasNextPage: false, endCursor: null }, nodes: drafts } } };
    }
    return {};
  };
  return { api, calls };
}

test('asks for a response on a draft with no commits or comments for 90 days', async () => {
  const { api, calls } = makeApi([{
    number: 100,
    title: 'feat: old draft',
    createdAt: '2026-01-01T00:00:00Z',
    labels: { nodes: [] },
    commits: { nodes: [{ commit: { committedDate: '2026-02-01T00:00:00Z' } }] },
    comments: { nodes: [] },
  }]);

  const result = await requestResponseOnIdleDrafts({ api, owner: 'aws', repo: 'aws-cdk', days: 90, maxPerRun: 50, dryRun: false, now: NOW, log: () => {} });

  expect(calls.slice(1)).toEqual([
    { path: '/repos/aws/aws-cdk/issues/100/comments', method: 'POST', body: { body: MESSAGE } },
    { path: '/repos/aws/aws-cdk/issues/100/labels', method: 'POST', body: { labels: ['response-requested'] } },
  ]);
  expect(result.done).toEqual([{ number: 100, title: 'feat: old draft', lastActivity: new Date('2026-02-01T00:00:00Z') }]);
});

test('searches only open drafts without the skip labels', async () => {
  const { api, calls } = makeApi([]);

  await requestResponseOnIdleDrafts({ api, owner: 'aws', repo: 'aws-cdk', days: 90, maxPerRun: 50, dryRun: false, now: NOW, log: () => {} });

  expect(calls).toEqual([{
    path: '/graphql',
    method: 'POST',
    body: {
      query: expect.any(String),
      variables: { q: 'repo:aws/aws-cdk is:pr is:open draft:true -label:response-requested -label:closing-soon -label:no-autoclose', cursor: null },
    },
  }]);
});

test('leaves a draft alone when a person commented within 90 days', async () => {
  const { api, calls } = makeApi([{
    number: 101,
    title: 'feat: old commit, recent comment',
    createdAt: '2026-01-01T00:00:00Z',
    labels: { nodes: [] },
    commits: { nodes: [{ commit: { committedDate: '2026-02-01T00:00:00Z' } }] },
    comments: { nodes: [{ createdAt: '2026-10-01T00:00:00Z', author: { __typename: 'User', login: 'someone' } }] },
  }]);

  const result = await requestResponseOnIdleDrafts({ api, owner: 'aws', repo: 'aws-cdk', days: 90, maxPerRun: 50, dryRun: false, now: NOW, log: () => {} });

  expect(calls.length).toEqual(1);
  expect(result.done).toEqual([]);
});

test('leaves a draft alone when it has a commit within 90 days', async () => {
  const { api, calls } = makeApi([{
    number: 102,
    title: 'feat: recent commit',
    createdAt: '2026-01-01T00:00:00Z',
    labels: { nodes: [] },
    commits: { nodes: [{ commit: { committedDate: '2026-10-20T00:00:00Z' } }] },
    comments: { nodes: [] },
  }]);

  const result = await requestResponseOnIdleDrafts({ api, owner: 'aws', repo: 'aws-cdk', days: 90, maxPerRun: 50, dryRun: false, now: NOW, log: () => {} });

  expect(calls.length).toEqual(1);
  expect(result.done).toEqual([]);
});

test('ignores comments from bots and automation accounts', async () => {
  const { api } = makeApi([{
    number: 103,
    title: 'feat: only bot comments',
    createdAt: '2026-01-01T00:00:00Z',
    labels: { nodes: [] },
    commits: { nodes: [{ commit: { committedDate: '2026-02-01T00:00:00Z' } }] },
    comments: { nodes: [
      { createdAt: '2026-10-01T00:00:00Z', author: { __typename: 'Bot', login: 'github-actions' } },
      { createdAt: '2026-10-02T00:00:00Z', author: { __typename: 'User', login: 'aws-cdk-automation' } },
      { createdAt: '2026-10-03T00:00:00Z', author: null },
    ] },
  }]);

  const result = await requestResponseOnIdleDrafts({ api, owner: 'aws', repo: 'aws-cdk', days: 90, maxPerRun: 50, dryRun: false, now: NOW, log: () => {} });

  expect(result.done).toEqual([{ number: 103, title: 'feat: only bot comments', lastActivity: new Date('2026-02-01T00:00:00Z') }]);
});

test('skips a draft with no-autoclose even if search returns it', async () => {
  const { api, calls } = makeApi([{
    number: 104,
    title: 'feat: exempt',
    createdAt: '2026-01-01T00:00:00Z',
    labels: { nodes: [{ name: 'no-autoclose' }] },
    commits: { nodes: [{ commit: { committedDate: '2026-02-01T00:00:00Z' } }] },
    comments: { nodes: [] },
  }]);

  const result = await requestResponseOnIdleDrafts({ api, owner: 'aws', repo: 'aws-cdk', days: 90, maxPerRun: 50, dryRun: false, now: NOW, log: () => {} });

  expect(calls.length).toEqual(1);
  expect(result.done).toEqual([]);
});

test('dry run makes no comments or labels', async () => {
  const { api, calls } = makeApi([{
    number: 105,
    title: 'feat: old draft',
    createdAt: '2026-01-01T00:00:00Z',
    labels: { nodes: [] },
    commits: { nodes: [{ commit: { committedDate: '2026-02-01T00:00:00Z' } }] },
    comments: { nodes: [] },
  }]);

  const result = await requestResponseOnIdleDrafts({ api, owner: 'aws', repo: 'aws-cdk', days: 90, maxPerRun: 50, dryRun: true, now: NOW, log: () => {} });

  expect(calls.length).toEqual(1);
  expect(result.done).toEqual([{ number: 105, title: 'feat: old draft', lastActivity: new Date('2026-02-01T00:00:00Z') }]);
});

test('acts on at most maxPerRun drafts, oldest first', async () => {
  const { api, calls } = makeApi([
    {
      number: 106,
      title: 'feat: newer idle draft',
      createdAt: '2026-03-01T00:00:00Z',
      labels: { nodes: [] },
      commits: { nodes: [] },
      comments: { nodes: [] },
    },
    {
      number: 107,
      title: 'feat: older idle draft',
      createdAt: '2026-01-01T00:00:00Z',
      labels: { nodes: [] },
      commits: { nodes: [] },
      comments: { nodes: [] },
    },
  ]);

  const result = await requestResponseOnIdleDrafts({ api, owner: 'aws', repo: 'aws-cdk', days: 90, maxPerRun: 1, dryRun: false, now: NOW, log: () => {} });

  expect(calls.slice(1)).toEqual([
    { path: '/repos/aws/aws-cdk/issues/107/comments', method: 'POST', body: { body: MESSAGE } },
    { path: '/repos/aws/aws-cdk/issues/107/labels', method: 'POST', body: { labels: ['response-requested'] } },
  ]);
  expect(result.done).toEqual([{ number: 107, title: 'feat: older idle draft', lastActivity: new Date('2026-01-01T00:00:00Z') }]);
});

test('records an error and continues when a write fails', async () => {
  const calls = [];
  const api = async (path, init = {}) => {
    calls.push(path);
    if (path === '/graphql') {
      return { data: { search: { pageInfo: { hasNextPage: false, endCursor: null }, nodes: [
        { number: 108, title: 'feat: locked', createdAt: '2026-01-01T00:00:00Z', labels: { nodes: [] }, commits: { nodes: [] }, comments: { nodes: [] } },
        { number: 109, title: 'feat: fine', createdAt: '2026-01-02T00:00:00Z', labels: { nodes: [] }, commits: { nodes: [] }, comments: { nodes: [] } },
      ] } } };
    }
    if (path === '/repos/aws/aws-cdk/issues/108/comments') {
      throw new Error('POST /repos/aws/aws-cdk/issues/108/comments failed with 403: locked');
    }
    return {};
  };

  const result = await requestResponseOnIdleDrafts({ api, owner: 'aws', repo: 'aws-cdk', days: 90, maxPerRun: 50, dryRun: false, now: NOW, log: () => {} });

  expect(calls).toEqual([
    '/graphql',
    '/repos/aws/aws-cdk/issues/108/comments',
    '/repos/aws/aws-cdk/issues/109/comments',
    '/repos/aws/aws-cdk/issues/109/labels',
  ]);
  expect(result.errors).toEqual([{ number: 108, error: 'POST /repos/aws/aws-cdk/issues/108/comments failed with 403: locked' }]);
  expect(result.done).toEqual([{ number: 109, title: 'feat: fine', lastActivity: new Date('2026-01-02T00:00:00Z') }]);
});

test('follows search pagination', async () => {
  const calls = [];
  const api = async (path, init = {}) => {
    calls.push(init.body.variables.cursor);
    if (path === '/graphql' && init.body.variables.cursor === null) {
      return { data: { search: { pageInfo: { hasNextPage: true, endCursor: 'page2' }, nodes: [
        { number: 110, title: 'feat: page one', createdAt: '2026-10-20T00:00:00Z', labels: { nodes: [] }, commits: { nodes: [] }, comments: { nodes: [] } },
      ] } } };
    }
    if (path === '/graphql') {
      return { data: { search: { pageInfo: { hasNextPage: false, endCursor: null }, nodes: [
        { number: 111, title: 'feat: page two', createdAt: '2026-10-21T00:00:00Z', labels: { nodes: [] }, commits: { nodes: [] }, comments: { nodes: [] } },
      ] } } };
    }
    return {};
  };

  const result = await requestResponseOnIdleDrafts({ api, owner: 'aws', repo: 'aws-cdk', days: 90, maxPerRun: 50, dryRun: false, now: NOW, log: () => {} });

  expect(calls).toEqual([null, 'page2']);
  expect(result.scanned).toEqual(2);
});
