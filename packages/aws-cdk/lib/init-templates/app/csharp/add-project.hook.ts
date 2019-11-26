import * as child_process from 'child_process';
import * as path from 'path';
import { InvokeHook } from '../../../init';

export const invoke: InvokeHook = async (targetDirectory: string) => {
  const slnPath = path.join(targetDirectory, "src", "%name.PascalCased%.sln");
  const csprojPath = path.join(targetDirectory, "src", "%name.PascalCased%", "%name.PascalCased%.csproj");

  try {
    await runCommand('dotnet', 'sln', slnPath, 'add', csprojPath);
  } catch (err) {
    throw new Error(`Could not add project %name.PascalCased%.csproj to solution %name.PascalCased%.sln: ${err}`);
  }

  try {
    await runCommand('dotnet', 'add', csprojPath, 'package', 'Amazon.Jsii.Analyzers');
  } catch (err) {
    throw new Error(`Could not add Amazon.Jsii.Analyzers to project %name.PascalCased%.csproj: ${err}`);
  }
};

function runCommand(command: string, ...args: string[]): Promise<string> {
  const child = child_process.spawn(command, args, { shell: true, stdio: ['ignore', 'pipe', 'inherit'] });

  return new Promise<string>((ok, ko) => {
    const stdout = new Array<Buffer>();

    child.stdout.on('data', chunk => {
      stdout.push(Buffer.from(chunk));
      process.stdout.write(chunk);
    });

    child.once('error', ko);

    child.once('exit', (code, signal) => {
      if (code === 0) {
        ok(Buffer.concat(stdout).toString('utf-8'));
      } else if (code != null) {
        ko(new Error(`Command exited with non-zero code: ${code}`));
      } else {
        ko(new Error(`Command was killed by signal: ${signal}`));
      }
    });
  });
}
