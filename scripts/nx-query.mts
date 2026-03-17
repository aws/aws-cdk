#!/usr/bin/env -S node --experimental-strip-types
import { execFileSync } from 'child_process';
import { inspect } from 'util';
import { readFileSync } from 'fs';

interface NxGraph {
  graph: {
    nodes: Record<string, {
      data: {
        root: string;
      },
    }>;
    dependencies: Record<string, {
      source: string;
      target: string;
      type: string;
    }[]>;
  }
}

function main() {
  const output: NxGraph = JSON.parse(execFileSync('npx', ['nx', 'graph', '--print'], { encoding: 'utf-8' }));

  const nodes = Object.keys(output.graph.nodes);
  const dependencyGraph: AdjacencyList = Object.fromEntries(nodes.map(node => [node, []]));

  for (const nodeEdges of Object.values(output.graph.dependencies ?? {})) {
    for (const edge of nodeEdges) {
      dependencyGraph[edge.source].push(edge.target);
    }
  }

  if (process.argv.length < 3 || process.argv.includes('--help') || process.argv.includes('-h')) {
    help();
    process.exitCode = 1;
    return;
  }

  const expression = process.argv[2];
  const directories = Object.fromEntries(nodes.map(node => [node, output.graph.nodes[node].data.root]));

  let selectedNodes = new Set(evaluateExpression(expression ?? '', dependencyGraph, {
    jsii: () => new Set(nodes.filter(n => isJsiiPackage(directories[n]))),
  }));

  const sortedNodes = new Graph(dependencyGraph).topologicalSort().flatMap(xs => xs).filter(x => selectedNodes.has(x));

  for (const node of sortedNodes) {
    console.log(directories[node]);
  }
}

/**
 * Returns whether the given package.json has a "jsii" section
 */
function isJsiiPackage(dir: string) {
  const pkgJson = JSON.parse(readFileSync(`${dir}/package.json`, 'utf-8'));
  return !!pkgJson.jsii;
}

function help() {
  console.error(`Usage: nx-query.mts <EXPRESSION>

Query the monorepo graph for packages using an expression language. The
language is based on https://docs.jj-vcs.dev/latest/revsets/. Highlights:

    x              A package name
    ::x            All packages that x depends on (including x)
    x::            All packages that depend on x (including x)
    x::y           All packages between x and y
    ~x             All packages other than x
    x & y, x | y   Intersection and union
    x ~ y          All packages in x except those in y

    jsii()         All jsii packages
`);
}


interface ExpressionFunctions {
  jsii: () => Set<string>;
}

/**
 * Evaluate the given graph expression
 *
 * We're doing a tiny subset of https://docs.jj-vcs.dev/latest/revsets/ as the expression language.
 *
 * Implemented using Pratt Parsing.
 */
