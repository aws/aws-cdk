# monobuild

Aggregates all declared dev dependencies into a monolithic uber-package
based on all of its declared `devDependencies`.

This is used in the CDK to create a monolithic package that is then
published for customers to consume.