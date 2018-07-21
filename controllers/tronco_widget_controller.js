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
            res.render('study_name', 
                    {error: 'Error: a study with the same name already exists'})
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
    const result = rscript.callSync(script, 
                                    {working_directory : current_directory})
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
        // get the gene list file uploaded by the user
        var interest = files['INTERESTinput']
        if (interest.name != '') {
            interest_path = interest.path.replace(/\\/g, '/')
        } else {
            interest_path = ''
        }
        // Get custom boolean user input
        var bool_input = files['BOOLEANinput']
        if (bool_input.name != '') {
            boolean_p = bool_input.path.replace(/\\/g, '/')
        } else {
            boolean_p = ''
        }
        // Get the event type set by the user for the custom boolean input:
        var custom_type = fields.event_type
        // Get the file which contains the cluster data
        var clusters = ''
        if (fields.y_cluster) {
            clusters = files['CLUSTERinput'].path
            clusters = clusters.replace(/\\/g, '/')
            req.session.cluster_file = files['CLUSTERinput'].name
        }
        // Get the separator for the cluster file
        var cluster_sep = (fields.cl_separator_selection === 'Space/tabs') ? '':fields.cl_separator_selection
        var maf_sep = (fields.maf_separator_selection === 'Space/tabs') ? '':fields.maf_separator_selection
        var gistic_sep = (fields.gistic_separator_selection === 'Space/tabs') ? '':fields.gistic_separator_selection
        var boolean_sep = (fields.boolean_separator_selection === 'Space/tabs') ? '':fields.boolean_separator_selection
        var script = current_directory + '/picnic_import.R'
        const result = rscript.callSync(script, {maf_path : maf_p, 
                                                genes_interest : interest_path, 
                                                gistic_path : gistic_p, 
                                                user_directory : session_dir,
                                                boolean_path : boolean_p, 
                                                custom_event : custom_type,
                                                clusters_path : clusters,
                                                cluster_separator : cluster_sep,
                                                maf_separator : maf_sep,
                                                gistic_separator : gistic_sep,
                                                boolean_separator : boolean_sep})
        console.log(result)
        // Save in the session the name of the final dataset to use for reconstruction
        req.session.to_reconstruct = result.to_plot
        // Save in the session the names of the columns contained in the cluster dataset
        req.session.columns = result.columns
        // Save in the session the cluster separator
        req.session.cluster_separator = cluster_sep
        console.log('CLUSTERS: ' + files['CLUSTERinput'].path)
       
        //res.download(email_dir + '/MAF.RData')
        // res.render('index')
        if (result.result === 'no_errors') {
            if (fields.y_cluster)
                res.redirect('/tronco/cluster_selection')
            else
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



exports.select_clusters_get = function(req, res, next) {
    res.render('cluster_selection', 
                {columns : req.session.columns})
}

exports.select_clusters_post = function(req, res, next) {
    var session_dir =  __dirname + '/widget_data/' + 
                        req.session.email + '/' +
                        req.session.title
    session_dir= session_dir.replace(/\\/g, '/')
    var form = new formidable.IncomingForm({keepExtensions : true});
    // TODO: add errors
    form.parse(req, (err, fields, files) => {
        // Get the script to execute
        var script = __dirname + '/picnic_events_clustering.R'
        // Retrieve the file containg the model data
        data_path = session_dir + '/' + req.session.to_reconstruct
        // Retrieve the cluster file which has previously been uploaded
        var cluster_file = session_dir + '/uploads/' + req.session.cluster_file

        console.log(data_path)
        console.log(fields.freq_selection)
        console.log(fields.cluster_selection)
        console.log(fields.id_selection)
        console.log(cluster_file)
        console.log(session_dir)
        console.log(req.session.cluster_separator)
        
        const result = rscript.callSync(script, {data : data_path,
                                        filter_freq : fields.freq_selection,
                                        cluster_column : fields.cluster_selection,
                                        id_column : fields.id_selection,
                                        cluster_path : cluster_file,
                                        reconstruction_dir : session_dir,
                                        separator : req.session.cluster_separator})
        
        if (result.result === 'no_errors') {
            res.redirect('/tronco/files_loaded')
        } else {
            res.send('Errors')
        }
        console.log(result)
    })
}


exports.files_loaded_get = function(req, res, next) {
    var dir = __dirname + '/widget_data/' + req.session.email + '/' + req.session.title
    var clusters = []
    fs.readdir(dir, function(err, files) {
        files.forEach(function(file, index) {
            if (!(['MAF.RData', 'MAF.GISTIC.RData', 'MAF.GISTIC.BOOLEAN.RData', 'uploads'].includes(file))) {
                const [fileName, fileExt] = file.split('.')
                clusters.push(fileName)
            }
        })
        res.render('widget_reconstruction',
                    {clusters : clusters})
    })
    
}


exports.files_loaded_caprese_post = function(req, res, next) {
    session_dir =  __dirname + '/widget_data/' + 
                    req.session.email + '/' + 
                    req.session.title
    session_dir = session_dir.replace(/\\/g, '/')
    
    // var input = req.session.to_reconstruct
    var input = req.body.cluster_selection
   
    var script = __dirname + '/picnic_reconstruct.R'

    const result = rscript.callSync(script, 
                                    {method : 'caprese',
                                    model : session_dir + '/' + input,
                                    directory : session_dir})
    console.log(result)
    res.send(input)
}


exports.files_loaded_post = function(req, res, next) {
    if (req.session.email) {
        var session_dir = ''
        var script = __dirname + '/picnic_reconstruct.R'
        session_dir =  __dirname + '/widget_data/' + req.session.email + '/' + req.session.title
        session_dir = session_dir.replace(/\\/g, '/')

        result_dir = session_dir + '/results'

        if (!fs.existsSync(result_dir)) {
            fs.mkdirSync(result_dir)
        }
        var form = new formidable.IncomingForm({keepExtensions : true});
        // TODO: add errors
        form.parse(req, (err, fields, files) => {
            if (fields.capri_submit) {
                 //var input = req.session.to_reconstruct
                console.log(fields.cluster_selection)
                console.log(fields.bic)
                console.log(fields.aic)
                console.log(fields.err_rate_capri)
                console.log(fields.command)
                var bic = fields.bic ? fields.bic:''
                var aic = fields.aic ? fields.aic:''
                const result = rscript.callSync(script, {method : 'capri',
                                            model : session_dir + '/' + fields.cluster_selection + '.RData',
                                            directory : session_dir,
                                            bic : bic,
                                            aic : aic,
                                            command : fields.command,
                                            bootstrap : fields.err_rate_capri,
                                            name : fields.cluster_selection,
                                            result_dir : result_dir})
                console.log(result)
                if (result.result == 'no_errors') {
                    res.redirect('/tronco/tronco_plot')
                } else
                    res.send('Errors')
                
            } else if (fields.caprese_submit) {
                const result = rscript.callSync(script, {method : 'caprese',
                                                model : session_dir + '/' + fields.cluster_selection,
                                                directory : session_dir})
                console.log(result)
            }
        })
    } else {
        console.log('errore')
    }
}

exports.tronco_plot_get = function(req, res, next) {
    result_dir =  __dirname + '/widget_data/' + req.session.email + '/' + req.session.title + '/results'
    result_dir = result_dir.replace(/\\/g, '/')
    
    var models_ready = []
    fs.readdir(result_dir, function(err, files) {
        files.forEach(function(file, index) {
            console.log('!!!!!' + file)
            models_ready.push(file)
        })
        res.render('construction_successful',
            {models : models_ready})
    })
}


exports.tronco_plot_post = function(req, res, next) {
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        console.log(fields.hg)
        console.log(fields.tp)
        console.log(fields.pr)
        console.log(fields.pf)
        console.log(fields.disconnected)
        var current_directory = __dirname
        current_directory = current_directory.replace(/\\/g, "/")
        // Create an array with the eventual error messages
        var err = [];
        // Get the confidence values set by the user
        var c_hg = ''
        var c_tp = ''
        var c_pr = ''
        if (fields.hg) {
            c_hg = 'hg'
        }
        if (fields.tp) {
            c_tp = 'tp'
        }
        if (fields.pr) {
            c_pr = 'pr'
        }

        var pf = false
        if (fields.pf != undefined) {
            pf = true
        }
        session_dir = __dirname + '/widget_data/' + req.session.email + '/' + req.session.title
        session_dir = session_dir.replace(/\\/g, '/')
        result_dir =  session_dir + '/results'
        
        plots_dir = session_dir + '/plots'
        if (!fs.existsSync(plots_dir)) {
            fs.mkdirSync(plots_dir)
        }
        var [name, ext] = fields.cluster_selection.split('.')
        var path = result_dir + '/' + fields.cluster_selection 
        var script = current_directory + "/test.R"
        console.log(path)
        console.log(name)
        console.log(c_hg)
        console.log(c_tp)
        console.log(c_pr)
        console.log(plots_dir)
        console.log(pf)
        console.log(req.session.id)
        const result = rscript.callSync(script, {modelPath : path,
                                                modelName: name, 
                                                hg: c_hg, tp: c_tp, 
                                                pr : c_pr, 
                                                output_dir : plots_dir,
                                                pf : pf,
                                                sess_id : req.session.id});
        console.log(result)
        console.log(result.result)
        fs.readFile(result.result, 'utf8', function(error, data) {
            req.session.graph = data
            fs.unlink(result.result)
            res.render('tronco_visualization', {content : req.session.graph})
        });

    })
}