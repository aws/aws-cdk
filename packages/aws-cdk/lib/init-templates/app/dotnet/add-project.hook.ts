import * as child_process from 'child_process';
import * as path from 'path';
import { InvokeHook } from '../../../init';

export const invoke: InvokeHook = async (targetDirectory: string) => {
  const slnPath = path.join(targetDirectory, "src", "HelloCdk.sln");
  const csprojPath = path.join(targetDirectory, "src", "HelloCdk", "HelloCdk.csproj");

  const child = child_process.spawn('dotnet', [ 'sln', slnPath, 'add', csprojPath ], {
    // Need this for Windows where we want .cmd and .bat to be found as well.
    shell: true,
    stdio: [ 'ignore', 'pipe', 'inherit' ]
  });

  await new Promise<string>((resolve, reject) => {
    const stdout = new Array<any>();

    child.stdout.on('data', chunk => {
      process.stdout.write(chunk);
      stdout.push(chunk);
    });

    child.once('error', reject);

    child.once('exit', code => {
      if (code === 0) {
        resolve(Buffer.concat(stdout).toString('utf-8'));
      } else {
        reject(new Error(`Could not add project HelloCdk.csproj to solution HelloCdk.sln. Error code: ${code}`));
      }
    });
  });
};
