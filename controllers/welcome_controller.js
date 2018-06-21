var cytoscape = require('cytoscape');
var jquery = require('jquery');
var graphml = require('cytoscape-graphml');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;


graphml( cytoscape, jquery ); // register extension

exports.index = function(req, res) {
    //res.sendfile('../public/')
    //res.render('index', { title: 'cyTRON'});
    graph = req.session.graph
    
    if (graph) {
        //var decoder = new StringDecoder('utf8');
        //graph_string = decoder.write(graph['data'])
        console.log(graph)
        
        res.render('tronco_visualization', {content : graph})
        // res.render('index')
    }
    else {
        res.render('index')
    }
   

}
