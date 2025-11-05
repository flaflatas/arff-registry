import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await db.connect();
    const {
      timestamp,
      weather,
      visibility,
      groundConditions,
      vehicle,
      startingPosition,
      arrivalTime,
      pumpingTime,
      lightConditions,
      comments
    } = req.body;

    // Create table if it doesn't exist
    await client.sql`
      CREATE TABLE IF NOT EXISTS drills (
        id SERIAL PRIMARY KEY,
        timestamp TEXT NOT NULL,
        weather TEXT NOT NULL,
        visibility TEXT NOT NULL,
        ground_conditions TEXT NOT NULL,
        vehicle TEXT NOT NULL,
        starting_position TEXT NOT NULL,
        arrival_time TEXT NOT NULL,
        pumping_time TEXT,
        light_conditions TEXT NOT NULL,
        comments TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Insert the data
    const result = await client.sql`
      INSERT INTO drills (
        timestamp, weather, visibility, ground_conditions, vehicle, 
        starting_position, arrival_time, pumping_time, light_conditions, comments
      ) VALUES (
        ${timestamp}, ${weather}, ${visibility}, ${groundConditions}, ${vehicle},
        ${startingPosition}, ${arrivalTime}, ${pumpingTime}, ${lightConditions}, ${comments}
      )
      RETURNING *
    `;

    await client.release();

    res.status(200).json({
      success: true,
      message: 'Data saved successfully!',
      id: result.rows[0].id
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save data to database'
    });
  }
}