    CREATE TABLE user (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) UNIQUE NOT NULL
    );
    
    CREATE TABLE post (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      author INT REFERENCES user(id) ON DELETE CASCADE
    );
    
    CREATE TABLE post_comment (
      id INT PRIMARY KEY AUTO_INCREMENT,
      content TEXT NOT NULL,
      target_post INT REFERENCES post(id) ON DELETE CASCADE,
      author INT REFERENCES user(id) ON DELETE CASCADE
    );