
module.exports = async ({github, context, core}) => {
    const fs = require('fs');
    const content = fs.readFileSync('./packages/aws-cdk-lib/region-info/build-tools/metadata.ts');

    console.log(content.toString());
}