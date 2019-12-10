import child = require('child_process');
import { promisify } from 'util';
import { MonoRepo, MonoRepoPackage } from './types';

export async function discoverMonoRepo(directory: string): Promise<MonoRepo> {
  const { stdout } = await promisify(child.exec)('npx lerna ls --toposort --json --all', {
    cwd: directory
  });
  const modules = JSON.parse(stdout) as LernaLsOutput;

  const packages: {[key: string]: MonoRepoPackage} = {};
  for (const module of modules) {
    packages[module.name] = {
      name: module.name,
      directory: module.location
    };
  }

  return { directory, packages };
}

type LernaLsOutput = Array<{
  name: string;
  version: string;
  private: boolean;
  location: string;
}>;