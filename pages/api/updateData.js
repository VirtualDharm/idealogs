import fs from 'fs';
import path from 'path';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis-15377.c212.ap-south-1-1.ec2.redns.redis-cloud.com:15377');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const filePath = path.join(process.cwd(), 'public', 'data.json'); // Path to data.json file
    const newData = req.body;

    // Write the new data to data.json
    fs.writeFile(filePath, JSON.stringify(newData, null, 2), async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update data.json' });
      }
      
      // Update the Redis cache
      await redis.set('appData', JSON.stringify(newData));
      
      res.status(200).json({ message: 'Data updated successfully' });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
