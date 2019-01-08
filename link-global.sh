#!/bin/bash
# Creates global symlinkins to @aws-cdk/* so later those can be
# used with npm link to test development changes locally

echo "⛓ Linking development versions of @aws-cdk packages into global folder.     ⛓"
echo "⛓ Use npm link <pkg_name> to those in aby project. Any built change         ⛓"
echo "⛓ (ie. with npm watch) of @aws-cdk packages will be  immediately reflected  ⛓"
echo
echo "❗️ This script may require admin / sudo rights ❗️"

sleep 1



lerna --concurrency 8 --stream --scope '@aws-cdk/*' --scope 'aws-cdk/*' exec 'npm link --only=production --no-package-lock'