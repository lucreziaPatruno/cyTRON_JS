var path = require('path');
var formidable = require('formidable')
const rscript = require('js-call-r');
var fs = require('fs')
var request_module = require('request')

// This function is called when the application is started
// See welcome.js route file: when a user requests '/welcome/',
// this function is called
exports.start_widget_get = function(req, res, next) {
    var dir = __dirname + '/widget_data'
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir)
    res.render('insert_email')
}

// This function is called when a user insterts his/her email
exports.start_widget_post = function(req, res, next) {
    var form = new formidable.IncomingForm()
    
    form.parse(req, (err, fields, files) => {
        // Set session variable to remember the
        // email of the user for the session
        req.session.email = fields.inputEmail
        res.redirect('/tronco/user_options')
    })
    
}

// This function is called right after the previous one
// In tronco.js route file, the route '/tronco/user_options'
// is associated to this function in case of a get
exports.show_options_get = function(req, res, next) {
    if (req.session.email) {
        var session_dir =  __dirname + '/widget_data/' + req.session.email
        var options = {} 
        var models_array = []
        var graphs_array = []
        // Get all the models and graphml files previously constructed by a user:
        // for each analysis get models and graphs
        if (fs.existsSync(session_dir)) {
            files = fs.readdirSync(session_dir) 
            files.forEach(function(file, index) {
                var model_dir = session_dir + '/' + file + '/results'
                console.log(model_dir)
                if (fs.existsSync(model_dir)) {
                    models = fs.readdirSync(model_dir)
                    models.forEach(function(file_model, index) {
                        console.log(file_model)
                        console.log('FILE: ' + file)
                        var name = file_model.split('.')
                        name.pop()
                        name = name.join('.')
                        models_array.push([file, name])
                    })
                }
                var graphs_dir = session_dir + '/' + file + '/plots'
                if (fs.existsSync(graphs_dir)) {
                    graphs = fs.readdirSync(graphs_dir)
                    graphs.forEach(function(file_graph, index) {
                        console.log(file_graph)
                        console.log('FILE: ' + file)
                        var name = file_graph.split('.')
                        name.pop()
                        name = name.join('.')
                        graphs_array.push([file, name])
                    })
                }
                
                
            })
            options['models'] = models_array
            options['graphs'] = graphs_array
            console.log(options)
            res.render('study_name', options)
        } else {
            res.render('study_name')
        }
    } else {
        // The session expired -> display home page
        res.redirect('/welcome')
    }
}

// This function is called after the user types a name 
// for the analysis to be made
// In tronco.js route file, the route '/tronco/user_options'
// is associated to this function in case of a post
exports.show_options_post = function(req, res, next) {
    if (req.session.email) {
        var form = new formidable.IncomingForm()
        form.parse(req, (err, fields, files) => {
            title = fields.inputName
            study_dir = __dirname + '/widget_data/' + req.session.email + '/' + title
            if (fs.existsSync(study_dir)) {
                res.render('study_name', 
                        {error: 'Error: a study with the same name already exists'})
                return;
            }
            // Store analysis title in current session
            req.session.title = title
            res.redirect('/tronco')
        })
    } else {
        // The session expired -> display home page
        res.redirect('/welcome')
    }
}

// This function is called right after the previous one
// In tronco.js route file, the route '/tronco'
// is associated to this function in case of a get
exports.tronco_widget_get = function(req, res, next) {
    if (req.session.email) {
        var current_directory = __dirname
        current_directory = current_directory.replace(/\\/g, "/")
        // Call the first R script: it checks if every required package is installed
        // If needed, it installs any missing package required
        var script = current_directory + '/load_packages_picnic.R'
        const result = rscript.callSync(script, 
                                        {working_directory : current_directory}) //(err, result) => {res.render('widget')})
        res.render('widget')
    } else {
        // The session expired -> display home page
        res.redirect('/welcome')
    }
};

