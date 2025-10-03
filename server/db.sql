CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    reg_date VARCHAR(50) NOT NULL,
    log_date VARCHAR(50),
    status VARCHAR(50) NOT NULL,
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    sessia TEXT NOT NULL,
    user_id INTEGER, 
    FOREIGN KEY (user_id) REFERENCES users (id)
);