const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var path = require('path');
var formidable = require('formidable')
const rscript = require('js-call-r');
var fs = require('fs')

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
        // Get the confidence values set by the user
        var c_hg = ''
        var c_tp = ''
        var c_pr = ''
        if (fields.hg != undefined) {
            c_hg = 'hg'
        }
        if (fields.tp != undefined) {
            c_tp = 'tp'
        }
        if (fields.pr != undefined) {
            c_pr = 'pr'
        }
        // Get the models to plot set by the user
        var capri_bic = ''
        var capri_aic = ''
        var caprese = ''
        if (fields.capri_bic != undefined) {
            capri_bic = 'capri_bic'
        }
        if (fields.capri_aic != undefined) {
            capri_aic = 'capri_aic'
        }
        if (fields.caprese != undefined) {
            caprese = 'caprese'
        }
        // Get the RData model selected by the user
        // TODO: validation of the file extension
        var mod = files['ModelChoice'];
        const [fileName, fileExt] = mod.name.split('.')
        if (fileExt != 'RData') {
            err[err.length] = 'Please upload an RData file'
        }
        if (err.length > 0) {
            res.render('tronco')
        }
        // Get the value of the 
        var pf = false
        if (fields.pf != undefined) {
            pf = true
        }
        var script = current_directory + "/test.R"
        var result_dir = current_directory+"/results"
        const result = rscript.callSync(script, {modelPath : mod.path.replace(/\\/g, "/"), modelName: fileName, 
                                                hg: c_hg, tp: c_tp, pr : c_pr, output_dir : result_dir,
                                                capri_bic: capri_bic, capri_aic: capri_aic, caprese: caprese,
                                                pf : pf,
                                                sess_id : req.session.id});
        //const result = rscript.callSync(script);
        console.log(result)
        fs.readFile(result.result, 'utf8', function(error, data) {
            req.session.graph = data
            fs.unlink(result.result)
            res.render('tronco_visualization', {content : req.session.graph})
        });

        //res.render('tronco_visualization', {content : })
    })

    /*form.on('fileBegin', function(name, file) {
        const [fileName, fileExt] = file.name.split('.')
        console.log(filename)
        file.path = path.join(form.uploadDir, `${fileName}_${new Date().getTime()}.${fileExt}`)
        
    })*/
    form.on('fileBegin', function (name, file) {
        const [fileName, fileExt] = file.name.split('.')

        file.path = __dirname + '/uploads/' + fileName + req.session.id + '.'+ fileExt;
        // file.path = __dirname + '/uploads/' + file.name;
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