require('dotenv').config();
const app = require('./src/app');
const port = process.env.PORT || 3100;
app.listen(port, () => console.log(`[unicost-backend] listening on port ${port}`));
