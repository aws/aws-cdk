# Staging Stack Resource Names

The Staging Stack can produce the following types of resources, depending on what is needed for the app:

- iam role (file publishing role and asset publishing role)
- s3 bucket (one per app)
- ecr repository (one per image asset family)

These resources need to be named unique to their scope to avoid CloudFormation errors when trying to create
a resource with an existing name. The resource specific limitations are as follows:

- iam role names: must be unique to their account
- s3 bucket names: must be globally unique
- ecr repository names: must be unique to their account/region

The attributes we can use to name our resources are as follows:

- account number (i.e. `123456789012`)
- region name (i.e. `us-east-1`)
- app id (a user-specified id that should be unique to the app)
- image id (a user-specified id added on image assets)

This information can be distilled into the following table, which shows what identifiers are necessary to
make each resource name unique:

| Resource  | Account | Region | App Id | Image Id |
| --------- | ------- | ------ | ------ | -------- |
| iam roles |         | ✔️      | ✔️      |          |
| s3 bucket | ✔️       | ✔️      | ✔️     ️️ |          |
| ecr repos |         |        | ✔️      | ✔️        |
