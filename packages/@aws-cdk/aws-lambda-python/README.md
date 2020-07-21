## Amazon Lambda Python Library
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This library provides constructs for Python Lambda functions.

To use this module, you will need to have Docker installed.

### Python Function
Define a `PythonFunction`:

```ts
new lambda.PythonFunction(this, 'my_handler');
```

By default, the construct will use the name of the defining file and the construct's id to look
up the entry file:
```
.
├── stack.ts # defines a 'PythonFunction' with 'my_handler' as id
├── stack.my_handler.py # exports a function named 'lambda_handler'
```

Alternatively, an entry file and handler can be specified:
```ts
new lambda.PythonFunction(this, 'MyFunction', {
  entry: '/path/to/my/file.py',
  handler: 'my_exported_func',
  runtime: lambda.Runtime.PYTHON_3_6
});
```

All other properties of `lambda.Function` are supported, see also the [AWS Lambda construct library](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-lambda).

### Module Dependencies

If `requirements.txt` exists at the same level as the entry file, the construct will handle installing
all required modules in a [Lambda compatible Docker container](https://github.com/lambci/docker-lambda)
according to the `runtime` (defaults to `PYTHON_3_7`).
```
.
├── lambda_function.py # exports a function named 'lambda_handler'
├── requirements.txt # has to be in the same directory as the entry file
```
