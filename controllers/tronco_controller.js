const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var path = require('path');
var formidable = require('formidable')
const rscript = require('js-call-r');

var fs = require('fs');

exports.plot_graph_get = function(req, res, next) {
    res.render('tronco')
};

exports.plot_graph_post = function(req, res, next) {
    // Create a formidable object
    var form = new formidable.IncomingForm();
        
    form.parse(req, (err, fields, files) => {
        var current_directory = __dirname
        current_directory = current_directory.replace(/\\/g, "/")
        // Create an array with the eventual error messages
        var err = [];
        // Get the confidence value set by the user
        c = fields.confidence;
        // Get the RData model selected by the user
        // TODO: validation of the file extension
        var mod = files['ModelChoice'];
        const [fileName, fileExt] = mod.name.split('.')
        
        if (fileExt != 'RData') {
            err[err.length] = 'Please upload an RData file'
        }
        if (err.length > 0) {
            res.render('tronco', {conf : c})
        }
        
        var script = current_directory + "/test.R"
        var result_dir = current_directory+"/results"
        const result = rscript.callSync(script, {model : mod.path.replace(/\\/g, "/"), conf : c, dir : result_dir});
        console.log(result)
    })

    /*form.on('fileBegin', function(name, file) {
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
/*exports.plot_graph_post = [
    body('ModelChioce', 'please upload Rdata file').custom((value, {req}) => {
        //var extension = (path.extname(value)).toLowerCase();
        console.log(req.body.ModelChoice);
        return true;
        //return extension == '.RData';
    }),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('errori');
            console.log(req.body.confidence)
            res.render('tronco', {model : req.body.ModelChoice, confidence : req.body.confidence, errors: errors.array() })
            return;
        } else {
            var form = new formidable.IncomingForm();
            form.on('fileBegin', function (name, file) {
                file.path = __dirname + '/uploads/' + file.name;
            });
        
            form.on('file', function (name, file) {
                console.log('file caricato:' + file.name)
                
            })

               
            //console.log(out);
        }
    }
];*/