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
  reasonable value if not supplied. This may involve creating other resources
  as part of constructing this construct. For example, all resources that
  require a role allow passing in a **Role** object, but if the user does
  not supply one an appropriate **Role** object is constructed in-place.
* Use contextual defaulting between properties; the value of one property may
  affect sensible defaults for other properties. *Example*: enableDnsHostnames
  and and enableDnsSupport.  dnsHostnames requires dnsSupport, only yell if the
  user has *explicitly* disabled dnsSupport, but tried to enable dnsHostnames.
  A user expects things to just work - make that the case unless they tell us
  otherwise.
* Make the user thinkg about concepts, not implementation detail; for example,
  if establishing an association between two resources (such as a **Topic**
  and a **Queue**) requires multiple steps (in this case, creating a
  **Subscription** but also setting appropriate IAM permissions), make
  both things happen in a single call (to **subscribeQueue()**). The user
  should be mentally thinking about the result they're trying to achieve,
  not the various steps necessary to get there.
* Make sure you are not introducing new concepts or terminology. For example
  don't be temped to replace SQS's **dataKeyReusePeriod** with **keyRotation**
  because it will be hard for people to diagnose problems. They won't be able to
  just search for *sqs dataKeyReuse* and find topics on it.
* Indicate units of measurement in property names that don't use a strong type.
  Use **milli**, **sec**, **min**, **hr**, **Bytes**, **KiB**, **MiB**, **GiB**,
  etc.
* Optimize for the common case; example: **Fleet** accepts a **VPC** and deploys
  in the private subnet by default because that's the common case, but has an
  option to **placementOptions** for the special case.
* Use Typescript; in order for construct libraries to be reusable across
  programming languages (using jsii), they need to be authored in a language
  that can compile to a jsii assembly. At the moment, the only supported
  language is TypeScript.

Implementation Details
======================

* Every construct consist of an exported class (**MyConstruct**) and an exported
  interface (**MyConstructProps**) that defines the parameters for these
  classes.
* Constructs are (mostly) immutable; sometimes we use mutating methods if it
  makes sense or reads better (for example, for event handlers we will write
  `builder.onBuild(topic)`), but configuration props are usually passed into
  the constructor, after which they cannot be changed anymore.
* Most of the logic happens in the constructor; the constructor will build up
  the state of the construct (what children it has, which ones are always
  there and which ones are optional, etc.).
* Validate as early as possible; throw an `Error` in the constructor if the
  parameters don't make sense. Only if you want to validate mutations that can
  occur after construction time, override the `validate()` method.
* Avoid unneeded hierarchy in props; try to keep the props interface flat to
  help discoverability.
* Don't expose **Token** s to your consumers; tokens are an implementation
  mechanism for one of two purpose: representing CloudFormation intrinsic
  values, or representing lazily evaluated values. They can be used for
  implementation purposes, but use more specific types as part of your public
  API.
* Don't use type unions (**string | BucketName**); they do not translate well
  across **jsii**. Instead, either just accept a **string** or a **BucketName**.
  One can always be translated into the other (either by Token stringification
  or by constructing a **BucketName** from a literal).
* Accept objects instead of ARNs; when accepting other resources as parameters,
  declare your property as **queue: QueueRef** instead of **queueArn: Arn**.
  This makes snapping objects together work logical, and allows you to
  query/modify the incoming resource as well. The latter is particularly
  useful if something about IAM permissions need to be set, for example.
* Use **XxxRef** instead of **Xxx** to allow imports to work; when accepting
  resource parameters, accept the **XxxRef** variant of the class (if
  available). This makes it possible for users to pass resources that aren't
  defined in the same CDK app.
* Name wrapped resource constructs **Resource** or **Default**; The "main"
  resource that an AWS Construct represents should use the ID **Resource**,
  for higher-level wrapping resources you will generally use **Default**
  (resources named **Default** will inherit their parent's logical ID,
  while resources named **Resource** will have a distinct logical ID but
  the human-readable part of it will not show the "Resource" part).


Code Organization
=================

* Your package is named ``aws-xxx`` if it represents the canonical AWS
  Construct Library for this service; otherwise we recommend starting with
  ``cdk-``, but you are free to pick a pleasing name.
* Code goes under **lib/**, tests go under **test/**.
* Entry point should be **lib/index.ts** and should only contain ``export`` s
  for other files.
* No need to put every class in a separate file. Try to think of a
  reader-friendly organization of your source files.
* If you want to make package-private utility functions, put them in a file
  that is *not exported* from **index.ts** and use that file as normal.
* Free-floating functions cannot be accessed through **jsii** (i.e., from
  languages other than TypeScript and JavaScript). Don't use them for
  public features of your construct library.
* Document all public APIs with doc comments. Document defaults using the **@default**
  marker in doc comments.

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
* Include some example code for the simple use case near the very top.
* If there are multiple common use cases, provide an example for each one and
  describe what happens under the hood at a high level (e.g. which resources are
  created).
* Reference docs are not needed.
* Use literate (.lit.ts) integration tests into README file.

Evolving constructs
===================

* All children's construct IDs are part of your public contract; those IDs are
  used to generate CloudFormation logical names for resources. If they change,
  CloudFormation will replace the resource. This technically means that if you
  change any ID of a child construct you will have to major-version-bump your
  library.
