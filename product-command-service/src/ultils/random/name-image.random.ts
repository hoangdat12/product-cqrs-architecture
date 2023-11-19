import crypto from 'crypto';
export const imageNameRandom = () => crypto.randomBytes(16).toString('hex');
