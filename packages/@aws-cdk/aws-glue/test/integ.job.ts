#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import glue = require('../lib');
import { ConnectionInputTypes } from '../lib/connection/connection-input';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-glue');

const job = new glue.Job(stack, 'MyJob', {
    connections: [
        new glue.Connection(stack, 'MyConnection', {
            connectionInput: {
                properties: {},
                type: ConnectionInputTypes.JDBC
            }
        });
    ]
});

app.synth();
