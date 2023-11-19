import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing s3 config value!');
}

const s3Config = {
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
};

const s3 = new S3Client(s3Config);

export const S3Service = {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
};
