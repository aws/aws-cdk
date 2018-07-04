#!/bin/bash
set -euo pipefail

VERSION=$(node -e 'console.log(require("./lerna.json").version);')

for S in $(node -e 'console.log(require("./packages/@aws-cdk/cloudformation-resource-spec").namespaces.join("\n"));'); do
    P=$(tr 'A-Z' 'a-z' <<< "${S/AWS::/@aws-cdk/}")
    PB=$(basename ${P})
    if [ ! -d packages/${P} ]; then
        echo "⏳ Creating package ${P} for scope ${S}..."
        mkdir -p packages/${P}/test
        mkdir -p packages/${P}/lib
        echo '*.js' >> packages/${P}/.gitignore
        echo '*.js.map' >> packages/${P}/.gitignore
        echo '*.d.ts' >> packages/${P}/.gitignore
        echo 'tsconfig.json' >> packages/${P}/.gitignore
        echo 'tslint.json' >> packages/${P}/.gitignore
        echo 'node_modules' >> packages/${P}/.gitignore
        echo 'cfn' >> packages/${P}/.gitignore
        echo 'dist' >> packages/${P}/.gitignore

        echo "# Don't include original .ts files when doing \`npm pack\`" >> packages/${P}/.npmignore
        echo '*.ts' >> packages/${P}/.npmignore
        echo '!*.d.ts' >> packages/${P}/.npmignore
        echo 'coverage' >> packages/${P}/.npmignore
        echo '.nyc_output' >> packages/${P}/.npmignore
        echo '*.tgz' >> packages/${P}/.npmignore

        echo '{' >> packages/${P}/package.json
        echo "  \"name\": \"${P}\"," >> packages/${P}/package.json
        echo "  \"version\": \"${VERSION}\"," >> packages/${P}/package.json
        echo "  \"description\": \"The CDK Construct Library for ${S}\"," >> packages/${P}/package.json
        echo "  \"main\": \"lib/index.js\"," >> packages/${P}/package.json
        echo "  \"types\": \"lib/index.d.ts\"," >> packages/${P}/package.json
        echo "  \"jsii\": {" >> packages/${P}/package.json
        echo "    \"outdir\": \"dist\"," >> packages/${P}/package.json
        echo "    \"bundledDependencies\": []," >> packages/${P}/package.json
        echo "    \"names\": {" >> packages/${P}/package.json
        echo "      \"java\": \"com.amazonaws.cdk.${PB}\"," >> packages/${P}/package.json
        echo "      \"dotnet\": \"${S/AWS::/Aws.Cdk.}\"" >> packages/${P}/package.json
        echo "    }" >> packages/${P}/package.json
        echo "  }," >> packages/${P}/package.json
        echo "  \"repository\": {" >> packages/${P}/package.json
        echo "    \"type\": \"git\"," >> packages/${P}/package.json
        echo "    \"url\": \"git://github.com/awslabs/aws-cdk\"" >> packages/${P}/package.json
        echo "  }," >> packages/${P}/package.json
        echo "  \"scripts\": {" >> packages/${P}/package.json
        echo "    \"build\": \"cfn2ts --scope=${S} && jsii && tslint -p . && pkglint\"," >> packages/${P}/package.json
        echo "    \"watch\": \"jsii -w\"," >> packages/${P}/package.json
        echo "    \"lint\": \"jsii && tslint -p . --force\"," >> packages/${P}/package.json
        echo "    \"test\": \"nodeunit test/test.*.js && cdk-integ-assert\"," >> packages/${P}/package.json
        echo "    \"integ\": \"cdk-integ\"," >> packages/${P}/package.json
        echo "    \"pkglint\": \"pkglint -f\"" >> packages/${P}/package.json
        echo "  }," >> packages/${P}/package.json
        echo "  \"keywords\": [" >> packages/${P}/package.json
        echo "    \"aws\"," >> packages/${P}/package.json
        echo "    \"cdk\"," >> packages/${P}/package.json
        echo "    \"constructs\"," >> packages/${P}/package.json
        echo "    \"${PB}\"" >> packages/${P}/package.json
        echo "  ]," >> packages/${P}/package.json
        echo "  \"author\": {" >> packages/${P}/package.json
        echo "    \"name\": \"Amazon Web Services\"," >> packages/${P}/package.json
        echo "    \"url\": \"https://aws.amazon.com\"" >> packages/${P}/package.json
        echo "  }," >> packages/${P}/package.json
        echo "  \"license\": \"LicenseRef-LICENSE\"," >> packages/${P}/package.json
        echo "  \"devDependencies\": {" >> packages/${P}/package.json
        echo "    \"@aws-cdk/assert\": \"^${VERSION}\"," >> packages/${P}/package.json
        echo "    \"cfn2ts\": \"^${VERSION}\"," >> packages/${P}/package.json
        echo "    \"pkglint\": \"^${VERSION}\"" >> packages/${P}/package.json
        echo "  }," >> packages/${P}/package.json
        echo "  \"dependencies\": {" >> packages/${P}/package.json
        echo "    \"@aws-cdk/core\": \"^${VERSION}\"," >> packages/${P}/package.json
        echo "    \"@aws-cdk/runtime\": \"^${VERSION}\"" >> packages/${P}/package.json
        echo "  }" >> packages/${P}/package.json
        echo '}' >> packages/${P}/package.json

        echo "// The L1 Library for ${S}:" >> packages/${P}/lib/index.ts
        echo "export * from '../cfn/${PB}';" >> packages/${P}/lib/index.ts

        echo "import { Test, testCase } from 'nodeunit';" >> packages/${P}/test/test.${PB}.ts
        echo "" >> packages/${P}/test/test.${PB}.ts
        echo "exports = testCase({" >> packages/${P}/test/test.${PB}.ts
        echo "    notTested(test: Test) {" >> packages/${P}/test/test.${PB}.ts
        echo "        test.ok(true, 'No tests are specified for this package.');" >> packages/${P}/test/test.${PB}.ts
        echo "        test.done();" >> packages/${P}/test/test.${PB}.ts
        echo "    }" >> packages/${P}/test/test.${PB}.ts
        echo "});" >> packages/${P}/test/test.${PB}.ts

        echo "⌛️ Bootstrapping & building ${P}"
        lerna bootstrap --scope=${P}
        lerna run build --scope=${P}

        git add packages/${P}

        echo "✅ Have fun with your new package ${P}"
    fi
done
