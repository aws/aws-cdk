.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _tool_ref:

####################
|cdk| Tool Reference
####################


Reference
=========

.. js:module:: aws-cdk

CredentialProviderSource *(interface)*
--------------------------------------

.. js:class:: CredentialProviderSource

   .. js:attribute:: name

      A friendly name for the provider, which will be used in error messages, for example.

      :type: ``string``

   .. js:method:: isAvailable()

      Whether the credential provider is even online. Guaranteed to be called before any of the other functions are called.

      :returns: ``Promise<boolean>``

   .. js:method:: canProvideCredentials(accountId)

      Whether the credential provider can provide credentials for the given account.

      :param string accountId: the account ID for which credentials are needed.
      :returns: ``Promise<boolean>``

   .. js:method:: getProvider(accountId, mode)

      Construct a credential provider for the given account and the given access mode.
      Guaranteed to be called only if canProvideCredentails() returned true at some point.

      :param string accountId: the account ID for which credentials are needed.
      :param aws-cdk.Mode mode: the kind of operations the credentials are intended to perform.
      :returns: ``Promise<aws.Credentials>``

Mode *(enum)*
-------------

.. js:class:: Mode

   .. js:data:: ForReading

      Credentials are inteded to be used for read-only scenarios.

   .. js:data:: ForWriting

      Credentials are intended to be used for read-write scenarios.

Plugin *(interface)*
--------------------

.. js:class:: Plugin()

   .. js:attribute:: version

      The version of the plug-in interface used by the plug-in. This will be used by
      the plug-in host to handle version changes. Currently, the only valid value for
      this attribute is ``'1'``.

      :type: ``string``

   .. js:method:: init(host)

      When defined, this function is invoked right after the plug-in has been loaded,
      so that the plug-in is able to initialize itself. It may call methods of the
      :js:class:`~aws-cdk.PluginHost` instance it receives to register new
      :js:class:`~aws-cdk.CredentialProviderSource` instances.

      :param aws-cdk.PluginHost host: The |cdk| plugin host
      :returns: ``void``

PluginHost
----------

.. js:class:: PluginHost()

   .. js:data:: instance

      :type: :js:class:`~aws-cdk.PluginHost`

   .. js:method:: load(moduleSpec)

      Loads a plug-in into this PluginHost.

      :param string moduleSpec: the specification (path or name) of the plug-in module to be loaded.
      :throws Error: if the provided ``moduleSpec`` cannot be loaded or is not a valid :js:class:`~aws-cdk.Plugin`.
      :returns: ``void``

   .. js:method:: registerCredentialProviderSource(source)

      Allows plug-ins to register new :js:class:`~aws-cdk.CredentialProviderSources`.

      :param aws-cdk.CredentialProviderSources source: a new CredentialProviderSource to register.
      :returns: ``void``
