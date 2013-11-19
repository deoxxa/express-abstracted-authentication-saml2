var express = require("express");

var createApp = exports.createApp = function createApp(options) {
  var passports = options.passports;
  var successRedirect = options.successRedirect || "/";
  var failureRedirect = options.failureRedirect || "/";

  var app = express();

  app._auth_login = "/sso/initiator";

  app.get("/sso/initiator", passports.middleware("saml2_ssoInitiator"));

  app.get("/sso/redirect", [
    passports.middleware("saml2_handleRedirect"),
    passports.middleware("authenticate", "saml2", {successRedirect: successRedirect, failureRedirect: failureRedirect}),
  ]);

  app.post("/sso/post", [
    passports.middleware("saml2_handlePost"),
    passports.middleware("authenticate", "saml2", {successRedirect: successRedirect, failureRedirect: failureRedirect}),
  ]);

  return app;
};
