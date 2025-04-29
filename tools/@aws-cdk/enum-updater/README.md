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

the logic for this step is in `lib/missing-enum-updater.ts`