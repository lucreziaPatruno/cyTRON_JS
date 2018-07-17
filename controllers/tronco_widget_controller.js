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
    session_dir =  __dirname + '/widget_data/' + 
                    req.session.email + '/' + 
                    req.session.title
    session_dir = session_dir.replace(/\\/g, '/')
    
    var input = req.session.to_reconstruct
    var script = __dirname + '/picnic_reconstruct.R'

    const result = rscript.callSync(script, {method : 'caprese',
                                            model : session_dir + '/' + input,
                                            directory : session_dir})
    console.log(result)
    res.send(input)
}

exports.select_clusters_get = function(req, res, next) {
    res.render('cluster_selection', {columns : req.session.columns})
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
        

        console.log(result)
    })
    

}