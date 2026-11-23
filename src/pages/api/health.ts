import type { NextApiRequest, NextApiResponse } from 'next';
import { checkStorage } from '../../utils/serverStore';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ status: 'ERROR', error: 'Method not allowed' });
  }
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || process.env.npm_package_version || '2.1.0',
    revision: process.env.APP_REVISION || null,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: { application: 'healthy', storage: 'healthy' },
  };
  try {
    checkStorage();
    if (process.env.NODE_ENV === 'production' && !/^[a-fA-F0-9]{64}$/.test(process.env.ENCRYPTION_KEY || '')) {
      throw new Error('Missing or invalid encryption configuration');
    }
    return res.status(200).json(health);
  } catch {
    return res.status(503).json({ ...health, status: 'ERROR', services: { application: 'healthy', storage: 'unavailable' } });
  }
}
