'use strict';

exports = module.exports = function(app, mongoose) {
  //then regular docs
  require('./schema/User')(app, mongoose);
  require('./schema/Group')(app, mongoose);
  require('./schema/Message')(app, mongoose);
  //require('./schema/LoginAttempt')(app, mongoose);
};