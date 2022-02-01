import { canonicalizeTemplate } from '../lib';

test('Canonicalize asset parameters and references to them', () => {
  const template = {
    Resources: {
      AResource: {
        Type: 'Some::Resource',
        Properties: {
          SomeValue: { Ref: 'AssetParametersea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161S3Bucket0C424907' },
        },
      },
    },
    Parameters: {
      AssetParametersea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161S3Bucket0C424907: {
        Type: 'String',
        Description: 'S3 bucket for asset \'ea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161\'',
      },
      AssetParametersea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161S3VersionKey6841F1F8: {
        Type: 'String',
        Description: 'S3 key for asset version \'ea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161\'',
      },
      AssetParametersea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161ArtifactHash67B22EF2: {
        Type: 'String',
        Description: 'Artifact hash for asset \'ea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161\'',
      },
    },
  };

  const expected = {
    Resources: {
      AResource: {
        Type: 'Some::Resource',
        Properties: {
          SomeValue: { Ref: 'Asset1S3Bucket' },
        },
      },
    },
    Parameters: {
      Asset1S3Bucket: {
        Type: 'String',
        Description: 'S3 bucket for asset \'Asset1Hash\'',
      },
      Asset1S3VersionKey: {
        Type: 'String',
        Description: 'S3 key for asset version \'Asset1Hash\'',
      },
      Asset1ArtifactHash: {
        Type: 'String',
        Description: 'Artifact hash for asset \'Asset1Hash\'',
      },
    },
  };

  expect(canonicalizeTemplate(template)).toEqual(expected);
});

test('Distinguished 2 different assets', () => {
  const template = {
    Resources: {
      AResource: {
        Type: 'Some::Resource',
        Properties: {
          SomeValue: { Ref: 'AssetParametersea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161S3Bucket0C424907' },
          OtherValue: { Ref: 'AssetParameters1111111111111111111111111111111111122222222222222222222222222222ArtifactHash67B22EF2' },
        },
      },
    },
    Parameters: {
      AssetParametersea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161S3Bucket0C424907: {
        Type: 'String',
        Description: 'S3 bucket for asset \'ea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161\'',
      },
      AssetParametersea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161S3VersionKey6841F1F8: {
        Type: 'String',
        Description: 'S3 key for asset version \'ea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161\'',
      },
      AssetParametersea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161ArtifactHash67B22EF2: {
        Type: 'String',
        Description: 'Artifact hash for asset \'ea46702e1c05b2735e48e826d630f7bf6acdf7e55d6fa8d9fa8df858d5542161\'',
      },
      AssetParameters1111111111111111111111111111111111122222222222222222222222222222S3Bucket0C424907: {
        Type: 'String',
        Description: 'S3 bucket for asset \'1111111111111111111111111111111111122222222222222222222222222222\'',
      },
      AssetParameters1111111111111111111111111111111111122222222222222222222222222222S3VersionKey6841F1F8: {
        Type: 'String',
        Description: 'S3 key for asset version \'1111111111111111111111111111111111122222222222222222222222222222\'',
      },
      AssetParameters1111111111111111111111111111111111122222222222222222222222222222ArtifactHash67B22EF2: {
        Type: 'String',
        Description: 'Artifact hash for asset \'1111111111111111111111111111111111122222222222222222222222222222\'',
      },
    },
  };

  const expected = {
    Resources: {
      AResource: {
        Type: 'Some::Resource',
        Properties: {
          SomeValue: { Ref: 'Asset1S3Bucket' },
          OtherValue: { Ref: 'Asset2ArtifactHash' },
        },
      },
    },
    Parameters: {
      Asset1S3Bucket: {
        Type: 'String',
        Description: 'S3 bucket for asset \'Asset1Hash\'',
      },
      Asset1S3VersionKey: {
        Type: 'String',
        Description: 'S3 key for asset version \'Asset1Hash\'',
      },
      Asset1ArtifactHash: {
        Type: 'String',
        Description: 'Artifact hash for asset \'Asset1Hash\'',
      },
      Asset2S3Bucket: {
        Type: 'String',
        Description: 'S3 bucket for asset \'Asset2Hash\'',
      },
      Asset2S3VersionKey: {
        Type: 'String',
        Description: 'S3 key for asset version \'Asset2Hash\'',
      },
      Asset2ArtifactHash: {
        Type: 'String',
        Description: 'Artifact hash for asset \'Asset2Hash\'',
      },
    },
  };

  expect(canonicalizeTemplate(template)).toEqual(expected);
});