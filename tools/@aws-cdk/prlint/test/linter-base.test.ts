/**
 * Tests for the "linter base" class
 *
 * This has generic GitHub functionality, and the ability to carry
 * out a set of GitHub actions.
 *
 * None of this is CDK-specific business logic.
 */

import { PullRequestLinterBase } from "../linter-base";

const octomock = {
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
  repos: {
    listCommitStatusesForRef: jest.fn(),
  },
  paginate: async (method: any, args: any) => { return (await method(args)).data; },
};

const linter = new PullRequestLinterBase({
  client: octomock as any,
  owner: 'test-owner',
  repo: 'test-repo',
  number: 123,
  linterLogin: 'aws-cdk-automation',
});

beforeEach(() => {
  jest.resetAllMocks();

  octomock.pulls.get.mockReturnValue({
    data: {
      number: 123,
      base: { ref: 'main' },
      head: { sha: 'ABC' },
    },
  });
  octomock.pulls.listReviews.mockReturnValue({ data: [] });
  octomock.repos.listCommitStatusesForRef.mockReturnValue({ data: [] });
});

test('ignore if dismissing reviews throws a specific "already dismissed" error', async () => {
  // GIVEN
  octomock.pulls.listReviews.mockReturnValue({
    data: [
      {
        id: 1111,
        user: { login: 'aws-cdk-automation' },
        state: 'CHANGES_REQUESTED',
        body: 'some comment',
      },
    ]
  });
  octomock.pulls.dismissReview.mockRejectedValue({
    status: 422,
    response: {
      data: {
        errors: [
          'Can not dismiss a dismissed pull request review',
        ],
      },
    },
  });

  // WHEN
  await linter.executeActions({
    dismissPreviousReview: true,
  });

  // THEN: no error
});

test('throw if dismissing reviews throws any other error', async () => {
  // GIVEN
  octomock.pulls.listReviews.mockReturnValue({
    data: [
      {
        id: 1111,
        user: { login: 'aws-cdk-automation' },
        state: 'CHANGES_REQUESTED',
        body: 'some comment',
      },
    ]
  });
  octomock.pulls.dismissReview.mockRejectedValue({
    status: 422,
    response: {
      data: {
        errors: [
          'Review not found',
        ],
      },
    },
  });

  // THEN
  await expect(linter.executeActions({
    dismissPreviousReview: true,
  })).rejects.toThrow(/Dismissing review failed/);
});

test('dismissing a review dismisses and changes the text of all previous reviews', async () => {
  // GIVEN
  octomock.pulls.listReviews.mockReturnValue({
    data: [
      {
        id: 1111,
        user: { login: 'aws-cdk-automation' },
        state: 'CHANGES_REQUESTED',
        body: 'some comment',
      },
      {
        id: 2222,
        user: { login: 'aws-cdk-automation' },
        state: 'CHANGES_REQUESTED',
        body: 'some other comment',
      },
      {
        id: 3333,
        user: { login: 'some-other-user' },
        state: 'CHANGES_REQUESTED',
        body: 'some other comment',
      },
    ],
  });

  // WHEN
  await linter.executeActions({
    dismissPreviousReview: true,
  });

  // THEN
  expect(octomock.pulls.updateReview).toHaveBeenCalledWith(expect.objectContaining({
    owner: 'test-owner',
    repo: 'test-repo',
    pull_number: 123,
    review_id: 1111,
  }));
  expect(octomock.pulls.updateReview).toHaveBeenCalledWith(expect.objectContaining({
    review_id: 2222,
  }));
  expect(octomock.pulls.updateReview).not.toHaveBeenCalledWith(expect.objectContaining({
    review_id: 3333,
  }));

  expect(octomock.pulls.dismissReview).toHaveBeenCalledWith(expect.objectContaining({
    review_id: 1111,
  }));
  expect(octomock.pulls.dismissReview).toHaveBeenCalledWith(expect.objectContaining({
    review_id: 2222,
  }));
  expect(octomock.pulls.dismissReview).not.toHaveBeenCalledWith(expect.objectContaining({
    review_id: 3333,
  }));
});
