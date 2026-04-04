const express = require('express');
const apiRoutes = require('./src/routes/api.v1');
const app = express();

app.use(express.json());
app.use('/api/v1', apiRoutes); // All routes start with /api/v1/

app.listen(3000, () => console.log("PaaS Backend Online"));