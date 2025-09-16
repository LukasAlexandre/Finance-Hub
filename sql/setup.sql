-- Script inicial do banco FinanceHub (executar no MySQL Clever Cloud)
-- Ajuste charset/collation conforme necessidade.

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE accounts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  type ENUM('checking','savings','wallet','investment','credit','other') NOT NULL DEFAULT 'checking',
  initial_balance DECIMAL(14,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_accounts_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('income','expense','investment') NOT NULL,
  color VARCHAR(16) NOT NULL DEFAULT '#888888',
  parent_id BIGINT NULL,
  CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_categories_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE transactions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  account_id BIGINT NOT NULL,
  date DATE NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  category_id BIGINT NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  CONSTRAINT fk_transactions_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_transactions_user_date (user_id, date),
  INDEX idx_transactions_account (account_id)
) ENGINE=InnoDB;

CREATE TABLE assets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  type ENUM('stock','fund','fixed_income','crypto','other') NOT NULL DEFAULT 'stock',
  ticker VARCHAR(40) NOT NULL,
  quantity DECIMAL(18,6) NOT NULL,
  price DECIMAL(14,4) NOT NULL,
  total DECIMAL(16,4) GENERATED ALWAYS AS (quantity * price) STORED,
  purchase_date DATE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_assets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assets_user (user_id),
  INDEX idx_assets_ticker (ticker)
) ENGINE=InnoDB;

CREATE TABLE investment_snapshots (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  snapshot_date DATE NOT NULL,
  total_value DECIMAL(16,2) NOT NULL,
  details JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_snapshots_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY u_snapshot_user_date (user_id, snapshot_date)
) ENGINE=InnoDB;

-- Inserir categorias padrão globais (user_id NULL)
INSERT INTO categories (user_id, name, type, color) VALUES
(NULL, 'Alimentação', 'expense', '#ef4444'),
(NULL, 'Transporte', 'expense', '#3b82f6'),
(NULL, 'Contas Fixas', 'expense', '#8b5cf6'),
(NULL, 'Cartão de Crédito', 'expense', '#f59e0b'),
(NULL, 'Contas Flexíveis', 'expense', '#10b981'),
(NULL, 'Gastos Desnecessários', 'expense', '#ef4444'),
(NULL, 'Saúde', 'expense', '#06b6d4'),
(NULL, 'Receitas', 'income', '#22c55e'),
(NULL, 'Investimentos', 'investment', '#6366f1');

-- (Opcional futuro)
-- CREATE TABLE budgets (...);
-- CREATE TABLE goals (...);
