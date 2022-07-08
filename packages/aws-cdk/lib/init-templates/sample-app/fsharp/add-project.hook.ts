import * as child_process from 'child_process';
import * as path from 'path';
import { InvokeHook } from '../../../init';

export const invoke: InvokeHook = async (targetDirectory: string) => {
  const slnPath = path.join(targetDirectory, 'src', '%name.PascalCased%.sln');
  const fsprojPath = path.join(targetDirectory, 'src', '%name.PascalCased%', '%name.PascalCased%.fsproj');

  const child = child_process.spawn('dotnet', ['sln', slnPath, 'add', fsprojPath], {
    // Need this for Windows where we want .cmd and .bat to be found as well.
    shell: true,
    stdio: ['ignore', 'pipe', 'inherit'],
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
        resolve(Buffer.from(stdout).toString('utf-8'));
      } else {
        reject(new Error(`Could not add project %name.PascalCased%.fsproj to solution %name.PascalCased%.sln. Error code: ${code}`));
      }
    });
  });
};
