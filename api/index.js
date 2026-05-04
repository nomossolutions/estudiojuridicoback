import serverless from 'serverless-http';
import Server from '../server/config.js';
import router from '../routes/index.routes.js';

const server = new Server();

server.app.use('/', router);

export default serverless(server.app);