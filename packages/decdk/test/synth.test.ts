import cdk = require('@aws-cdk/cdk');
import fs = require('fs');
import path = require('path');
import { DeclarativeStack, loadTypeSystem, readTemplate, stackNameFromFileName } from '../lib';

const dir = path.join(__dirname, '..', 'examples');

for (const templateFile of fs.readdirSync(dir)) {
  test(templateFile, async () => {
    const template = await readTemplate(path.resolve(dir, templateFile));
    const typeSystem = await loadTypeSystem();

    const app = new cdk.App();
    const stackName = stackNameFromFileName(templateFile);

    new DeclarativeStack(app, stackName, {
      template,
      typeSystem
    });

    expect(app.synthesizeStack(stackName).template).toMatchSnapshot(stackName);
  });
}