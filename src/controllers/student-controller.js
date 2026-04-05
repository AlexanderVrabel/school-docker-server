const k8sService = require('../services/k8s-service');

const registerStudent = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Missing student name" });
        }

        // Call the service to do the K8s work
        const result = await k8sService.createNamespace(name);

        res.status(201).json({
            success: true,
            namespace: result.metadata.name,
            message: `Environment for ${name} is ready.`
        });
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    registerStudent
};