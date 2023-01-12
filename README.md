About
=====

Quick web server for easy dev with static files and modern web browser and their pseudo security limitation.

Install & Usage
===============

1. Install the package.

```
npm i -D @xan105/qwebsrv
```

2. Configure it by adding a `config` obj in your `package.json`.

Here are the default options:

```js
{
  "config": {
    "host": "localhost",
    "port": 80,
    "proxy": false, /*set to true only if you're behind a reverse proxy 
                     (Heroku, Bluemix, AWS ELB, Nginx, etc)*/
    "cors": true,
    "csp": false, //default secure csp header rules
    "root": "./docs", //GitHub Pages
    "index": ["index.html"],
    "404": "404.html", 
    "etag": false,
    "maxAge": "1m"
  }
}
```

Change what you need and you can omit the rest.

3. Add a script entry in your `package.json` to start the server.

Example:

```json
{
  "scripts": {
    "start": "websrv"
  }
}
```
