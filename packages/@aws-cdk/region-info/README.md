## AWS region information, such as service principal names
### Usage
Information pertaining to an AWS Region can be obtained using the `RegionInfo`
class:

```ts
const dublin = RegionInfo.forRegion('eu-west-1');
```

### User-supplied region information
The library comes pre-loaded with information about all publicly available AWS
regions as of the release date of a particular version. It is possible this
information is incomplete (or possibly incorrect). A user can provide their own
region information by placing data in a JSON document at
`~/.cdk/region-info.json`. The location of the file can be customized either by
setting the `CDK_REGION_INFO_PATH` environment variable, or by setting the
`RegionInfo.userDataPath` property.

The file must contain a single region information object, or an array of region
information objects, which must conform to the JSON-Schema found in this
package's `schema/region-info.schema.json` file, for example:

```json
[
  {
    // Obviously not a "real" region:
    "name": "bermuda-triangle-42",
    "partition": "aws-phony",
    "s3WebsiteEndpoint": "s3-website.bermuda-triangle-42.amazonawstest.com",
    "servicePrincipals": {
      "codedeploy": "codedeploy.bermuda-triangle-42.amazonawstest.com",
      "s3": "s3.amazonawstest.com",
      "sqs": "sqs.amazonaws.com"
    }
  }
]
```

User-supplied region information has a higher precedence than built-in
information, so any region specified in the user data file will effectively
replace any built-in data (this helps guarantee stability of the results of the
call when upgrading this library).

---

This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.
