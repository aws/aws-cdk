.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _writing_constructs:

#########################
Writing |cdk| Constructs
#########################

This topic provides some tips writing idiomatic new constructs for the |cdk|.
The tips here apply equally to constructs written for inclusion in the AWS
Construct Library, purpose-built constructs to achieve a well-defined goal,
or constructs that serve as building blocks for assembling your cloud
applications.

General Design Priciples
========================

* Favor composition over inheritance; most of the constructs should directly
  extend the **Construct** class instead of some other construct. Inheritance
  should mainly be used to allow polymorphism. Typically, you'll add a child
  construct and expose any of its APIs and properties in the parent construct.
* Provide defaults for everything that a reasonable guess can be made for;
  ideally, props should be optional and **new MyAwesomeConstruct(this, "Foo")**
  should be enough to set up a reasonable variant of the construct. This does
  not mean that the user should not have the opportunity to customize! Rather,
  it means that the specific parameter should be optional and set to a
  reasonable value if not supplied. This may involve creating other resources as
  part of initializing this construct. For example, all resources that require a
  role allow passing in a **Role** object (specifically, a **RoleRef** object),
  but if the user does not supply one an appropriate **Role** object is
  defined in-place.
* Use contextual defaulting between properties; the value of one property may
  affect sensible defaults for other properties. *Example*:
  **enableDnsHostnames** and **enableDnsSupport**. **dnsHostnames** requires
  **dnsSupport**, only throw an error if the user has *explicitly* disabled DNS
  Support, but tried to enable DNS Hostnames. A user expects things to just
  work. If their intention is clear, we should do the right thing.
* Make the user think about ntent, not implementation detail; for example,
  if establishing an association between two resources (such as a **Topic**
  and a **Queue**) requires multiple steps (in this case, creating a
  **Subscription** but also setting appropriate IAM permissions), make
  both things happen in a single call (to **subscribeQueue()**). The user
  should be mentally thinking about the result they're trying to achieve,
  not the various steps necessary to get there.
* Make sure you are not renaming concepts or terminology. For example don't be
  temped to replace SQS's **dataKeyReusePeriod** with **keyRotation** because it
  will be hard for people to diagnose problems. They won't be able to just
  search for *sqs dataKeyReuse* and find topics on it. It is sometimes okay
  to introduce a new concept that does not have a counterpart in CloudFormation,
  especially if it directly maps onto the mental model that users already
  have about a service.
* Optimize for the common case; example: **AutoScalingGroup** accepts a **VPC**
  and deploys in the private subnet by default because that's the common case,
  but has an option to **placementOptions** for the special case.
* If a class can have multiple modes/behaviors: prefer values over polymorphism.
  Try switching behavior on property values first. Switch to multiple classes
  with a shared base class/interface only if there value to be had from having
  multiple classes (type safety, maybe one mode has different features/required
  parameters).

Implementation Details
======================

* Every construct consists of an exported class (**MyConstruct**) and an
  exported interface (**MyConstructProps**) that defines the parameters for
  these classes. The props argument is the 3rd to the construct (after the
  mandatory **parent** and **id** arguments), and the entire parameter should be
  optional if all of the properties on the props object are optional.
* Most of the logic happens in the constructor; the constructor will build up
  the state of the construct (what children it has, which ones are always
  there and which ones are optional, etc.).
* Validate as early as possible; throw an `Error` in the constructor if the
  parameters don't make sense. Only if you want to validate mutations that can
  occur after construction time, override the `validate()` method. The hierarchy
  of validation:
    * Best: Incorrect code won't compile, because of type safety guarantees.
    * Good: Runtime check everything the type checker can't enforce and fail
      early (error in the constructor).
    * Okay: Synth-time validate everything that can't be checked at construction
      time (error in ``validate()``).
    * Not great: Fail with an error in CloudFormation (bad because the
      CloudFormation deploy operation may take a long while, and the error
      may take several minutes to surface).
    * Very bad: Fail with a timeout during CloudFormation deployment (it may take
      up to an hour for resource stabilization to timeout!)
    * Worst: Don't fail the deployment at all, but fail at runtime.
* Avoid unneeded hierarchy in props; try to keep the props interface flat to
  help discoverability.
* Constructs are classes that have a set of invariants they maintain over their
  lifetime (such as which members are initialized and relationships between
  properties as members are mutated).
* Constructs mostly have write-only scalar properties that are passed in the
  constructor, but mutating functions for collections (for example, there will
  be ``construct.addElement()`` or ``construct.onEvent())`` functions, but not
  ``construct.setProperty()``. It is perfectly fine to deviate from this
  convention as it makes sense for your own constructs.
* Don't expose **Tokens** to your consumers; tokens are an implementation
  mechanism for one of two purpose: representing CloudFormation intrinsic
  values, or representing lazily evaluated values. They can be used for
  implementation purposes, but use more specific types as part of your public
  API.
