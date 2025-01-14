#!/usr/bin/env node
import {main} from '../lib';

main().catch(e => {
    console.error(e);
    process.exit(1);
});