function evaluateExpression(expression: string, edges: AdjacencyList, functions: ExpressionFunctions): Set<string> {
  const upstream = new Graph(edges);
  const downstream = upstream.transpose();
  const allNodes = upstream.nodes();

  const nodeSetStack = new Array<Set<string>>();

  type ParseRule = { prefix?: () => void, infix?: () => void, prio: number };
  const rules: Record<Token['type'], ParseRule> = {
    range: { prefix: parsePrefixRange, infix: parseRange, prio: 50 },
    "~": { prefix: parseUnary, infix: parseBinary, prio: 10 },
    "&": { infix: parseBinary, prio: 10 },
    "|": { infix: parseBinary, prio: 10 },
    "(": { prefix: parseGroup, prio: 100 },
    ")": { prio: 0 },
    "identifier": { prefix: parseIdentifier, prio: 70 },
    "eof": { prio: 0 },
  };
  const tokens = Array.from(scan(expression));

  // No expression: return all nodes
  if (tokens[0].type === 'eof') {
    return allNodes;
  }

  // Otherwise evaluate the expression in a stack machine
  let index = 0;
  let curToken: Token = tokens[index];

  function advance() {
    index += 1;
    if (index >= tokens.length) {
      throw new Error(`Unexpected end of input string at '${expression.slice(curToken.start)}'`);
    }
    curToken = tokens[index];
  }

  function curPrio() {
    return rules[curToken.type].prio;
  }

  function parseWithPrio(prio: number) {
    const rule = rules[curToken.type];

    if (!rule.prefix) {
      throw new Error(`Expected expression at '${expression.slice(curToken.start)}'`);
    }
    rule.prefix();

    while (prio <= curPrio()) {
      const rule = rules[curToken.type];
      rule.infix?.();
    }
  }

  function parseExpression() {
    parseWithPrio(1); // Lowest priority
  }

  function parseGroup() {
    advance();
    parseExpression();
    if (curToken.type !== ')') {
      throw new Error(`Expected ')' at '${expression.slice(curToken.start)}'`);
    }
    advance();
  }

  function pop(): Set<string> {
    const x = nodeSetStack.pop();
    if (x === undefined) {
      throw new Error('Stack is empty');
    }
    return x;
  }

  function popArray() {
    return Array.from(pop());
  }

  /**
   * If we encounter a range without a first argument (::x)
   *
   * Behaves like a unary.
   */
  function parsePrefixRange() {
    const prio = curPrio();
    advance();

    if (curPrio() > prio) {
      // We have an RHS to parse
      parseExpression();
      const rhs = popArray();
      nodeSetStack.push(union(...rhs.map(p => new Set(upstream.closure(p)))));
    } else {
      // Missing RHS argument. Since we also don't have a left-side argument, we saw a `::`.
      nodeSetStack.push(allNodes);
    }
  }

  function parseRange() {
    const prio = curPrio();
    advance();

    if (curPrio() > prio) {
      // On the RHS there is something we can parse
      parseWithPrio(prio + 1);
      const rhs = popArray();
      const lhs = popArray();

      // Only those that are both ancestors of RHS and descendants of LHS
      const ancestors = union(...rhs.map(p => new Set(upstream.closure(p))));
      const descendants = union(...lhs.map(p => new Set(downstream.closure(p))));

      nodeSetStack.push(intersect(ancestors, descendants));
    } else {
      // If not, there is a missing argument. All downstream packages then.
      const lhs = popArray();
      nodeSetStack.push(union(...lhs.map(p => new Set(downstream.closure(p)))));
    }
  }

  function parseBinary() {
    const op = curToken.type;
    const prio = curPrio();

    advance();
    parseWithPrio(prio + 1);

    const rhs = pop();
    const lhs = pop();

    switch (op) {
      case '&':
        nodeSetStack.push(intersect(lhs, rhs));
        break;
      case '|':
        nodeSetStack.push(union(lhs, rhs));
        break;
      case '~':
        nodeSetStack.push(except(lhs, rhs));
        break;
      default:
        // Other cases are unreachable
        break;
    }
  }

  function parseUnary() {
    const op = curToken.type;

    advance();
    parseExpression();

    // Only reachable case
    if (op === '~') {
      const notThese = pop();
      nodeSetStack.push(except(allNodes, notThese));
    }
  }

  function parseIdentifier() {
    const t = curToken;
    if (t.type !== 'identifier') {
      // Has to be this, to satisfy type checker
      throw new Error('Impossible');
    }

    advance();

    if (curToken.type === '(') {
      // Function call
      advance();
      parseFunctionCall(t);
    } else {
      // Package reference
      if (!allNodes.has(t.ident)) {
        throw new Error(`No such package: ${t.ident} (have: ${Array.from(allNodes)})`);
      }

      nodeSetStack.push(new Set([t.ident]));
    }
  }

  function parseFunctionCall(fn: Extract<Token, { type: 'identifier' }>) {
    // Expected to be on the first argument here.
    // But we don't support arguments so we are on the closing brace.
    if (curToken.type !== ')') {
      throw new Error(`Expected ')' at '${expression.slice(curToken.start)}'`);
    }
    advance();

    switch (fn.ident) {
      case 'jsii':
        nodeSetStack.push(functions.jsii());
        break;

      default:
        throw new Error(`Unrecognized function: ${fn.ident}()`);
    }
  }

  while (curToken.type !== 'eof') {
    parseExpression();
  }

  if (nodeSetStack.length !== 1) {
    throw new Error(`Stack should have one element on it, have: ${inspect(nodeSetStack)}`);
  }

  return nodeSetStack[0];
}

