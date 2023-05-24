import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { UpdateDiscussionComment ,AddDiscussionComment, MarkDiscussionCommentAsAnswer, GetDiscussionCount, GetAnswerableDiscussionId} from '../src/generated/graphql';
//import { gql } from 'apollo-server';
//import { MyMutation, MyQuery } from './myGraphQLQueries';

beforeEach(() => {
  jest.resetModules();
});

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: {
    'x-api-key': 'key-redacted',
  },
  cache: new InMemoryCache(),
});

describe('Update Discussion comment mutation', () => {
  const commentId = 'abcd1234';
  const updatedCommentText = 'Updated comment text';
  
  it('should make a successful mutation to my GraphQL API', async () => {
    // Define the expected result of the mutation
    const expectedResult = {
      data: {
        updateDiscussionComment: {
          id: commentId,
        },
      },
    };

    // Set up the mocked response for the mutation
    const mockResponse = {
      data: {
        updateDiscussionComment: {
          id: commentId,
        },
      },
    };

    client.mutate = jest.fn().mockResolvedValueOnce(mockResponse);

    // Execute the mutation
    const result = await client.mutate({
      mutation: UpdateDiscussionComment,
      variables: {
        commentId,
        body: updatedCommentText,
      }
    });

    // Verify that the mutation was called with the correct arguments
    expect(client.mutate).toHaveBeenCalledWith({
      mutation: UpdateDiscussionComment,
      variables: {
        commentId,
        body: updatedCommentText
      }
    });

    // Verify that the result of the mutation matches the expected result
    expect(result).toEqual(expectedResult);
  });
})

describe('Add Discussion comment ', () => {
  const discussionId = 'discussion1234';
  const text = 'Add comment text';
  
  it('add discussion comment using mutation', async () => {
    // Define the expected result of the mutation
    const expectedResult = {
      data: {
        addDiscussionComment: {
          commentId: 'comment123',
        },
      },
    };

    // Set up the mocked response for the mutation
    const mockResponse = {
      data: {
        addDiscussionComment: {
          commentId: 'comment123',
        },
      },
    };

    client.mutate = jest.fn().mockResolvedValueOnce(mockResponse);

    // Execute the mutation
    const result = await client.mutate({
      mutation: AddDiscussionComment,
      variables: {
        discussionId,
        body: text,
      }
    });

    // Verify that the mutation was called with the correct arguments
    expect(client.mutate).toHaveBeenCalledWith({
      mutation: AddDiscussionComment,
      variables: {
        discussionId,
        body: text,
      }
    });

    // Verify that the result of the mutation matches the expected result
    expect(result).toEqual(expectedResult);
  });
})


describe('Mark discussion as answered ', () => {
  const commentId = 'comment123';
  
  it('Mark discussion comment as answer', async () => {
    // Define the expected result of the mutation
    const expectedResult = {
      data: {
        markDiscussionCommentAsAnswer: {
          clientMutationId: 'mutation123',
        },
      },
    };

    // Set up the mocked response for the mutation
    const mockResponse = {
      data: {
        markDiscussionCommentAsAnswer: {
          clientMutationId: 'mutation123',
        },
      },
    };

    client.mutate = jest.fn().mockResolvedValueOnce(mockResponse);

    // Execute the mutation
    const result = await client.mutate({
      mutation: MarkDiscussionCommentAsAnswer,
      variables: {
        commentId
      }
    });

    // Verify that the mutation was called with the correct arguments
    expect(client.mutate).toHaveBeenCalledWith({
      mutation: MarkDiscussionCommentAsAnswer,
      variables: {
        commentId
      }
    });

    // Verify that the result of the mutation matches the expected result
    expect(result).toEqual(expectedResult);
  });
})

describe('Get total discussion count', () => {
  
  it('Get total discussion count for categoryId', async () => {
    // Define the expected result of the mutation
    const expectedResult = {
      data: {
        totalCount: 10,
      },
    };

    // Set up the mocked response for the mutation
    const mockResponse = {
      data: {
        totalCount: 10,
      },
    };

    client.query = jest.fn().mockResolvedValueOnce(mockResponse);

    // Execute the mutation
    const result = await client.query({
      query: GetDiscussionCount,
      variables: {
        owner: "testOwner",
        name: 'repoName',
        categoryId: 'category123'
      }
    });

    // Verify that the mutation was called with the correct arguments
    expect(client.query).toHaveBeenCalledWith({
      query: GetDiscussionCount,
      variables: {
        owner: "testOwner",
        name: 'repoName',
        categoryId: 'category123'
      }
    });

    // Verify that the result of the mutation matches the expected result
    expect(result).toEqual(expectedResult);
  });
})

describe('Get answerable discussion category id ', () => {
  
  it('Get answerable discussion category Id', async () => {
    // Define the expected result of the mutation
    const expectedResult = {
      data:  {
          isAnswerable: true,
          id: 'id123'
      }
    }

    // Set up the mocked response for the mutation
    const mockResponse = {
      data:  {
        isAnswerable: true,
        id: 'id123'
       }
    }

    client.query = jest.fn().mockResolvedValueOnce(mockResponse);

    // Execute the mutation
    const result = await client.query({
      query: GetAnswerableDiscussionId,
      variables: {
        owner: 'owner123',
        name: 'repo123'
      }
    });

    // Verify that the mutation was called with the correct arguments
    expect(client.query).toHaveBeenCalledWith({
      query: GetAnswerableDiscussionId,
      variables: {
        owner: 'owner123',
        name: 'repo123'
      }
    });

    // Verify that the result of the mutation matches the expected result
    expect(result).toEqual(expectedResult);
  });
})