import * as path from 'path';
import { InvokeHook } from '../../../init';
import { shell } from '../util/os';

export const invoke: InvokeHook = async (targetDirectory: string) => {
  const slnPath = path.join(targetDirectory, 'src', '%name.PascalCased%.sln');
  const csprojPath = path.join(targetDirectory, 'src', '%name.PascalCased%', '%name.PascalCased%.csproj');
  await shell(['dotnet', 'sln', slnPath, 'add', csprojPath], { errorMessage: 'Could not add project %name.PascalCased%.csproj to solution %name.PascalCased%.sln.' });
};