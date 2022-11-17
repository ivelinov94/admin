## Getting Started ##


1. Install Docker
2. start admin_panel_db Image (cli: docker compose up -d admin_panel_db)
3. yarn/npm install modules
4. run npx prisma generate
5. run npx prisma migrate deploy (This is going to make all migrations)
6. npm run dev
7. Enter admin/admin and watch the console for the otp code





### Custom database handling

If you want custom url/database

1. change .env and the db url of your choice
2. Execute the DDL in your database so you can have the same structure
3. Fill with data of your choice
4. Use it :)

example.

CRYPTO_DATABASE_URL="postgresql://postgres:postgres@localhost:5429/crypto?schema=public"

This is going make access to database like in admin panel, but in crypto db.

Execute the DDl in the same DB and you're rdy to go.
