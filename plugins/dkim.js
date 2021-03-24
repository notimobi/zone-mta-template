'use strict';

const fs = require('fs');

module.exports.title = 'DKIM signer';
module.exports.init = function (app, done) {

let privKey;

try {
    privKey = fs.readFileSync(app.config.path, 'ascii').trim();
    app.logger.info('DKIM', 'loaded private key', privKey);
} catch (E) {
    app.logger.error('DKIM', 'Failed loading key: %s', E.message);
    return done;
}

app.addHook('sender:connect', (delivery, options, next) => {
    app.logger.info('DKIM', 'Sign message',delivery);
    if (!delivery.dkim.keys) {
        delivery.dkim.keys = [];
    }

    delivery.dkim.keys.push({
        domainName: app.config.domain,
        keySelector: app.config.selector,
        privateKey: privKey
    });

    next();
});

done();
};  