* **Tokens** are (mostly) only used in the implementation of an L2 to pass lazy
  values to other constructs. For example, if you have an array that can be
  mutated during the lifetime of your class, you pass it to an L1 construct
  like so: ``new cdk.Token(() => this.myList)``.
* Be aware that you might not be able to usefully inspect all strings. Any
  string passed into your construct may contain special markers that represent
  values that will only be known at deploy time (for example, the ARN of a
  resource that will be created during deployment). Those are *stringified
  Tokens* and they look like ``"${TOKEN[Token.123]}"``. You will not be able to
  validate those against a regular expression, for example, as their "real"
  values are not known yet. To figure out if your string contains a special
  marker, use ``cdk.unresolved(string)``.
* Indicate units of measurement in property names that don't use a strong type.
  Use **milli**, **sec**, **min**, **hr**, **Bytes**, **KiB**, **MiB**, **GiB**,
  etc.
* Be sure to define an **IMyResource** interface for your resources which
  defines the API area that other constructs are going to use. Typical
  capabilities on this interface are querying for a resource ARN and adding
  resource permissions.
* Accept objects instead of ARNs or names; when accepting other resources as
  parameters, declare your property as **resource: IMyResource** instead of
  **resourceArn: string**.  This makes snapping objects together feel natural to
  consumers, and allows you to query/modify the incoming resource as well. The
  latter is particularly useful if something about IAM permissions need to be
  set, for example.
* Implement **export()** and **import()** functions for your resource; these
  make it possible to interoperate with resources that are not defined in the
  same CDK app (they may be manually created, created using raw CloudFormation,
  or created in a completely unrelated CDK app).
* If your construct wraps a single (or most prominent) other construct, give it
  an id of either **"Resource"** or **"Default"**; The "main" resource that an
  AWS Construct represents should use the ID **Resource**, for higher-level
  wrapping resources you will generally use **Default** (resources named
  **Default** will inherit their parent's logical ID, while resources named
  **Resource** will have a distinct logical ID but the human-readable part of it
  will not show the "Resource" part).


Implementation Language
=======================

In order for construct libraries to be reusable across programming languages,
they, they need to be authored in a language that can compile to a jsii
assembly.

At the moment, the only supported language is TypeScript, so prefer TypeScript
unless you are planning to specifically isolate your constructs to a single
developer base.


Code Organization
=================

Your package will roughly look like this:

```
your-package
├── package.json
├── README.md
├── lib
│   ├── index.ts
│   ├── some-resource.ts
│   └── some-other-resource.ts
└── test
    ├── integ.everything.lit.ts
    ├── test.some-resource.ts
    └── test.some-other-resource.ts

```

* Your package is named ``@aws-cdk/aws-xxx`` if it represents the canonical AWS
  Construct Library for this service; otherwise we recommend starting with
  ``cdk-``, but you are free to pick a pleasing name.
* Code goes under **lib/**, tests go under **test/**.
* Entry point should be **lib/index.ts** and should only contain ``export`` s
  for other files.
* No need to put every class in a separate file. Try to think of a
  reader-friendly organization of your source files.
* If you want to make package-private utility functions, put them in a file
  that is *not exported* from **index.ts** and use that file as normal.
* Free-floating functions (functions that are not part of a class definition)
  cannot be accessed through **jsii** (i.e., from languages other than
  TypeScript and JavaScript). Don't use them for public features of your
  construct library.
* Document all public APIs with doc comments (JSdoc syntax). Document defaults
  using the **@default** marker in doc comments.

Testing
=======

* Add unit tests for every construct (**test.xxx.ts**), relating the construct's
  properties to the CloudFormation that gets generated. Use the
  **@aws-cdk/assert** library to make it easier to write assertions on the
  CloudFormation output.
* Try to test one concern per unit test. Even if you *could* test more than one
  feature of the construct per test, it's better to write multiple tests,
  one for each feature. A test should have one reason to break.
* Add integration tests (**integ.xxx.ts**) that are basically just CDK apps
  which exercise the features of the construct, then load your shell with
  credentials and run ``npm run integ`` to exercise them. You will also have to
  run this if the CloudFormation output of the construct changes.
* If there are packages that you only depend on for testing, add them to
  **devDependencies** (instead of regular **dependencies**). You're still
  not allowed to create dependency cycles this way (from the root, run
  ``scripts/find-cycles.sh`` to figure out if you have created any cycles).
* Try to make your integ test literate (**integ.xxx.lit.ts**) if possible
  and link to it from the README.

README
======

* Header should include maturity level.
* Header should start at H2, not H1.
* Include some example code for the simple use case near the very top.
* If there are multiple common use cases, provide an example for each one and
  describe what happens under the hood at a high level (e.g. which resources are
  created).
* Reference docs are not needed.
* Use literate (.lit.ts) integration tests into README file.

Construct IDs
===================

* All children's construct IDs are part of your public contract; those IDs are
  used to generate CloudFormation logical names for resources. If they change,
  CloudFormation will replace the resource. This technically means that if you
  change any ID of a child construct you will have to major-version-bump your
  library.
