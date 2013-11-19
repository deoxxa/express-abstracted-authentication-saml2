var express = require("express"),
    passport_saml2 = require("passport-saml2");

var createApp = exports.createApp = function createApp(options) {
  options = options || {};

  var name = options.name;
  var passports = options.passports;
  var successRedirect = options.successRedirect || "/";
  var failureRedirect = options.failureRedirect || "/";

  passports._createInstanceHandlers = passports._createInstanceHandlers || [];

  passports._createInstanceHandlers.push(function configureSaml2(instance, options, done) {
    var strategy = new passport_saml2(options[name]);

    instance.use(name, strategy);

    instance[[name, "handleRedirect"].join("_")] = strategy.handleRedirect.bind.bind(strategy.handleRedirect, strategy);
    instance[[name, "handlePost"].join("_")] = strategy.handlePost.bind.bind(strategy.handlePost, strategy);
    instance[[name, "ssoInitiator"].join("_")] = strategy.ssoInitiator.bind.bind(strategy.ssoInitiator, strategy);
    instance[[name, "ssoHandler"].join("_")] = strategy.ssoHandler.bind.bind(strategy.ssoHandler, strategy);
    instance[[name, "sloInitiator"].join("_")] = strategy.sloInitiator.bind.bind(strategy.sloInitiator, strategy);
    instance[[name, "sloHandler"].join("_")] = strategy.sloHandler.bind.bind(strategy.sloHandler, strategy);

    return done();
  });

  var app = express();

  app._auth_login = "/sso/initiator";

  app.get("/sso/initiator", passports.middleware([name, "ssoInitiator"].join("_")));

  app.get("/sso/redirect", [
    passports.middleware([name, "handleRedirect"].join("_")),
    passports.middleware("authenticate", name, {successRedirect: successRedirect, failureRedirect: failureRedirect}),
  ]);

  app.post("/sso/post", [
    passports.middleware([name, "handlePost"].join("_")),
    passports.middleware("authenticate", name, {successRedirect: successRedirect, failureRedirect: failureRedirect}),
  ]);

  return app;
};
