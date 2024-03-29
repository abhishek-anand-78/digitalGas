var officegen = require('officegen');
var async = require('async');
var fs = require('fs');
var path = require('path');
var async = require('async');

var WordCreator = function () {
    var obj = {};
    obj.templateData = null;
    
    var docx = officegen ( {
        type: 'docx',
        orientation: 'portrait',
        pageMargins: { top: 1000, left: 1000, bottom: 1000, right: 1000 }        
    });
    
    // Remove this comment in case of debugging Officegen:
    // officegen.setVerboseMode ( true );
    
    docx.on ( 'error', function ( err ) {
        console.log ( err );
    });
    
    
    var pObj = docx.createP ( { align: 'center', border: 'thick', borderSize: 12, borderColor: '88CCFF' } );
    pObj.addText ( ' TAX INVOICE ', { font_face: 'Arial', font_size: 18, border: 'thick', borderSize: 12, borderColor: '88CCFF' } );    
    pObj.addText ( '', { font_face: 'Arial', font_size: 18, border: 'thick', borderSize: 12, borderColor: '88CCFF' } );
    

    pObj.addText ('Hello');
    var table = [
        [{       
            val: "To,",     
            opts: {
                cellColWidth: 100,
                b:true,
                sz: '0',
                shd: {                                    
                    "themeFillTint": "80"
                },
                fontFamily: "Avenir Book"
            }
        },
        {       
            val: "Bill No-,",     
            opts: {
                cellColWidth: 100,
                b:true,
                sz: '0',
                shd: {                                    
                    "themeFillTint": "80"
                },
                fontFamily: "Avenir Book"
            }
        },
        {       
            val: "        ",     
            opts: {
                cellColWidth: 100,
                b:true,
                sz: '0',
                shd: {                                    
                    "themeFillTint": "80"
                },
                fontFamily: "Avenir Book"
            }
        },
        {       
            val: "        ",     
            opts: {
                cellColWidth: 100,
                b:true,
                sz: '0',
                shd: {                                    
                    "themeFillTint": "80"
                },
                fontFamily: "Avenir Book"
            }
        }],
        ['Gas agency customer ka naam','    '],
        ['Chhota address, Gaon','Dated-','09/15/2034'],
        ['But when it is a matter ',''],
        ['watch out for the baobabs!','END','===='],
    ]
    
    var tableStyle = {
        tableColWidth: 100,
        tableSize: 24,
        tableColor: "ada",
        tableAlign: "left",
        borders: true,
        tableFontFamily: "Comic Sans MS"
    }
    
    var pObj = docx.createTable (table, tableStyle);

    //docx.putPageBreak ();
    var pObj = docx.createTable (table, tableStyle);
    docx.putPageBreak ();


    var pObj = docx.createP ();
    
    pObj.addText ( 'Simple' );
    pObj.addText ( ' with color', { color: '000088' } );
    pObj.addText ( ' and back color.', { color: '00ffff', back: '000088' } );
    
    var pObj = docx.createP ();
    
    pObj.addText ( 'Since ' );
    pObj.addText ( 'officegen 0.2.12', { back: '00ffff', shdType: 'pct12', shdColor: 'ff0000' } ); // Use pattern in the background.
    pObj.addText ( ' you can do ' );
    pObj.addText ( 'more cool ', { highlight: true } ); // Highlight!
    pObj.addText ( 'stuff!', { highlight: 'darkGreen' } ); // Different highlight color.
    
    var pObj = docx.createP ();
    
    pObj.addText ('Even add ');
    pObj.addText ('external link', { link: 'https://github.com' });
    pObj.addText ('!');
    
    var pObj = docx.createP ();
    
    pObj.addText ( 'Bold + underline', { bold: true, underline: true } );
    
    var pObj = docx.createP ( { align: 'center' } );
    pObj.addText ( ' Fonts face and size.', { font_face: 'Arial', font_size: 40 } );
    
    pObj.addText ( 'Center this text', { border: 'dotted', borderSize: 12, borderColor: '88CCFF' } );
    
    var pObj = docx.createP ();
    pObj.options.align = 'right';
    
    pObj.addText ( 'Align this text to the right.' );
    
    var pObj = docx.createP ();
    
    pObj.addText ( 'Those two lines are in the same paragraph,' );
    pObj.addLineBreak ();
    pObj.addText ( 'but they are separated by a line break.' );
    
    docx.putPageBreak ();
    
    var pObj = docx.createP ();
        
    pObj.addText ( 'Fonts face only.', { font_face: 'Arial' } );
    pObj.addText ( ' Fonts face and size.', { font_face: 'Arial', font_size: 40 } );
    
    docx.putPageBreak ();
    
    var pObj = docx.createP ();
    
    //pObj.addImage ('../../../downloads/image5.jpeg' );
    
    //docx.putPageBreak ();
    
    //var pObj = docx.createP ();
    
    //pObj.addImage ('../../../downloads/image5.jpeg' ) ;
    
    //var pObj = docx.createP ();
    
    // pObj.addImage ( '../../../downloads/image5.jpeg');
    // pObj.addImage ( '../../../downloads/image5.jpeg');
    // pObj.addImage ( '../../../downloads/image5.jpeg' );
    // pObj.addText ( '... some text here ...', { font_face: 'Arial' } );
    // pObj.addImage ( '../../../downloads/image5.jpeg' ) ;
    
    //var pObj = docx.createP ();
    
   // pObj.addImage ( '../../../downloads/image5.jpeg' );
    
    docx.putPageBreak ();
    
    var pObj = docx.createListOfNumbers ();
    
    pObj.addText ( 'Option 1' );
    
    var pObj = docx.createListOfNumbers ();
    
    pObj.addText ( 'Option 2' );
    
    pObj.addHorizontalLine ();
    
    var pObj = docx.createP ({ backline: 'E0E0E0' });
    
    pObj.addText ( 'Backline text1' );
    
    pObj.addText ( ' text2' );
    
    var table = [
        [{
            val: "No.",
            opts: {
                cellColWidth: 4261,
                b:true,
                sz: '48',
                shd: {
                    fill: "7F7F7F",
                    themeFill: "text1",
                    "themeFillTint": "80"
                },
                fontFamily: "Avenir Book"
            }
        },{
            val: "Title1",
            opts: {
                b:true,
                color: "A00000",
                align: "right",
                shd: {
                    fill: "92CDDC",
                    themeFill: "text1",
                    "themeFillTint": "80"
                }
            }
        },{
            val: "Title2",
            opts: {
                align: "center",
                cellColWidth: 42,
                b:true,
                sz: '48',
                shd: {
                    fill: "92CDDC",
                    themeFill: "text1",
                    "themeFillTint": "80"
                }
            }
        }],
        [1,'All grown-ups were once children',''],
        [2,'there is no harm in putting off a piece of work until another day.',''],
        [3,'But when it is a matter of baobabs, that always means a catastrophe.',''],
        [4,'watch out for the baobabs!','END'],
    ]
    
    var tableStyle = {
        tableColWidth: 4261,
        tableSize: 24,
        tableColor: "ada",
        tableAlign: "left",
        tableFontFamily: "Comic Sans MS"
    }
    
    var pObj = docx.createTable (table, tableStyle);
    
    var out = fs.createWriteStream ('../../../downloads/wordReal.docx');
    
    out.on ( 'error', function ( err ) {
        console.log ( err );
    });
    
    async.parallel ([
        function ( done ) {
            out.on ( 'close', function () {
                console.log ( 'Finish to create a DOCX file.' );
                done ( null );
            });
            docx.generate ( out );
        }
    
    ], function ( err ) {
        if ( err ) {
            console.log ( 'error: ' + err );
        } // Endif.
    });

}
WordCreator();
module.exports = WordCreator;