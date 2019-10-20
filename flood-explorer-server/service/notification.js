const express = require('express');
const app = express();

let notificationComponent = require('../component/notificationComponent.js');

app.post('/notification', function (req, res) {
console.log('Request: ', req.body);
    notificationComponent.sendNotifications(req.body.mailTo, req.body.content, req.body.image);

    res.json({
        ok: true
    })
});

app.post('/notification/mail', function (req, res) {

    notificationComponent.mailNotifications(req.body.mailTo, req.body.content, req.body.image);

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

