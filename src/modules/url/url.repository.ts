import { database } from "../../config/database";
import { UrlRecord } from "./url.types";

interface UrlRow {
  id: number;
  short_code: string;
  original_url: string;
  created_at: Date;
  is_active: boolean;
}

function toUrlRecord(row: UrlRow): UrlRecord {
  return {
    id: row.id,
    code: row.short_code,
    originalUrl: row.original_url,
    createdAt: row.created_at,
    is_active: row.is_active
  };
}

export async function createUrl(code: string, originalUrl: string): Promise<UrlRecord> {
  const result = await database.query<UrlRow>(
    "INSERT INTO urls (short_code, original_url) VALUES ($1, $2) RETURNING id, short_code, original_url, created_at, is_active",
    [code, originalUrl]
  );
  return toUrlRecord(result.rows[0]);
}

export async function findUrlByCode(code: string): Promise<UrlRecord | null> {
  const result = await database.query<UrlRow>(
    "SELECT id, short_code, original_url, created_at, is_active FROM urls WHERE short_code = $1 AND is_active = true",
    [code]
  );
  return result.rows[0] ? toUrlRecord(result.rows[0]) : null;
}

export async function AllUrlDetails(): Promise<UrlRecord[]> {
  const result = await database.query<UrlRow>(
    "SELECT id, short_code, original_url, created_at, is_active FROM urls WHERE is_active = true"
  );
  return result.rows.map(toUrlRecord);
}
