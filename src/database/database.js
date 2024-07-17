import SQLite from 'react-native-sqlite-storage';

const databaseName = 'foodBot.db';
const databaseSize = 200000;
const databaseLocation = 'default';

const openDatabase = () => SQLite.openDatabase({ name: databaseName, location: databaseLocation, createFromLocation: 1 });

const createTable = (db) => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS food (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        size TEXT
      );`,
      [],
      (success) => {
        console.log('Table created successfully');
      },
      (error) => {
        console.log('Error creating table: ', error);
      }
    );
  });
};

// Populate the database with initial data or provide a mechanism for adding food items
const populateDatabase = (db) => {
  db.transaction((tx) => {
    // Insert food items into the database
    tx.executeSql('INSERT INTO food (name, price, size) VALUES (?, ?, ?)', ['Pizza', 10, 'small']);
    // ... other food items
  });
};

const initDatabase = async () => {
  const db = await openDatabase();
  createTable(db);
  // populateDatabase(db); // Uncomment to populate initially
};

export default initDatabase;