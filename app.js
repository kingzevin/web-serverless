/* eslint-disable
    max-len,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// zevin's config

process.env["WEB_API_HOST"] = 'localhost';
process.env["WEB_HOST"] = 'localhost';
process.env["SHARELATEX_MONGO_URL"] = "mongodb://172.17.0.1/sharelatex";
process.env["MONGO_HOST"] = '172.17.0.1';
process.env["SHARELATEX_REDIS_HOST"] = '172.17.0.1';
process.env["REDIS_HOST"] = '172.17.0.1';
process.env["SPELLING_HOST"] = '172.17.0.1';
process.env['SPELLING_URL'] = 'http://172.17.0.1:10001/api/v1/web/guest/sharelatex/spelling'
process.env["CHAT_HOST"] = '172.17.0.1';
process.env["CHAT_URL"] = 'http://172.17.0.1:10001/api/v1/web/guest/sharelatex/chat';
process.env["CONTACTS_HOST"] = '172.17.0.1';
process.env["CONTACTS_URL"] = 'http://172.17.0.1:10001/api/v1/web/guest/sharelatex/contacts';
process.env["NOTIFICATIONS_HOST"] = '172.17.0.1';
process.env["NOTIFICATIONS_URL"] = 'http://172.17.0.1:10001/api/v1/web/guest/sharelatex/notifications';
// check notificaitons
process.env["TAGS_HOST"] = '172.17.0.1';
process.env["TAGS_URL"] = 'http://172.17.0.1:10001/api/v1/web/guest/sharelatex/tags';
process.env["DOCSTORE_HOST"] = '172.17.0.1';
process.env["DOCSTORE_URL"] = 'http://172.17.0.1:10001/api/v1/web/guest/sharelatex/docstore';
process.env["CLSI_HOST"] = '172.17.0.1';
process.env["CLSI_URL"] = 'http://172.17.0.1:10001/api/v1/web/guest/sharelatex/clsi';
process.env["TRACK_CHANGES_HOST"] = '172.17.0.1';
process.env["TRACK_CHANGES_URL"] = 'http://172.17.0.1:10001/api/v1/web/guest/sharelatex/track-changes';
process.env["FILESTORE_HOST"] = '172.17.0.1';
process.env["DOCUMENT_UPDATER_HOST"] = '172.17.0.1';
process.env["LISTEN_ADDRESS"] = '0.0.0.0';
process.env["REALTIME_HOST"] = '172.17.0.1';
process.env["ENABLE_CONVERSIONS"] = 'true';
process.env["WEB_API_USER"] = 'sharelatex';
process.env["ENABLED_LINKED_FILE_TYPES"] = 'url;project_file';
process.env["SHARELATEX_APP_NAME"] = 'Overleaf Community Edition';
process.env["APP_NAME"] = 'Overleaf Community Edition';
process.env["WEB_API_PASSWORD"] = 'rAp8aFvtk77m20PG6Kedzt3iOOrWKJ3pL5eiaQsP6s';
process.env["SESSION_SECRET"] = 'K1pOaUSsFIoXADLUIgtIh4toKBzgoZS1vHRXNySWQc';
process.env["SHARELATEX_SESSION_SECRET"] = 'K1pOaUSsFIoXADLUIgtIh4toKBzgoZS1vHRXNySWQc';
process.env["SHAREALTEX_CONFIG"] = __dirname + '/settings.coffee';
process.env['DOOCUMENT_UPDATER_URL'] = 'http://172.17.0.1:10001/api/v1/web/guest/sharelatex/document-updater'

// 
const metrics = require('metrics-sharelatex')
metrics.initialize(process.env['METRICS_APP_NAME'] || 'web')
const Settings = require('settings-sharelatex')
const logger = require('logger-sharelatex')
logger.initialize(process.env['METRICS_APP_NAME'] || 'web')
logger.logger.serializers.user = require('./app/src/infrastructure/LoggerSerializers').user
logger.logger.serializers.docs = require('./app/src/infrastructure/LoggerSerializers').docs
logger.logger.serializers.files = require('./app/src/infrastructure/LoggerSerializers').files
logger.logger.serializers.project = require('./app/src/infrastructure/LoggerSerializers').project
if ((Settings.sentry != null ? Settings.sentry.dsn : undefined) != null) {
  logger.initializeErrorReporting(Settings.sentry.dsn)
}

metrics.memory.monitor(logger)
const Server = require('./app/src/infrastructure/Server')

if (Settings.catchErrors) {
  process.removeAllListeners('uncaughtException')
  process.on('uncaughtException', error =>
    logger.error({ err: error }, 'uncaughtException')
  )
}
const port = Settings.port || Settings.internal.web.port || 3000
const host = Settings.internal.web.host || 'localhost'
// if (!module.parent) {
  // Called directly

  // We want to make sure that we provided a password through the environment.
  if (!process.env['WEB_API_USER'] || !process.env['WEB_API_PASSWORD']) {
    throw new Error('No API user and password provided')
  }
  Server.server.listen(port, host, function() {
    logger.info(`web starting up, listening on ${host}:${port}`)
    logger.info(`${require('http').globalAgent.maxSockets} sockets enabled`)
    // wait until the process is ready before monitoring the event loop
    metrics.event_loop.monitor(logger)
  })
// }

// handle SIGTERM for graceful shutdown in kubernetes
process.on('SIGTERM', function(signal) {
  logger.warn({ signal: signal }, 'received signal, shutting down')
  Settings.shuttingDown = true
})

// module.exports = Server.server
exports.main = main

function main(params = {}){
  const url = params.__ow_path
  const method = params.__ow_method == 'delete' ? 'del' : params.__ow_method
  const headers = params.__ow_headers
  
  const { promisify } = require('util')
  const request = require("request")
  const reqPromise = promisify(request[method]);
  return (async () => {
    let result;
    let opt={}
    opt['headers'] = headers;
    opt['url'] = `http://${host}:${port}${url}`;
    let str = params.__ow_body || '';
    if(str !== "" && Buffer.from(str, 'base64').toString('base64') === str){
      // base64
      params.__ow_body = Buffer.from(str, 'base64').toString('ascii');
    }
    opt['body'] = params.__ow_body;
    if(params.__ow_query !== ""){
      const qs = '?' + params.__ow_query;
      opt['url'] = opt['url'] + qs;
    }
    result = await reqPromise(opt);
    var response = JSON.parse(JSON.stringify(result));
    delete response.request
    return response
  })();
}