function union(...xss: Set<string>[]): Set<string> {
  const ret = new Set<string>();
  for (const xs of xss) {
    for (const x of xs) {
      ret.add(x);
    }
  }
  return ret;
}

function intersect(xs: Set<string>, ys: Set<string>): Set<string> {
  return new Set(Array.from(xs).filter(x => ys.has(x)));
}

function except(xs: Set<string>, ys: Set<string>): Set<string> {
  return new Set(Array.from(xs).filter(x => !ys.has(x)));
}

type Token =
  | { type: 'range', start: number }
  | { type: 'identifier', ident: string, start: number }
  | { type: '&', start: number }
  | { type: '|', start: number }
  | { type: '~', start: number }
  | { type: '(', start: number }
  | { type: ')', start: number }
  | { type: 'eof', start: number };

function* scan(s: string): Generator<Token> {
  const packageChars = /[A-Za-z0-9@\/-]/;
  let i = 0;
  while (i < s.length) {
    const start = i;
    let c = s[i++];

    if (c == ':') {
      c = s[i++];
      if (c !== ':') {
        throw new Error(`Expected '::' at '${s.slice(start)}'`);
      }
      yield { type: 'range', start };
      continue;
    }

    if (['&', '|', '~', '(', ')'].includes(c)) {
      yield { type: c as any, start };
      continue;
    }

    if (packageChars.test(c)) {
      while (i < s.length && packageChars.test(s[i])) {
        i += 1;
      }
      yield { type: 'identifier', ident: s.substring(start, i), start };
      continue;
    }

    if ([' ', '\t'].includes(c)) {
      continue;
    }

    throw new Error(`Unexpected character '${c}' at '${s.slice(start)}'`);
  }

  yield { type: 'eof', start: s.length };
}

type AdjacencyList = Record<string, string[]>;

class Graph {
  private readonly outEdges: AdjacencyList;

  constructor(outEdges: AdjacencyList) {
    this.outEdges = outEdges;
  }

  public nodes(): Set<string> {
    return new Set(Object.keys(this.outEdges));
  }

  public has(node: string) {
    return !!this.outEdges[node];
  }

  public direct(node: string): string[] {
    return this.outEdges[node] ?? [];
  }

  public* closure(node: string): Iterable<string> {
    const queue = [node];
    const seen = new Set<string>();

    while (true) {
      let next = queue.shift();
      if (!next) {
        return;
      }

      if (seen.has(next)) {
        continue;
      }
      seen.add(next);

      yield next;
      queue.push(...this.outEdges[next] ?? []);
    }
  }

  public transpose(): Graph {
    const ret: AdjacencyList = {};
    for (const [node, outs] of Object.entries(this.outEdges)) {
      for (const out of outs) {
        ret[out] = ret[out] ?? [];
        ret[out].push(node);
      }
    }
    return new Graph(ret);
  }

  /**
   * Return a topological sort of all elements of xs, according to the given dependency functions
   *
   * Dependencies outside the referenced set are ignored.
   *
   * Not a stable sort, but in order to keep the order as stable as possible, we'll sort by key
   * among elements https://www.youtube.com/of equal precedence.
   */
  public topologicalSort(): string[][] {
    const remaining = new Map<string, string[]>();
    for (const [key, deps] of Object.entries(this.outEdges)) {
      remaining.set(key, deps);
    }

    const ret = new Array<string[]>();
    while (remaining.size > 0) {
      // All elements with no more deps in the set can be ordered
      const selectable = Array.from(remaining.entries())
        .filter(([_, deps]) => deps.every(d => !remaining.has(d)))
        .map(([k, _]) => k);

      // If we didn't make any progress, we got stuck
      if (selectable.length === 0) {
        throw new Error(`Could not determine ordering between: ${Array.from(remaining.keys()).join(', ')}`);
      }

      ret.push(selectable);

      for (const selected of selectable) {
        remaining.delete(selected);
      }
    }

    return ret;
  }
}


main();