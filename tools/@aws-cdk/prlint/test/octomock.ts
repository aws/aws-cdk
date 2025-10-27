
/**
 * Create a mock object for Octokit
 */
export function createOctomock() {
  return  {
    pulls: {
      get: jest.fn(),
      listFiles: jest.fn(),
      createReview: jest.fn(),
      listReviews: jest.fn(),
      dismissReview: jest.fn(),
      updateReview: jest.fn(),
      update: jest.fn(),
    },
    issues: {
      createComment: jest.fn(),
      deleteComment: jest.fn(),
      listComments: jest.fn(),
      removeLabel: jest.fn(),
      addLabels: jest.fn(),
    },
    search: {
      issuesAndPullRequests: jest.fn(),
    },
    checks: {
      listForRef: jest.fn(),
    },
    actions: {
      listWorkflowRuns: jest.fn(),
    },
    paginate: async (method: any, args: any) => { return (await method(args)).data; },
  };
}

export type OctoMock = ReturnType<typeof createOctomock>;