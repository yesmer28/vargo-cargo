-- Crear base de datos (ejecutar como superusuario, fuera de la BD destino)
CREATE DATABASE vargo_cargo
  WITH
  OWNER = postgres
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8'
  TEMPLATE = template0;

\c vargo_cargo

-- Extensión para UUIDs (TypeORM usa uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla users
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  department    VARCHAR(80)  NOT NULL,
  municipality  VARCHAR(120) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_users_email UNIQUE (email),
  CONSTRAINT uq_users_phone UNIQUE (phone)
);

-- Índices (los UNIQUE ya crean índices; opcionales si quieres nombres explícitos)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users (phone);