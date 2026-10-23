const mockContext = {
  repo: { owner: 'aws', repo: 'aws-cdk' },
  eventName: 'workflow_run',
  payload: {},
};
const mockGetPRFromCommit = jest.fn();
const mockValidate = jest.fn();
const mockExecute = jest.fn();
const mockLinter = jest.fn(() => ({
  validatePullRequestTarget: mockValidate,
  executeActions: mockExecute,
}));

jest.mock('@actions/github', () => ({ context: mockContext }));
jest.mock('@octokit/rest', () => ({ Octokit: jest.fn() }));
jest.mock('../lint', () => ({
  PullRequestLinter: Object.assign(mockLinter, { getPRFromCommit: mockGetPRFromCommit }),
}));

const originalEnv = process.env;
const originalExitCode = process.exitCode;
const sha = '13f0a6310e9f6a8613276eb2d1c96508e932a200';

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'log').mockImplementation();
  process.env = { ...originalEnv, PR_NUMBER: '', PR_SHA: sha };
  process.exitCode = undefined;
  mockContext.eventName = 'workflow_run';
  mockContext.payload = {};
  mockGetPRFromCommit.mockResolvedValue(undefined);
  mockValidate.mockResolvedValue(undefined);
  mockExecute.mockResolvedValue(undefined);
});

afterEach(() => {
  process.env = originalEnv;
  process.exitCode = originalExitCode;
  jest.restoreAllMocks();
});

async function runLinter() {
  jest.isolateModules(() => {
    jest.requireActual('../index');
  });
  // The entry point starts asynchronously when the action is loaded.
  await new Promise(resolve => setImmediate(resolve));
}

test.each(['workflow_run', 'check_suite', 'status'])('skips %s when the commit has no current PR', async eventName => {
  mockContext.eventName = eventName;

  await runLinter();

  expect(mockGetPRFromCommit).toHaveBeenCalledWith(expect.anything(), 'aws', 'aws-cdk', sha);
  expect(mockLinter).not.toHaveBeenCalled();
  expect(process.exitCode).toBeUndefined();
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Skipping.'));
});

test('validates a workflow_run PR resolved from its commit when no PR number is available', async () => {
  mockGetPRFromCommit.mockResolvedValue({ number: 37858 });
  const actions = { addLabels: ['pr/needs-maintainer-review'] };
  mockValidate.mockResolvedValue(actions);

  await runLinter();

  expect(mockLinter).toHaveBeenCalledWith(expect.objectContaining({ number: 37858 }));
  expect(mockValidate).toHaveBeenCalledTimes(1);
  expect(mockExecute).toHaveBeenCalledWith(actions);
  expect(process.exitCode).toBeUndefined();
});

test('preserves the PR number supplied by the downloaded artifact', async () => {
  process.env.PR_NUMBER = '37858';

  await runLinter();

  expect(mockGetPRFromCommit).not.toHaveBeenCalled();
  expect(mockLinter).toHaveBeenCalledWith(expect.objectContaining({ number: 37858 }));
  expect(mockValidate).toHaveBeenCalledTimes(1);
  expect(process.exitCode).toBeUndefined();
});

test('preserves direct pull_request_target validation', async () => {
  mockContext.eventName = 'pull_request_target';
  mockContext.payload = { pull_request: { number: 37858 } };

  await runLinter();

  expect(mockGetPRFromCommit).not.toHaveBeenCalled();
  expect(mockLinter).toHaveBeenCalledWith(expect.objectContaining({ number: 37858 }));
  expect(mockValidate).toHaveBeenCalledTimes(1);
  expect(process.exitCode).toBeUndefined();
});

test.each(['check_suite', 'status'])('preserves %s SHA lookup from the event payload', async eventName => {
  mockContext.eventName = eventName;
  mockContext.payload = eventName === 'check_suite' ? { check_suite: { head_sha: sha } } : { sha };
  process.env.PR_SHA = '';

  await runLinter();

  expect(mockGetPRFromCommit).toHaveBeenCalledWith(expect.anything(), 'aws', 'aws-cdk', sha);
  expect(process.exitCode).toBeUndefined();
});

test('fails when the commit lookup fails', async () => {
  const error = new Error('GitHub API unavailable');
  mockGetPRFromCommit.mockRejectedValue(error);

  await runLinter();

  expect(process.exitCode).toBe(1);
  expect(console.error).toHaveBeenCalledWith(error);
  expect(mockLinter).not.toHaveBeenCalled();
});

test('fails when PR validation fails', async () => {
  process.env.PR_NUMBER = '37858';
  const error = new Error('Validation failed');
  mockValidate.mockRejectedValue(error);

  await runLinter();

  expect(process.exitCode).toBe(1);
  expect(console.error).toHaveBeenCalledWith(error);
  expect(mockExecute).not.toHaveBeenCalled();
});

test('fails when executing PR actions fails', async () => {
  process.env.PR_NUMBER = '37858';
  mockValidate.mockResolvedValue({ addLabels: ['pr/needs-maintainer-review'] });
  const error = new Error('GitHub write failed');
  mockExecute.mockRejectedValue(error);

  await runLinter();

  expect(process.exitCode).toBe(1);
  expect(console.error).toHaveBeenCalledWith(error);
});
