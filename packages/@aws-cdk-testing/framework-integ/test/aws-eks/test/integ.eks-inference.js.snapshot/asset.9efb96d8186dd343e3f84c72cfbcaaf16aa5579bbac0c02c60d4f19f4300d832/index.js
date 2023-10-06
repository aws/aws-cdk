"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComplete = exports.onEvent = void 0;
var client_eks_1 = () => { var tmp = require("@aws-sdk/client-eks"); client_eks_1 = () => tmp; return tmp; };
var credential_providers_1 = () => { var tmp = require("@aws-sdk/credential-providers"); credential_providers_1 = () => tmp; return tmp; };
var node_http_handler_1 = () => { var tmp = require("@aws-sdk/node-http-handler"); node_http_handler_1 = () => tmp; return tmp; };
var proxy_agent_1 = () => { var tmp = require("proxy-agent"); proxy_agent_1 = () => tmp; return tmp; };
var cluster_1 = () => { var tmp = require("./cluster"); cluster_1 = () => tmp; return tmp; };
var consts = () => { var tmp = require("./consts"); consts = () => tmp; return tmp; };
var fargate_1 = () => { var tmp = require("./fargate"); fargate_1 = () => tmp; return tmp; };
const proxyAgent = new (proxy_agent_1().ProxyAgent)();
const awsConfig = {
    logger: console,
    requestHandler: new (node_http_handler_1().NodeHttpHandler)({
        httpAgent: proxyAgent,
        httpsAgent: proxyAgent,
    }),
};
let eks;
const defaultEksClient = {
    createCluster: req => getEksClient().createCluster(req),
    deleteCluster: req => getEksClient().deleteCluster(req),
    describeCluster: req => getEksClient().describeCluster(req),
    describeUpdate: req => getEksClient().describeUpdate(req),
    updateClusterConfig: req => getEksClient().updateClusterConfig(req),
    updateClusterVersion: req => getEksClient().updateClusterVersion(req),
    createFargateProfile: req => getEksClient().createFargateProfile(req),
    deleteFargateProfile: req => getEksClient().deleteFargateProfile(req),
    describeFargateProfile: req => getEksClient().describeFargateProfile(req),
    configureAssumeRole: (req) => {
        eks = new (client_eks_1().EKS)({
            ...awsConfig,
            credentials: (0, credential_providers_1().fromTemporaryCredentials)({
                params: req,
            }),
        });
    },
};
function getEksClient() {
    if (!eks) {
        throw new Error('EKS client not initialized (call "configureAssumeRole")');
    }
    return eks;
}
async function onEvent(event) {
    const provider = createResourceHandler(event);
    return provider.onEvent();
}
exports.onEvent = onEvent;
async function isComplete(event) {
    const provider = createResourceHandler(event);
    return provider.isComplete();
}
exports.isComplete = isComplete;
function createResourceHandler(event) {
    switch (event.ResourceType) {
        case consts().CLUSTER_RESOURCE_TYPE: return new (cluster_1().ClusterResourceHandler)(defaultEksClient, event);
        case consts().FARGATE_PROFILE_RESOURCE_TYPE: return new (fargate_1().FargateProfileResourceHandler)(defaultEksClient, event);
        default:
            throw new Error(`Unsupported resource type "${event.ResourceType}`);
    }
}
