-- u need to run this when you first start the server
-- altv is the name of my db, edit this for your own
CREATE DATABASE IF NOT EXISTS altv;
USE altv;
CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    kills INT DEFAULT 0,
    deaths INT DEFAULT 0,
    score INT DEFAULT 0,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP NULL,
    FOREIGN KEY (player_id) REFERENCES players(id)
);
