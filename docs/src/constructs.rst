.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _constructs:

##########
Constructs
##########

Constructs are the building blocks of |cdk| applications. Constructs can have
child constructs, which in turn can have child constructs, forming a
hierarchical tree structure.

The |cdk| includes two different levels of constructs:

|l1|

  These constructs are low-level constructs that provide a direct, one-to-one,
  mapping to an |CFN| resource,
  as listed in the |CFN| topic `AWS Resource Types Reference <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html>`_.

  All |l1| members are found in the :py:mod:`@aws-cdk/resources` package.

|l2|

  These constructs have been handwritten by AWS and come with
  convenient defaults and additional knowledge about the inner workings of the
  AWS resources they represent. In general, you will be able to express your
  intent without worrying about the details too much, and the correct resources
  will automatically be defined for you.

  |l2| members are found in the :py:mod:`@aws-cdk/NAMESPACE` packages,
  where NAMESPACE is the short name for the associated service,
  such as SQS for the |l2| for the |SQS| service.
  See the :ref:`reference` section for descriptions of the |cdk|
  packages and constructs.

.. Hide for now
   At an even higher-level than an |l2|, a |l3|
   aggregates multiple, other constructs together
   into common architectural patterns, such as a *queue processor* or an *HTTP
   service*.

   By leveraging these common patterns, you can assemble your
   application even faster than by using an |l2| directly.

   A |l3|
   is not included with the standard CDK Construct
   Library. Instead, we encourage you to develop and share them inside your
   organization or on GitHub.

.. _construct_structure:

Construct Structure
===================

The construct tree structure is a powerful design pattern for composing high-level
abstractions. For example, you can define a ``StorageLayer`` construct that
represents your application's storage layer and include all the AWS resources,
such as |DDB| tables and |S3| buckets, needed to implement your storage layer in
this construct. When your higher-level code uses this construct, it only needs
to instantiate the ``StorageLayer`` construct.

When you initialize a construct,
add the construct to the construct tree by specifying the parent construct as the first initializer parameter,
an identifier for the construct as the second parameter,
and an set of properties for the final parameter,
as shown in the following example.

.. code-block:: js

   new SomeConstruct(parent, name[, props]);

In almost all cases, you should pass the keyword ``this`` for the ``parent``
argument, because you will generally initialize new constructs in the context of
the parent construct. Any descriptive string will do for the ``name``
argument,
and an in-line object for the set of properties.

.. code-block:: js

   new BeautifulConstruct(this, 'Foo', {
     applicationName: 'myApp',
     timeout: 300
   });

.. note::

   Associating the construct to its parent as part of
   initialization is necessary because the construct occasionally needs contextual
   information from its parent, such as to which the region the stack is deployed.

Use the following operations to inspect the construct tree.

:py:attr:`aws-cdk.Construct.parent`
   Gets the construct's parent construct.

:py:meth:`aws-cdk.Construct.getChildren`
   Gets an array of all of the contruct's children.

:py:meth:`aws-cdk.Construct.getChild`
   Gets the child construct with the specified ID.

:py:meth:`aws-cdk.Construct.toTreeString()`

   Gets a string representing the construct's tree.

.. We discuss the advantages of an |l2| over a |l1| in the :ref:`l2_advantages` section.

.. _construct_names:

Construct Names
===============

Every construct in a CDK app must have a **name** unique among its siblings.
Names are used to track constructs in the construct hierarchy, and to allocate
logical IDs so that |CFN| can keep track of the generated resources.

When a construct is created, its name is specified as the second
initializer argument:

.. code-block:: js

   const c1 = new MyBeautifulConstruct(this, 'OneBeautiful');
   const c2 = new MyBeautifulConstruct(this, 'TwoBeautiful');
   assert(c1.name === 'OneBeautiful');
   assert(c2.name === 'TwoBeautiful');

Use the :py:attr:`aws-cdk.Construct.path` property to get the path of this
construct from the root of the tree.

Note that the name of a construct does not directly map onto the physical name
of the resource when it is created! If you want to give a physical name to a bucket or table,
specify the physical name using use the appropriate
property, such as ``bucketName`` or ``tableName``. Example:

.. code-block:: js

    new Bucket(this, 'MyBucket', {
      bucketName: 'physical-bucket-name'
    });

Avoid specifying physical names. Instead, let
|CFN| generate names for you.
Use attributes, such as **bucket.bucketName**,
to discover the generated names.

.. and pass them to your application's runtime
   code, as described in :ref:`creating_runtime_value`.

When you synthesize an |cdk| tree into an |CFN| template, the |CFN| logical ID
for each resource in the template is allocated according to the path of that
resource in the construct tree. For more information, see :ref:`logical_ids`.

.. _construct_properties:

Construct Properties
====================

Customize constructs by passing a property object as the third
parameter (*props*). Every construct has its own set of parameters, defined as an
interface. You can pass a property object to your construct in two ways:

.. code-block:: js

   // Inline (recommended)
   new Queue(this, 'MyQueue', {
     visibilityTimeout: 300
   });

   // Instantiate separate property object
   const props: QueueProps = {
     visibilityTimeout: 300
   };

   new Queue(this, 'MyQueue', props);

.. _construct_metadata:

Construct Metadata
==================

You can attach metadata to a construct using the
:py:meth:`aws-cdk.Construct.addMetadata` operation. Metadata entries
automatically include the stack trace from which the metadata entry was added.
Therefore, at any level of a construct you can find the code location, even if metadata
was created by a lower-level library that you don't own.
