const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var path = require('path');
var formidable = require('formidable')

var fs = require('fs');

exports.plot_graph_get = function(req, res, next) {
    res.render('tronco')
};

exports.plot_graph_post = function(req, res, next) {
    model = req.files.ModelChoice;
    console.log(model);
}

exports.plot_graph_post = function(req, res, next) {
    // Create a formidable object: uploaddir is where to put the uploaded files
    var form = new formidable.IncomingForm();
    
    form.parse(req);
    /*form.parse(req, (err, fields, files) => {
        
        c = req.body.confidence
        if (c.length < 3) {
            console.log('errore')
            res.render('tronco', {conf : req.body.confidence})
        }
        var prova = files['ModelChoice'].path;
        console.log(prova)

    })

    form.on('fileBegin', function(name, file) {
        const [fileName, fileExt] = file.name.split('.')
        console.log(filename)
        file.path = path.join(form.uploadDir, `${fileName}_${new Date().getTime()}.${fileExt}`)
        
    })*/
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (name, file) {
        console.log('file caricato:' + file.name)
        
    })

    

    
}

/*
exports.plot_graph_post = [
    body('ModelChioce', 'please upload Rdata file').custom(value => {
        var extension = (path.extname(value)).toLowerCase();
        
        return extension == '.RData';
    }),
    


    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('errori');
            res.render('tronco', {model : req.body.ModelChoice, errors: errors.array() })
            return;
        } else {
            console.log(req.body.ModelChoice)
            var file = req.body.ModelChioce;
            console.log(typeof file)
            /*fs.writeFile(file, "ciao", function(err) {
                console.log('couldn\'t read file')
            })
            var out = R("ex-sync.R")
                .data("hello world", 20)
                .callSync();
            var out = R('./ex-sync.R');
               
            //console.log(out);
        }
    }
];*/