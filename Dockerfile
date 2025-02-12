# Alpine para imagen reducida
FROM node:alpine

# esto mejora performance
ENV NODE_ENV production

# lugar dedicado para la app
WORKDIR /usr/src/app

# Copiar solo archivos necesarios para la instalacion
COPY package*.json ./

# Solo instala dependencias de produccion
# `ci` asegura un build reproducible
RUN npm ci --only=production

# Copiar fuente despues de instalar dependencias
# Y solo copiar los archivos necesarios
COPY --chown=node:node ./dist ./dist

ENV PORT 3000

EXPOSE $PORT

ENTRYPOINT ["node","dist/index.js"]