import * as path from 'path';
import { InvokeHook } from '../../../init';
import { shell } from '../../../os';

export const invoke: InvokeHook = async (targetDirectory: string, context) => {
  const pname = context.placeholder('name.PascalCased');
  const slnPath = path.join(targetDirectory, 'src', `${pname}.sln`);
  const csprojPath = path.join(targetDirectory, 'src', pname, `${pname}.csproj`);
  try {
    await shell(['dotnet', 'sln', slnPath, 'add', csprojPath]);
  } catch (e) {
    throw new Error(`Could not add project ${pname}.csproj to solution ${pname}.sln. ${e.message}`);
  }
};
