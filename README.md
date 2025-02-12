# PWA-realtime-encrypted-chat

Este proyecto es un chat encriptado en tiempo real. 

### Dependencias

Antes que nada, hay que instalar las dependencias para que el proyecto pueda funcionar. Esto se hace ejecutando:

~~~bash
npm i
~~~

## Desarrollo

Para levantar el proyecto en desarrollo debe ejecutar el siguiente comando.

~~~bash
npm run dev
~~~

Si se realizan cambios en los estilos utilizando _tailwind_ se debe ejecutar en paralelo el siguiente comando:

~~~bash
npm run watch:css
~~~

## Producción

Para levantar este proyecto en producción es necesario correr los siguientes comandos en el siguiente orden:

* Build:

Este comando se encarga de compilar el proyecto, dando como resultado la creacion de la carpeta dist que contiene los archivos optimizados listos para ser desplegados a un servidor de producción.

~~~bash
npm run build
~~~

Para levantar el proyecto en entorno productivo se debe ejecutar el siguiente comando:

~~~bash
npm run preview
~~~

## Producción utilizando firebase

Este proyecto esta pensado para que el deploy se haga en el host de firebase, para ello hay que ejecutar los siguientes comandos:

1- Se realiza por comandos el login en firebase, este loggeo debe realizarse utilizando la cuenta que tiene acceso al proyecto Firebase.

~~~bash
firebase login
~~~

2- Con el comando init, se realiza la configuración del servicio firebase a utilizar. En este caso se debe seleccionar el tipo hosting

~~~bash
firebase init hosting
~~~

3- Finalmente, con el siguiente comando se realiza el deploy en firebase y los cambios estarán actualizados en produtivo ya que en el archivo _firebase.json_ se deja especificado que el deploy ejecute el comando _npm run build_.

~~~bash
firebase deploy
~~~
