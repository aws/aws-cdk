import * as child_process from 'child_process';

export async function shell(command: string[]): Promise<string> {
  const child = child_process.spawn(command[0], command.slice(1), {
    // Need this for Windows where we want .cmd and .bat to be found as well.
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<any>();

    child.stdout!.on('data', chunk => {
      process.stdout.write(chunk);
      stdout.push(chunk);
    });

    child.stderr!.on('data', chunk => {
      process.stderr.write(chunk.toString());
    });

    child.once('error', reject);
    child.once('exit', code => {
      if (code === 0) {
        resolve(Buffer.concat(stdout).toString('utf-8'));
      } else {
        reject(new Error(`Command '${command}' exited with error code ${code}`));
      }
    });
  });
}
