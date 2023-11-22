import { createServer } from 'http';
import app from './app';

const server = createServer(app);

const PORT = process.env.PORT || 8082;
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
