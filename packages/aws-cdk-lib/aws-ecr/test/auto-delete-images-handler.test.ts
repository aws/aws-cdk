const mockECRClient = {
  listImages: jest.fn().mockReturnThis(),
  batchDeleteImage: jest.fn().mockReturnThis(),
  describeRepositories: jest.fn().mockReturnThis(),
  listTagsForResource: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

import { handler } from '../lib/auto-delete-images-handler';

jest.mock('aws-sdk', () => {
  return { ECR: jest.fn(() => mockECRClient) };
});

beforeEach(() => {
  mockECRClient.listImages.mockReturnThis();
  mockECRClient.batchDeleteImage.mockReturnThis();
  mockECRClient.listTagsForResource.mockReturnThis();
  mockECRClient.describeRepositories.mockReturnThis();
  givenTaggedForDeletion();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('does nothing on create event', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceCreateEvent> = {
    RequestType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockECRClient.listImages).toHaveBeenCalledTimes(0);
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledTimes(0);
});

test('does nothing on update event when everything remains the same', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
    OldResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockECRClient.describeRepositories).toHaveBeenCalledTimes(0);
  expect(mockECRClient.listImages).toHaveBeenCalledTimes(0);
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledTimes(0);
});

test('does nothing on update event when the repository name remains the same but the service token changes', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
    OldResourceProperties: {
      ServiceToken: 'Bar',
      RespositoryName: 'MyRepo',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockECRClient.describeRepositories).toHaveBeenCalledTimes(0);
  expect(mockECRClient.listImages).toHaveBeenCalledTimes(0);
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledTimes(0);
});

test('does nothing on update event when the new resource properties are absent', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    OldResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockECRClient.listImages).toHaveBeenCalledTimes(0);
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledTimes(0);
  expect(mockECRClient.describeRepositories).toHaveBeenCalledTimes(0);
});

test('does nothing on update event when the old resource properties are absent', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockECRClient.listImages).toHaveBeenCalledTimes(0);
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledTimes(0);
  expect(mockECRClient.describeRepositories).toHaveBeenCalledTimes(0);
});

test('deletes all objects when the name changes on update event', async () => {
  // GIVEN
  mockAwsPromise(mockECRClient.describeRepositories, {
    repositories: [
      { repositoryArn: 'RepositoryArn', respositoryName: 'MyRepo' },
    ],
  });

  mockAwsPromise(mockECRClient.listImages, {
    imageIds: [
      { imageDigest: 'ImageDigest1', imageTag: 'ImageTag1' },
      { imageDigest: 'ImageDigest2', imageTag: 'ImageTag2' },
    ],
  });

  const event: Partial<AWSLambda.CloudFormationCustomResourceUpdateEvent> = {
    RequestType: 'Update',
    OldResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo-renamed',
    },
  };

  // WHEN
  await invokeHandler(event);

  // THEN
  expect(mockECRClient.listImages).toHaveBeenCalledTimes(1);
  expect(mockECRClient.listImages).toHaveBeenCalledWith({ repositoryName: 'MyRepo' });
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledTimes(1);
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledWith({
    repositoryName: 'MyRepo',
    imageIds: [
      { imageDigest: 'ImageDigest1', imageTag: 'ImageTag1' },
      { imageDigest: 'ImageDigest2', imageTag: 'ImageTag2' },
    ],
  });
  expect(mockECRClient.describeRepositories).toHaveBeenCalledTimes(1);
});

test('deletes no images on delete event when repository has no images', async () => {
  // GIVEN
  mockECRClient.promise.mockResolvedValue({ imageIds: [] }); // listedImages() call

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
  };
  await invokeHandler(event);

  // THEN
  expect(mockECRClient.listImages).toHaveBeenCalledTimes(1);
  expect(mockECRClient.listImages).toHaveBeenCalledWith({ repositoryName: 'MyRepo' });
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledTimes(0);
  expect(mockECRClient.describeRepositories).toHaveBeenCalledTimes(1);
});

