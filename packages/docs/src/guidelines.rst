.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _guidelines:

##########
Guidelines
##########

This topic describes helpful tips for using the |cdk|. These apply when you are
writing Constructs.

.. _general_guidelines:

General Guidelines
==================

These are global guidelines that we recommend.

Although not a guideline,
don't forget that if you change the name of a deployed construct,
but do not rename the construct as described in the
*Changing Logical IDs* section of the :ref:`concepts` topic,
|cfn| deletes the old construct, including any resources created by the construct,
when you deploy the new construct.

**Use TypeScript unless you are a single-language shop.**

  You can use constructs made in TypeScript in any other supported language.
  The converse is not supported.

**Use compositions instead of inheritance.**

  Most constructs should directly extend the **Construct** class instead of
  another construct. For example, when defining a Library construct that
  represents an AWS resource, do not extend the corresponding Resource
  construct. Instead, extend the **Construct** class and add the resource as a
  child. Give the primary Resource construct the name ``"Resource"``.

.. _property_guidelines:

Property Guidelines
===================

These are the recommended guidelines for construct properties.

**Use strongly-typed properties.**

  This includes using enums instead of primitive types such as strings or ints.

**Do not use tokens for property types.**

  Since tokens are a functional interface,
  they provide no type information and may not translate into a type-safe member during translation
  to another programming language.

**Provide reasonable default values wherever possible.**

  Most properties should be optional so the user can `new` the construct and get a reasonable object.

**Validate properties during initialization.**

  Fail early

**Avoid renaming existing AWS resource property names.**

  It adds another level of cognitive dissonance to debugging

**Indicate units in primitive property type names.**

  For example, if the property is an int and specifies how long to wait in seconds,
  the name could be **waitSec**.

.. _library_guidelines:

Library Guidelines
==================

Use these guidelines when constructing a library.

Code should be under *lib/*.

The entry point should be *lib/index.ts* and should only contain
  **import** statements (importing other TypeScript files in the same directory)

**There is no need to put every class in a separate file. Think of the user.**

**Keep your unit test utility code separate from your constructs.**

  If you want to make them to be "package-private",
  put them in a separate file and import them (`import ../lib/my-util`) in your tests

**Keep your integration tests in *test/* as *integ-xxx.ts*.**

  They should be |cdk| apps that can be deployed with |cx-deploy-bold|.

**Always create a *README.md* file.**

  It should include:

  - The maturity level
  - An example for each common use case,
    which should explain what resources it creates
