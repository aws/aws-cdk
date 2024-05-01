# Some sample CloudTrail events

For reference.


## S3

PutObject

    {
      "eventSource": "s3.amazonaws.com",
      "resources": [
        {
          "ARN": "arn:aws:s3:::BUCKETNAME/OBJECTKEY",
          "type": "AWS::S3::Object"
        },
        {
          "accountId": "123456789012",
          "ARN": "arn:aws:s3:::BUCKETNAME",
          "type": "AWS::S3::Bucket"
        }
      ],
      "eventTime": "2020-05-22T08:38:05Z",
      "userAgent": "[aws-cli/1.16.96 Python/2.7.12 Linux/4.4.0-146-generic botocore/1.12.86]",
      "readOnly": false,
      "recipientAccountId": "123456789012",
      "awsRegion": "eu-west-1",
      "requestID": "CF9748DFDC5FB0A4",
      "additionalEventData": {
        "CipherSuite": "ECDHE-RSA-AES128-GCM-SHA256",
        "bytesTransferredOut": 0,
        "AuthenticationMethod": "AuthHeader",
        "x-amz-id-2": "hRJMAs5p4ALZIabP4ATIL53npWU61+N6LYWj02gdQtR0ymKSySzVXUSZx7ydv7tRJwk+XMaPerM=",
        "bytesTransferredIn": 197,
        "SignatureVersion": "SigV4"
      },
      "eventType": "AwsApiCall",
      "eventID": "3074546e-1bfa-4973-8502-b1bb4d0bda1a",
      "eventVersion": "1.05",
      "eventName": "PutObject",
      "sourceIPAddress": "1.2.3.4",
      "userIdentity": {
        "accountId": "123456789012",
        "type": "AssumedRole",
        "principalId": "AROAJBNCAL3UTR5C42U4M:user-SomeRole",
        "accessKeyId": "AZYCAIJERO6H7",
        "sessionContext": {
          "attributes": {
            "mfaAuthenticated": "false",
            "creationDate": "2020-05-22T08:10:21Z"
          },
          "sessionIssuer": {
            "accountId": "123456789012",
            "type": "Role",
            "principalId": "AROAJBNCAL3UTR5C42U4M",
            "userName": "SomeRole",
            "arn": "arn:aws:iam::123456789012:role/SomeRole"
          }
        },
        "arn": "arn:aws:sts::123456789012:assumed-role/SomeRole/user-SomeRole"
      },
      "responseElements": null,
      "requestParameters": {
        "bucketName": "BUCKETNAME",
        "Host": "BUCKETNAME.s3.eu-west-1.amazonaws.com",
        "key": "OBJECTKEY"
      }
    }
