const express = require('express');
const app = express();

let notificationComponent = require('../component/notificationComponent.js');

app.post('/notification', function (req, res) {

    notificationComponent.sendNotifications(req.body.content, req.body.image);

    res.json({
        ok: true
    })
});

app.post('/notification/mail', function (req, res) {

    notificationComponent.mailNotifications(req.body.content, req.body.image);

    res.json({
        ok: true
    })
});

app.post('/notification/twitter', function (req, res) {

    notificationComponent.twitterNotifications(req.body.content, req.body.image);

    res.json({
        ok: true
    })
});

module.exports = app;