import { shouldRunIntegTests } from '../lib/preflight';
import * as utils from '../lib/utils';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

const defaultProps = {
  githubToken: 'test-token',
  owner: 'aws',
  repo: 'aws-cdk',
  prNumber: 123,
};

describe('shouldRunIntegTests', () => {
  let getChangedSnapshotsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    getChangedSnapshotsSpy = jest.spyOn(utils, 'getChangedSnapshots');
  });

  afterEach(() => {
    getChangedSnapshotsSpy.mockRestore();
  });

  describe('when no snapshot changes', () => {
    it('should not run and return appropriate reason', async () => {
      getChangedSnapshotsSpy.mockResolvedValue([]);

      const result = await shouldRunIntegTests(defaultProps);

      expect(result.shouldRun).toBe(false);
      expect(result.reason).toBe('No snapshot changes detected in this PR');
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('when PR has snapshot changes', () => {
    beforeEach(() => {
      getChangedSnapshotsSpy.mockResolvedValue([
        'packages/@aws-cdk-testing/framework-integ/test/aws-lambda/test/integ.function.js.snapshot',
      ]);
    });

    it('should run when approved by a CDK team member', async () => {
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
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      getChangedSnapshotsSpy.mockResolvedValue(['some-snapshot']);
    });

    it('should throw when reviews fetch fails', async () => {
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

    it('should throw on 401 authentication error during team membership check', async () => {
      // Mock reviews
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { state: 'APPROVED', user: { login: 'some-user' } },
        ]),
      });

      // Mock team membership check - 401 unauthorized
      mockFetch.mockResolvedValueOnce({
        status: 401,
      });

      await expect(shouldRunIntegTests(defaultProps)).rejects.toThrow(
        'GitHub authentication/authorization failed when checking team membership for some-user. Status: 401',
      );
    });

    it('should throw on 403 forbidden error during team membership check', async () => {
      // Mock reviews
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { state: 'APPROVED', user: { login: 'some-user' } },
        ]),
      });

      // Mock team membership check - 403 forbidden
      mockFetch.mockResolvedValueOnce({
        status: 403,
      });

      await expect(shouldRunIntegTests(defaultProps)).rejects.toThrow(
        'GitHub authentication/authorization failed when checking team membership for some-user. Status: 403',
      );
    });

    it('should throw on unexpected status codes during team membership check', async () => {
      // Mock reviews
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { state: 'APPROVED', user: { login: 'some-user' } },
        ]),
      });

      // Mock team membership check - 500 server error
      mockFetch.mockResolvedValueOnce({
        status: 500,
      });

      await expect(shouldRunIntegTests(defaultProps)).rejects.toThrow(
        'Failed to verify team membership for some-user. GitHub API returned status: 500',
      );
    });
  });
});
