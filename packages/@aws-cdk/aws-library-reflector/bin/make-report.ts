#!/usr/bin/env node
import { createReport, createTypeSystem, writeHtml } from '../lib';

async function main() {
  const ts = await createTypeSystem();
  const report = createReport(ts);
  writeHtml(ts, report);
}

main().catch(e => {
  console.log(e);
  process.exit(1);
});