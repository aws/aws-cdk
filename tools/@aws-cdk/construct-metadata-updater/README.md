# CDK Metadata Updater

This tool updates will parse the entire `aws-cdk` repository and does the following things:

1. `ConstructUpdater`: For any non-abstract L2 construct class, add `addConstructMetadata` method call to the constructor to track analytics usage and add necessary import statements if missing
2. `PropertyUpdater`: Generate a JSON Blueprint file in `packages/aws-cdk-lib/core/lib/analytics-data-source/classes.ts` that contains all L2 construct class's props as well as public methods' props.
3. `EnumsUpdater`: Generate a JSON Blueprint file in `packages/aws-cdk-lib/core/lib/analytics-data-source/enums.ts` that gets all ENUMs type in `aws-cdk` repo.
4. `MethodsUpdater`: For any non-abstract L2 construct class, add `@MethodMetadata` decorator to public methods to track analytics usage and add necessary import statements if missing