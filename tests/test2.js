var ut = require("../lib/ut");
var log = ut.logger;

log.debug('hola');
log.info(1);
log.warn([true,1, '2']);
log.error({a:true, b: 1, c: '2'});
log.debug(false);
log.debug();
log.debug();
log.debug([12,3]);
log.debug(1,2,3,4,{a:true, b: 1, c: '2'}, [true,1, '2']);

log.debug("The number is not correct", 1, "bye");