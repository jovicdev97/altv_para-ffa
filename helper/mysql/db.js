import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.resolve(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const pool = mysql.createPool(config.database);
const db = pool.promise();

db.getConnection()
    .then((connection) => {
        console.log('Connected to the MySQL database.');
        connection.release();
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

export default db;

function getPlayerStats(player) {
    return new Promise((resolve, reject) => {
        db.query('SELECT kills, deaths FROM players WHERE socialid = ? OR discordid = ?', [player.socialID, player.discordID], (err, results) => {
            if (err) {
                reject(err);
                return;
            }   
            resolve(results);
        });
    });
}

console.log(getPlayerStats)