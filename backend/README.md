## Getting Started

First, run the development server:

# 1

```bash
composer install
```

# 2

```bash
cp -r .env.example .env
```

# 3

```bash
php artisan key:generate
```

# 4

```bash
php artisan jwt:secret
```

# 5

```bash
php artisan storage:link
```

# 6

config database in .env
DB_CONNECTION=pgsql
DB_HOST=(host database)
DB_PORT=(port)
DB_DATABASE=(database name)
DB_USERNAME=(database username)
DB_PASSWORD=(database username password)

# 7

import database from model migration

migrate use dummy data

```bash
php artisan migrate:fresh --seed
```

migrate not dummy data

```bash
php artisan migrate
```

# 8

import user default

```bash
php artisan db:seed --class=UserSeeder
```

user default
email : user@example.com
password: password

# 9

command running server

```bash
php artisan serve
```
