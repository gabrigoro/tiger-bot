# Ambiente de desarrollo

### Environment

Archivo `.env`:

```
BOT_TOKEN=
API_KEY=
AUTH_DOMAIN=
PROJECT_ID=
STORAGE_BUCKET=
MESSAGING_SENDER_ID=
APP_ID=
PORT=
TZ=GMT-3
ENVIRONMENT=development
```

### Usar bot

1. Instalar dependencias

```shell
npm install
```

2. Levantar bot

```shell
npm start
```

3. Iniciar bot. Esta opción está deshabilitada cuando el valor de entorno `ENVIRONMENT` esta en `development`, el bot se inicia solo.

```shell
curl http://localhost:<port>/start
```

4. Detener bot

```shell
curl http://localhost:<port>/stop
```

5. Obtener status. Puede responder `{status:online}` o `{status:offline}`.

```shell
curl http://localhost:<port>/status
```
