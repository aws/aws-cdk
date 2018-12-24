import reflect = require('jsii-reflect');
import { TypeKind } from 'jsii-spec';

export interface Report {
  modules: Module[];
}

export interface Module {
  name: string;
  namespace: string;
  resources: Resource[];
}

export interface Resource {
  namespace: string;
  basename: string;
  cloudformation: string;
  doc: string;
  layer1: string;
  layer2?: string;
  ref?: string;
  layer1_legacy?: string;
  metrics?: string[];
  events?: string[];
  grants?: string[];
}

export function createReport(ts: reflect.TypeSystem): Report {
  const constructClass = ts.findClass('@aws-cdk/cdk.Construct');
  const resourceClass = ts.findClass('@aws-cdk/cdk.Resource');

  const report: Report = {
    modules: ts.assemblies.map(a => analyzeModule(a))
  };

  return report;

  function analyzeModule(a: reflect.Assembly): Module {
    return {
      name: a.name,
      namespace: a.name.split('/')[1],
      resources: extractResources(a)
    };
  }

  function extractResources(lib: reflect.Assembly): Resource[] {
    return lib.classes.filter(c => isLayer1(c)).map(layer1 => {
      const baseName = layer1.name.substr('Cfn'.length);
      const docLink = layer1.docs.docs.link || '';

      // we expect the L2 to be just the class with the base name
      const layer2s = lib.classes.filter(c => c.name === baseName);

      // HACK: extract full CFN name from initializer docs
      const initializerDoc = (layer1.initializer && layer1.initializer.docs.docs.comment) || '';
      const out = /Creates a new ``([^`]+)``/.exec(initializerDoc);
      let cloudformation = out && out[1];
      if (!cloudformation) {
        reportError(layer1, 'Unable to extract CloudFormation resource name from initializer documentation');
        cloudformation = 'AWS::Unknown::Resource';
      }

      const namespace = cloudformation.split('::').slice(0, 2).join('::');
      const layer2 = layer2s[0] && layer2s[0];

      const resource: Resource = {
        namespace,
        cloudformation,
        doc: docLink,
        basename: baseName,
        layer1: layer1.fqn,
      };

      if (layer2) {
        resource.layer2 = layer2.fqn;
        resource.metrics = extractMetrics(layer2);
        resource.events = extractEvents(layer2);
        resource.grants = extractGrants(layer2);
        resource.ref = findRefType(layer2);
      }

      return resource;
    });
  }

  function findRefType(layer2: reflect.ClassType) {
    // old-style refs are classes that use the "Ref" suffix
    const oldStyle = ts.classes.find(c => c.fqn === `${layer2.fqn}Ref`);
    if (oldStyle) {
      return oldStyle.fqn;
    }

    // new-style refs are interfaces with an "I" prefix
    const newStyle = layer2.assembly.types.find(t => t.name === `I${layer2.name}` && t.kind === TypeKind.Interface);
    if (newStyle) {
      return newStyle.fqn;
    }

    return undefined;
  }

  function extractMetrics(layer2: reflect.ClassType) {
    return layer2.methods.filter(method => method.name.startsWith('metric')).map(m => m.name);
  }

  function extractEvents(layer2: reflect.ClassType) {
    return layer2.methods.filter(method => method.name.startsWith('on')).map(m => m.name);
  }

  function extractGrants(layer2: reflect.ClassType) {
    return layer2.methods.filter(m => m.name.startsWith('grant')).map(m => m.name);
  }

  function isConstruct(c: reflect.ClassType) {
    const bases = c.getAncestors();
    const root = bases[bases.length - 1];
    return root === constructClass;
  }

  function isLayer1(c: reflect.ClassType) {
    if (!isConstruct(c)) {
      return false;
    }

    if (c.base !== resourceClass) {
      return false;
    }

    if (!c.name.startsWith('Cfn')) {
      return false;
    }

    return true;
  }

  function reportError(context: any, message: string) {
    console.error(`ERROR: ${message} [${context}]`);
  }
}
