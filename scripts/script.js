import * as fs from "fs";

module.exports = async ({github, context, core}) => {
    const content = fs.readFileSync('./packages/aws-cdk-lib/region-info/build-tools/metadata.ts');

    console.log(content);
}