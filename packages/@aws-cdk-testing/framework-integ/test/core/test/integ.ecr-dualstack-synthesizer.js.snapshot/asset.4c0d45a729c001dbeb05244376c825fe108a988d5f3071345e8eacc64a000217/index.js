"use strict";
/**
 * Simple Node.js application for ECR dual-stack endpoint integration testing
 *
 * This is a minimal container application used to test Docker image asset
 * synthesis with both IPv4-only and dual-stack ECR endpoints.
 */
console.log('ECR Dual-Stack Integration Test Application');
console.log('Application started successfully');
console.log('Timestamp:', new Date().toISOString());
// Keep the process running
setInterval(() => {
    console.log('ECR dual-stack integration test - heartbeat:', new Date().toISOString());
}, 30000);
