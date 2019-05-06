import { expect } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';

import glue = require('../lib');

export = {
  'default database creates a bucket to store the datbase'(test: Test) {
    const stack = new cdk.Stack();

    new glue.Database(stack, 'Database', {
      databaseName: 'test_database'
    });

    expect(stack).toMatch({
      Resources: {
        DatabaseBucket318AF64F: {
          Type: 'AWS::S3::Bucket',
          DeletionPolicy: "Retain"
        },
        DatabaseB269D8BB: {
          Type: 'AWS::Glue::Database',
          Properties: {
            CatalogId: {
              Ref: "AWS::AccountId"
            },
            DatabaseInput: {
              LocationUri: {
                "Fn::Join": [
                  "",
                  [
                    "s3://",
                    {
                      Ref: "DatabaseBucket318AF64F"
                    },
                    "/test_database"
                  ]
                ]
              },
              Name: "test_database"
            }
          }
        }
      }
    });

    test.done();
  },

  'explicit locationURI'(test: Test) {
    const stack = new cdk.Stack();

    new glue.Database(stack, 'Database', {
      databaseName: 'test_database',
      locationUri: 's3://my-uri/'
    });

    expect(stack).toMatch({
      Resources: {
        DatabaseB269D8BB: {
          Type: 'AWS::Glue::Database',
          Properties: {
            CatalogId: {
              Ref: "AWS::AccountId"
            },
            DatabaseInput: {
              LocationUri: 's3://my-uri/',
              Name: "test_database"
            }
          }
        }
      }
    });

    test.done();
  },

  'export creates Outputs for catalog ARN/Id, database ARN/Name/LocationURI'(test: Test) {
    const stack = new cdk.Stack();

    const db = new glue.Database(stack, 'Database', {
      databaseName: 'test_database'
    });

    glue.Database.fromDatabaseAttributes(new cdk.Stack(), 'Database', db.export());

    expect(stack).toMatch({
      Resources: {
        DatabaseBucket318AF64F: {
          Type: 'AWS::S3::Bucket',
          DeletionPolicy: "Retain"
        },
        DatabaseB269D8BB: {
          Type: 'AWS::Glue::Database',
          Properties: {
            CatalogId: {
              Ref: "AWS::AccountId"
            },
            DatabaseInput: {
              LocationUri: {
                "Fn::Join": [
                  "",
                  [
                    "s3://",
                    {
                      Ref: "DatabaseBucket318AF64F"
                    },
                    "/test_database"
                  ]
                ]
              },
              Name: "test_database"
            }
          }
        }
      },
      Outputs: {
        DatabaseCatalogArnE5C8063F: {
          Value: {
            "Fn::Join": [
              "",
              [
                "arn:",
                {
                  Ref: "AWS::Partition"
                },
                ":glue:",
                {
                  Ref: "AWS::Region"
                },
                ":",
                {
                  Ref: "AWS::AccountId"
                },
                ":catalog"
              ]
            ]
          },
          Export: {
            Name: "Stack:DatabaseCatalogArnE5C8063F"
          }
        },
        DatabaseCatalogId509C6547: {
          Value: {
            Ref: "AWS::AccountId"
          },
          Export: {
            Name: "Stack:DatabaseCatalogId509C6547"
          }
        },
        DatabaseDatabaseArn157B38E0: {
          Value: {
            "Fn::Join": [
              "",
              [
                "arn:",
                {
                  Ref: "AWS::Partition"
                },
                ":glue:",
                {
                  Ref: "AWS::Region"
                },
                ":",
                {
                  Ref: "AWS::AccountId"
                },
                ":database/",
                {
                  Ref: "DatabaseB269D8BB"
                }
              ]
            ]
          },
          Export: {
            Name: "Stack:DatabaseDatabaseArn157B38E0"
          }
        },
        DatabaseDatabaseName925B74A8: {
          Value: {
            Ref: "DatabaseB269D8BB"
          },
          Export: {
            Name: "Stack:DatabaseDatabaseName925B74A8"
          }
        },
        DatabaseLocationURIF74653AF: {
          Value: {
            "Fn::Join": [
              "",
              [
                "s3://",
                {
                  Ref: "DatabaseBucket318AF64F"
                },
                "/test_database"
              ]
            ]
          },
          Export: {
            Name: "Stack:DatabaseLocationURIF74653AF"
          }
        }
      }
    });

    test.done();
  }
};
