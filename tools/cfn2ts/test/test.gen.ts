import { Test } from 'nodeunit';
// import generate from '../lib'
// import { TargetLibrary } from '../lib/codegen'
// import * as fs from 'fs'
// import * as path from 'path'

// export const cfnobjects = codeGenTest(TargetLibrary.CfnObjects, 'expected.cfnobjects.output');
// export const cdk = codeGenTest(TargetLibrary.CDK, 'expected.cdk.output', path.join(__dirname, 'enrichments'));

export = {
  'test me'(test: Test) {
    test.done();
  }
};

// function codeGenTest(target: TargetLibrary, expectedFileName: string, enrichmentsDir?: string) {
//   return async function(test: Test) {
//     let outdir = fs.mkdtempSync('/tmp/cfngen');
//     let outfile = path.join(outdir, 'out.ts');

//     try {
//       await generate(outfile, target, enrichmentsDir);
//     }
//     catch (e) {
//       console.log(e);
//       throw e;
//     }

//     let expectedPath = path.join(__dirname, expectedFileName);
//     let expected = fs.readFileSync(expectedPath);
//     let actual = fs.readFileSync(outfile);

//     test.deepEqual(actual, expected, `Expected: ${expectedPath}, actual: ${outfile}`);
//     test.done();
//   }
// }
