# CDK Examples

Each example is a CDK app and resides in a separate directory alongside a
`cdk.json` file that points to the app's index.

Dependencies and build configuration are shared via a a single `package.json`
file at the root.

To synthesize or deploy and example app, you will first need to build it:

```shell
npm run prepare
```

Or you can watch:

```shell
npm run watch
```

Then, you can just use the CDK Toolkit in each example directory:

```shell
$ cd hello-cdk
$ cdk synth
Resources:
    TableCD117FA1:
        Type: 'AWS::DynamoDB::Table'
        Properties:
            AttributeDefinitions:
                -
                    AttributeName: ID
                    AttributeType: S
                -
                    AttributeName: Timestamp
                    AttributeType: N
            KeySchema:
                -
                    AttributeName: ID
                    KeyType: HASH
                -
                    AttributeName: Timestamp
                    KeyType: RANGE
            ProvisionedThroughput:
                ReadCapacityUnits: 1
                WriteCapacityUnits: 1
```
