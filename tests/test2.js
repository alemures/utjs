var ut = require("../lib/ut");
var log = ut.logger;

log.debug('hola');
log.info(1);
log.warn([true,1, '2']);
log.error({a:true, b: 1, c: '2'});

