# Foobar

Rails 8 api

## Installation

Add rails secrets for both dev and prod

```bash
# development
VISUAL="code --wait" bin/rails credentials:edit

# production
VISUAL="code --wait" bin/rails credentials:edit --environment production
```

Example credentials

```bash
smtp:
  user_name: xxxx
  password: xxxx

aws:
  access_key_id: xxxx
  secret_access_key: xxxx
  region: xxxx
  bucket: xxxx

secret_key_base: xxxxxxxxxxx
jwt_secret: xxxxxxxxxx
api_url: http://localhost:3000
frontend_url: http://localhost:5173

```
