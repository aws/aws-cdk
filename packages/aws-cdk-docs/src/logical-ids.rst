.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _logical_ids:

###########
Logical IDs
###########

When you synthesize a stack into an |CFN| template,
the |cdk| assigns a
`logical ID <https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resources-section-structure.html>`_,
which must be unique within the template,
to each resource in the stack.

.. important::

    When you update the template, |CFN| uses these logical IDs to plan the update
    and apply changes. Therefore, logical IDs must remain "stable" across updates.
    If you make a modification in your code that results in a change to a logical ID
    of a resource, |CFN| deletes the resource and creates a new resource when it
    updates the stack.

Each resource in the construct tree has a unique path that represents its
location within the tree.
Since logical IDs can only use alphanumeric characters and also restricted in
length, the CDK is unable to simply use a delimited path as the logical ID.
Instead, logical IDs are allocated by concatenating a human-friendly rendition 
from the path (concatenation, de-duplicate, trim) with an eight-character MD5 
hash of the delimited path. 
This final component is necessary since |CFN| logical IDs cannot include 
the delimiting slash character (/), so simply concatenating the component 
values does not work. For example, concatenating the components of the 
path */a/b/c* produces **abc**, which is the same as concatenating the components of 
the path */ab/c*.

.. code-block:: text

    VPCPrivateSubnet2RouteTable0A19E10E
    <-----------human---------><-hash->

Low-level CloudFormation resources (from `@aws-cdk/resources`) 
that are direct children of the |stack-class| class use
their name as their logical ID without modification. This makes it easier to
port existing templates into a CDK app.

This scheme ensures that:

Logical IDs have a human-friendly portion
   This is useful when interacting directly with the synthesized |CFN|
   template during development and deployment.

Logical IDs are unique within the stack
   This is ensured by the MD5 component,
   which is based on the absolute path to the resource,
   which is unique within a stack.

Logical IDs remain unchanged across updates
   This is true as long as their location within the construct tree doesn't change.

The |cdk| applies some heuristics to improve the human-friendliness of the prefix:

- If a path component is **Resource**, it is omitted.
  This postfix does not normally contribute any additional useful information to the ID.
- If two subsequent names in the path are the same, only one is retained.
- If the prefix exceeds 240 characters, it is trimmed to 240 characters.
  This ensures that the total length of the logical ID does not exceed the 255 character
  |CFN| limit for logical IDs.

.. _changing_logical_ids:

Renaming Logical IDs
====================

The :py:meth:`aws-cdk.Stack.renameLogical` method can be used to explicitly assign
logical IDs to certain resources, given either their full path or

.. code-block:: javascript

    class MyStack extends Stack {
      constructor(parent: App, name: string, props: StackProps) {
        super(parent, name);

        // note that `renameLogical` must be called /before/ defining the construct.
        // a good practice would be to always put these at the top of your stack initializer.
        this.renameLogical('MyTableCD117FA1', 'MyTable');
        this.renameLogical('MyQueueAB4432A3', 'MyAwesomeQueue');
        
        new Table(this, 'MyTable');
        new Queue(this, 'MyQueue');
      }
    }

In some cases changing a resource
results in a structural change,
which results in a different path,
thus changing the logical ID of the resource.

When a resource's logical ID changes,
|CFN| eventually deletes the old resource and create a new resource,
as it cannot determine that the two resources are the same.
Depending on the nature of the resource,
this can be disastrous in production, such as when deleting a |DDB| table.

You could use
`AWS CloudFormation Stack Policies
<https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html>`_
to protect critical resources in your stack from accidental deletion.
Although this |CFN| feature is not supported in the |cdk| and |toolkit|,
the |cdk| does provide a few other mechanisms to help deal with logical ID changes.

If you have CDK stacks deployed with persistent resources such as S3 buckets or
DynamoDB tables, you might want to explicitly "rename" the new logical IDs to
match your existing resources.

First, make sure you compare the newly synthesized template with any deployed
stacks. `cdk diff` will tell you which resources are about to be destroyed:

.. code:: shell

    [-] ☢️ Destroying MyTable (type: AWS::DynamoDB::Table)
    [+] 🆕 Creating MyTableCD117FA1 (type: AWS::DynamoDB::Table)

Now, you can add a :py:meth:`aws-cdk.Stack.renameLogical` call before the 
table is defined to rename **MyTableCD117FA1** to **MyTable**.
