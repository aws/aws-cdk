#!/bin/bash

###
# Updates the AWS CloudFormation Resource Specification using the files published on the AWS Documentaiton.
# See: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
###

set -euo pipefail

src="spec-source"

rm -f ${src}/000_CloudFormationResourceSpecification.json
curl -L "https://d1uauaxba7bl26.cloudfront.net/latest/gzip/CloudFormationResourceSpecification.json" \
    | gunzip - > ${src}/000_CloudFormationResourceSpecification.json

rm -fr ${src}/000_sam.spec.json
curl -L "https://raw.githubusercontent.com/awslabs/goformation/master/generate/sam-2016-10-31.json" \
    > ${src}/000_sam.spec.json

# sort hash keys to help identify *real* changes
sort-json ${src}/*.json
