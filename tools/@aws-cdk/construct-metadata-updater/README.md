# CDK Metadata Updater

This tool updates will parse the entire `aws-cdk` repository and does the following things:

1. `ConstructUpdater`: For any L2 construct class, add `addConstructMetadata` method call to track analytics usage and add necessary import statements if missing
2. `ClassesUpdater`: Generate a JSON Blueprint file in `packages/aws-cdk-lib/core/lib/analytics-data-source/classes.ts` that contains all L2 construct class's props
3. `EumsUpdater`: Generate a JSON Blueprint file in `packages/aws-cdk-lib/core/lib/analytics-data-source/classes.ts` that gets all ENUMs type in `aws-cdk` repo.
4. `MethodsUpdater`: To be implemented.
