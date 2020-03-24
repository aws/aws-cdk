## Cloud Assembly Schema

Making changes to this module should only happen when you introduce new cloud assembly capabilities.

> For example: supporting the `--target` option when building docker containers.

If you decided these changes are necessary, simply go ahead and make the necessary modifications to the interfaces that describe the schema.
Our tests and validation mechanisms will ensure you make those changes correctly.

### Schema Generation

The [*json-schema*](./schema/cloud-assembly.schema.json) is auto-generated from the code during build.

For example, lets see what happens when we add an optional `cloudProvider` property to the [`AssemblyManifest`](./lib/manifest.ts#L311) interface:

```console
 ❯yarn build
yarn run v1.21.1
$ cdk-build
JSII: Ignoring TypeAliasDeclaration node (it cannot be represented in the jsii type model)
JSII: Ignoring TypeAliasDeclaration node (it cannot be represented in the jsii type model)
JSII: Ignoring TypeAliasDeclaration node (it cannot be represented in the jsii type model)
JSII: Ignoring TypeAliasDeclaration node (it cannot be represented in the jsii type model)
JSII: Ignoring TypeAliasDeclaration node (it cannot be represented in the jsii type model)
$ bash scripts/generate-json-schema.sh
Generating JSON schema into /Users/epolon/dev/src/github.com/aws/aws-cdk/packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.schema.json
diff --git a/packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.schema.json b/packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.schema.json
index 1581e88e9..489be8b79 100644
--- a/packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.schema.json
+++ b/packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.schema.json
@@ -67,6 +67,11 @@
                     "description": "The set of artifacts in this assembly.",
                     "type": "object"
                 },
+                "cloudProvider": {
+                    "default": "aws",
+                    "description": "The cloud provider this assembly is deployed to.",
+                    "type": "string"
+                },
                 "missing": {
                     "default": "- no missing context.",
                     "description": "Missing context information. If this field has values, it means that the\ncloud assembly is not complete and should not be deployed.",
✨  Done in 13.05s.
```

We can see that the new schema was generated into `schema/cloud-assembly.schema.json`, and it also prints out the exact diff.

> You can also generate a new schema explicitly by running `yarn generate-json-schema`.

### Schema Validation

Being a **stable** `jsii` module, it undergoes strict API compatibility checks with the help
of [`jsii-diff`](https://github.com/aws/jsii/tree/master/packages/jsii-diff). This means that performing breaking changes, such as:

- Adding a required property. (same as changing from *optional* to *required*)
- Changing the type of the property.

Will be rejected.

In addition, the interfaces defined here are programatically exposed to users, via the [`manifest`](../cx-api/lib/cloud-assembly.ts#L42)
property of the `CloudAssembly` class. This means that the following are also considered breaking changes:

- Changing a property from *required* to *optional*.
- Removing an optional property.
- Removing a required property.

#### Caveat (TBD)
