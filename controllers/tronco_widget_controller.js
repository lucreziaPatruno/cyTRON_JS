var path = require('path');
var formidable = require('formidable')
const rscript = require('js-call-r');
var fs = require('fs')

exports.start_widget_get = function(req, res, next) {
    res.render('insert_email')
}

exports.start_widget_post = function(req, res, next) {
    var form = new formidable.IncomingForm()
    
    form.parse(req, (err, fields, files) => {
        req.session.email = fields.inputEmail
        res.redirect('/tronco/user_options')
    })
    
}

exports.show_options_get = function(req, res, next) {
    res.render('study_name')
}

exports.show_options_post = function(req, res, next) {
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        title = fields.inputName
        study_dir = __dirname + '/widget_data/' + req.session.email + '/' + title
        if (fs.existsSync(study_dir)) {
            res.render('study_name', {error: 'Error: a study with the same name already exists'})
            return;
        }
        req.session.title = title
        res.redirect('/tronco')
    })
}

exports.tronco_widget_get = function(req, res, next) {
    var current_directory = __dirname
    current_directory = current_directory.replace(/\\/g, "/")
    var script = current_directory + '/load_packages_picnic.R'
    const result = rscript.callSync(script, {working_directory : current_directory})
    console.log('questa è la get')
    res.render('widget')
};

exports.tronco_widget_post = function(req, res, next) {
    // Create directories needed to store the pipeline data
    var email_dir = __dirname + '/widget_data/' + req.session.email
    email_dir = email_dir.replace(/\\/g, '/')
    if (!fs.existsSync(email_dir))
        fs.mkdirSync(email_dir)

    var session_dir =  __dirname + '/widget_data/' + req.session.email + '/' + req.session.title
    session_dir = session_dir.replace(/\\/g, '/')

    if (!fs.existsSync(session_dir))
        fs.mkdirSync(session_dir)

    var upload_dir = session_dir + '/uploads'
    upload_dir = upload_dir.replace(/\\/g, '/')

    if(!fs.existsSync(upload_dir))
        fs.mkdirSync(upload_dir)

    var form = new formidable.IncomingForm({keepExtensions : true});
    // TODO: add errors
    form.parse(req, (err, fields, files) => {
        var current_directory = __dirname
        current_directory = current_directory.replace(/\\/g, "/")
        // Get the MAF input file uploaded by the user
        var maf = files['MAFinput']
        if (maf.name != '') {
            maf_p = maf.path.replace(/\\/g, '/')
        } else {
            maf_p = ''
        }
        // Get the GISTIC input file uploaded by the user
        var gistic = files['GISTICinput']
        if (gistic.name != '') {
            gistic_p = gistic.path.replace(/\\/g, '/')
        } else {
            gistic_p = ''
        }

        var interest = files['INTERESTinput']
        if (interest.name != '') {
            interest_path = interest.path.replace(/\\/g, '/')
        } else {
            interest_path = ''
        }
        var bool_input = files['BOOLEANinput']
        if (bool_input.name != '') {
            boolean_p = bool_input.path.replace(/\\/g, '/')
        } else {
            boolean_p = ''
        }
        // Get the event type set by the user for the cutsom boolean input:
        var custom_type = fields.event_type

        var script = current_directory + '/picnic_import.R'
        const result = rscript.callSync(script, {maf_path : maf_p, genes_interest : interest_path, 
                                    gistic_path : gistic_p, user_directory : session_dir,
                                    boolean_path : boolean_p, custom_event : custom_type})
        req.session.to_reconstruct = result.to_plot
        console.log(email_dir)
        console.log(result.to_plot)
        //res.download(email_dir + '/MAF.RData')
        // res.render('index')
        if (result.result === 'no_errors') {
            res.redirect('/tronco/files_loaded')
        } else {
            res.send('Errors')
        }
        
    })

    form.on('fileBegin', function (name, file) {
        if (file.name != '') {
            const [fileName, fileExt] = file.name.split('.')
            //fs.rename(file.path, )
            file.path = upload_dir + '/' + file.name
        }
        
    })

    form.on('file', function (name, file) {
        if (file.name != '') {
            console.log('file caricato: ' + file.name)
        }
        
    })
    
}

exports.files_loaded_get = function(req, res, next) {
    res.render('widget_reconstruction')
}

exports.files_loaded_capri_post = function(req, res, next) {
    var session_dir = ''
    if (req.session.email) {
        session_dir =  __dirname + '/widget_data/' + req.session.email + '/' + req.session.title
        session_dir = session_dir.replace(/\\/g, '/')
        var form = new formidable.IncomingForm({keepExtensions : true});
        // TODO: add errors
        form.parse(req, (err, fields, files) => {
            var command = ''
            if (fields.hc)
                command = 'hc'
            else if (fields.tabu)
                command = 'tabu'
            var input = req.session.to_reconstruct
            res.send(input)
            
        })

    } else {
        console.log('errore')
    }


}

exports.files_loaded_caprese_post = function(req, res, next) {
    session_dir =  __dirname + '/widget_data/' + req.session.email + '/' + req.session.title
    session_dir = session_dir.replace(/\\/g, '/')
    
    var input = req.session.to_reconstruct
    var script = __dirname + '/picnic_reconstruct.R'

    const result = rscript.callSync(script, {method : 'caprese', model : session_dir + '/' + input,
                                            directory : session_dir})
    console.log(result)
    res.send(input)
}