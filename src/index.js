import { startServer } from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

(async () => {
  try {
    await initMongoConnection();
    startServer();
  } catch (err) {
    console.error('Failed to initialize application', err);
    process.exit(1);
  }
})();
