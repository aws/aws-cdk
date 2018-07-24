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
*.js
*.js.map
*.d.ts
*.generated.ts
tsconfig.json
tslint.json
node_modules
dist
.jsii
.nyc_output
coverage
.LAST_BUILD
EOM

        cat <<EOM > packages/${P}/.npmignore
# Don't include original .ts files when doing \`npm pack\`
*.ts
!*.d.ts
coverage
.nyc_output
*.tgz
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
      "java": {
        "package": "com.amazonaws.cdk.aws.${PB}",
        "maven": {
          "groupId": "com.amazonaws.cdk",
          "artifactId": "aws-${PB}"
        }
      },
      "dotnet": {
        "namespace": "${S/AWS::/Amazon.CDK.AWS.}"
      }
    }
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/awslabs/aws-cdk"
  },
  "scripts": {
    "build": "cdk-build",
    "watch": "cdk-watch",
    "lint": "cdk-lint",
    "test": "cdk-test",
    "integ": "cdk-integ",
    "pkglint": "pkglint -f"
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
    "url": "https://aws.amazon.com"
  },
  "license": "LicenseRef-LICENSE",
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
export * from './${PB}.generated';
EOM

        cat <<EOM > packages/${P}/test/test.${PB}.ts
import { Test, testCase } from 'nodeunit';
import {} from '../lib';

exports = testCase({
    notTested(test: Test) {
        test.ok(true, 'No tests are specified for this package.');
        test.done();
    }
});
EOM

        echo "⌛️ Bootstrapping & building ${P}"
        lerna bootstrap --scope=${P}
        lerna run build --scope=${P}

        git add packages/${P}

        echo "✅ Have fun with your new package ${P} (⚠️ don't forget to add it to 'aws-cdk-all')"
    fi
done
