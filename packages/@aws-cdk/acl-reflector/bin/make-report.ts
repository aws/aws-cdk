#!/usr/bin/env node
import { createReport, createTypeSystem, writeHtml } from '../lib';

async function main() {
  const jsiidir = process.argv[2];
  if (!jsiidir) {
    throw new Error(`Usage: <jsiidir>`);
  }
  const ts = await createTypeSystem(jsiidir);
  const report = createReport(ts);
  writeHtml(ts, report);
}

main().catch(e => {
  console.log(e);
  process.exit(1);
});