// This function is called after a user selects input files
// In tronco.js route file, the route '/tronco'
// is associated to this function in case of a post
exports.tronco_widget_post = function(req, res, next) {
    if (req.session.email) {
        // Create directories needed to store the pipeline data
        var email_dir = __dirname + '/widget_data/' + req.session.email
        email_dir = email_dir.replace(/\\/g, '/')
        if (!fs.existsSync(email_dir))
            fs.mkdirSync(email_dir)

        var session_dir =  __dirname + '/widget_data/' + req.session.email + '/' + req.session.title
        session_dir = session_dir.replace(/\\/g, '/')

        if (!fs.existsSync(session_dir))
            fs.mkdirSync(session_dir)
        //  Create directory to store uploaded input files
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
            if (fields.MAF && maf.name != '') {
                maf_p = maf.path.replace(/\\/g, '/')
            } else {
                maf_p = ''
            }
            // Get the GISTIC input file uploaded by the user
            var gistic_file = files['GISTICinput']
            if (fields.gistic && gistic_file.name != '') {
                gistic_p = gistic_file.path.replace(/\\/g, '/')
            } else {
                gistic_p = ''
            }
            // Get the gene list file uploaded by the user
            var interest = files['INTERESTinput']
            if (fields.interest && interest.name != '') {
                interest_path = interest.path.replace(/\\/g, '/')
            } else {
                interest_path = ''
            }
            // Get custom boolean user input
            var bool_input = files['BOOLEANinput']
            if (fields.boolean && bool_input.name != '') {
                boolean_p = bool_input.path.replace(/\\/g, '/')
            } else {
                boolean_p = ''
            }
            // Get the event type set by the user for the custom boolean input:
            var custom_type = fields.event_type
            // Get the file which contains the cluster data
            var clusters = ''
            if (fields.cluster) {
                clusters = files['CLUSTERinput'].path
                clusters = clusters.replace(/\\/g, '/')
                req.session.cluster_file = files['CLUSTERinput'].name
            }
            // Get the separator for every file
            var cluster_sep = (fields.cl_separator_selection === 'Space/tabs') ? '':fields.cl_separator_selection
            var maf_sep = (fields.maf_separator_selection === 'Space/tabs') ? '':fields.maf_separator_selection
            var gistic_sep = (fields.gistic_separator_selection === 'Space/tabs') ? '':fields.gistic_separator_selection
            var boolean_sep = (fields.boolean_separator_selection === 'Space/tabs') ? '':fields.boolean_separator_selection
            var script = current_directory + '/picnic_import.R'
            console.log(interest_path)
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
                        
                            //if (err) {
                            //   console.log('err: ' + err)
                            //} else {
            
                                //console.log('CLUSTERS: ' + files['CLUSTERinput'].path)
                                
                                //res.download(email_dir + '/MAF.RData')
                                // res.render('index')
            if (result.result === 'no_errors') {
                // Save in the session the name of the final dataset to use for reconstruction
                req.session.to_reconstruct = result.to_plot
                // Save in the session the names of the columns contained in the cluster dataset
                if (fields.cluster) {
                    req.session.columns = result.columns
                    // Save in the session the cluster separator
                    req.session.cluster_separator = cluster_sep
                    // Render page to select columns for cluster subtyping
                    res.redirect('/tronco/cluster_selection')
                } else {
                    // No cluster file has been uploaded -> proceed directly to reconstruction page
                    res.redirect('/tronco/reconstruction')
                
                }
            } else {
                // Some error occured during script execution ->
                // render input selection page again
                res.render('widget', 
                    {errors : ['Attention, there was an error in data input', 
                            'Make sure to select the correct files']})
                
            }
            
        })

        //next()                                          
        //}

        // Function called everytime a file is uploaded through the form   
        form.on('fileBegin', function (name, file) {
            if (file.name != '') {
                //const [fileName, fileExt] = file.name.split('.')
                //fs.rename(file.path, )
                file.path = upload_dir + '/' + file.name
            }
            
        })

        form.on('file', function (name, file) {
            if (file.name != '') {
                console.log('file caricato: ' + file.name)
            }
            
        })
        //res.end()
        //return next()
    } else {
        // The session expired -> display home page
        res.redirect('/welcome')
    }  
}

