import { createServer } from 'http';
import app from './app';
import Mongodb from './dbs/init.mongodb';

const server = createServer(app);

const PORT = process.env.PORT || 8082;

Mongodb.getInstance();

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
