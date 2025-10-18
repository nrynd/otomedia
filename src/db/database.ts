import SQLite from 'react-native-sqlite-storage';
import { User } from '../store/userSlice';

SQLite.enablePromise(true);

const database_name = 'Otomedia.db';
const database_version = '1.0';
const database_displayname = 'SQLite Otomedia';
const database_size = 200000;

export const initDB = async () => {
    const db = await SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
    );
    await createTable(db);
    return db;
};

export const createTable = async (db: SQLite.SQLiteDatabase) => {
    const query = `CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  );`;
    await db.executeSql(query);
};

export const getUsers = async (db: SQLite.SQLiteDatabase): Promise<User[]> => {
    const results = await db.executeSql('SELECT * FROM Users');
    const users: User[] = [];
    results.forEach(result => {
        for (let i = 0; i < result.rows.length; i++) {
            users.push(result.rows.item(i));
        }
    });
    return users;
};

export const addUserDB = async (db: SQLite.SQLiteDatabase, user: Omit<User, 'id'>) => {
    const insertQuery = 'INSERT INTO Users (name, email) VALUES (?, ?)';
    await db.executeSql(insertQuery, [user.name, user.email]);
};

export const updateUserDB = async (db: SQLite.SQLiteDatabase, user: User) => {
    const updateQuery = 'UPDATE Users SET name = ?, email = ? WHERE id = ?';
    await db.executeSql(updateQuery, [user.name, user.email, user.id]);
};

export const deleteUserDB = async (db: SQLite.SQLiteDatabase, id: number) => {
    const deleteQuery = 'DELETE FROM Users WHERE id = ?';
    await db.executeSql(deleteQuery, [id]);
};
