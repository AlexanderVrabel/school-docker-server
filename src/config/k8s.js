const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const coreApi = kc.makeApiClient(k8s.CoreV1Api);   // Namespaces, Pods
const appsApi = kc.makeApiClient(k8s.AppsV1Api);   // Deployments
const networkApi = kc.makeApiClient(k8s.NetworkingV1Api); // Ingress (Traefik)

module.exports = { coreApi, appsApi, networkApi };