// Function called after the previous one when a user selects
// a cluster file.
// In tronco.js route file, the route '/tronco/cluster_selection'
// is associated to this function in case of a get
exports.select_clusters_get = function(req, res, next) {
    if (req.session.email) {
        res.render('cluster_selection', 
                    {columns : req.session.columns})
    } else {
        // The session expired -> display home page
        res.redirect('/welcome')
    }
}

// Function called after a user selects the cluster and ID column
// In tronco.js route file, the route '/tronco/cluster_selection'
// is associated to this function in case of a post
exports.select_clusters_post = function(req, res, next) {
    if (req.session.email) {
        var session_dir =  __dirname + '/widget_data/' + 
                            req.session.email + '/' +
                            req.session.title
        session_dir= session_dir.replace(/\\/g, '/')
        var form = new formidable.IncomingForm({keepExtensions : true});
        // Prepare a variable to store any cluster which is not found in
        // the input mutation files
        req.session.clusters_not_found = ''
        form.parse(req, (err, fields, files) => {
            // Get the script to execute
            var script = __dirname + '/picnic_events_clustering.R'
            // Retrieve the file containg the model data
            data_path = session_dir + '/' + req.session.to_reconstruct
            // Retrieve the cluster file which has previously been uploaded
            var cluster_file = session_dir + '/uploads/' + req.session.cluster_file

            // Call the script for mutation subtyping
            const result = rscript.callSync(script, 
                {data : data_path, 
                    filter_freq : fields.freq_selection, 
                    cluster_column : fields.cluster_selection,
                    id_column : fields.id_selection,
                    cluster_path : cluster_file,
                    reconstruction_dir : session_dir,
                    separator : req.session.cluster_separator})
                                    
            console.log(result)
            // Three possible cases:
            // 1. At least one sample was found for each cluster
            // 2. For some clusters no samples were found
            // 3. There is an error in the files or columns selected
            if (result.result === 'no_errors') {
                // Case 1
                res.redirect('/tronco/reconstruction')
            } else {
                if (result.result === 'clusters_not_found') {
                    // Case 2
                    req.session.clusters_not_found = result.clusters
                    res.redirect('/tronco/reconstruction')
                } else
                // Case 3
                    res.render('cluster_selection', 
                        {errors: 
                        'Attention, there was an error in the cluster selection process. \nMake sure to select the right columns',
                        columns : req.session.columns})
                
            }
        })
    } else {
        // The session expired -> display home page
        res.redirect('/welcome')
    }
}

// This function is called after the cluster subtyping processes
// finishes
// In tronco.js route file, the route '/tronco/reconstruction'
// is associated to this function in case of a get
// This function displays a form to select the reconstruction algorithm
exports.files_loaded_get = function(req, res, next) {
    if (req.session.email) {
        var dir = __dirname + '/widget_data/' + req.session.email + '/' + req.session.title
        var clusters = []
        // Get cluster names
        fs.readdir(dir, function(err, files) {
            files.forEach(function(file, index) {
                if (!(['plots', 'uploads'].includes(file))) {
                    // Remove file extension from name
                    var name = file.split('.')
                    name.pop()
                    name = name.join('.')
                    clusters.push(name)
                }
            })
            console.log(req.session.clusters_not_found)
            if (req.session.clusters_not_found) {
                // Some clusters don't contain any sample
                // render the page with a message
                res.render('widget_reconstruction',
                        {clusters : clusters, 
                        errors : [req.session.clusters_not_found]})
            } else {
                // Every cluster contains at least one sample -> 
                // No message needs to be displayed
                res.render('widget_reconstruction',
                            {clusters : clusters})
            }
            
        })
    } else {
        // The session expired -> display home page
        res.redirect('/welcome')
    }
}

