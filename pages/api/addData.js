import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  const { user, type, texted } = req.body;

  try {
    const { error } = await supabase
      .from('entries')
      .insert([{ user, type, texted }]);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.status(200).json({ sucess: 'data inserted' });
  } catch (err) {
    console.error('Error adding data:', err);
    res.status(500).json({ error: 'Failed to add data' });
  }
}