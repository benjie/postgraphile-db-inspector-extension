try {
  require('./.env')
} catch (e) {
  // No envvars 🤷
}
const express = require("express");
const {postgraphile, makePluginHook} = require("postgraphile");

const plugins = [
  // require('postgraphile-plugin-connection-filter'),
]

const isProd = process.env.NODE_ENV === 'production';

const {
  PORT = 3000,
  POSTGRES_CONNECTION,
  POSTGRAPHILE_SCHEMAS = "public",
  DYNAMIC_JSON = 'true',
  DISABLE_DEFAULT_MUTATIONS = null,
  WATCH_PG = isProd ? null : 'true',
  ENABLE_PGDBI = isProd ? null : 'true'
} = process.env;

if (!POSTGRES_CONNECTION) {
  throw new Error("No 'POSTGRES_CONNECTION' envvar found, we don't know which database to connect to.");
}

const identity = _ => _;


const port = PORT;
const connection = POSTGRES_CONNECTION;
const schemas = POSTGRAPHILE_SCHEMAS.split(',');
const dynamicJson = DYNAMIC_JSON === 'true';
const disableDefaultMutations = DISABLE_DEFAULT_MUTATIONS === 'true';
const watchPg = WATCH_PG === 'true';
const enablePgdbi = ENABLE_PGDBI === 'true';

const pluginHook = makePluginHook([
  enablePgdbi ? require('../pgdbi') : null
].filter(identity))

const app = express();

app.use(postgraphile(
  connection
  ,schemas
  ,{
    pluginHook
    ,dynamicJson: dynamicJson
    ,showErrorStack: true
    ,extendedErrors: ['severity', 'code', 'detail', 'hint', 'positon', 'internalPosition', 'internalQuery', 'where', 'schema', 'table', 'column', 'dataType', 'constraint', 'file', 'line', 'routine']
    ,disableDefaultMutations: disableDefaultMutations
    ,appendPlugins: plugins
    ,watchPg: watchPg
    ,graphiql: true
  }
));

const server = app.listen(port)

/*
 * When being used in nodemon, SIGUSR2 is issued to restart the process. We
 * listen for this and shut down cleanly.
 */
process.once('SIGUSR2', function () {
  server.close();
  const t = setTimeout(function () {
    process.kill(process.pid, 'SIGUSR2');
  }, 200);
  // Don't prevent clean shutdown:
  t.unref();
});

console.log(`listening on ${port}`)
