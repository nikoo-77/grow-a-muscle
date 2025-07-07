import supabaseService from '../../lib/supabaseServiceClient';

export default async function handler(req, res) {
  console.log('API route hit:', req.method, req.body);
  console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  // Optionally, add authentication/authorization checks here

  try {
    const { error } = await supabaseService.auth.admin.deleteUser(userId);
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('API route exception:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 