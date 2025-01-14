# PWA-realtime-encrypted-chat

Este proyecto es un chat encriptado en tiempo real. 

### Dependencias

Antes que nada, hay que instalar las dependencias para que el proyecto pueda funcionar. Esto se hace ejecutando:

~~~bash
npm i
~~~

## Desarrollo

Para levantar el proyecto en desarrollo se requiere levantar el frontend y el backend.

~~~bash
Frontend -> npm run dev:client
Backend  -> npm run dev:server
~~~

## Producción

Para levantar este proyecto en producción es necesario correr los siguientes comandos en el siguiente orden:

* Build:

Este comando se encarga de compilar el proyecto, dando como resultado la creacion de la carpeta dist que contiene los archivos optimizados listos para ser desplegados a un servidor de producción.

~~~bash
npm run build
~~~
