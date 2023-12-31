# Deploy via CPanel

This is a general setup guide that should work with any hosting provider that provides you with the following
- CPanel Interface
- Node.js Selector plugin
- Ability to create and manage PostgreSQL databases


## Set up sub-domain

If not using your main domain then you should set up a sub-domain

In CPanel...

1. Go to **Domains -> Domains**
2. Click on **Create a New Domain**
3. Fill in the form and then click on **Submit**
  - Domain: Type the full url for the new subdomain, note that you need to own the domain that you are making a subdomain for, e.g.
    ```
    subdomain.domain.com
    ```

  - Document Root: this will be relative to your home directory, e.g.
    ```
    sites/subdomain.domain.com/public_html
    ```

This will take a while to propagate, in the mean time you can set everything else up.

TODO: If you are impatient then you can follow a guide here...

## Clone the project

Connect to your web server via the Terminal

This can be done either from **CPanel -> Advanced -> Terminal** or via **SSH** (if available)

Go to a location outside of the document root you specified earlier, e.g.

```
cd ~/sites/subdomain.domain.com
```

Then clone this project into a subfolder of this folder

```
git clone https://github.com/b-xb/ecommerce-app.git
```

A new folder called `ecommerce-app` should now exist, containing the porject code


## Set up the database

### Create the database

In the **Databases** section of **CPanel**, you can set up your PostgreSQL database

You will need to do perform three tasks

- Create a new database
- Create a new user
- Add the new user to the new database

This can be acheived using the **PostgreSQL Database Wizard** or set up directly using in the **PostgreSQL Databases** interface

Make sure to make a note of the following
- database name
- database user
- database password


### Initialise the database

#### Set Up the Timezone

The timezone should already be set to UTC

TODO: write a guide on how to check this...

#### Connect to PostgreSQL client via the Terminal

Connect to your web server via the Terminal

This can be done either from **CPanel -> Advanced -> Terminal** or via **SSH** (if available)

Open the terminal at the base of your project, e.g.

```
cd ~/sites/subdomain.domain.com/ecommerce-app
```

Connect to the postgresql database using the credentials you set up earlier

```
psql -U <db username> -d <db name>
```

When prompted for a password, type in the password for the database user


#### Initialise the database

To run the database setup script from psql type the following

```
\i ./models/db-setup.sql
```

#### Loading data into the database

To populate your database with data for testing you can import data using the following the command

```
\copy products FROM './mocks/products.csv' delimiter ',' NULL AS 'NULL' csv header
```

In this example the data is being imported from a csv file in the mocks folder (used for testing)


## Set up Node.js

### Create a new Node.js Application

In CPanel, go to **Software -> Setup Node.js App**

Fill in the form as follows, and then click on **Create**

- Node.js version: select version 16
- Application mode: `Production`
- Application root: the root path of the project, e.g.
  ```
  sites/subdomain.domain.com/ecommerce-app
  ```
- Application URL: select the subdomain that you set up before or main domain, if using that
- Application Startup file: `app.js`
- Passenger log file: type the path and name of a file here if you want debug output, e.g.
  ```
  logs/ecommerce-passenger.log
  ```

- Environment Variables

  Click add variable for the following key value pairs

  - DB_DATABASE : the database name you set up before
  - DB_USER : the database username you set up before
  - DB_PASSWORD : the database password you set up before
  - DB_HOST : `localhost`
  - DB_PORT : `5432`
  - FORCE_DEPLOY : `true`
  - TZ : `UTC`
  - SESSION_SECRET : a random string


### Install Node.js dependencies

In the application page for the new application you created...

Scroll down to **Detected configuration files**, and then click on **Run NPM Install**