var cytoscape = require('cytoscape');
var jquery = require('jquery');
var graphml = require('cytoscape-graphml');
var fs = require('fs');

graphml( cytoscape, jquery ); // register extension

exports.visualize_model = function(req, res) {
    //res.sendfile('../public/')
    //res.render('index', { title: 'cyTRON'});
    res.render('index')
    // res.render('insert_email')

}
