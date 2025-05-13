# CDK Enum Updater

This tool updates CDK enums with missing enum values on a weekly basis. It is triggered by the following two Github workflows:
 * [Update Enum Static Mapping](../../../.github/workflows/enum-static-mapping-updater.yml) - Runs every week on Monday 12am
 * [Update Missing Enum Values](../../../.github/workflows/enum-auto-updater.yml) - Runs every week on Monday 1pm

To run the tool locally, run the following commands to install dependencies and build:

```
yarn install
yarn build
```

To run the logic for updating the static mapping file, `lib/static-enum-mapping.json`, run the following command:
```
./bin/update-static-enum-mapping
```

The logic for this step is in `lib/static-enum-mapping-updater.ts`


To run the logic for identifying missing enum values and creating the code changes, run the following command:
```
./bin/update-missing-enums
```

The logic for this step is in `lib/missing-enum-updater.ts`

## Exclusions
Exclusions should be added to the `lib/exclude-values.json` file. There are 2 cases where an exclusion may be needed:

1. If an invalid static mapping is being created in `lib/static-enum-mapping.json`
2. If an invalid enum value is being added for a correctly mapped enum

For case #1, add an entry with the following format:

```
{
    "modulename": {
        "EnumName": {
            "comment": "Reason for exclusion"
        },
    }
}
```

Example:
```
{
    "cloudtrail": {
        "DataResourceType": {
            "comment": "New DataResourceType need further change. Backfilling enum is not enough"
        }
    },
}
```

For case #2, add an entry with the following format (with the `values` field specified):
```
{
    "modulename": {
        "EnumName": {
            "values": ["ENUM_VALUE_1", "ENUM_VALUE_2"],
            "comment": "Reason for exclusion"
        },
    }
}
```

Example:
```
{
    "ec2": {
        "VpcEndpointIpAddressType": {
            "values": ["NOT_SPECIFIED"],
            "comment": "Although NOT_SPECIFIED is a valid value, but for CDK customers can just not provide the value for that property"
        },
        "VpcEndpointDnsRecordIpType": {
            "values": ["NOT_SPECIFIED"],
            "comment": "Although NOT_SPECIFIED is a valid value, but for CDK customers can just not provide the value for that property"
        },
        "VpcEndpointPrivateDnsOnlyForInboundResolverEndpoint": {
            "values": ["NOTSPECIFIED"],
            "comment": "Although NOTSPECIFIED is a valid value, but for CDK customers can just not provide the value for that property"
        }
    }
}
```

All exclusions for a module should be listed together. For example if you want to exclude certain enum mappings from being created and also exclude certain values for an enum within one module, list them together like so:
```
{
    "autoscaling": {
        "EbsDeviceVolumeType": {
            "values": ["IO2"],
            "comment": "io2 is not supported in CFN https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-launchconfiguration-blockdevice.html#cfn-autoscaling-launchconfiguration-blockdevice-volumetype"
        },
        "HealthCheckType": {
            "comment": "Already defined in AddtionalHealthCheckType"
        },
        "AdditionalHealthCheckType": {
            "comment": "EC2 is the default value and does not need to be defined in AdditionalHealthCheckType"
        }
    }
}
```

### Manual Static Mapping Overrides
Sometimes the script will calculate the wrong static enum mapping. You can override this value by adding an entry to the `lib/manual-enum-mapping.json` file. 

Manual mappings should be added in the form:
```
{
    "serviceName": {
      "CdkEnumName": {
        "cdk_path": "path/to/cdkEnum",
        "sdk_service": "serviceName",
        "sdk_enum_name": "AwsEnumThatWeWantThisToMapTo",
        "match_percentage": 1.0,
      }
    }
}
```

For example:
```
{
    "ec2": {
      "VpcEndpointIpAddressType": {
        "cdk_path": "aws-cdk/packages/aws-cdk-lib/aws-ec2/lib/vpc-endpoint.ts",
        "sdk_service": "ec2",
        "sdk_enum_name": "IpAddressType",
        "match_percentage": 1.0,
      }
    }
}
```

The entry that is overwritten in the `lib/static-enum-mapping.json` file will contain a field `manual: true`:
```
{
    "ec2": {
      "VpcEndpointIpAddressType": {
        "cdk_path": "aws-cdk/packages/aws-cdk-lib/aws-ec2/lib/vpc-endpoint.ts",
        "sdk_service": "ec2",
        "sdk_enum_name": "IpAddressType",
        "match_percentage": 1.0,
        "manual": true,
      }
    }
}
```