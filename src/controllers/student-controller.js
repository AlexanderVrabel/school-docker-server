const k8sService = require('../services/k8s-service');

const handleDeployment = async (req, res) => {
    try {
        const { name, imageName, containerPort } = req.body;

        if (!name || !imageName) {
            return res.status(400).json({ error: "Name and imageName are required" });
        }

        // Pass the custom data to the service
        const result = await k8sService.deployImage(name, {
            image: imageName,
            port: containerPort || 80 // Default to 80 if not provided
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { handleDeployment };