// This function is called after the user selects the cluster
// for the reconstruction.
// In tronco.js route file, the route '/tronco/cluster_selection'
// is associated to this function in case of a post
exports.files_loaded_post = function(req, res, next) {
    if (req.session.email) {
        var session_dir = ''
        var script = __dirname + '/picnic_reconstruct.R'
        session_dir =  __dirname + '/widget_data/' + req.session.email + '/' + req.session.title
        session_dir = session_dir.replace(/\\/g, '/')

        var result_dir = session_dir + '/results'

        if (!fs.existsSync(result_dir)) {
            fs.mkdirSync(result_dir)
        }
        var upload_dir = session_dir + '/uploads'
        var form = new formidable.IncomingForm({keepExtensions : true});
        form.parse(req, (err, fields, files) => {
            if (fields.capri_submit) {
                // Case when the algorithm selected is capri
                // Get algorithm parameters set by the user
                var bic = fields.bic ? fields.bic:''
                var aic = fields.aic ? fields.aic:''
                var mutex = files['MUTEXinput']
                var mutex = mutex.name!='' ? mutex.path:''
                console.log(mutex)
                const result = rscript.callSync(script, {method : 'capri',
                                            model : session_dir + '/' + fields.cluster_selection + '.RData',
                                            directory : session_dir,
                                            bic : bic,
                                            aic : aic,
                                            command : fields.command,
                                            bootstrap : fields.err_rate_capri,
                                            name : fields.cluster_selection,
                                            result_dir : result_dir,
                                            mutex : mutex})
                                     
                                    //(result)=> {
                console.log(result)
                if (result.result == 'no_errors') {
                    // Case when the reconstruction encontered no errors
                    res.redirect('/tronco/tronco_plot')
                } else {
                    // This is the case when reconstruction fails -> the page must
                    // be reloaded.
                    clusters = []
                    fs.readdir(session_dir, function(err, files) {
                        files.forEach(function(file, index) {
                            if (!(['plots', 'uploads'].includes(file))) {
                                var name = file.split('.')
                                name.pop()
                                name = name.join('.')
                                clusters.push(name)
                            }
                        })//, function(){})})
                        if (req.session.clusters_not_found) {
                            res.render('widget_reconstruction',
                                    {clusters : clusters, 
                                    errors : [req.session.clusters_not_found],
                                    reconstruction_error : 
                                        'Something went wrong in the reconstruction of cluster ' + fields.cluster_selection + '\nSelect another cluster'})
                        } else {
                            res.render('widget_reconstruction',
                                        {clusters : clusters,
                                        reconstruction_error : 
                                        'Something went wrong in the reconstruction of cluster ' + fields.cluster_selection + '\nSelect another cluster'})
                        }
                    })
                }
            } else if (fields.caprese_submit) {
                // Case when the algorithm chosen is caprese
                const result = rscript.callSync(script, {method : 'caprese',
                                                model : session_dir + '/' + fields.cluster_selection +'.RData',
                                                directory : session_dir,
                                                result_dir : result_dir,
                                                name : fields.cluster_selection})
                                         
                                        //(result) => {
                console.log(result)
                if (result.result == 'no_errors') {
                    // Case when the reconstruction encontered no errors
                    res.redirect('/tronco/tronco_plot')
                } else {
                    // This is the case when reconstruction fails -> the page must
                    // be reloaded.
                    clusters = []
                    fs.readdir(session_dir, function(err, files) {
                        files.forEach(function(file, index) {
                            if (!(['plots', 'uploads'].includes(file))) {
                                //const [fileName, fileExt] = file.split('.')
                                var name = file.split('.')
                                name.pop()
                                name = name.join('.')
                                clusters.push(name)
                            }
                        })//, function(){})
                            if (req.session.clusters_not_found) {
                                res.render('widget_reconstruction',
                                        {clusters : clusters, 
                                        errors : [req.session.clusters_not_found],
                                        reconstruction_error : 
                                            'Something went wrong in the reconstruction of cluster ' + fields.cluster_selection + '\nSelect another cluster'})
                            } else {
                                res.render('widget_reconstruction',
                                            {clusters : clusters,
                                            reconstruction_error : 
                                            'Something went wrong in the reconstruction of cluster ' + fields.cluster_selection + '\nSelect another cluster'})
                            }
                        })
                }
            }
        })
        form.on('fileBegin', function (name, file) {
            if (file.name != '') {
                file.path = upload_dir + '/' + file.name
            }
            
        })
    
        form.on('file', function (name, file) {
            if (file.name != '') {
                console.log('file caricato: ' + file.name)
            }
            
        })
    } else {
        // The session expired -> display home page
        res.redirect('/welcome')
    }
}

