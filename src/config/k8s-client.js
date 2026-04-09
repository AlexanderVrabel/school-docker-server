// src/config/k8s-client.js
const k8sClient = require('@kubernetes/client-node');
const path = require('path');

const kc = new k8sClient.KubeConfig();
kc.loadFromFile(path.join(__dirname, 'k3s.yaml'));

const k8sApi = kc.makeApiClient(k8sClient.CoreV1Api);
const k8sAppsApi = kc.makeApiClient(k8sClient.AppsV1Api); // For Deployments later
const k8sNetworkingApi = kc.makeApiClient(k8sClient.NetworkingV1Api);
module.exports = { k8sApi, k8sAppsApi,k8sNetworkingApi };