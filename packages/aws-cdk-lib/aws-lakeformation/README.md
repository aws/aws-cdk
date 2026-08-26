# AWS::LakeFormation Construct Library

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

```ts nofixture
import * as lakeformation from 'aws-cdk-lib/aws-lakeformation';
```

<!--BEGIN CFNONLY DISCLAIMER-->

There are no official hand-written ([L2](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) constructs for this service yet. Here are some suggestions on how to proceed:

- Search [Construct Hub for LakeFormation construct libraries](https://constructs.dev/search?q=lakeformation)
- Use the automatically generated [L1](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_l1_using) constructs, in the same way you would use [the CloudFormation AWS::LakeFormation resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_LakeFormation.html) directly.

<!--BEGIN CFNONLY DISCLAIMER-->

There are no hand-written ([L2](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) constructs for this service yet.
However, you can still use the automatically generated [L1](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_l1_using) constructs, and use this service exactly as you would using CloudFormation directly.

For more information on the resources and properties available for this service, see the [CloudFormation documentation for AWS::LakeFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_LakeFormation.html).

(Read the [CDK Contributing Guide](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md) and submit an RFC if you are interested in contributing to this construct library.)

<!--END CFNONLY DISCLAIMER-->

## Example

Here is an example of creating a glue table and putting lakeformation tags on it. Note: this example uses deprecated constructs and overly permissive IAM roles. This example is meant to give a general idea of using the L1s; it is not production level.

```ts
import * as cdk from 'aws-cdk-lib';
import { S3Table, Database, DataFormat, Schema } from '@aws-cdk/aws-glue-alpha';
import { CfnDataLakeSettings, CfnTag, CfnTagAssociation } from 'aws-cdk-lib/aws-lakeformation';

declare const stack: cdk.Stack;
declare const accountId: string;

const tagKey = 'aws';
const tagValues = ['dev'];

const database = new Database(this, 'Database');

const table = new S3Table(this, 'Table', {
  database,
  columns: [
    {
      name: 'col1',
      type: Schema.STRING,
    },
    {
      name: 'col2',
      type: Schema.STRING,
    }
  ],
  dataFormat: DataFormat.CSV,
});

const synthesizer = stack.synthesizer as cdk.DefaultStackSynthesizer;
new CfnDataLakeSettings(this, 'DataLakeSettings', {
  admins: [
    { 
      dataLakePrincipalIdentifier: stack.formatArn({
        service: 'iam',
        resource: 'role',
        region: '',
        account: accountId,
        resourceName: 'Admin',
      }),
    },
    {
      // The CDK cloudformation execution role.
      dataLakePrincipalIdentifier: synthesizer.cloudFormationExecutionRoleArn.replace('${AWS::Partition}', 'aws'),
    },
  ],
});

const tag = new CfnTag(this, 'Tag', {
  catalogId: accountId,
  tagKey,
  tagValues,
});

const lfTagPairProperty: CfnTagAssociation.LFTagPairProperty = {
  catalogId: accountId,
  tagKey,
  tagValues,
};

const tagAssociation = new CfnTagAssociation(this, 'TagAssociation', {
  lfTags: [lfTagPairProperty],
  resource: {
    tableWithColumns: {
      databaseName: database.databaseName,
      columnNames: ['col1', 'col2'],
      catalogId: accountId,
      name: table.tableName,
    }
  }
});

tagAssociation.node.addDependency(tag);
tagAssociation.node.addDependency(table);

```

Additionally, you may need to use the lakeformation console to give permissions, particularly to give the cdk-exec-role tagging permissions.
