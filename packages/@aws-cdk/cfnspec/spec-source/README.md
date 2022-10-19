# Specification source

This directory contains specifications for the following things:

- `specification`: CloudFormation and SAM resource specification
- `cfn-lint`: information that is sourced from the
  [cfn-lint](https://github.com/aws-cloudformation/cfn-lint) project. This
  directory is treated as a collection of plain JSON files and patches just like
  the root.
- `cfn-docs`: information that is sourced from the CloudFormation documentation website.
  Contains the documentation strings for all CloudFormation resources and properties.

Each of these directories contains a "JSON patch set".

## JSON Patch Set

(This is not a standard, it's a local convention.)

At build time, the files in these directories are combined to form a single JSON model,
as follows:

- JSON Files that do *not* have the word `patch` in the name are treated as plain
  JSON objects and are all merged together into one big JSON object. All values
  defined in the combined model must have a unique JSON path. In other words, no 2
  files may define the same property. Properties that start with a `$` character
  are not merged at all, and are treated as metadata of the JSON file itself.
- JSON Files with the word `patch` in the name are treated as patch files to be
  applied to the model at that point. These can be used to drop or rewrite
  properties in the model, if we find that the CloudFormation spec contains
  inaccuracies.
- Directories are first recursively combined, then treated as a model to be
  merged into the parent model.

Patch files look like this:

```
{
  "surrounding": {
    "context": {

      "patch": {
        "description": "...",
        "operations: [ { "op": "add", ... } ],
      },
      "patch:each": {
        "description": "...",
        "operations: [ { "op": "remove", ... } ],
      }

    }
  }
}
```

Surrounding context is used to set up a path to a place in the model. At any
place in the model, the keys `patch` and `patch:each` may occur. These define
patches to be applied, with a description and a set of operations.

- The patch in `patch` is applied once
- The patch in `patch:each` is applied to each of the keys found in the model
  in the context object.

The `operations` key is interpreted a a [json patch](http://jsonpatch.com/) structure.
The paths in the patch operations themselves are relative to the context
location in the JSON model, unless they start with `$/` in which case they will
be interpreted as a path relative to the root of the model.

Files are applied in alphanumeric order: this only matters for relative ordering of
patches. Inside a single file there is no guaranteed order between the patches.

By convention, patches are named like this:

```text
500_<Service>_<Resource>[_<Property>]_patch.json
```
