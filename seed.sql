CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    bio TEXT,
    post_code VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS threads (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type TEXT
);

CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT REFERENCES users(id),
    thread_id INT REFERENCES threads(id),
    content VARCHAR(300)
);

CREATE TABLE IF NOT EXISTS genres (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT
);

CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT REFERENCES users(id),
    post_id INT REFERENCES posts(id),
    content TEXT
);

CREATE TABLE IF NOT EXISTS instrument (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    instrument TEXT,
    years INT,
    level TEXT,
    gig_ready BOOL,
    availability BOOL,
    genre INT REFERENCES genres(id),
    user_id INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100),
    type VARCHAR(255),
    rating INT,
    postcode VARCHAR(10)
);

INSERT INTO genres (name) VALUES
    ('Rock'), ('Metal'), ('Jazz'), ('Classical'), ('Pop'), ('Hip Hop'),
    ('Electronic'), ('Country'), ('Blues'), ('Folk'), ('R&B'), ('Ska'), ('Eclectic');


ALTER TABLE instrument
ADD COLUMN genre TEXT
