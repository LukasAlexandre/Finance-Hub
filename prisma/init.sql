-- MySQL schema for tabela de ativos (FinanceHub)
CREATE TABLE IF NOT EXISTS Asset (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(32) NOT NULL,
  ticker VARCHAR(32),
  quantity DOUBLE NOT NULL,
  price DOUBLE NOT NULL,
  total DOUBLE NOT NULL,
  purchaseDate DATE NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
