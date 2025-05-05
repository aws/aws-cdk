# CDK Enum Updater

This tool updates CDK enums with missing enum values on a weekly basis.

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