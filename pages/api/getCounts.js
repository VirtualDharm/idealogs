import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  try {
    // Define the types you want to get counts for
    const types = ['jokes', 'thoughts', 'fitness', 'finance', 'misc'];

    const counts = {};

    // Iterate over each type and get the count of entries
    for (const type of types) {
      const { count, error } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true }) // Get only the count
        .eq('type', type);

      if (error) throw error;

      counts[type] = count;
    }

    // Return the counts as JSON
    console.log(`now it is setting.`)
    res.status(200).json(counts);
  } catch (err) {
    console.error('Error fetching counts:', err);
    res.status(500).json({ error: 'Failed to fetch counts' });
  }
}
