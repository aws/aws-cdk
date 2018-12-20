import reflect = require('jsii-reflect');
import { Report } from './report';

export function writeHtml(ts: reflect.TypeSystem, report: Report, out: NodeJS.WriteStream = process.stdout) {

  const e = (open: string, block?: (() => void) | string) => {
    out.write(`<${open}>\n`);
    const close = open.split(' ')[0];
    if (typeof block === 'string') {
      out.write(block);
      out.write('\n');
    } else if (typeof block === 'function') {
      block();
    }
    out.write(`</${close}>\n`);
  };

  e('html', () => {
    e('head', () => {
      e('style', `
      table {
        border-collapse: collapse;
      }

      h2 {
        margin: 0px;
        margin-top: 10px;
      }

      tr {
        border-bottom: 1px silver solid;
      }

      th {
        text-align: left;
        background-color: #eee;
      }
      `);
    });

    e('body', () => {

      e('table width="100%"', () => {

        for (const module of report.modules) {
            if (module.resources.length === 0) {
              continue;
            }

            e('tr', () => e('td colspan=6', () => e('h2', module.namespace)));


            e('tr', () => {
              e('th', 'layer1 construct');
              e('th', 'layer2 construct');
              e('th', 'ref type');
              e('th', 'grants');
              e('th', 'metrics');
              e('th', 'events');
            });

            for (const resource of module.resources) {
              e('tr', () => {
                const layer1 = ts.findFqn(resource.layer1);
                e('td', () => doclink(layer1.fqn, layer1.name));
  
                if (resource.layer2) {
                  const layer2 = ts.findFqn(resource.layer2);
                  e('td', () => doclink(layer2.fqn, layer2.name));
                  if (resource.ref) {
                    const refType = ts.findFqn(resource.ref);
                    e('td', () => doclink(refType.fqn, refType.name));
                  } else {
                    e('td');
                  }
                  e('td', () => docmethods(layer2.fqn, resource.grants));
                  e('td', () => docmethods(layer2.fqn, resource.metrics));
                  e('td', () => docmethods(layer2.fqn, resource.events));
                } else {
                  e('td');
                  e('td');
                  e('td');
                  e('td');
                  e('td');
                }
              });
            }
          }
        });
    });
  });

  function docmethods(type: string, methods: string[] = []) {
    methods.forEach(method => {
      e('li', () => doclink(`${type}.${method}`, method));
    });
  }

  function doclink(fqn: string, text: string) {
    let [ module, ] = fqn.split('.');
    module = module.replace(/[@\/]/g, '_');
    const link = `https://awslabs.github.io/aws-cdk/refs/${module}.html#${fqn}`;
    e(`a href='${link}'`, text);
  }
}