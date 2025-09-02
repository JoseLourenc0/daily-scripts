import inquirer from "inquirer";
import { Database } from "bun:sqlite";

type Settings = {
  pointsThreshold: number;
  comparisonMode: "parityClub" | "parity";
};

export class SettingsService {
  private db: Database;

  constructor(private tableName = "settings") {
    this.db = new Database("app.db");
    this.createTableIfNotExists();
  }

  private createTableIfNotExists() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        pointsThreshold INTEGER NOT NULL,
        comparisonMode TEXT NOT NULL CHECK (comparisonMode IN ('parityClub','parity'))
      )
    `);
  }

  getSettings(): Settings | null {
    const row = this.db.query(`SELECT pointsThreshold, comparisonMode FROM ${this.tableName} WHERE id = 1`).get();
    return row ? (row as Settings) : null;
  }

  saveSettings(settings: Settings): void {
    this.db
      .query(
        `INSERT INTO ${this.tableName} (id, pointsThreshold, comparisonMode)
         VALUES (1, ?, ?)
         ON CONFLICT(id) DO UPDATE
         SET pointsThreshold = excluded.pointsThreshold,
             comparisonMode = excluded.comparisonMode`
      )
      .run(settings.pointsThreshold, settings.comparisonMode);
  }
}
