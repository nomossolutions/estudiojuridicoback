import Server from './server/config.js';
import router from './routes/index.routes.js';  

const server = new Server();
server.app.use('/api', router);
server.listen();