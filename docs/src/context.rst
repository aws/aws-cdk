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


###########################
Viewing and managing context
###########################

Context is used to retrieve things like Availability Zones available to you, or
AMI IDs used to start your instances. In order to avoid unexpected changes to
your deployments-- let's say you were adding a ``Queue`` to your application but
it happened that a new Amazon Linux AMI was released and all of a sudden your
AutoScalingGroup will change-- we store the context values in ``cdk.json``, so
after they've been retrieved once we can be sure we're using the same value on
the next synthesis.

To have a look at the context values stored for your application, run ``cdk
context``. You will see something like the following:

.. code::

   $ cdk context

   Context found in cdk.json:

   ┌───┬────────────────────────────────────────────────────┬────────────────────────────────────────────────────┐
   │ # │ Key                                                │ Value                                              │
   ├───┼────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
   │ 1 │ availability-zones:account=123456789012:region=us- │ [ "us-east-1a", "us-east-1b", "us-east-1c",        │
   │   │ east-1                                             │ "us-east-1d", "us-east-1e", "us-east-1f" ]         │
   ├───┼────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
   │ 2 │ ssm:account=123456789012:parameterName=/aws/       │ "ami-013be31976ca2c322"                            │
   │   │ service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_ │                                                    │
   │   │ 64-gp2:region=us-east-1                            │                                                    │
   └───┴────────────────────────────────────────────────────┴────────────────────────────────────────────────────┘

   Run cdk context --invalidate KEY_OR_NUMBER to invalidate a context key. It will be refreshed on the next CDK synthesis run.

At some point, we *do* want to update to the latest version of the Amazon Linux
AMI. To do a controlled update of the context value, invalidate it and
synthesize again:

.. code::

   $ cdk context --invalidate 2
   Context value
   ssm:account=123456789012:parameterName=/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2:region=us-east-1
   invalidated. It will be refreshed on the next SDK synthesis run.

   $ cdk synth
   ...
