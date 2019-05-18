
/******************************************************************/
//   L I N K S

//  https://www.npmjs.com/package/pdfkit
//  http://pdfkit.org/docs/guide.pdf
//  file:///C:/Users/sandr/Downloads/coupon.pdf
//  http://masteringionic.com/blog/2017-12-22-generating-pdf-documents-with-node-and-ionic/

/******************************************************************/

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const request = require('request');

/*Website crawler*/
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;

/*PDF*/
const PDFDocument = require('pdfkit');
var fs = require('fs');
const blobStream = require('blob-stream');
const fontkit = require('fontkit');


admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

/******************************************************************/
//    I N I T I A T I V E N
/******************************************************************/
exports.initiativen = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        var array = [];
        request({
            method: "GET",
            url: "http://wecollect.ch/de"
        }, (error, response, body) => {

            const dom = new JSDOM(body);
            dom.window.document.querySelectorAll('article').forEach(element => {
                //console.log(element.textContent);

                var string = element.textContent.trim();
                var titel = string.split('\n')[0];
                var subtitel = string.split('\n')[4].trim();
                var text = string.split('\n')[8].trim();
                var unterschriften = string.split('\n')[13].trim();
                var picture = "https://wecollect.ch" + element.querySelector('img').src;
                var link = "https://wecollect.ch" + element.querySelector('a').href;

                array.push({
                    titel: titel,
                    subtitel: subtitel,
                    text: text,
                    picture: picture,
                    link: link,
                    unterschriften: unterschriften
                });
            })

            res.status(200);
            return res.json({
                initiativen: array
            });

        });
    }

});

/******************************************************************/
//    G E N E R A T E   P D F
/******************************************************************/
exports.generatepdf = functions.https.onRequest((req, res) => {

    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('cors');
    } else {

        //console.log(req.body);
        var initiative = req.body.initiative;
        var user = req.body.user;
        console.log(req.body);

        const myPdfFile = admin.storage().bucket().file(user.sub + '/' + initiative.titel + '.pdf', {
            type: "application/pdf"
        });

        const doc = new PDFDocument({
            layout: 'portrait',
            margins: {
                top: 50,
                bottom: 50,
                left: 72,
                right: 72
            },
            info: {
                Title: initiative.titel,
                Author: user.given_name,
                Subject: initiative.subtitel,
                ModDate: new Date(Date.now()).toLocaleString()
            }
        });

        //doc.pipe(res); // HTTP response
        const stream = doc.pipe(myPdfFile.createWriteStream({
            contentType: "application/pdf",
            metadata : {
                customMetadata: {
                    "titel": initiative.titel,
                    "subtitel": initiative.subtitel,
                    "text": initiative.text,
                    "eid": user.sub
                }
            }
        })); //save to firebase bucket

        // add stuff to PDF here using methods described below...

        doc.image('./img/sh_ch_logo_farbe.png', 0, 15, {
            width: 200
        });
        doc.moveDown(7);
        doc.font("./google_roboto/Roboto-Bold.ttf")
            .fontSize(14)
            .text("powered by: eID+/shcollect/schaffhausen.io/bockchain.ch/wecollect.ch");
        doc.moveDown(2);

        doc.font("./google_roboto/Roboto-Regular.ttf")
            .fontSize(20)
            .text("Eidgenössische Volksinitiative «" + initiative.titel + "»");
        doc.moveDown();
        doc.text(initiative.subtitel).fontSize(16);
        doc.moveDown();
        doc.text(initiative.text).fontSize(14);
        doc.moveDown();

        doc.text("Die unterzeichneten stimmberechtigten Schweizer Bürgerinnen und Bürger stellen hiermit gestützt auf Art. 34, 136, 139 und 194 der Bundesverfassung und nach dem Bundesgesetz vom 17. Dezember 1976 über die politischen Rechte, Art. 68ff., folgendes Begehren:").fontSize(14);
        doc.moveDown();
        doc.text("<<Gesetzesänderung>>").fontSize(14);

        doc.moveDown();
        doc.text("eID+: " + user.sub).fontSize(14);
        doc.text("Name: " + user.family_name).fontSize(14);
        doc.text("Vorname: " + user.given_name)

        doc.text("Geburtsdatum: " + user.birth_date);
        doc.text("Wohnadresse: " + user.street_address + ", " + user.postal_code + ", " + user.locality);
        doc.moveDown(3);
        doc.text("Wer bei einer Unterschriftensammlung besticht oder sich bestechen lässt oder wer das Ergebnis einer Unterschriftensammlung für eine Volksinitiative fälscht, macht sich strafbar nach Art. 281 beziehungsweise nach Art. 282 des Strafgesetzbuches.").fontSize(8);

        // finalize the PDF and end the stream
        doc.end();

        myPdfFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        }).then(signedUrl => {

            res.status(201);
            return res.json({
                "url": signedUrl[0]
            });

        });

    }

});

/******************************************************************/
//    G E T     ALL     D O C U M E N T S   per User
/******************************************************************/
exports.getDocuments = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('cors');
    } else {
        var user = req.body.user;
        console.log(req.body);
        admin.storage().bucket().getFiles({
            prefix: user.sub
        }, function (err, files) {

            if (err) {
                res.status(500);
                return res.send("error");
            }

            var fileArray = [];
            const promises = files.map(file => {
                return file.getMetadata();
            });

            Promise.all(promises).then((arrayOfDocuments) => {
                arrayOfDocuments.forEach(document => {
                    console.log(document);
                    fileArray.push(document);
                })

                res.status(201);
                res.json({
                    "documents": fileArray
                });
            });

        });
    }
});

/******************************************************************/
//    G E T     F I L E     U R L
/******************************************************************/
exports.getSignedUrl = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('cors');
    } else {

        var document = req.body.document;

        console.log(document);

        admin.storage().bucket().file(document).getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        }).then(url => {
            res.status(201);
            res.json({
                "url": url[0]
            });

        })


    }
});


/******************************************************************/
//    D E L E T E    F I L E
/******************************************************************/
exports.deletePDF = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('cors');
    } else {
        var document = req.body.document;
        console.log(document);

        var bucket = admin.storage().bucket();
        bucket.deleteFiles({
            prefix: document.name
        }).then(() => {

            res.status(201);
            res.send('deleted');
        });


    }
});


/******************************************************************/
//    U P L P O A D     F I L E
/******************************************************************/
exports.uploadpdf = functions.https.onRequest((req, res) => {
   
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('cors');
    } else {

        const myPdfFile = admin.storage().bucket().file(user.sub + '/' + initiative.titel + '.pdf', {
            type: "application/pdf"
        });
        var stream = myPdfFile.createWriteStream();
        stream.write(req.body,(error)=>{
            console.log(error);
        })

    }
});