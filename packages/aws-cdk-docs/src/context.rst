.. Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

   This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0
   International License (the "License"). You may not use this file except in compliance with the
   License. A copy of the License is located at http://creativecommons.org/licenses/by-nc-sa/4.0/.

   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and
   limitations under the License.

.. _context:

#####################
Environmental Context
#####################

When you synthesize a stack to create a |CFN| template, the |cdk| might need information based on the
environment (account and Region), such as the availability zones or AMIs available in the Region.
To enable this feature, the |toolkit| uses *context providers*,
and saves the context information into |cx-json|
the first time you call |cx-synth-code|.

The |cdk| currently supports the following context providers.

:py:class:`AvailabilityZoneProvider <@aws-cdk/cdk.AvailabilityZoneProvider>`
   Use this provider to get the list of all supported availability zones in this environment.
   For example, the following code iterates over all of the AZs in the current environment.

.. code:: js

   // "this" refers to a parent Construct
   const zones: string[] = new AvailabilityZoneProvider(this).availabilityZones;

   for (let zone of zones) {
      // do somethning for each zone!
   }

:py:class:`SSMParameterProvider <@aws-cdk/cdk.SSMParameterProvider>`
   Use this provider to read values from the current Region's SSM parameter store.
   For example, the follow code returns the value of the 'my-awesome-value' key:

.. code:: js

   const ami: string = new SSMParameterProvider(this).getString('my-awesome-value');
