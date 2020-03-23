## Cloud Assembly Schema

Making changes to this module should only happen when you introduce new cloud assembly capabilities.

> For example: supporting the `--target` option when building docker containers.

If you decided these changes are necessary, simply go ahead and make the necessary modifications to the interfaces that describe the schema.
Our tests and validation mechanisms will ensure you make those changes correctly.

The following sections explain exactly how those mechanisms work.

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

Now lets the tests and see what happens:

```console
yarn run v1.21.1
$ cdk-test
FAIL test/schema.test.js
  ✓ manifest save (4ms)
  ✓ manifest load (5ms)
  ✕ schema has the correct version and hash (14ms)
  ✓ manifest load fails for invalid nested property (6ms)
  ✓ manifest load fails for invalid artifact type (2ms)
  ✓ stack-tags are deserialized properly (2ms)
  ✓ can access random metadata (2ms)

  ● schema has the correct version and hash

    expect(received).toEqual(expected) // deep equality

    Expected: "3.0.0"
    Received: "2.0.0"

      49 |     const version = require('../schema/cloud-assembly.metadata.json').version;
      50 |     const expectedVersion = semver.inc(version, 'major');
    > 51 |     expect(version).toEqual(expectedVersion);
         |                     ^
      52 |
      53 |     // we also require the hash to be equal, so fail anyway.
      54 |     // this is to prevent a manual change to the version, without changing the hash.

      at Object.<anonymous>.test (test/schema.test.ts:51:21)
```

We see that the `'schema has the correct version and hash'` test failed, because it expected the version
to be `3.0.0`, when if fact it is `2.0.0`.

### What is that? And why is it failing?

[Remember](./README#versioning) that we consider every change to schema as a `major` version bump.
This test validates that we dont introduce any changes to the schema without also performing a version bump.

It calculates the hash of the current schema, and compares it to the hash of the previous schema, which is
stored in [`schema.expected.json`](./test/schema.expected.json). If the hashes don't match, it requires a major version bump.

### So how do I bump the version?

To fix this, you have to run `yarn bump-schema-version`:

```console
 ❯ yarn bump-schema-version                                                                                                                                                                                                                                                                                      [15:32:44]
yarn run v1.21.1
$ node scripts/bump-schema-version.js
Bump version: 2.0.0 -> 3.0.0
Bump hash: c9059fa4c7fc10873876b1759f7f9149c3509a67b60200cf10f7268b83bfaeae -> 17917ca799f4af3b49bda389a0fd68e569a9653629efc55e5366d7f4a07302d4
✨  Done in 0.18s.
```

Now, if we run `git diff`:

```console
diff --git a/packages/@aws-cdk/cloud-assembly-schema/lib/manifest.ts b/packages/@aws-cdk/cloud-assembly-schema/lib/manifest.ts
index d6b2dfc56..17de7d170 100644
--- a/packages/@aws-cdk/cloud-assembly-schema/lib/manifest.ts
+++ b/packages/@aws-cdk/cloud-assembly-schema/lib/manifest.ts
@@ -309,6 +309,14 @@ export interface ArtifactManifest {
  * A manifest which describes the cloud assembly.
  */
 export interface AssemblyManifest {
+
+    /**
+     * The cloud provider this assembly is deployed to.
+     *
+     * @default aws
+     */
+    readonly cloudProvider?: string;
+
     /**
      * Protocol version
      */
diff --git a/packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.metadata.json
b/packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.metadata.json
index a06dd3f0f..2bc6d1822 100644
--- a/packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.metadata.json
+++ b/packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.metadata.json
@@ -1,3 +1,3 @@
 {
-    "version": "2.0.0"
+    "version": "3.0.0"
 }
\ No newline at end of file
diff --git a/packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.schema.json
b/packages/@aws-cdk/cloud-assembly-schema/schema/cloud-assembly.schema.json
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
                     "description": "Missing context information. If this field has values ...",
diff --git a/packages/@aws-cdk/cloud-assembly-schema/test/schema.expected.json
b/packages/@aws-cdk/cloud-assembly-schema/test/schema.expected.json
index 5b98ebf7e..09862090d 100644
--- a/packages/@aws-cdk/cloud-assembly-schema/test/schema.expected.json
+++ b/packages/@aws-cdk/cloud-assembly-schema/test/schema.expected.json
@@ -1,3 +1,3 @@
 {
-    "hash": "17917ca799f4af3b49bda389a0fd68e569a9653629efc55e5366d7f4a07302d4"
+    "hash": "c9059fa4c7fc10873876b1759f7f9149c3509a67b60200cf10f7268b83bfaeae"
 }
```

Now you can very clearly see the changes:

- `manifest.ts` - the code change.
- `cloud-assembly.schema.json` - the schema change generated from the code.
- `cloud-assembly.metadata.json` - version was bump.
- `schema.expected.json` - expected hash was updated.

> Its actually pretty much the same to our normal integration tes with the expected templates.

Now, running `yarn test` again:

```console
❯ yarn test
yarn run v1.21.1
$ cdk-test
PASS test/schema.test.js
  ✓ manifest save (5ms)
  ✓ manifest load (5ms)
  ✓ schema has the correct version and hash (19ms)
  ✓ manifest load fails for invalid nested property (5ms)
  ✓ manifest load fails for invalid artifact type (2ms)
  ✓ stack-tags are deserialized properly (2ms)
  ✓ can access random metadata (2ms)
```

Yey! - you are ready to push.

### API Compatibility Checks
