import { spawnSync } from 'child_process';
import * as path from 'path';

const pathToGeneratedFile = path.join(__dirname, 'custom_command_output', 'mylambdafile.js');

spawnSync('rm', [pathToGeneratedFile], {
  stdio: 'inherit',
});

spawnSync('cp', [path.join(__dirname, 'dependencies.ts'), pathToGeneratedFile], {
  stdio: 'inherit',
});

