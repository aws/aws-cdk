.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _applets:

#######
Applets
#######

.. note:: Currently the |cdk| only supports applets published as JavaScript modules.

Applets are files in the YAML format that instantiate constructs directly,
without writing any code. The structure of an applet file looks like this:

.. code:: js

   applets:
     Applet1:
       type: MODULE[:CLASS]
       properties:
         property1: value1
         property2: value2
         ...
     Applet2:
       type: MODULE[:CLASS]
       properties:
         ...

Every applet will be synthesized to its own stack, named after the key used
in the applet definition.

Specifying the applet to load
=============================

An applet ``type`` specification looks like this:

.. code:: js

   applet: MODULE[:CLASS]

**MODULE** can be used to indicate:

* A local file, such as ``./my-module`` (expects ``my-module.js`` in the same
  directory).
* A local module such as ``my-dependency`` (expects an NPM package at
  ``node_modules/my-dependency``).
* A global module, such as ``@aws-cdk/aws-s3`` (expects the package to have been
  globally installed using NPM).
* An NPM package, such as ``npm://some-package@1.2.3`` (the version specifier
  may be omitted to refer to the latest version of the package).

**CLASS** should reference the name of a class exported by the indicated module.
If the class name is omitted, ``Applet`` is used as the default class name.

Properties
==========

Pass properties to the applet by specifying them in the ``properties`` object.
The properties will be passed to the instantiation of the class in the ``type``
parameter.

Running
=======

To run an applet, pass its YAML file directly as the ``--app`` argument to a
``cdk`` invocation:

.. code-block:: sh

   cdk --app ./my-applet.yaml deploy

To avoid needing to specify ``--app`` for every invocation, make a ``cdk.json``
file and add in the application in the config as usual:

.. code-block:: json

   {
      "app": "./my-applet.yaml"
   }
