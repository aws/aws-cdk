#!/bin/bash

###
# Updates the AWS CloudFormation Resource Specification using the files published on the AWS Documentaiton.
# See: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
###

set -euo pipefail

rm -f spec-source/000_CloudFormationResourceSpecification.json
curl -L "https://d1uauaxba7bl26.cloudfront.net/latest/gzip/CloudFormationResourceSpecification.json" \
    | gunzip - > spec-source/000_CloudFormationResourceSpecification.json
