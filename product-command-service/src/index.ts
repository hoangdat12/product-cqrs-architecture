import { createServer } from 'http';
import app from './app';
import { AppDataSource } from './database/data-source';

const server = createServer(app);

const PORT = process.env.PORT || 8081;

// DATABASE
AppDataSource.initialize()
  .then(async () => {
    console.log('Psql connected');
  })
  .catch((err) => console.log(err));

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
