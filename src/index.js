import { startServer } from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

(async () => {
  try {
    await initMongoConnection();
    startServer();
  } catch (error) {
    console.error('Failed to initialize application:', error.message);
    process.exit(1);
  }
})();
