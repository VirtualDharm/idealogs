import { getCallLogs } from '../../lib/callLogsStore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const logs = getCallLogs();
    console.log('Returning call logs:', logs); // Log the logs being returned
    res.status(200).json({ logs });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
