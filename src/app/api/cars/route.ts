import Database from 'better-sqlite3';

const db = new Database('./database.db');

export async function GET() {
  try {
    const cars = db.prepare('SELECT * FROM vehicles ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(cars), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cars' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, year, driven, registration } = await request.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO vehicles (title, description, year, driven, registration)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(title, description, year, driven, registration);

    return new Response(
      JSON.stringify({ 
        id: result.lastInsertRowid,
        message: 'Car added successfully' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add car' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, description, year, driven, registration } = await request.json();

    if (!id || !title) {
      return new Response(
        JSON.stringify({ error: 'ID and title are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const stmt = db.prepare(`
      UPDATE vehicles 
      SET title = ?, description = ?, year = ?, driven = ?, registration = ?
      WHERE id = ?
    `);

    const result = stmt.run(title, description, year, driven, registration, id);

    if (result.changes === 0) {
      return new Response(
        JSON.stringify({ error: 'Car not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Car updated successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update car' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const stmt = db.prepare('DELETE FROM vehicles WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return new Response(
        JSON.stringify({ error: 'Car not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Car deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete car' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}