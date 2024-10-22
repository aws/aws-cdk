import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { RecordingConfiguration, RenditionSelection, Resolution, ThumbnailRecordingMode, ThumbnailStorage } from '../lib';

describe('IVS Recording Configuration', () => {
  let app: App;
  let stack: Stack;
  let bucket: Bucket;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack', {});
    bucket = new Bucket(stack, 'Bucket', {});
  });

  test('creates a recording configuration with minimum properties', () => {
    // WHEN
    new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
      recordingConfigurationName: 'my-recording-configuration',
      bucket,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IVS::RecordingConfiguration', {
      Name: 'my-recording-configuration',
      DestinationConfiguration: {
        S3: {
          BucketName: stack.resolve(bucket.bucketName),
        },
      },
    });
  });

  test('set recordingReconnectWindowSeconds', () => {
    // WHEN
    new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
      recordingConfigurationName: 'my-recording-configuration',
      bucket,
      recordingReconnectWindow: Duration.seconds(30),
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IVS::RecordingConfiguration', {
      Name: 'my-recording-configuration',
      DestinationConfiguration: {
        S3: {
          BucketName: stack.resolve(bucket.bucketName),
        },
      },
      RecordingReconnectWindowSeconds: 30,
    });
  });

  describe('test rendition settings', () => {
    test.each([
      RenditionSelection.ALL,
      RenditionSelection.NONE,
    ])('set renditionSelection to %s and renditions to %s', (renditionSelection) => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        bucket,
        renditionSelection,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IVS::RecordingConfiguration', {
        DestinationConfiguration: {
          S3: {
            BucketName: stack.resolve(bucket.bucketName),
          },
        },
        RenditionConfiguration: {
          RenditionSelection: renditionSelection,
        },
      });
    });

    test.each([
      [RenditionSelection.CUSTOM, [Resolution.FULL_HD]],
      [RenditionSelection.CUSTOM, [Resolution.FULL_HD, Resolution.HD, Resolution.SD, Resolution.LOWEST_RESOLUTION]],
    ])('set renditionSelection to %s and renditions to %s', (renditionSelection, renditions) => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        bucket,
        renditionSelection,
        renditions,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IVS::RecordingConfiguration', {
        DestinationConfiguration: {
          S3: {
            BucketName: stack.resolve(bucket.bucketName),
          },
        },
        RenditionConfiguration: {
          RenditionSelection: renditionSelection,
          Renditions: renditions,
        },
      });
    });

    test.each([
      [RenditionSelection.CUSTOM, [Resolution.FULL_HD]],
      [RenditionSelection.CUSTOM, [Resolution.FULL_HD, Resolution.HD, Resolution.SD, Resolution.LOWEST_RESOLUTION]],
    ])('set renditionSelection to %s and renditions to %s', (renditionSelection, renditions) => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        bucket,
        renditionSelection,
        renditions,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IVS::RecordingConfiguration', {
        DestinationConfiguration: {
          S3: {
            BucketName: stack.resolve(bucket.bucketName),
          },
        },
        RenditionConfiguration: {
          RenditionSelection: renditionSelection,
          Renditions: renditions,
        },
      });
    });
  });

  describe('test thumbnail settings', () => {
    test('set thumbnailRecordingMode to ThumbnailRecordingMode.DISABLED', () => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        recordingConfigurationName: 'my-recording-configuration',
        bucket,
        thumbnailRecordingMode: ThumbnailRecordingMode.DISABLED,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IVS::RecordingConfiguration', {
        Name: 'my-recording-configuration',
        DestinationConfiguration: {
          S3: {
            BucketName: stack.resolve(bucket.bucketName),
          },
        },
        ThumbnailConfiguration: {
          RecordingMode: 'DISABLED',
        },
      });
    });

    test.each([
      Resolution.FULL_HD,
      Resolution.HD,
      Resolution.SD,
      Resolution.LOWEST_RESOLUTION,
    ])('set thumbnairlResolution to %s when thumbnailRecordingMode is ThumbnailRecordingMode.INTERVAL', (thumbnailResolution) => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        recordingConfigurationName: 'my-recording-configuration',
        bucket,
        thumbnailRecordingMode: ThumbnailRecordingMode.INTERVAL,
        thumbnailResolution,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IVS::RecordingConfiguration', {
        Name: 'my-recording-configuration',
        DestinationConfiguration: {
          S3: {
            BucketName: stack.resolve(bucket.bucketName),
          },
        },
        ThumbnailConfiguration: {
          RecordingMode: 'INTERVAL',
          Resolution: thumbnailResolution,
        },
      });
    });

    test.each([
      [[ThumbnailStorage.LATEST]],
      [[ThumbnailStorage.LATEST, ThumbnailStorage.SEQUENTIAL]],
    ])('set thumbnailStorage to %s when thumbnailRecordingMode is ThumbnailRecordingMode.INTERVAL', (thumbnailStorage) => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        recordingConfigurationName: 'my-recording-configuration',
        bucket,
        thumbnailRecordingMode: ThumbnailRecordingMode.INTERVAL,
        thumbnailStorage,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IVS::RecordingConfiguration', {
        Name: 'my-recording-configuration',
        DestinationConfiguration: {
          S3: {
            BucketName: stack.resolve(bucket.bucketName),
          },
        },
        ThumbnailConfiguration: {
          RecordingMode: 'INTERVAL',
          Storage: thumbnailStorage,
        },
      });
    });

    test('set thumbnailTargetInterval', () => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        recordingConfigurationName: 'my-recording-configuration',
        bucket,
        thumbnailRecordingMode: ThumbnailRecordingMode.INTERVAL,
        thumbnailTargetInterval: Duration.seconds(30),
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IVS::RecordingConfiguration', {
        Name: 'my-recording-configuration',
        DestinationConfiguration: {
          S3: {
            BucketName: stack.resolve(bucket.bucketName),
          },
        },
        ThumbnailConfiguration: {
          RecordingMode: 'INTERVAL',
          TargetIntervalSeconds: 30,
        },
      });
    });
  });

  describe('validateRecordingConfigurationName test', () => {
    test('throws when recordingConfigurationName include invalid characters.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          recordingConfigurationName: 'invalid name',
        });
      }).toThrow('\`recordingConfigurationName\` must consist only of alphanumeric characters, hyphens or underbars, got: invalid name.');
    },
    );

    test('throws when recordingConfigurationName length is invalid.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          recordingConfigurationName: 'a'.repeat(129),
        });
      }).toThrow('\`recordingConfigurationName\` must be less than or equal to 128 characters, got: 129 characters.');
    },
    );
  });

  describe('validateRecordingReconnectWindowSeconds test', () => {
    test('throws when recordingReconnectWindow is smaller than 1 second.', () => {

      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          recordingReconnectWindow: Duration.millis(1),
        });
      }).toThrow('\`recordingReconnectWindow\` must be between 0 and 300 seconds, got 1 milliseconds.');
    });

    test('throws when recordingReconnectWindow is invalid seconds.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          recordingReconnectWindow: Duration.seconds(301),
        });
      }).toThrow('\`recordingReconnectWindow\` must be between 0 and 300 seconds, got 301 seconds.');
    });
  });

  describe('validateRenditionSettings test', () => {
    test('throws when renditionSelection is RenditionSelection.CUSTOM without renditions.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          thumbnailRecordingMode: ThumbnailRecordingMode.INTERVAL,
          renditionSelection: RenditionSelection.CUSTOM,
        });
      }).toThrow('`renditions` must be provided when \`renditionSelection\` is `RenditionSelection.CUSTOM`.');
    });

    test('throws when thumbnailTargetInterval is invalid seconds.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          thumbnailRecordingMode: ThumbnailRecordingMode.INTERVAL,
          renditionSelection: RenditionSelection.ALL,
          renditions: [Resolution.FULL_HD],
        });
      }).toThrow('\`renditions\` can only be set when \`renditionSelection\` is \`RenditionSelection.CUSTOM\`, got ALL.');
    });
  });

  describe('validateThumbnailSettings test', () => {
    test('throws when thumbnailTargetInterval is smaller than 1 second.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          thumbnailRecordingMode: ThumbnailRecordingMode.INTERVAL,
          thumbnailTargetInterval: Duration.millis(1),
        });
      }).toThrow('\`thumbnailTargetInterval\` must be between 1 and 60 seconds, got 1 milliseconds.');
    });

    test('throws when thumbnailTargetInterval is invalid seconds.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          thumbnailRecordingMode: ThumbnailRecordingMode.INTERVAL,
          thumbnailTargetInterval: Duration.seconds(61),
        });
      }).toThrow('\`thumbnailTargetInterval\` must be between 1 and 60 seconds, got 61 seconds.');
    });

    test('throws when thumbnailResolution is set with not ThmbnailRecordingMode.INTERVAL.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          thumbnailRecordingMode: ThumbnailRecordingMode.DISABLED,
          thumbnailResolution: Resolution.FULL_HD,
        });
      }).toThrow('`thumbnailResolution` can only be set when `thumbnailRecordingMode` is `ThumbnailRecordingMode.INTERVAL`.');
    });

    test('throws when thumbnailStorage is set with not ThmbnailRecordingMode.INTERVAL.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          thumbnailRecordingMode: ThumbnailRecordingMode.DISABLED,
          thumbnailStorage: [ThumbnailStorage.LATEST],
        });
      }).toThrow('`thumbnailStorage` can only be set when `thumbnailRecordingMode` is `ThumbnailRecordingMode.INTERVAL`.');
    });

    test('throws when thumbnailTargetInterval is set with not ThmbnailRecordingMode.INTERVAL.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          thumbnailRecordingMode: ThumbnailRecordingMode.DISABLED,
          thumbnailTargetInterval: Duration.seconds(30),
        });
      }).toThrow('`thumbnailTargetInterval` can only be set when `thumbnailRecordingMode` is `ThumbnailRecordingMode.INTERVAL`.');
    });
  });
});