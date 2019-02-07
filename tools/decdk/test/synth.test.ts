import fs = require('fs');
import path = require('path');

for (const templateFile of fs.readdirSync(path.join(__dirname, '..', 'examples'))) {
  test(templateFile, async () => {
    console.error(templateFile);
  });
}