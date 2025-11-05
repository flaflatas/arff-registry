import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await db.connect();
    const result = await client.sql`
      SELECT * FROM drills 
      ORDER BY created_at DESC 
      LIMIT 100
    `;
    
    await client.release();

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch data'
    });
  }
}