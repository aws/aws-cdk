import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { IRecordingConfiguration, RecordingConfiguration, Resolution } from '../lib';
import { Storage, ThumbnailConfiguration } from '../lib/thumbnail-configuration';
import { RenditionConfiguration } from '../lib/rendition-configuration';

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

  describe('test rendition configuration', () => {
    test('set rendition all', () => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        bucket,
        renditionConfiguration: RenditionConfiguration.all(),
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
          RenditionSelection: 'ALL',
        },
      });
    });

    test('set rendition none', () => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        bucket,
        renditionConfiguration: RenditionConfiguration.none(),
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
          RenditionSelection: 'NONE',
        },
      });
    });

    test('set rendition custom', () => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        bucket,
        renditionConfiguration: RenditionConfiguration.custom([Resolution.HD, Resolution.SD]),
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
          RenditionSelection: 'CUSTOM',
          Renditions: ['HD', 'SD'],
        },
      });
    });
  });

  describe('test thumbnail configuration', () => {
    test('set thumbnail disable', () => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        recordingConfigurationName: 'my-recording-configuration',
        bucket,
        thumbnailConfiguration: ThumbnailConfiguration.disable(),
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

    test('set thumbnail interval', () => {
      // WHEN
      new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
        recordingConfigurationName: 'my-recording-configuration',
        bucket,
        thumbnailConfiguration: ThumbnailConfiguration.interval(Resolution.HD, [Storage.LATEST, Storage.SEQUENTIAL], Duration.seconds(30)),
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
          Resolution: 'HD',
          Storage: ['LATEST', 'SEQUENTIAL'],
          TargetIntervalSeconds: 30,
        },
      });
    });
  });

  describe('fromRecordingConfigurationId method test', () => {
    let importRecordingConfiguration: IRecordingConfiguration;

    beforeEach(() => {
      app = new App();
      stack = new Stack(app, 'TestStack');
      importRecordingConfiguration = RecordingConfiguration.fromRecordingConfigurationId(stack, 'ImportedRecordingConfiguration', 'my-record-configuration');
    });

    test('should correctly set recordingConfigurationId', () => {
      expect(importRecordingConfiguration.recordingConfigurationId).toEqual('my-record-configuration');
    });

    test('should correctly format recordingConfigurationArn', () => {
      expect(importRecordingConfiguration.recordingConfigurationArn).toEqual(
        Stack.of(stack).formatArn({
          service: 'ivs',
          resource: 'recording-configuration',
          resourceName: 'my-record-configuration',
        }),
      );
    });
  });

  describe('fromArn method test', () => {
    let importRecordingConfiguration: IRecordingConfiguration;

    beforeEach(() => {
      app = new App();
      stack = new Stack(app, 'TestStack');
      importRecordingConfiguration = RecordingConfiguration.fromArn(stack, 'ImportedRecordingConfiguration', 'arn:aws:ivs:us-east-1:012345678912:recording-configuration/my-record-configuration');
    });

    test('should correctly set recordingConfigurationId', () => {
      expect(importRecordingConfiguration.recordingConfigurationId).toEqual('my-record-configuration');
    });

    test('should correctly format recordingConfigurationArn', () => {
      expect(importRecordingConfiguration.recordingConfigurationArn).toEqual('arn:aws:ivs:us-east-1:012345678912:recording-configuration/my-record-configuration');
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

  describe('validate thumbnailConfiguraion test', () => {
    test('throws when targetInterval is smaller than 1 second.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          thumbnailConfiguration: ThumbnailConfiguration.interval(Resolution.HD, [Storage.LATEST], Duration.millis(1)),
        });
      }).toThrow('\`targetInterval\` must be between 1 and 60 seconds, got 1 milliseconds.');
    });

    test('throws when targetInterval is invalid seconds.', () => {
      expect(() => {
        new RecordingConfiguration(stack, 'MyRecordingConfiguration', {
          bucket,
          thumbnailConfiguration: ThumbnailConfiguration.interval(Resolution.HD, [Storage.LATEST], Duration.seconds(61)),
        });
      }).toThrow('\`targetInterval\` must be between 1 and 60 seconds, got 61 seconds.');
    });
  });
});
