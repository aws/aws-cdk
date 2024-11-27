import * as fs from 'fs';

// eslint-disable-next-line no-console
void(fs);

const originalFs = Object.assign({}, fs);

module.exports = () => {
  (fs as any).writeFile = (file: any, data: any, options: any, callback: any) => {
    // eslint-disable-next-line no-console
    console.error(file);
    return originalFs.writeFile(file, data, options, callback);
  };
};
