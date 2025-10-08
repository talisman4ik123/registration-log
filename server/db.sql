CREATE TABLE registration (
    id SERIAL PRIMARY KEY,
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    name TEXT NOT NULL,
    phone VARCHAR(50),
    comment TEXT,
    status VARCHAR(50) NOT NULL,
);

ALTER TABLE registration ADD COLUMN registr VARCHAR(50);
ALTER TABLE registration ADD COLUMN ip VARCHAR(50);
ALTER TABLE registration ADD COLUMN change_date VARCHAR(50);