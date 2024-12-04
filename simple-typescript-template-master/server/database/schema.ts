const USER_TABLE = `
CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
`;

const POST_TABLE = `
CREATE TABLE IF NOT EXISTS posts(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const COMMENT_TABLE = `
CREATE TABLE IF NOT EXISTS comments(
    id INT NOT NULL AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

export { USER_TABLE, POST_TABLE, COMMENT_TABLE };
