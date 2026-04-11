const { k8sApi, k8sAppsApi, k8sNetworkingApi } = require('../config/k8s-client');

const createNamespace = async (studentName) => {
    const nsName = `student-${studentName.toLowerCase()}`;
    const body = { metadata: { name: nsName } };

    try {
        await k8sApi.createNamespace({ body });
        console.log(`🏠 Namespace ${nsName} created.`);
    } catch (err) {
        // Log the error once so you can see it in your Node terminal
        // console.log("Debug Error:", JSON.stringify(err));

        // This is the most robust way to check for "Already Exists"
        const isConflict =
            err.response?.statusCode === 409 ||
            err.statusCode === 409 ||
            (err.body && err.body.reason === 'AlreadyExists') ||
            (typeof err.body === 'string' && err.body.includes('AlreadyExists'));

        if (isConflict) {
            console.log(`ℹ️ Namespace ${nsName} already exists. Proceeding...`);
            return;
        }

        throw err; // If it's not a 409, then it's a real problem
    }
};

async function deployImage(studentName, options = {}) {
    // Destructure containerPort from options, default to 80
    const { image = "nginx:latest", containerPort = 80 } = options;
    const ns = `student-${studentName.toLowerCase()}`;
    const appName = `${studentName}-app`;
    const hostName = `${studentName}.${process.env.HOST_NAME}`;

    // 1. Create Namespace
    await createNamespace(studentName);

    // 2. Define Deployment Obaject
    const deployment = {
        metadata: { name: appName },
        spec: {
            replicas: 1,
            selector: { matchLabels: { app: appName } },
            template: {
                metadata: { labels: { app: appName } },
                spec: {
                    containers: [{
                        name: "main-container",
                        image: image,
                        ports: [{ containerPort: parseInt(containerPort) }]
                    }]
                }
            }
        }
    };

    // 3. Define Service Object (ClusterIP)
    const service = {
        metadata: { name: `${appName}-svc` },
        spec: {
            selector: { app: appName },
            ports: [{ port: 80, targetPort: parseInt(containerPort) }],
            type: "ClusterIP"
        }
    };

    // 4. Define Ingress Object
    const ingress = {
        metadata: {
            name: `${appName}-ingress`,
            annotations: {
                "kubernetes.io/ingress.class": "traefik",
                "traefik.ingress.kubernetes.io/router.entrypoints": "web"
            }
        },
        spec: {
            rules: [{
                host: hostName,
                http: {
                    paths: [{
                        path: "/",
                        pathType: "Prefix",
                        backend: {
                            service: {
                                name: `${appName}-svc`,
                                port: { number: 80 }
                            }
                        }
                    }]
                }
            }]
        }
    };

    try {
        // EXECUTE DEPLOYMENT
        try {
            await k8sAppsApi.createNamespacedDeployment({ namespace: ns, body: deployment });
        } catch (e) { if (e.response?.statusCode !== 409) throw e; }

        // EXECUTE SERVICE
        try {
            await k8sApi.createNamespacedService({ namespace: ns, body: service });
        } catch (e) { if (e.response?.statusCode !== 409) throw e; }

        // EXECUTE INGRESS
        try {
            await k8sNetworkingApi.createNamespacedIngress({ namespace: ns, body: ingress });
        } catch (e) { if (e.response?.statusCode !== 409) throw e; }

        console.log(`🚀 Successfully deployed ${appName} to ${ns}`);
        return { message: `App live at http://${hostName}` };

    } catch (err) {
        console.error("❌ K8s Deployment Failed:", err.body || err.message);
        throw err;
    }
}

module.exports = { createNamespace, deployImage };