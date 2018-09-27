import colors = require('colors/safe');
import { data } from './logging';

let previousTemplate: any = { };

export async function interactive(stack: any, verbose: boolean, synthStackFn: (x: any) => Promise<any>) {
  let template;
  try {
    template = (await synthStackFn(stack)).template;
  } catch (e) {
    template = { error: e };
  }

  process.stdout.write('\x1B[2J\x1B[0f');
  data(colors.underline(colors.green(stack.name)));

  if (template.error) {
    data(colors.red(template.error));
  } else {
    if (!template.Resources || Object.keys(template.Resources).length === 0) {
      data(colors.dim(colors.white('(stack is empty)')));
    } else {
      for (const id of Object.keys(template.Resources).sort()) {
        const res = template.Resources[id];

        const resourceChanged = () => {
          if (!previousTemplate.Resources || !(id in previousTemplate.Resources)) {
            return true;
          }

          const prev = JSON.stringify(previousTemplate.Resources[id]);
          const curr = JSON.stringify(res);
          return (prev !== curr);
        };

        const globalColor: (x: any) => any = resourceChanged() ? colors.italic : (x: any) => x;

        data(globalColor(`${colors.bold(colors.white(id))} ${colors.gray(res.Type)}`));

        if (verbose && res.Properties) {
          Object.keys(res.Properties).forEach(prop => {
            const value = res.Properties[prop];
            data(globalColor(`  ${colors.cyan(prop)}=${JSON.stringify(value)}`));
          });
        }
      }
    }
  }

  previousTemplate = template;

  setTimeout(() => interactive(stack, verbose, synthStackFn), 2000);
}
