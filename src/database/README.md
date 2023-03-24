# Documentacion de la base de datos

## Tablas

### usuarios

- id [string]: Id unico por chat y usuario, sacado directamente desde la API de telegram.
- name [string]: Nombre completo del usuario sacado de la API de telegram.
- dateCreated [string]: Fecha en formato ISO de la creacion.

### feedback

- id [string]: Id generado por firebase
- date [string]: Fecha en formato ISO
- text [string]: Contenido del feedback
- userId [string]: Id del usuario

### pagos
- id [string]: Id generado por firebase
- amount [int]: Monto total del pago
- category [string]: Categoria del pago
- date [string]: Fecha en formato ISO
- userId [string]: Id del usuario
- description [string]: Descripcion o destino del pago

### ingresos
- id [string]: Id generado por firebase
- amount [int]: Monto total del ingreso
- date [string]: Fecha en formato ISO
- userId [string]: Id del usuario
- description [string]: Descripcion o destino del pago