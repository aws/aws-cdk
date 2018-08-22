import * as cdkBuildTools from 'cdk-build-tools';
import * as path from 'path';
import { InvokeHook } from '../../../init';

export const invoke: InvokeHook = async (targetDirectory: string) => {
    const slnPath = path.join(targetDirectory, "src", "HelloCdk.sln");
    const csprojPath = path.join(targetDirectory, "src", "HelloCdk", "HelloCdk.csproj");
    await cdkBuildTools.shell([ 'dotnet', 'sln', slnPath, 'add', csprojPath ]);
};
