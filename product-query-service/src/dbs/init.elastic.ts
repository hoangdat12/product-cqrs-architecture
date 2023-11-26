import { Client } from '@elastic/elasticsearch';
import * as dotenv from 'dotenv';

dotenv.config();

export class InitElasticsearch {
  static instance: InitElasticsearch | null = null;
  client: Client;
  constructor() {
    const username = process.env.ELS_USERNAME;
    const password = process.env.ELS_PASSWORD;
    if (!username || !password)
      throw Error('Missing username password when connect ELS!');

    this.client = new Client({
      node: process.env.ELS_END_POINT, // Elasticsearch endpoint
      auth: {
        username,
        password,
      },
      caFingerprint: process.env.ELS_CA_FINGERPRINT,
      tls: {
        // ca: fs.readFileSync(path.join(__dirname, './http_ca.crt'), 'utf-8'),
        rejectUnauthorized: false,
      },
    });
  }

  static getInstance() {
    if (!InitElasticsearch.instance) {
      InitElasticsearch.instance = new InitElasticsearch();
    }
    return InitElasticsearch.instance;
  }
}

const elsInstance = InitElasticsearch.getInstance();

export default elsInstance.client;
