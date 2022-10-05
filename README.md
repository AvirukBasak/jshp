# JSHP
JavaScript Hypertext Preprocessor - Inspired by PHP, in JavaScript.

Visit [JSHP-App](https://github.com/AvirukBasak/JSHP-App) to view the demo project.

## Index
1. [Requirements](#requirements)
    - [Why not older NodeJS versions?](#why-not-older-nodejs-versions)
2. [CLI use](#cli-use)
3. [Script use](#script-use)
4. [Coding](#coding)
    - [JSHP HTML file](#jshp-html-file-jshphtml)
    - [Syntax](#syntax)
    - [HTML template tags](#html-template-tags)
5. [The configuration file](#the-configuration-file)
6. [Config properties](#config-properties)
    - [defaultHeaders](#1-defaultheaders)
    - [logPath](#2-logpath)
    - [inlineLogLength](#3-inlineloglength)
    - [indexFile](#4-indexfile)
    - [timeoutSec](#5-timeoutsec)
    - [execExtensions](#6-execextensions)
    - [trailingSlashes](#7-trailingslashes)
    - [noExtension](#8-noextension)
    - [matchConfig](#9-matchconfig)
    - [buildDir](#10-builddir)
    - [hotCompile](#11-hotcompile)
    - [compileOnStart](#12-compileonstart)
    - [forbidden](#13-forbidden)
    - [rewrites](#14-rewrites)
    - [redirects](#15-redirects)
    - [errFiles](#16-errfiles)
    - [respondInChunks](#17-respondinchunks)
    - [chunkLimit](#18-chunklimit)
    - [chunksPerEcho](#19-chunksperecho)
7. [Hidden config](#hidden-config)
8. [Global variables](#global-variables)
9. [Functions](#functions)
10. [Special functions](#special-functions)
11. [Async and await](#async-and-await)
11. [Module variables](#module-variables)
12. [Security bug 1](#security-bug-1)

## Requirements
- NodeJS `>= 11.7.0`
- NPM `>= 6.5.0`

### Why not older NodeJS versions?
- Because `worker_threads` is used to execute`JSHP` codes.
- This ensures lengthy or buggy codes do not block server operations.
- This also prevents server from crashing due to errors in async JSHP codes.

## CLI use
To run as a CLI executable, run `npm i -g @aviruk/jshp`.
Then run `jshp` from the CLI.
```
USAGE: jshp [option] [args]
  help                      Display this message
  compile [path]            Parse JSHP codes to JS from [path]
  compile --verbose [path]  List source files
  serve [host:port] [path]  Serve files from [path]
  serve [:port] [path]      [host] defauts to 0.0.0.0
  version                   Display version information
```

Use the `--debug` flag with `compile` or `server` to view stack traces of crashes that occurred during execution.

Note that the debug flag is meant for debugging this package.
It isn't meant for debugging your JSHP code.

#### Example
```bash
jshp serve :8080 ~/Public
```

## Script use
To use as a dependency run `npm i @aviruk/jshp`.

Once that is done, you can use a JavaScript file to spin up the server using a function from the module as shown.

This function can be imported by another script.
It basically wraps around the actual CLI function, allowing arguments to be sent.

As a result, this function behaves exactly like the CLI.

#### Example
```JavaScript
const jshp = require('@aviruk/jshp').jshp;

/**
 * @param {string} option   The corresponding CLI option, used 'serve' in this example
 * @param {string} hostname Use format 'host:port' or ':port'. Example: localhost:8080.
 * @param {string} path     The path to server resources
 */
jshp('serve', ':8080', '~/Public');
```

## Coding
- Create an `index.jshp.html` file in your server directory.
- Write normal HTML code.
- For JSHP tags, strictly use the given syntax.
- Note that all JSHP code will be executed in `use strict` mode.
- Use `jshp` to `serve` the directory.

### JSHP HTML file (.jshp.html)
Uses standard HTML/CSS/JS syntax highlighting and is supported in all text editors.
The only caveat is a lengthy tag declaration.

If you want your change executable file extension, you'll need to specify it in [execExtensions](#5-execextensions).

#### Examples
```HTML
<!-- html code -->
    <script jshp>
        // JS code
    </script>
<!-- more html code -->
```

Alternatively, you can use the following
```HTML
<!-- html code -->
    <?jshp
        // JS code
    ?>
<!-- more html code -->
```

Or, you can use the following
```HTML
<!-- html code -->
    <?
        // JS code
    ?>
<!-- more html code -->
```

### Syntax
- Starting tag should exactly be as shown above.
- Ending tag should exactly be as shown above.
- Tag declarations are `case-sensitive`.
- Excess spaces and newlines within the tag declaration isn't valid.

#### Example:
```HTML
<body>
    <script jshp>
        const number = Number($_GET['num']);
    </script>
    <p>
        <b>Series: </b>
        <?
            const arr = [];
            for (let i = 0; i < number; i++) {
                arr.push(i);
            }
            echo(String(arr));
        ?>
    </p>
</body>
```

The returned value of the code inside a scoped code block will show up in the page.

### HTML template tags
During parsing, code within `<?( )?>` will be evaluated.
The value of the code will be displayed on the page.

These tags should be preferred only for displaying values from variables.

#### Example:
```HTML
<body>
    <script jshp>
        const NAME = $_GET['name'];
        const UID = $_GET['id'];
    </script>
    <p><b>Names: </b><?( NAME )?></p>
    <p><b>UID: </b><?( UID.toUpperCase() )?></p>
</body>
```

In the above code, `NAME` and `UID.toUpperCase()` are used inside the template tags.

## The configuration file
A file named `config.json` placed at the root of server resources will contain configurations for the server.

Any property specified in `config.json` fully overwrites default config values.
Therefore, if the property to be specified is an array (or object like [matchConfig](#8-matchconfig)), then all its properties must be specified in the config.json file.
Otherwise, the server might crash.

#### Bad
If you don't want to expose `/config.json`, `/server.log` and `/.builds` directories, you shouldn't do this.

They contain information about your server, your server code, etc, and you don't want to expose them.

```JSON5
"forbidden": [
    "/private/.*",
    "/data/.*",
    "/assets/.*"
]
```

#### Good
```JSON5
"forbidden": [
    "/config\\.json",        // default
    "/server\\.log",         // default
    "/\\.builds/.*",         // default
    "/private/.*",
    "/data/.*",
    "/assets/.*"
]
```

## Config properties
The server can understand only the following properties.

If you declare a property the server doesn't understand, it won't cause any errors.
You will be able to access those properties from the `$_CONFIG` object in your JSHP code.

### 1. defaultHeaders
Headers specified here are written to every response.

**Default:** `"defaultHeaders": {}` i.e. an empty object.

### 2. logPath
Path to server log file. Logging can be turned off by setting property value to empty string.

#### Format:
```
[date time] <type> <client-address> <method/response-code> <path>
```

#### Example:
```
[2021-12-30@11:26:26] INFO ::1 GET /favicon.ico
[2021-12-30@11:26:26] INFO ::1 200 /favicon.ico
[2021-12-30@11:26:46] INFO ::1 GET /config/
[2021-12-30@11:26:46] INFO ::1 200 /config/index.jshp.html
[2021-12-30@11:27:10] INFO ::1 GET /favicon.ico
[2021-12-30@11:27:10] INFO ::1 200 /favicon.ico
[2021-12-30@11:27:35] INFO ::1 GET /config.json
[2021-12-30@11:27:35] ERROR ::1 403 /config.json
```

**Default:** `"logPath": "/server.log"`.

### 3. inlineLogLength
The maximum number of characters from a passed string that can be printed by `Logger` functions in 1 line (see <code>[Functions -> Logger.info(any)](#functions)</code>).

Beyond this length, the message is printed below.

**Default:** `"inlineLogLength": "96"`

### 4. indexFile
Path to the index file if requested path is a directory.

Directories must end with a `/` in the get request.
Otherwise they are considered files, unless [trailingSlashes](#7-trailingSlashes) is disabled.

#### Example
If `"indexFile": "main.jshp.html"` then for request
```
GET /msg/ HTTP/1.1
Host: xyz.net
Connection: close

```
the server serves the file `/msg/main.jshp.html`.
But as the file has a `.jshp.html` extension, it gets executed.

**Default:** `"indexFile": "index.jshp.html"`.

### 5. timeoutSec
Request times out with `500` after a specified number of seconds.
This timeout dictates how long a JSHP code is allowed to be parsed.
If JSHP code contains an infinite loop (or similar), it'll be killed after specified seconds.

**Default:** `"timeoutSec": 10`

### 6. execExtensions
Extensions of files that needs to be parsed for executing JSHP codes.

#### Example
If `"execExtensions": [ ".jshp.html" ]` then only files ending with those extensions will get parsed.

On parsing, if the parser finds any executable JavaScript, it'll get executed, and any non-executable part will be copy-pasted.

**Default:** `"execExtensions": [ ".jshp.html" ]`

### 7. trailingSlashes
Trailing slashes after a directory isn't required if set to false. This property is a syntactic sugar for [noExtension](#8-noExtension).

**Default:** `"trailingSlashes": true`

### 8. noExtension
If requested path is a file and has no extension, server will look for a file having requested name and one of these extensions.

#### Example
If `"noExtension": [ ".jshp.html" ]` then for request
```
GET /msg/main HTTP/1.1
Host: xyz.net
Connection: close

```
the server serves the file `/msg/main.jshp.html`.
That is because `main.jshp.html` is a file having name `main` and ending with and extension specified in `noExtension`.
But as the file has a `.jshp.html` extension, it gets executed.

If specified extension is a `'/'`, then for the directory `/msg/`, trailing slash will not be required.

#### Example
If `"noExtension": [ "/", ".jshp.html" ]` and `"indexFile": "main.jshp.html"` then for request
```
GET /msg HTTP/1.1
Host: xyz.net
Connection: close

```
the server serves the file `/msg/main.jshp.html`.

This is because a `'/'` is also treated as an extension, but the path is a directory.
For it to work, the index file of the directory must be specified in [indexFile](#4-indexFile).

**Default:** `"noExtension": [ ".jshp.html" ]`

### 9. matchConfig
This property specifies how regexes in the config file are handled.
Not all config properties support regexes.
If a property supports regex, it'll have the word `REGEXSUP` in its section of description.

#### Default
```JSON5
"matchConfig": {
    "matchFromStart": true,
    "matchTillEnd": true
}
```
If the default is kept then for properties that support regex, `matchFromStart` adds `^` to the beginning of the regex and `matchTillEnd` adds `$` to its end.

#### Example
If config is
```JSON5
"rewrites": [
    {
        "req": "/chat.*",
        "src": "/messaging/chat/index.jshp.html"
    }
]
```
then, `/chat.*` is turned into the regex `/^\/chat.*\/$/`.
This means any path starting with `/chat` is rewritten to the `src`.

Learn more about rewriting paths in [rewrites](#14-rewrites) section.

If `matchTillEnd` is disabled, `/chat.*` would be turned into the regex `/^\/chat.*\//`.

### 10. buildDir
Path to directory under resource root where compiled codes are kept.

#### Caution
Make sure your build directory is listed in [forbidden](#13-forbidden) to prevent clients from reading your code.

Otherwise, quite understandably, your source code will get leaked.

**Default:** `"buildDir": "/.builds/",`

### 11. hotCompile
If `true`, JSHP files will be compiled every time that file is requested. Suitable for testing and debugging.

**Default:** `"hotCompile": false`

### 12. compileOnStart
If `true`, JSHP code will be compiled to executable JS during server startup.

**Default:** `"compileOnStart": false`

### 13. forbidden
If any of these files are requested, response is `403`.

**Note:** This property supports regexes (`REGEXSUP`).

#### Default
```JSON5
"forbidden": [
    "/config\\.json",
    "/server\\.log",
    "/\\.builds/.*"
]
```

### 14. rewrites
For a specified path, server sends response from another specified path.

#### Example
If config is
```JSON5
"rewrites": [
    {
        "req": "/chat",
        "src": "/messaging/chat/index.jshp.html"
    }
]
```
then for request
```
GET /chat HTTP/1.1
Host: xyz.net
Connection: close

```
the server serves the file `/messaging/chat/index.jshp.html`.

It is not a redirection, so it'll result in `200` if `/messaging/chat/index.jshp.html` is a valid request path.

**Note:** Property `req` of this property supports regexes (`REGEXSUP`).

**Default:** `"rewrites": []` i.e. an empty array.

### 15. redirects
For a specified path, server sends response `3xx` with a `Location` header.

#### Example
If config is
```JSON5
"redirects": [
    {
        "req": "/chat",
        "src": "/messaging/chat/index.jshp.html",
        "status": 301
    }
]
```
then for request
```
GET /chat HTTP/1.1
Host: xyz.net
Connection: close

```
the server responds with
```
HTTP/1.1 301 Moved Parmanently
Location: /messaging/chat/index.jshp.html
.
.
.

```
This request is a redirection, so it'll result in `3xx`.

**Default:** `"redirects": []` i.e. an empty array.

**Note:** Property `req` of this property supports regexes (`REGEXSUP`).

**Note:** Redirects work for external domains as well.
But redirects are not open to the client.
The server redirects only if you specify it in `config.json`.

**Note:** If a path is present in both `rewrites` and `redirects`, the server will
do a rewrite.

This is because a request is first checked for rewrites and then for redirects.

### 16. errFiles
For a specified HTTP error, a specified file is sent as a response.

#### Example
If config is
```JSON5
"errFiles": {
    "404": "/404.jshp.html",
    "403": "/403.jshp.html"
}
```
then for a `404` error, server serves the file `/404.jshp.html`.

If the specified file doesn't exist, an empty response is sent.

**Default:** `"errFiles": {}` i.e. an empty object.

### 17. respondInChunks
If `true`, server will use `response.write` to send responses.
For every `echo`, server does this depending on the next 2 properties.

By default, it's kept off.
As a result, the server waits for the entire page to be generated server side, and then it uses `response.end` to serve the page.

#### Drawbacks
- You have to use `setStatusCode()`, `setHeader()` and `setCookie()` before you've written any HTML or echoed something.
- Content-Length header won't be set.
- Has no practical improvements.

**Default:** `"respondInChunks": false`

### 18. chunkLimit
Character / byte limit beyond which echoed data gets broken into pieces.

**Default:** `"chunkLimit": 200`

### 19. chunksPerEcho
Number of chunks in which echoed data is to be split.

**Default:** `"chunksPerEcho": 2`

## Hidden config
These config properties are auto generated by the server during startup and on calling `Server.reloadConfig()`.

Specifying these properties in `config.json` has no effect as the server will just overwrite any of these properties.

### 1. host
Server host, collected from the `host:port` argument.

### 2. port
Server port, collected from the `host:port` argument.

### 3. resRoot
A string containing the path to server resources, collected from the `path` argument.

### 4. rewriteList
It's an array of all those paths that are to be rewritten.

### 5. redirectList
It's an array of all those paths that are to be redirected.

### 6. srcMapping
It's an object mapping sources (jshp files) to their respective JavaScript compiled files.
It is generated when JSHP code is compiled.

## Global variables
- `$_ENV` - Object, Stores system environment variables
- `$_CONFIG` - Object, Stores server configuration data
- `$_RES_ROOT` - String, Stores the path to server resources
- `$_REQUEST` - Object, Some request data
- `$_HEADERS` - Object, Stores headers of request
- `$_COOKIES` - Object, Not yet implemented
- `$_GET` - Object, Stores url parameters
- `$_POST` - Object, Not yet implemented
- `$_SERVER` - Object, Stores some server variables, work in progress
- `$_SESSION` - Object, Not yet implemented

## Functions
- **setHeader(name, value)** - Sets header of current response
- **setStatusCode(code)** - Sets response code
- **setCookie(name, value)** - Not yet implemented
- **writeToResponse(string or Buffer)** - Writes some data directly to response
- **endResponse(string or Buffer, encoding)** - Similar to http module's `response.end()`;
- **Logger.info(any)** - Write an info to the console
- **Logger.error(any)** - Write an error to the console
- **Logger.warn(any)** - Write a warning to the console
- **echo(str)** - Displays text/HTML
- **Message.echo(str, color?)** - Displays text/HTML within a color bordered box
- **Message.warn(str)** - Displays text/HTML within a tangerine bordered box
- **Message.error(str)** - Displays text/HTML within a red bordered box
- **File.read(path, callback)** - Synchronously reads file, optional callback, returns a Buffer
- **File.write(path, data, callback)** - Asynchronously writes file, optional callback, data is a Buffer
- **ResponseCode.list()** - Get a list of response codes with their status messages.
- **ResponseCode.getMessage(number)** - Get status messages of a response code.

## Special functions
- **prequire(path)** - Loads a module for the `jshp` file.
- **nodejsinfo()** - Displays some server information.
- **jshpinfo()** - Same as `nodejsinfo`.
- **getStatusCode()** - Get status code of current page.
- **Server.reloadConfig()** - Reload config data from config.json
- **Server.fileCompile(path)** - Selectively recompile a file.
- **Server.recompile()** - Re-run compilation to include source code changes
- **Server.putResHash(algorithm)** - Writes hash of response to header `x-response-hash`, algorithm is `md5` by default.

## Importing modules
For `jshp` files, `require` will not work. `require` will attempt to load modules relative to directory of the executable.
To load modules relative to the server resources root, a specialised function `prequire` is provided.

Syntax
```
const mod = prequire('prebuilt-node-module');
const mod1 = prequire('js:my-dir/my-module');
const mod2 = prequire('./my-dir/my-module.js');
m1.foo();
m2.foo();
```

## Async and await
Note that certain functions return promises. They are
- `getStatusCode()`
- `Server.reloadConfig()`
- `Server.fileCompile(path)`
- `Server.recompile()`

Without proper promise handling, you might get errors.
It is recommended that you use `await` keyword for a clean looking code.

#### Example
```HTML
<script jshp>
    echo(await getStatusCode());            // echoes status code
    Message.echo(JSON.stringify(            // Message.echo doesn't accept Objects
        await Server.recompile(), null, 4)  // echoes the source map data (used by server)
    );
</script>
```

If you're wondering why you can use await without creating another async function to containing it,
that's because behind the scenes, the whole JSHP code runs in an async function.

## Module variables
- `HTTP` - NodeJS `http` module
- `URL` - NodeJS `url` module
- `PATH` - NodeJS `path` module
- `FS` - NodeJS `fs` module

## Security bug 1
Refer to [GHSA-8r4g-cg4m-x23c](https://github.com/advisories/GHSA-8r4g-cg4m-x23c).
- `node-static` v <= 0.7.11 is affected.
- as of 25th Dec, 2021, no fixed npm package is available.
- The issue was fixed in `node-static PR #227`.
- As a workaround for JSHP, a request is first checked for `%00`.
