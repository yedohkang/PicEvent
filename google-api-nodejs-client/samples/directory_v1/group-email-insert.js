// Copyright 2014-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Dependencies
var googleapis = require('googleapis');
var authData = require('./authData');

console.log('Auth data is: ', authData);

// Create JWT auth object
var jwt = new googleapis.auth.JWT(
  authData.email,
  authData.keyFile,
  authData.key,
  authData.scopes,
  authData.subject
);

// Authorize
jwt.authorize(function (err, data) {
  if (err) {
    throw err;
  }
  console.log('You have been successfully authenticated: ', data);

  // Get Google Admin API
  var admin = googleapis.admin('directory_v1');

  // Insert member in Google group
  admin.members.insert({
    groupKey: 'my_group@example.com',
    resource: { email: 'me@example.com' },
    auth: jwt
  }, function (err, data) {
    console.log(err || data);
  });
});