// This function is called after the reconstruction process ends
// In tronco.js route file, the route '/tronco/tronco_plot'
// is associated to this function in case of a post
// This function diplays a form to set parameters to visualize and export model
// in graphml format
exports.tronco_plot_get = function(req, res, next) {
    if (req.session.email) {
        result_dir =  __dirname + '/widget_data/' + 
            req.session.email + '/' + 
            req.session.title + '/results'
        result_dir = result_dir.replace(/\\/g, '/')
        // Retrieve the models reconstructed in this analysis
        // so tha the user can select which one he/she wants to plot
        var models_ready = []
        fs.readdir(result_dir, function(err, files) {
            files.forEach(function(file, index) {
                console.log('!!!' + file)
                var name = file.split('.')
                name.pop()
                name = name.join('.')
                models_ready.push(name)
            })
            res.render('construction_successful',
                {models : models_ready})
        })
    }
}

// This function is called after the user sets 
//parameters for model visualization
exports.tronco_plot_post = function(req, res, next) {
    if (req.session.email) {
        var form = new formidable.IncomingForm()
        form.parse(req, (err, fields, files) => {
            var current_directory = __dirname
            current_directory = current_directory.replace(/\\/g, "/")
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
            // Get value of prima facie parameter
            var pf = false
            if (fields.pf != undefined) {
                pf = true
            }
            session_dir = __dirname + '/widget_data/' + req.session.email + '/' + req.session.title
            session_dir = session_dir.replace(/\\/g, '/')
            // get dir where reconstructed models
            // files are be stored
            result_dir =  session_dir + '/results'
            // get dir where graphml files will be stored
            plots_dir = session_dir + '/plots'
            if (!fs.existsSync(plots_dir)) {
                fs.mkdirSync(plots_dir)
            }
            var name = fields.cluster_selection
            // get the path to the model file to diplay
            var path = result_dir + '/' + fields.cluster_selection + '.RData'
            var script = current_directory + "/test.R"
            const result = rscript.callSync(script, {modelPath : path,
                                                    modelName: name, 
                                                    hg: c_hg, tp: c_tp, 
                                                    pr : c_pr, 
                                                    output_dir : plots_dir,
                                                    pf : pf,
                                                    sess_id : req.session.id})
                                            
                                            //(result) => {//});
            console.log(result)
            console.log(result.result)
            fs.readFile(result.result, 'utf8', function(error, data) {
                req.session.graph = data
                //fs.unlink(result.result)
                res.render('index', {content : req.session.graph})
            });
        })
    }
}

// This function is called when a user doesn't start a new reconstruction
// but chooses to visualize an already built graph
exports.visualize_constructed_post = function(req, res, next) {
    if (req.session.email) {
        var session_dir = __dirname + '/widget_data/' + 
        req.session.email + '/'
        var form = new formidable.IncomingForm()
        form.parse(req, (err, fields, files) => {
            var array = JSON.parse(fields.graph_selection);
            // Get the path to the graph
            var file_graph = session_dir + array[0] + '/plots/' +
            array[1] + '.graphml'
            fs.readFile(file_graph, 'utf8', function(error, data) {
                console.log(data)
                // Render the page for visualization
                res.render('index', {content : data})
            })
        })
    }
}