test('deletes all images on delete event', async () => {
  mockECRClient.promise.mockResolvedValue({ // listedImages() call
    imageIds: [
      {
        imageTag: 'tag1',
        imageDigest: 'sha256-1',
      },
      {
        imageTag: 'tag2',
        imageDigest: 'sha256-2',
      },
    ],
  });

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
  };
  await invokeHandler(event);

  // THEN
  expect(mockECRClient.listImages).toHaveBeenCalledTimes(1);
  expect(mockECRClient.listImages).toHaveBeenCalledWith({ repositoryName: 'MyRepo' });
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledTimes(1);
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledWith({
    repositoryName: 'MyRepo',
    imageIds: [
      {
        imageTag: 'tag1',
        imageDigest: 'sha256-1',
      },
      {
        imageTag: 'tag2',
        imageDigest: 'sha256-2',
      },
    ],
  });
});

test('does not empty repository if it is not tagged', async () => {
  // GIVEN
  givenNotTaggedForDeletion();
  mockECRClient.promise.mockResolvedValue({ // listedImages() call
    imageIds: [
      {
        imageTag: 'tag1',
        imageDigest: 'sha256-1',
      },
      {
        imageTag: 'tag2',
        imageDigest: 'sha256-2',
      },
    ],
  });

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
  };
  await invokeHandler(event);

  // THEN
  expect(mockECRClient.batchDeleteImage).not.toHaveBeenCalled();
});

test('delete event where repo has many images does recurse appropriately', async () => {
  // GIVEN
  mockAwsPromise(mockECRClient.describeRepositories, {
    repositories: [
      { repositoryArn: 'RepositoryArn', respositoryName: 'MyRepo' },
    ],
  });

  mockECRClient.promise // listedImages() call
    .mockResolvedValueOnce({
      imageIds: [
        {
          imageTag: 'tag1',
          imageDigest: 'sha256-1',
        },
        {
          imageTag: 'tag2',
          imageDigest: 'sha256-2',
        },
      ],
      nextToken: 'token1',
    })
    .mockResolvedValueOnce(undefined) // batchDeleteImage() call
    .mockResolvedValueOnce({ // listedImages() call
      imageIds: [
        {
          imageTag: 'tag3',
          imageDigest: 'sha256-3',
        },
        {
          imageTag: 'tag4',
          imageDigest: 'sha256-4',
        },
      ],
    });

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
  };
  await invokeHandler(event);

  // THEN
  expect(mockECRClient.describeRepositories).toHaveBeenCalledTimes(1);
  expect(mockECRClient.listImages).toHaveBeenCalledTimes(2);
  expect(mockECRClient.listImages).toHaveBeenCalledWith({ repositoryName: 'MyRepo' });
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledTimes(2);
  expect(mockECRClient.batchDeleteImage).toHaveBeenNthCalledWith(1, {
    repositoryName: 'MyRepo',
    imageIds: [
      {
        imageTag: 'tag1',
        imageDigest: 'sha256-1',
      },
      {
        imageTag: 'tag2',
        imageDigest: 'sha256-2',
      },
    ],
  });
  expect(mockECRClient.batchDeleteImage).toHaveBeenNthCalledWith(2, {
    repositoryName: 'MyRepo',
    imageIds: [
      {
        imageTag: 'tag3',
        imageDigest: 'sha256-3',
      },
      {
        imageTag: 'tag4',
        imageDigest: 'sha256-4',
      },
    ],
  });
});

test('does nothing when the repository does not exist', async () => {
  // GIVEN
  mockECRClient.promise.mockRejectedValue({ name: 'RepositoryNotFoundException' });

  mockAwsPromise(mockECRClient.describeRepositories, {
    repositories: [
      { repositoryArn: 'RepositoryArn', respositoryName: 'MyRepo' },
    ],
  });

  // WHEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceDeleteEvent> = {
    RequestType: 'Delete',
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
  };
  await invokeHandler(event);

  expect(mockECRClient.batchDeleteImage).not.toHaveBeenCalled();
});

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}

function mockAwsPromise<A>(fn: jest.Mock<any, any>, value: A, when: 'once' | 'always' = 'always') {
  (when === 'always' ? fn.mockReturnValue : fn.mockReturnValueOnce).call(fn, {
    promise: () => value,
  });
}

function givenTaggedForDeletion() {
  mockAwsPromise(mockECRClient.listTagsForResource, {
    tags: [
      {
        Key: 'aws-cdk:auto-delete-images',
        Value: 'true',
      },
    ],

  });
}

function givenNotTaggedForDeletion() {
  mockAwsPromise(mockECRClient.listTagsForResource, {
    tags: [],
  });
}