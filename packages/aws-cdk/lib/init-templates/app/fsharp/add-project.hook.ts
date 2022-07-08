import * as path from 'path';
import { InvokeHook } from '../../../init';
import { shell } from '../util/os';

export const invoke: InvokeHook = async (targetDirectory: string) => {
  const slnPath = path.join(targetDirectory, 'src', '%name.PascalCased%.sln');
  const fsprojPath = path.join(targetDirectory, 'src', '%name.PascalCased%', '%name.PascalCased%.fsproj');
  await shell(['dotnet', 'sln', slnPath, 'add', fsprojPath], { errorMessage: 'Could not add project %name.PascalCased%.fsproj to solution %name.PascalCased%.sln.' });
};
