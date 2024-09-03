import { supabase } from '../../lib/supabaseClient';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, password } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Get the current timestamp for created_at and updated_at
  const currentTime = new Date().toISOString();

  const { data, error } = await supabase
    .from('idealog_users')
    .insert([{
      name,
      phone,
      password: hashedPassword,
      created_at: currentTime,
      updated_at: currentTime,
    }]);
console.log(`data error: ${JSON.stringify(data), JSON.stringify(error)}`)
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ success: 'User registered', data: { name, phone } });

}
