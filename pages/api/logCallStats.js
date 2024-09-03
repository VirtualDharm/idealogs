import { addCallLog } from '../../lib/callLogsStore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { roomName, user, stats } = req.body;
    console.log('Received stats for room:', roomName, 'from user:', user, 'with stats:', stats); // Log received data
    addCallLog({ roomName, user, stats });
    res.status(200).json({ message: 'Stats logged successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
