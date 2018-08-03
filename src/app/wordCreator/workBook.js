var officegen = require('officegen');
var async = require('async');
var fs = require('fs');
var path = require('path');
var async = require('async');

var WordCreator = function () {
    var obj = {};
    obj.templateData = null;
    // obj.createFreshWorkBook = function () {
    //     var docx = officegen('docx');
    //     var docx = officegen({
    //         'type': 'docx',
    //         'subject': 'Creates Bill',
    //         'keywords': 'Bill generation',
    //         'description': 'Creates Bill'
    //     });
    // }

    var docx = officegen('docx');
    docx.on('error', function (err) {
        console.log(err);
    });

    var table = [
        [{
            val: "No.",
            opts: {
                cellColWidth: 4261,
                b: true,
                sz: '80',
                shd: {
                    fill: "7F7F7F",
                    themeFill: "text1",
                    "themeFillTint": "80"
                },
                fontFamily: "Avenir Book"
            }
        }, {
            val: "Title1",
            opts: {
                b: true,
                color: "000000",
                align: "center",
                shd: {
                    fill: "80dfff",
                    themeFill: "text1",
                    "themeFillTint": "80"
                }
            }
        }, {
            val: "Title2",
            opts: {
                align: "center",
                cellColWidth: 42,
                b: true,
                sz: '48',
                shd: {
                    fill: "92CDDC",
                    themeFill: "text1",
                    "themeFillTint": "80"
                }
            }
        }],
        [1, 'All grown-ups were once children', ''],
        [2, 'there is no harm in putting off a piece of work until another day.', ''],
        [3, 'But when it is a matter of baobabs, that always means a catastrophe.', ''],
        [4, 'watch out for the baobabs!', 'END'],
    ]

    var tableStyle = {
        tableColWidth: 4261,
        tableSize: 24,
        tableColor: "ada",
        tableAlign: "left",
        tableFontFamily: "Comic Sans MS"
    }


    var pObj = docx.createP();
    var pObj = docx.createTable(table, tableStyle);
    var out = fs.createWriteStream('../../../downloads/out.docx');

    async.parallel([
        function (done) {
            out.on('close', function () {
                console.log('Finish to create a DOCX file.');
                done(null);
            });
            docx.generate(out);
        }

    ], function (err) {
        if (err) {
            console.log('error: ' + err);
        } // Endif.
    });
    //   docx.createByJson(data);

}
WordCreator();
module.exports = WordCreator;