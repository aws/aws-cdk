import { shouldRunIntegTests } from '../lib/preflight';
import * as utils from '../lib/utils';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock getChangedSnapshots
jest.mock('../lib/utils', () => ({
  ...jest.requireActual('../lib/utils'),
  getChangedSnapshots: jest.fn(),
}));

const defaultProps = {
  githubToken: 'test-token',
  owner: 'aws',
  repo: 'aws-cdk',
  prNumber: 123,
};

describe('shouldRunIntegTests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when no snapshot changes', () => {
    it('should not run and return appropriate reason', async () => {
      (utils.getChangedSnapshots as jest.Mock).mockResolvedValue([]);

      const result = await shouldRunIntegTests(defaultProps);

      expect(result.shouldRun).toBe(false);
      expect(result.reason).toBe('No snapshot changes detected in this PR');
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('when PR has snapshot changes', () => {
    beforeEach(() => {
      (utils.getChangedSnapshots as jest.Mock).mockResolvedValue([
        'packages/@aws-cdk-testing/framework-integ/test/aws-lambda/test/integ.function.js.snapshot',
      ]);
    });

    it('should run when PR has the integration test label', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          labels: [{ name: 'pr/needs-integration-tests-deployment' }],
        }),
      });

      const result = await shouldRunIntegTests(defaultProps);

      expect(result.shouldRun).toBe(true);
      expect(result.reason).toBe('PR has pr/needs-integration-tests-deployment label');
    });

    it('should run when approved by a CDK team member', async () => {
      // Mock PR details (no label)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          labels: [],
        }),
      });

      // Mock reviews
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { state: 'APPROVED', user: { login: 'cdk-team-member' } },
        ]),
      });

      // Mock team membership check - is a member
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ state: 'active' }),
      });

      const result = await shouldRunIntegTests(defaultProps);

      expect(result.shouldRun).toBe(true);
      expect(result.reason).toBe('PR has snapshot changes and is approved by CDK team member @cdk-team-member');
    });

    it('should not run when approved by non-CDK team member', async () => {
      // Mock PR details (no label)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          labels: [],
        }),
      });

      // Mock reviews
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { state: 'APPROVED', user: { login: 'external-contributor' } },
        ]),
      });

      // Mock team membership check - not a member (404)
      mockFetch.mockResolvedValueOnce({
        status: 404,
      });

      const result = await shouldRunIntegTests(defaultProps);

      expect(result.shouldRun).toBe(false);
      expect(result.reason).toContain('not yet approved by a CDK team member');
    });

    it('should not run when no approvals exist', async () => {
      // Mock PR details (no label)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          labels: [],
        }),
      });

      // Mock reviews - no approvals
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { state: 'COMMENTED', user: { login: 'someone' } },
          { state: 'CHANGES_REQUESTED', user: { login: 'reviewer' } },
        ]),
      });

      const result = await shouldRunIntegTests(defaultProps);

      expect(result.shouldRun).toBe(false);
      expect(result.reason).toContain('not yet approved by a CDK team member');
    });

    it('should check multiple approvers until finding a CDK team member', async () => {
      // Mock PR details (no label)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          labels: [],
        }),
      });

      // Mock reviews - multiple approvals
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { state: 'APPROVED', user: { login: 'external-user' } },
          { state: 'APPROVED', user: { login: 'cdk-maintainer' } },
        ]),
      });

      // Mock team membership check for external-user - not a member
      mockFetch.mockResolvedValueOnce({
        status: 404,
      });

      // Mock team membership check for cdk-maintainer - is a member
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ state: 'active' }),
      });

      const result = await shouldRunIntegTests(defaultProps);

      expect(result.shouldRun).toBe(true);
      expect(result.reason).toBe('PR has snapshot changes and is approved by CDK team member @cdk-maintainer');
    });

    it('should handle pending team membership state', async () => {
      // Mock PR details (no label)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          labels: [],
        }),
      });

      // Mock reviews
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { state: 'APPROVED', user: { login: 'pending-member' } },
        ]),
      });

      // Mock team membership check - pending (not active)
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ state: 'pending' }),
      });

      const result = await shouldRunIntegTests(defaultProps);

      expect(result.shouldRun).toBe(false);
      expect(result.reason).toContain('not yet approved by a CDK team member');
    });

    it('should skip reviews with null user', async () => {
      // Mock PR details (no label)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          labels: [],
        }),
      });

      // Mock reviews - approval with null user (e.g., deleted account)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { state: 'APPROVED', user: null },
        ]),
      });

      const result = await shouldRunIntegTests(defaultProps);

      expect(result.shouldRun).toBe(false);
      // No team membership check should be made for null user
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      (utils.getChangedSnapshots as jest.Mock).mockResolvedValue(['some-snapshot']);
    });

    it('should throw when PR fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(shouldRunIntegTests(defaultProps)).rejects.toThrow(
        'Failed to fetch PR details: 404 Not Found',
      );
    });

    it('should throw when reviews fetch fails', async () => {
      // Mock PR details success
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ labels: [] }),
      });

      // Mock reviews failure
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(shouldRunIntegTests(defaultProps)).rejects.toThrow(
        'Failed to fetch PR reviews: 500 Internal Server Error',
      );
    });
  });
});
