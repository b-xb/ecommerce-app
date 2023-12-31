# Deploy to Glitch and Supabase

Glitch currently only supports Node 16 and so this guide provides instructions to install a version of this app that runs on Node 16

You can check the following link to see if this has changed...

https://help.glitch.com/hc/en-us/articles/16287495688845-What-version-of-Node-can-I-use-and-how-do-I-change-update-upgrade-it-

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

2. Visit the following link to create a blank project

   https://glitch.com/edit/#!/remix/glitch-blank-website

3. After the app has been created, click on **Terminal**

   Now type the following...

   ```
   cd /
   rm -rf /app/*
   rm -rf /app/.*
   git clone https://github.com/b-xb/ecommerce-app.git app
   cd app
   git checkout node-16
   refresh
   ```

### add environment variables

Create a file at the base of the project called `.env`, if it doesn't already exist

Now click on the .env file and enter each environment variable one at a time

See example.env for the variables you will need to add

You will need to copy accross the values from the Database Settings page at Supabase

### View your new app

To view your new app, click on

`Preview -> Preview in a new window`