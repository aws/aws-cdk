import * as path from 'path';
import { InvokeHook } from '../../../init';
import { shell } from '../../../os';

export const invoke: InvokeHook = async (targetDirectory: string) => {
  const slnPath = path.join(targetDirectory, 'src', '%name.PascalCased%.sln');
  const csprojPath = path.join(targetDirectory, 'src', '%name.PascalCased%', '%name.PascalCased%.csproj');
  try {
    await shell(['dotnet', 'sln', slnPath, 'add', csprojPath]);
  } catch (e) {
    throw new Error(`Could not add project %name.PascalCased%.csproj to solution %name.PascalCased%.sln. ${e.message}`);
  }
};
