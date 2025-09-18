#!/usr/bin/env node
import { deployInegTestsWithAtmosphere } from '../lib/integ-run';

const endpoint = process.env.CDK_ATMOSPHERE_ENDPOINT;
const pool = process.env.CDK_ATMOSPHERE_POOL;

if (!endpoint) {
  throw new Error('CDK_ATMOSPHERE_ENDPOINT environment variable is required');
}

if (!pool) {
  throw new Error('CDK_ATMOSPHERE_POOL environment variable is required');
}

deployInegTestsWithAtmosphere({ endpoint, pool });