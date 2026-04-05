// src/services/k8s-service.js
const { k8sApi } = require('../config/k8s-client');

const createNamespace = async (name) => {
    const body = { metadata: { name: `student-${name}` } };
    try {
        return await k8sApi.createNamespace({ body });
    } catch (err) {
        if (err.httpStatusCode === 409) return { metadata: { name } };
        throw err;
    }
};

module.exports = { createNamespace };