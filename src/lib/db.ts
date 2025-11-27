// lib/db.ts - MySQL Database Connection
import mysql from "mysql2/promise";

// Cấu hình kết nối MySQL
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bun_bo_hue_co_do",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: "utf8mb4",
};

// Tạo connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Kết nối MySQL thành công!");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Lỗi kết nối MySQL:", error);
    return false;
  }
}

// Execute query
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Get single row
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  try {
    const [results] = await pool.execute(sql, params);
    const rows = results as T[];
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Database queryOne error:", error);
    throw error;
  }
}

// Execute with transaction
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Helper: Build WHERE clause
export function buildWhereClause(filters: Record<string, any>): {
  where: string;
  params: any[];
} {
  const conditions: string[] = [];
  const params: any[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      conditions.push(`${key} = ?`);
      params.push(value);
    }
  });

  return {
    where: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
}

// Helper: Build pagination
export function buildPagination(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;
  return {
    limit,
    offset,
    sql: `LIMIT ${limit} OFFSET ${offset}`,
  };
}

export default pool;
