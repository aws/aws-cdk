#!/bin/bash
set -euo pipefail

export PATH=node_modules/.bin:$PATH

# Making sure the bare minimum packages allowing be able to test-build the generated packages is available:
lerna exec --scope=cfn2ts                           \
           --scope=pkglint                          \
           --scope=@aws-cdk/cdk                     \
           --scope=@aws-cdk/assert              \
           --scope=@aws-cdk/cfnspec             \
           --scope=@aws-cdk/cloudformation-diff \
           --scope=@aws-cdk/cx-api              \
           --stream                                 \
  npm run build

VERSION=$(node -e 'console.log(require("./lerna.json").version);')

for S in $(node -e 'console.log(require("./packages/@aws-cdk/cfnspec").namespaces.join("\n"));'); do
    P=$(tr 'A-Z' 'a-z' <<< "${S/AWS::/@aws-cdk/aws-}")
    PB=$(basename ${P})
    if [ ! -d packages/${P} ]; then
        echo "⏳ Creating package ${P} for scope ${S}..."
        mkdir -p packages/${P}/test
        mkdir -p packages/${P}/lib
        cat <<EOM > packages/${P}/.gitignore
*.d.ts
*.generated.ts
*.js
*.js.map
.jsii
.LAST_BUILD
.LAST_PACKAGE
.nycrc
.nyc_output
coverage
dist
tsconfig.json
tslint.json
EOM

        cat <<EOM > packages/${P}/.npmignore
# The basics
*.ts
*.tgz
!*.d.ts
!*.js

# Coverage
coverage
.nyc_output
.nycrc

# Build gear
dist
.LAST_BUILD
.LAST_PACKAGE
.jsii
EOM

        cat <<EOM > packages/${P}/package.json
{
  "name": "${P}",
  "version": "${VERSION}",
  "description": "The CDK Construct Library for ${S}",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "jsii": {
    "outdir": "dist",
    "targets": {
      "dotnet": {
        "namespace": "${S/AWS::/Amazon.CDK.AWS.}",
        "packageId": "${S/AWS::/Amazon.CDK.AWS.}",
        "signAssembly": true,
        "assemblyOriginatorKeyFile": "../../key.snk"
      },
      "java": {
        "package": "software.amazon.awscdk.${PB/aws-/services.}",
        "maven": {
          "groupId": "software.amazon.awscdk",
          "artifactId": "${PB/aws-/}"
        }
      },
      "sphinx": {}
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/awslabs/aws-cdk.git"
  },
  "homepage": "https://github.com/awslabs/aws-cdk",
  "scripts": {
    "build": "cdk-build",
    "integ": "cdk-integ",
    "lint": "cdk-lint",
    "package": "cdk-package",
    "pkglint": "pkglint -f",
    "test": "cdk-test",
    "watch": "cdk-watch"
  },
  "cdk-build": {
    "cloudformation": "${S}"
  },
  "keywords": [
    "aws",
    "cdk",
    "constructs",
    "${PB}"
  ],
  "author": {
    "name": "Amazon Web Services",
    "url": "https://aws.amazon.com",
    "organization": true
  },
  "license": "Apache-2.0",
  "devDependencies": {
    "@aws-cdk/assert": "^${VERSION}",
    "cdk-build-tools": "^${VERSION}",
    "cfn2ts": "^${VERSION}",
    "pkglint": "^${VERSION}"
  },
  "dependencies": {
    "@aws-cdk/cdk": "^${VERSION}"
  }
}
EOM

        cat <<EOM > packages/${P}/lib/index.ts
// ${S} CloudFormation Resources:
export * from './${PB/aws-/}.generated';
EOM

        cat <<EOM > packages/${P}/test/test.${PB/aws-/}.ts
import { Test, testCase } from 'nodeunit';
import {} from '../lib';

export = testCase({
    notTested(test: Test) {
        test.ok(true, 'No tests are specified for this package.');
        test.done();
    }
});
EOM

        cat <<EOM > packages/${P}/README.md
## ${S/::/ } Construct Library

\`\`\`ts
const ${PB/aws-/} = require('${P}');
\`\`\`
EOM

        cp LICENSE NOTICE packages/${P}/

        echo "⌛️ Bootstrapping & building ${P}"
        lerna bootstrap --scope=${P}
        lerna run build --scope=${P}

        git add packages/${P}

        echo "✅ Have fun with your new package ${P}"
    fi
done
