// src/tests/db.test.ts
import { pool } from '../config/database.config';

async function testDatabaseConnection() {
  try {
    // Intentar obtener una conexión
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');

    // Probar una consulta simple
    const [result] = await connection.query('SELECT 1 + 1 as result');
    console.log('✅ Query execution successful:', result);

    // Verificar la existencia de la tabla todos
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'todos'
    `, [process.env.DB_NAME]);

    if (Array.isArray(tables) && tables.length > 0) {
      console.log('✅ Todos table exists');
    } else {
      console.log('❌ Todos table does not exist');
    }

    // Liberar la conexión
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testDatabaseConnection();