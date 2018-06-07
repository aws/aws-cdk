.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _validating_downloads:

########
Validating your CDK downloads
########

If you want to validate the integrity of the files you downloaded to obtain the
CDK, you can do so using the PGP signature. You need the following:

* [GNU Privacy Guard](https://gnupg.org/) needs to be installed.
* Make sure you have downloaded both ``aws-cdk-x.y.z.zip``
  and ``aws-cdk-x.y.z.zip.asc``.
* Copy the signature below to a file ``cdk-key.asc``.

Then run the following commands:

.. code-block:: sh

    gpg --import cdk-key.asc
    gpg --validate aws-cdk-x.y.z.zip.sig

Signature
=========

.. code-block::

    -----BEGIN PGP PUBLIC KEY BLOCK-----
    Version: GnuPG v2

    PUT ACTUAL KEY HERE
    -----END PGP PUBLIC KEY BLOCK-----

