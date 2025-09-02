import { Database } from "bun:sqlite";

export type FavoritePartner = {
  partnerCode: string;
  createdAt?: string;
  updatedAt?: string;
};

export class FavoritePartnerService {
  private db: Database;

  constructor(private tableName = "favorite_partners") {
    this.db = new Database("app.db");
    this.createTableIfNotExists();
  }

  private createTableIfNotExists() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        partnerCode TEXT PRIMARY KEY,
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
      )
    `);
  }

  add(partnerCode: string): void {
    this.createTableIfNotExists();
    this.db
      .query(
        `INSERT OR REPLACE INTO ${this.tableName} (partnerCode, createdAt, updatedAt)
         VALUES (?, COALESCE((SELECT createdAt FROM ${this.tableName} WHERE partnerCode = ?), datetime('now')), datetime('now'))`
      )
      .run(partnerCode, partnerCode);
  }

  findAll(): FavoritePartner[] {
    this.createTableIfNotExists();
    return this.db.query(`SELECT * FROM ${this.tableName}`).all() as FavoritePartner[];
  }

  findByCode(code: string): FavoritePartner | undefined {
    this.createTableIfNotExists();
    return this.db
      .query(`SELECT * FROM ${this.tableName} WHERE partnerCode = ?`)
      .get(code) as FavoritePartner | undefined;
  }

  remove(code: string): void {
    this.createTableIfNotExists();
    this.db.query(`DELETE FROM ${this.tableName} WHERE partnerCode = ?`).run(code);
  }
}

const service = new FavoritePartnerService();
service.remove("ABC123");
