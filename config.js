'use strict';

exports.port = process.env.PORT || 1024;
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/project'
};