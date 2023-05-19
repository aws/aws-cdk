
import * as path from 'node:path';
import { ModuleMap } from '@aws-cdk/cfn2ts';
import * as fs from 'fs-extra';

export default async function cloudformationInclude(moduleMap: ModuleMap, outPath: string) {
  const classMap: { [cfnType: string]: string } = {};
  Object.entries(moduleMap).forEach(([moduleName, { resources }]) => {
    const modulePath = `aws-cdk-lib/${moduleName}`;
    Object.entries(resources).forEach(([resourceName, resourceClassName]) => {
      classMap[resourceName] = `${modulePath}.${resourceClassName}`;
    });
  });

  const sortedClassMap = Object.fromEntries(Object.entries(classMap).sort(([resA], [resB]) => resA.localeCompare(resB)));

  const filePath = path.join(outPath, 'cloudformation-include', 'cfn-types-2-classes.json');
  await fs.writeJson(filePath, sortedClassMap, { spaces: 2 });
}
