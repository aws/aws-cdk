import { Resource, Template } from './template';

/**
 * Check a template for cyclic dependencies
 *
 * This will make sure that we don't happily validate templates
 * in unit tests that wouldn't deploy to CloudFormation anyway.
 */
export function checkTemplateForCyclicDependencies(template: Template): void {
  const logicalIds = new Set(Object.keys(template.Resources ?? {}));

  const dependencies = new Map<string, Set<string>>();
  for (const [logicalId, resource] of Object.entries(template.Resources ?? {})) {
    dependencies.set(logicalId, intersect(findResourceDependencies(resource), logicalIds));
  }

  // We will now progressively remove entries from the map of 'dependencies' that have
  // 0 elements in them. If we can't do that anymore and the map isn't empty, we
  // have a cyclic dependency.
  while (dependencies.size > 0) {
    const free = Array.from(dependencies.entries()).filter(([_, deps]) => deps.size === 0);
    if (free.length === 0) {
      // Oops!
      const cycle = findCycle(dependencies);

      const cycleResources: any = {};
      for (const logicalId of cycle) {
        cycleResources[logicalId] = template.Resources?.[logicalId];
      }

      throw new Error(`Template is undeployable, these resources have a dependency cycle: ${cycle.join(' -> ')}:\n\n${JSON.stringify(cycleResources, undefined, 2)}`);
    }

    for (const [logicalId, _] of free) {
      for (const deps of dependencies.values()) {
        deps.delete(logicalId);
      }
      dependencies.delete(logicalId);
    }
  }
}

function findResourceDependencies(res: Resource): Set<string> {
  return new Set([
    ...toArray(res.DependsOn ?? []),
    ...findExpressionDependencies(res.Properties),
  ]);
}

function toArray<A>(x: A | A[]): A[] {
  return Array.isArray(x) ? x : [x];
}

function findExpressionDependencies(obj: any): Set<string> {
  const ret = new Set<string>();
  recurse(obj);
  return ret;

  function recurse(x: any): void {
    if (!x) { return; }
    if (Array.isArray(x)) {
      x.forEach(recurse);
    }
    if (typeof x === 'object') {
      const keys = Object.keys(x);
      if (keys.length === 1 && keys[0] === 'Ref') {
        ret.add(x[keys[0]]);
      } else if (keys.length === 1 && keys[0] === 'Fn::GetAtt') {
        ret.add(x[keys[0]][0]);
      } else if (keys.length === 1 && keys[0] === 'Fn::Sub') {
        const argument = x[keys[0]];
        const pattern = Array.isArray(argument) ? argument[0] : argument;

        // pattern should always be a string, but we've encountered some cases in which
        // it isn't. Better safeguard.
        if (typeof pattern === 'string') {
          for (const logId of logicalIdsInSubString(pattern)) {
            ret.add(logId);
          }
        }
        const contextDict = Array.isArray(argument) ? argument[1] : undefined;
        if (contextDict && typeof contextDict === 'object') {
          Object.values(contextDict).forEach(recurse);
        }
      } else {
        Object.values(x).forEach(recurse);
      }
    }
  }
}

/**
 * Return the logical IDs found in a {Fn::Sub} format string
 */
function logicalIdsInSubString(x: string): string[] {
  return analyzeSubPattern(x).flatMap((fragment) => {
    switch (fragment.type) {
      case 'getatt':
      case 'ref':
        return [fragment.logicalId];
      case 'literal':
        return [];
    }
  });
}


function analyzeSubPattern(pattern: string): SubFragment[] {
  const ret: SubFragment[] = [];
  let start = 0;

  let ph0 = pattern.indexOf('${', start);
  while (ph0 > -1) {
    if (pattern[ph0 + 2] === '!') {
      // "${!" means "don't actually substitute"
      start = ph0 + 3;
      ph0 = pattern.indexOf('${', start);
      continue;
    }

    const ph1 = pattern.indexOf('}', ph0 + 2);
    if (ph1 === -1) {
      break;
    }
    const placeholder = pattern.substring(ph0 + 2, ph1);

    if (ph0 > start) {
      ret.push({ type: 'literal', content: pattern.substring(start, ph0) });
    }
    if (placeholder.includes('.')) {
      const [logicalId, attr] = placeholder.split('.');
      ret.push({ type: 'getatt', logicalId: logicalId!, attr: attr! });
    } else {
      ret.push({ type: 'ref', logicalId: placeholder });
    }

    start = ph1 + 1;
    ph0 = pattern.indexOf('${', start);
  }

  if (start < pattern.length - 1) {
    ret.push({ type: 'literal', content: pattern.slice(start) });
  }

  return ret;
}

type SubFragment =
  | { readonly type: 'literal'; readonly content: string }
  | { readonly type: 'ref'; readonly logicalId: string }
  | { readonly type: 'getatt'; readonly logicalId: string; readonly attr: string };


function intersect<A>(xs: Set<A>, ys: Set<A>): Set<A> {
  return new Set<A>(Array.from(xs).filter(x => ys.has(x)));
}

/**
 * Find cycles in a graph
 *
 * Not the fastest, but effective and should be rare
 */
function findCycle(deps: ReadonlyMap<string, ReadonlySet<string>>): string[] {
  for (const node of deps.keys()) {
    const cycle = recurse(node, [node]);
    if (cycle) { return cycle; }
  }
  throw new Error('No cycle found. Assertion failure!');

  function recurse(node: string, path: string[]): string[] | undefined {
    for (const dep of deps.get(node) ?? []) {
      if (dep === path[0]) { return [...path, dep]; }

      const cycle = recurse(dep, [...path, dep]);
      if (cycle) { return cycle; }
    }

    return undefined;
  }
}