var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var path = require('path');
var fs = require('fs');
// var moment = require('moment');
// moment(1521718676).forM
// console.log(moment("1521718676").format('MMMM Do YYYY, h:mm:ss a'));

'use strict';
// const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        // host: 'mail.dev.deployapp.net',
        host: 'mail.dev.deployapp.net',
        port: 25,
        // secureConnection: true,
        secure: true, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: 'abc@mail.dev.deployapp.net',
            pass: 'lehieu123' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'anc@mail.dev.deployapp.net', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        console.log('start send mail');
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});
// var App = 'taydoapp';
// var linkAppDebug = 'day la link debug';
// var linkAppSigned = 'day la link signed';
// var sDate = Date.now();
// var transporter = nodemailer.createTransport({ // config mail server
//     host: 'test_deployapp.net',
//     port: '25',
//     auth: {
//         user: 'no-reply@taydotech.com',
//         pass: 'taydotech!@#deployapp'
//     }
// });
// transporter.use('compile', hbs({
//     viewPath: path.join(appRoot, 'views'),
//     extName: '.ejs'
// }));

// var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
//     from: 'Deploy App <no-reply@taydotech.com>',
//     to: 'hieu.ric@gmail.com',
//     subject: 'Notification from DeployApp: ' + App + ' is now ready for download',
//     template: 'mail',
//     context: {
//         App,
//         linkAppDebug,
//         linkAppSigned,
//         sDate
//     }
// }
// transporter.sendMail(mainOptions, function(err, info) {
//     if (err) {
//         return console.log(err);
//     }
//     console.log('info mail: ' + info);
//     console.log('info mail 2: ' + JSON.stringify(info));
//     return console.log('Message sent: ' + info.response);

// });