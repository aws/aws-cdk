import { execSync } from 'child_process';
import * as fs from 'fs';

main().then((result) => {
  console.log(result);
  console.log('test finder exited successfully');
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exitCode = 1;
});


async function main() {
  if (!process.argv[2]) {
    throw new Error('Usage: node discover-integ-tests.ts <CDK Root>');
  }

  const testDirectory = `${process.argv[2]}/packages/@aws-cdk-testing/framework-integ/test`;

  const testsToRun = discoverTests(testDirectory);

  for (const module of fs.readdirSync(testDirectory)) {
    if (fs.statSync(`${testDirectory}/${module}`).isDirectory()) {
      for (const test of fs.readdirSync(`${testDirectory}/${module}`)) {
        if (fs.statSync(`${testDirectory}/${module}/${test}`).isDirectory()) {
          for (const testFile of fs.readdirSync(`${testDirectory}/${module}/${test}`)) {
            //console.log(testFile);
            let testFileNoExtension = '';
            if (testFile.includes('.js')) {
              testFileNoExtension = testFile.slice(0, testFile.length-'.js'.length);
            } else if (testFile.includes('.d.ts')) {
              testFileNoExtension = testFile.slice(0, testFile.length-'.d.ts'.length);
            } else if (testFile.includes('.snapshot')) {
              testFileNoExtension = testFile.slice(0, testFile.length-'.snapshot'.length);
            } else {
              continue;
            }
            console.log(`sliced ${testFile}`);
            if (testsToRun.includes(testFile)) {
              console.log(`removing ${testDirectory}/${module}/${test}/${testFile}`)
              //fs.rmSync(`${testDirectory}/${module}/${test}/${testFile}`);
            }
          }
        }
      }
    }
  }
}

function discoverTests(testDirectory: string) {
  // the integ runner will fail (and execSync will throw) if there are any changed or new tests
  // capture the output in both cases
  let integRunnerOut: Buffer;
  try {
    console.log('starting integ runner...');
    integRunnerOut = execSync(`integ-runner --directory ${testDirectory} --max-workers 12`);
  } catch (e: any) {
    integRunnerOut = e.output;
  }

  console.log('integ runner finished');

  const matches = integRunnerOut.toString().matchAll(/\ (UNCHANGED)\ *(.*)\ /g);

  console.log('finding test names...');

  const testsToRun: string[] = [];
  for (const match of matches) {
    // we care about the match group in the (.*), as this represents the test name. It is the third match group
    console.log(match[2]);
    testsToRun.push(match[2].trim());
  }

  console.log('found tests to run:');
  console.log(JSON.stringify(testsToRun));

  return testsToRun;
}