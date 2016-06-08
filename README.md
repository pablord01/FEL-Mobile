Este manual fue pensado para ser realizado paso a paso bajo el sistema operativo Windows. Más adelante se intentará realizar el mismo proceso para alguna distribución de GNU/Linux basada en Debian.


**Dependencias necesarias**
* NodeJS
* Android SDK
* Java JDK (1.8 8u91)
* Cordova 
* Ionic


** Instalación de dependencias**
* Ingresar a la página oficial de NodeJS y descargar la versión acorde a la arquitectura.
https://nodejs.org/en/download/

* Una vez instalado NodeJS, se debe ejecutar una consola de comandos de Windows (Win+R, ejecutar CMD). A continuación se debe ejecutar el comando para instalar cordova:
``` npm install -g cordova ```

* Cuando se tiene cordova instalado, es posible instalar Ionic. Para esto se debe ejecutar el comando:
``` npm install -g ionic ```

* Por otra parte, se debe instalar la versión del JDK a utilizar. Para llevar a cabo esto deben ingresar al sitio oficial de Java (http://www.oracle.com/technetwork/es/java/javase/downloads/index.html) y completar la instalación del ejecutable.

* Para instalar el SDK de android, se debe descargar desde la página oficial de Android Development y seguir los pasos del instalador (https://developer.android.com/studio/index.html?hl=es al final aparece el SDK solo). A continuación se debe ejecutar "SDK Manager" e instalar todos los paquetes que vienen preseleccionados por defecto.

* Para que Ionic reconozca el JDK de Java se debe agregar la ruta al directorio en que está instalado Java a las variables de entorno del sistema, en específico se debe crear una variable llamada "JAVA_HOME". Por otra parte, para poder realizar un build y obtener una APK se debe agregar la variable de entorno "ANDROID_HOME" en las variables de entorno de Windows, que apunte al directorio en que se encuentra el SDK de Android.

* Una vez instaladas todas las dependencias, se debe clonar el repositorio de la aplicación móvil (http://git.defontana.com/factoring/fe-mobile). Luego de esto es necesario entrar a la carpeta en que se ha clonado el repositorio a través de la consola de Windows y ejecutar el siguiente comando:

``` ionic platform add android ```

Con esto se agregan las dependencias necesarias al proyecto para poder generar un APK compatible con el sistema android.

Ionic por defecto trae un simulador de aplicaciones que es lanzado a través del navegador web que tengamos seteado por defecto, por lo que basta con ejecutar el comando:

``` ionic serve ```
Y podemos testear nuestra aplicación a través del navegador.

Para generar un archivo APk y poder testear la aplicación en un teléfono con sistema operativo Android, debemos ejecutar el comando 

``` ionic build android ```

Referencias:

1. http://ionicframework.com/docs/guide/installation.html
2. https://developer.android.com/studio/install.html?hl=es