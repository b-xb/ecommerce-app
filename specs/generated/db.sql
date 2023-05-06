CREATE SCHEMA ecommerce;
SET SEARCH_PATH = ecommerce;

CREATE TYPE "order_status" AS ENUM (
  'created',
  'accepted',
  'paid',
  'posted',
  'recieved'
);

CREATE TABLE "products" (
  "id" integer PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" text,
  "unit_price" numeric(6,2) NOT NULL DEFAULT 0,
  "stock" integer NOT NULL DEFAULT 0
);

CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL,
  "address" varchar(500),
  "password" varchar(50) NOT NULL,
  "is_admin" boolean
);

CREATE TABLE "cart_items" (
  "user_id" integer,
  "product_id" integer,
  "amount" integer NOT NULL DEFAULT 0,
  PRIMARY KEY ("user_id", "product_id")
);

CREATE TABLE "orders" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "created" timestamp NOT NULL,
  "status" order_status NOT NULL
);

CREATE TABLE "order_items" (
  "order_id" integer,
  "product_id" integer,
  "amount" integer NOT NULL DEFAULT 0,
  "unit_price" numeric(6,2) NOT NULL DEFAULT 0,
  "total_cost" numeric(6,2) NOT NULL DEFAULT 0,
  PRIMARY KEY ("order_id", "product_id")
);

ALTER TABLE "cart_items" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "cart_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
