/*
    This is the config file.
    Add your key-values here and you can use them in the main 'app.js' by calling the 'config' object.
    EXAMPLE: config.secret
*/

var config = {
    secret: 'ThisIsTheSecretUsedToEncodeTheJsonWebTokensItShouldBeQuiteImpossibleToGuessSoShutUp',
    tokenExpiresInHours: 2,
    defaultRoleName: 'user'
};

module.exports = config;
