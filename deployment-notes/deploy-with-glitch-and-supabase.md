# Deploy to Glitch and Supabase

## set up database

### create database project in Supabase

### connect to database from psql client in your local terminal

Open the terminal at the base of your project

On your Supabase project page go to the Database Settings page

`Project Settings -> Database`

Scroll down to the Connection String section.

Copy the PSQL command shown here and paste it into your terminal

When prompted for a password, type in the password that you added when you set up the database

If you need to reset the password, you can also do this from the Database Settings page


### setting the timezone 

The timezone should already be set to UTC

You can check this setting by typing the following from the psql client

```
SELECT * FROM pg_timezone_names WHERE abbrev = current_setting('TIMEZONE');
```

### initialising the database

To run the database setup script from psql type the following

```
\i ./models/db-setup.sql 
```

### loading data into the database

To populate your database with data for testing you can import data using the following the command

```
\copy products FROM './mocks/products.csv' delimiter ',' NULL AS 'NULL' csv header
```

In this example the data is being imported from a csv file in the mocks folder (used for testing)


## set up application at glitch.com

### create a new project

1. Log in to Glitch.com (set up an account if needed)

2. Click on New Project -> Import from Github

3. Paste the URL for this project

```
https://github.com/b-xb/ecommerce-app.git
```

### add environment variables

To set up the environment variables click on the .env file and enter each variable one at a time

see example.env for the variables you will need to add

You will need to copy accross the values from the Database Settings page at Supabase

### View your new app

To view your new app, click on

`Preview -> Preview in a new window`