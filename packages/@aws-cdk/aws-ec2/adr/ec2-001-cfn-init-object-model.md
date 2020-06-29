EC2-001: cfn-init object model
==============================

Status
------

Active

Context
-------

Config sections in [`AWS::CloudFormation::Init`
blocks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-init.html)
can be one of commands, files, groups, packages, services, sources and users.

Each one of specified as a map of `{ key: { ...details... } }`.

For some config types the **key** is significant (such as which file to
write), for others is it not and is merely used for ordering. Some config
types have a strong need for case classes, others are fine as a collection
of data and can be modeled by structs. Some should admit Assets
in an easy way which requires a `bind` pattern for (a) binding an `Asset` object
to the construct tree and (b) granting permissions.

We'd like to give users the option to leave out keys that are unnecessary,
and have the API be consistent between the different config types.

Let's look at the different config types, in order of complexity.

* **group** - key is semantic, mapping group name => group id.
* **user** - key is semantic, mapping user name => (uid, homedir, groups)
* **command** - key is not semantic (just id+list order). Has 2 variants, specify
  command as shell string or as argv array. 5 additional customization
  options.
* **source** - key is semantic, mapping directory name => url of ZIP. Should admit assets,
  so needs a class.
* **package** - depends on type of package (and platform). Case classes make this nicer.
  - rpm, msi: key is not semantic, argument is a location for the archive.
  - yum, apt, rubygems, python: key is the package name, argument are optional version number(s)
* **service** - key is semantic. Select service to either disables, enables, and/or optionally restarts services depending
  on other things cfn-init does (like touching files). Needs to encode dependencies on other configuration options.
  Has 2 fields that seem like it makes no sense for them to have different boolean values.
* **file** - key is semantic, indicating the file to create. Allows many diferent use cases which are
  best served by case classes, and assets need a class.
  - create file from literal string
  - create file from base64 encoded string
  - create a symlink from a literal string
  - create file from URL download
  - create JSON file from object
  - (cdk specific) read file from disk and make inline file from it, mirroring executable bit
  - (cdk specific) read file from disk and make asset from it, mirroring executable bit
  - (cdk specific) I guess read symlink from disk but this seems less valuable
  - on all of these we can configure owner, group, mode, mustache template substitution

File sources from URLs also allow authentication, which is a good feature to support eventually.
Easiest to do if we have classes for them.

It seems that couple of configs definitely *require* classes, and it would be weird to mix
structs and classes for the different config types. That means we use classes for all of them.

It would also be weird to mix factory functions and `new` for instantiation. Since we definitely
need case classes, we will use factory functions for all of them.

Services need to be able to encode references to other config sections, so it's tempting to use
object references for that. However, generally doing so is annoying because it turns what was once
a self-contained declarative expression into one in which subexpressions have to be assigned to variables
so that they can be referenced in 2 places. Assuming that people are generally used to encoding these
dependencies by file name, directory name, package name and command key, we can just keep the string
references.

How do we makes it possible to define configs and configsets.

We can keep the namespacing nice and flat and reduce the repetition by taking a list of `InitElement`,
subclassed by all the various init config types, so that we don't have to:

```ts
files: [
  InitFile.from(...),
],
packages: [
  InitPackage.from(...),
],
```

Instead we can go:

```ts
elements: [
  InitFile.from(...),
  InitPackage.from(...),
],
```

For configsets, a single config is the common use case:

```ts
CloudFormationInit.simpleConfig([
  InitFile.from(...),
  InitPackage.from(...),
])
```

For more complex cases, we can do:

```ts
CloudFormationInit.withConfigSets({
  configSets: {
    'default': ['cs1', 'cs2'],
    'reverse': ['cs2', 'cs1'],
  },
  configs: {
    cs1: [ ... ],
    cs2: [ ... ],
  }
])
```