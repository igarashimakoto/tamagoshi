import { SQLiteDatabase } from "expo-sqlite";

export async function initDatabase(database: SQLiteDatabase) {

    await database.execAsync(`CREATE TABLE IF NOT EXISTS saves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      goshiType INT NOT NULL,
      goshiHealth INT NOT NULL,
      goshiSleep INT NOT NULL,
      goshiHappiness INT NOT NULL,
      goshiStatus TEXT NOT NULL);
    `);
}