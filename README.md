# LoopbackHeadStart
Loopback 4 project with JWT authentication and PostgreSQL fully configured


## Getting started:

### Clone this repo
```
git clone https://github.com/MMortaga/LoopbackHeadStart.git

cd LoopbackHeadStart
```

### Install node packages
```
npm i
```

### Create config file
```
touch config.env
```

Use any code editor to add `JWT_SECRET` and `DATABASE_URL`

```
JWT_SECRET=YOUR_JWT_SECRET
DATABASE_URL=postgres://YOUR_DB_CREDENTIALS
```

### Migrate database schemas

```
npm run prestart
npm run migrate
```

### Run
```
npm run start
```

### Make sure the application is running
Finally, head to http://localhost:3000/explorer

All contributions are welcome!
