CREATE TYPE "order_status" AS ENUM (
  'created',
  'accepted',
  'paid',
  'posted',
  'recieved'
);

CREATE TABLE "products" (
  "id" uuid PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" text,
  "unit_price" numeric(6,2) NOT NULL DEFAULT 0,
  "stock" integer NOT NULL DEFAULT 0
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL,
  "address" varchar(500),
  "password" varchar(100) NOT NULL,
  "is_admin" boolean
);

CREATE TABLE "cart_items" (
  "user_id" uuid,
  "product_id" uuid,
  "amount" integer NOT NULL DEFAULT 0,
  PRIMARY KEY ("user_id", "product_id")
);

CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "created" timestamp NOT NULL,
  "status" order_status NOT NULL
);

CREATE TABLE "order_items" (
  "order_id" uuid,
  "product_id" uuid,
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

--add session table for use with connect-pg-simple

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");