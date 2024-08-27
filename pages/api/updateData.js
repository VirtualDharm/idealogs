import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const filePath = path.join(process.cwd(), 'public', 'data.json'); // Path to data.json file
    const newData = req.body;

    // Write the new data to data.json
    fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update data.json' });
      }
      res.status(200).json({ message: 'Data updated successfully' });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
