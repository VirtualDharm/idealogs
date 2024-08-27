import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  const { type, user = 'all' } = req.query;

  try {
    let data;
    if (user === 'all') {
      const { data: entries, error } = await supabase
        .from('entries')
        .select('*')
        .eq('type', type)
        .order('id', { ascending: false });
      
      if (error) throw error;
      data = entries;
    } else {
      const { data: entries, error } = await supabase
        .from('entries')
        .select('*')
        .eq('type', type)
        .eq('user', user)
        .order('id', { ascending: false });
      
      if (error) throw error;
      data = entries;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}