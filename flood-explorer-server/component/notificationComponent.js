require('../config/config-notification');

var Twitter = require('twitter');
var nodemailer = require('nodemailer');

const fs = require('fs');

/* Client to post tweet */

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

/* element to send mail */

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_APP,
    pass: process.env.EMAIL_PASS_APP
  }
});

function postTweetWithImage(textContent, image) {

  client.post("media/upload", { media_data: image }, function (error, media, response) {
    if (error) {
      console.log(error)
    } else {

      postTweetText(textContent, media.media_id_string);

    }
  })
}

function postTweetText(textContent, imgId) {

  const status = { status: textContent };

  if (imgId) {
    status.media_ids = imgId;
  }

  client.post('statuses/update', status,
    function (error, tweet, response) {
      if (error) {
        console.log("Error en el posteo de tweet");
        console.log(error);
      } else {
        console.log("Post ready");
        console.log(tweet);
      }
    });
}

function buildTweet(latitude, longitude, zone, seaLevel, alertType) {
  return "ALERTA: niveles peligrosos de agua en zonas aledanas a " + zone
    + " (latitud: " + latitude + ", longitud: " + longitude + ").";
  // + " Nivel del mar se encuentra a " + seaLevel + " sobre el nivel del mar";
}

function sendMail(mailTo, content, image) {
  var mailOptions = {
    from: process.env.EMAIL_APP,
    to: mailTo,
    subject: "Flood Explorer Notification - " + new Date(),
    html: mailBody.replace("%body", content)
  };

  if (image) {
    mailOptions.attachments = [{
      filename: 'map.png',
      content: image,
      cid: 'map@cid',
      encoding: 'base64'
    }];
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function sendNotifications(mailTo, textContent, image) {
  sendMail(mailTo, textContent, image);
  if (image) {
    postTweetWithImage(textContent, image);
  } else {
    postTweetText(textContent, undefined);
  }

}

function sendTwitterNotification(textContent, image) {
  postTweetWithImage(textContent, image);
}

function sendMailNotification(mailTo, textContent, image) {
  sendMail(mailTo, textContent, image);
}

module.exports.sendNotifications = sendNotifications;
module.exports.mailNotifications = sendMailNotification;
module.exports.twitterNotifications = sendTwitterNotification;




let mailBody = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <title>Flood Explorer - Mail Notificacion</title>

    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
        }
        
        img {
            border: 0px;
            display: block;
        }
        
        .socialLinks {
            font-size: 6px;
        }
        
        .socialLinks a {
            display: inline-block;
        }
        
        .long-text p {
            margin: 1em 0px;
        }
        
        .long-text p:last-child {
            margin-bottom: 0px;
        }
        
        .long-text p:first-child {
            margin-top: 0px;
        }
    </style>
    <style type="text/css">
        /* yahoo, hotmail */
        
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }
        
        .yshortcuts a {
            border-bottom: none !important;
        }
        
        .vb-outer {
            min-width: 0 !important;
        }
        
        .RMsgBdy,
        .ExternalClass {
            width: 100%;
            background-color: #3f3f3f;
            background-color: #3f3f3f
        }
        /* outlook/office365 add buttons outside not-linked images and safari have 2px margin */
        
        [o365] button {
            margin: 0 !important;
        }
        /* outlook */
        
        table {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
        }
        
        #outlook a {
            padding: 0;
        }
        
        img {
            outline: none;
            text-decoration: none;
            border: none;
            -ms-interpolation-mode: bicubic;
        }
        
        a img {
            border: none;
        }
        
        @media screen and (max-width: 600px) {
            table.vb-container,
            table.vb-row {
                width: 95% !important;
            }
            .mobile-hide {
                display: none !important;
            }
            .mobile-textcenter {
                text-align: center !important;
            }
            .mobile-full {
                width: 100% !important;
                max-width: none !important;
            }
        }
        /* previously used also screen and (max-device-width: 600px) but Yahoo Mail doesn't support multiple queries */
    </style>
    <style type="text/css">
        #ko_singleArticleBlock_3 .links-color a,
        #ko_singleArticleBlock_3 .links-color a:link,
        #ko_singleArticleBlock_3 .links-color a:visited,
        #ko_singleArticleBlock_3 .links-color a:hover {
            color: #3f3f3f;
            color: #3f3f3f;
            text-decoration: underline
        }
        
        #ko_footerBlock_2 .links-color a,
        #ko_footerBlock_2 .links-color a:link,
        #ko_footerBlock_2 .links-color a:visited,
        #ko_footerBlock_2 .links-color a:hover {
            color: #cccccc;
            color: #cccccc;
            text-decoration: underline
        }
    </style>

</head>

<body bgcolor="#3f3f3f" text="#919191" alink="#cccccc" vlink="#cccccc" style="margin: 0; padding: 0; background-color: #3f3f3f; color: #919191;">
    <center>

        <!-- /preheaderBlock -->

        <table role="presentation" class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#FFFFFF" style="background-color: #bfbfbf;" id="ko_singleArticleBlock_3">
            <tbody>
                <tr>
                    <td class="vb-outer" align="center" valign="top" style="padding-left: 9px; padding-right: 9px; font-size: 0;">
                        <!--[if (gte mso 9)|(lte ie 8)]><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]-->
                        <!--
      -->
                        <div style="margin: 0 auto; max-width: 100%; -mru-width: 0px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="9" bgcolor="#ffffff" width="100%" class="vb-row" style="border-collapse: separate; width: 100%; background-color: #ffffff; mso-cellspacing: 9px; border-spacing: 9px; max-width: 100%; -mru-width: 0px;">

                                <tbody>
                                    <tr>
                                        <td align="center" valign="top" style="font-size: 0;">
                                            <div style="vertical-align: top; width: 100%; max-width: 552px; -mru-width: 0px;">
                                                <!--
        -->
                                                <table role="presentation" class="vb-content" border="0" cellspacing="9" cellpadding="0" style="border-collapse: separate; width: 100%; mso-cellspacing: 9px; border-spacing: 9px;" width="552">

                                                    <tbody>                                                        
                                                        <tr>
                                                            <td width="100%" valign="top" align="left" style="font-weight: normal; color: #3f3f3f; font-size: 18px; font-family: Arial, Helvetica, sans-serif; text-align: left;"><span style="font-weight: normal;">ALERTA</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td class="long-text links-color" width="100%" valign="top" align="left" style="font-weight: normal; color: #3f3f3f; font-size: 13px; font-family: Arial, Helvetica, sans-serif; text-align: left; line-height: normal;">
                                                                <p style="margin: 1em 0px; margin-bottom: 0px; margin-top: 0px;">%body</p>
                                                            </td>
                                                        </tr>
                                                            <td width="100%" valign="top" align="center" class="links-color" style="padding-bottom: 9px;">
                                                                <!--[if (lte ie 8)]><div style="display: inline-block; width: 534px; -mru-width: 0px;"><![endif]--><img border="0" hspace="0" align="center" vspace="0" width="534" style="border: 0px; display: block; vertical-align: top; height: auto; margin: 0 auto; color: #3f3f3f; font-size: 13px; font-family: Arial, Helvetica, sans-serif; width: 100%; max-width: 534px; height: auto;" src="cid:map@cid">
                                                                <!--[if (lte ie 8)]></div><![endif]-->
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        <!--
    -->
                        <!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>

    </center>
</body>

</html>`;

