const mockECRClient = {
  listImages: jest.fn(),
  batchDeleteImage: jest.fn(),
  describeRepositories: jest.fn(),
  listTagsForResource: jest.fn(),
};

import { autoDeleteHandler } from '../../lib/aws-ecr/auto-delete-images-handler';

jest.mock('@aws-sdk/client-ecr', () => {
  return {
    ECR: jest.fn().mockImplementation(() => {
      return mockECRClient;
    }),
  };
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
  mockECRClient.describeRepositories.mockReturnValue({
    repositories: [
      { repositoryArn: 'RepositoryArn', respositoryName: 'MyRepo' },
    ],
  });

  mockECRClient.listImages.mockReturnValue({
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
  expect(mockECRClient.describeRepositories).toHaveBeenCalledTimes(1);
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
});

test('deletes no images on delete event when repository has no images', async () => {
  // GIVEN
  mockECRClient.listImages.mockResolvedValue({ imageIds: [] }); // listedImages() call

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
  mockECRClient.listImages.mockResolvedValue({ // listedImages() call
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
  mockECRClient.listImages.mockResolvedValue({ // listedImages() call
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
  mockECRClient.describeRepositories.mockReturnValue({
    repositories: [
      { repositoryArn: 'RepositoryArn', respositoryName: 'MyRepo' },
    ],
  });

  mockECRClient.listImages // listedImages() call
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
    });
  mockECRClient.batchDeleteImage.mockResolvedValueOnce(undefined); // batchDeleteImage() call
  mockECRClient.listImages.mockResolvedValueOnce({ // listedImages() call
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
  mockECRClient.listImages.mockImplementation(async () => {
    const { RepositoryNotFoundException } = jest.requireActual('@aws-sdk/client-ecr');
    return new RepositoryNotFoundException({ name: '', $metadata: {} });
  });

  mockECRClient.describeRepositories.mockReturnValue({
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

test('delete event where repo has tagged images and untagged images', async () => {
  // GIVEN
  mockECRClient.describeRepositories.mockReturnValue({
    repositories: [
      { repositoryArn: 'RepositoryArn', respositoryName: 'MyRepo' },
    ],
  });

  mockECRClient.listImages // listedImages() call
    .mockResolvedValueOnce({
      imageIds: [
        {
          imageTag: 'tag1',
          imageDigest: 'sha256-1',
        },
        {
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
  expect(mockECRClient.describeRepositories).toHaveBeenCalledTimes(1);
  expect(mockECRClient.listImages).toHaveBeenCalledTimes(1);
  expect(mockECRClient.listImages).toHaveBeenCalledWith({ repositoryName: 'MyRepo' });
  expect(mockECRClient.batchDeleteImage).toHaveBeenCalledTimes(2);
  expect(mockECRClient.batchDeleteImage).toHaveBeenNthCalledWith(1, {
    repositoryName: 'MyRepo',
    imageIds: [
      {
        imageTag: 'tag1',
        imageDigest: 'sha256-1',
      },
    ],
  });
  expect(mockECRClient.batchDeleteImage).toHaveBeenNthCalledWith(2, {
    repositoryName: 'MyRepo',
    imageIds: [
      {
        imageDigest: 'sha256-2',
      },
    ],
  });
});

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return autoDeleteHandler(event as AWSLambda.CloudFormationCustomResourceEvent);
}

function givenTaggedForDeletion() {
  mockECRClient.listTagsForResource.mockReturnValue({
    tags: [
      {
        Key: 'aws-cdk:auto-delete-images',
        Value: 'true',
      },
    ],
  });
}

function givenNotTaggedForDeletion() {
  mockECRClient.listTagsForResource.mockReturnValue({
    tags: [],
  });
}
