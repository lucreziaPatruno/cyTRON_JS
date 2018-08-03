loadgraphml = function(graphstr) {
    // A new model has been chosen, so all the information about the previous one need to be deleted:
    document.getElementById('confidenceValues').innerHTML = 'Graph information will be displayed here'

    var cy = cytoscape({
        container: document.getElementById('cy'),
            
        style: [
            {
                selector: 'node',
                style: {
                    'label': 'data(v_label)',
                    
                    'width' : 'data(v_width)',
                    'height' : 'data(v_height)',
                    'shape' : 'ellipse',
                    'background-color' : 'data(v_fillcolor)',
                    'border-width' : 'data(v_borderwidth)',
                    'border-color' : 'data(v_bordercolor)',
                    'text-wrap': 'wrap',
                    'text-valign': 'center',
                    'text-halign': 'center'
                }

            },
            {
                selector: 'edge',
                style: {
                    'label' : 'data(e_edgelabel)',
                    'line-style' : function(ele) { 
                        var style = ele.data('e_line')
                        if (style === "dash") {
                            return 'dashed'
                        } else
                            return 'solid' 
                        },

                    'line-color' : 'data(e_color)',
                    'width' : 'data(e_width)',
                    'curve-style': 'bezier',
                    'target-arrow-shape': function (ele) {
                        if (ele.data('e_arrow') === 'True') {
                            return 'triangle'
                        } else {
                            
                            return 'none'
                        }
                            
                    },
                    'target-arrow-fill' : 'filled',
                    'color' : function(ele) {
                        if (ele.data('e_labelcolor') != undefined) {
                            return ele.data('e_labelcolor')
                        } else
                            return "#000000"
                    }
                }
            },
            {
            selector: ':selected',
            style: {
            }
        }

        ],
    });

    var options = {
        name : 'dagre'
    }
    
    cy.graphml(graphstr);
    cy.layout(options).run();
    cy.panzoom({});
    var ur = cy.undoRedo(options);
    document.getElementById('confidenceValues').style.visibility = 'visible'
    var reset_button = document.getElementById('reset_button')
    reset_button.style.visibility = 'visible'
    reset_button.addEventListener("click", function(evt) {
        cy.layout(options).run()
        //cy.reset()
        //cy.zoom(0.8)
        //ur.undoAll()
    });
    cy.on("tap", "node", function(evt) {
        console.log('node click')
        var logic = ['OR', 'AND', 'XOR']
        var node = evt.target;
        name = node.data("v_name")
        //console.log( 'tapped ' + node.data("v_name") );
        if (logic.includes(name)) {
            document.getElementById('confidenceValues').innerHTML = 
            'This is a logic node representing a ' + name
        } else {
            /*var request = new XMLHttpRequest();
            var url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=(' +
            node.data("v_name") + '%5Bgene%5D)+AND+(Homo+sapiens%5Borgn%5D)+AND+(alive%5Bprop%5D)+NOT+(newentry%5Bgene%5D)'
    
            request.open('GET', url);
            request.responseType = 'text';

            function convert_string_to_xml(to_convert) {
                
                //eSearchResult
                if (window.DOMParser) {
                    parser = new DOMParser();
                    to_convert = parser.parseFromString(to_convert, "text/xml");
                } else // Internet Explorer
                {
                    to_convert = new ActiveXObject("Microsoft.XMLDOM");
                    to_convert.async = false;
                    to_convert.loadXML(txt);
                }
                return to_convert
            }

            request.onload = function() {
                xmlDoc = convert_string_to_xml(request.response)
                /*if (window.DOMParser) {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(request.response, "text/xml");
                } else // Internet Explorer
                {
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(txt);
                }
                //if (xmlDoc.getElementsByTagName("eSearchResult")) {
                    // This is the first query to get the gene ID
                    var gene_id = xmlDoc.getElementsByTagName("Id")[0].childNodes[0].nodeValue
                    console.log(gene_id)
                    var url_fetch = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=gene&id=' +
                    gene_id + '&retmode=xml'
                    var request_fetch = new XMLHttpRequest();
                    request_fetch.open('GET', url_fetch);
                    request_fetch.responseType = 'text';
                    request_fetch.onload = function() {
                        /*if (window.DOMParser) {
                            parser = new DOMParser();
                            xml_fetch = parser.parseFromString(request_fetch.response, "text/xml");
                        } else // Internet Explorer
                        {
                            xml_fetch = new ActiveXObject("Microsoft.XMLDOM");
                            xml_fetch.async = false;
                            xml_fetch.loadXML(txt);
                        }
                        var xml_fetch = convert_string_to_xml(request_fetch.response)
                        console.log(xml_fetch.getElementsByTagName("Gene-commentary"))
                        //console.log(xml_fetch.getElementsByTagName("Translation")[0].childNodes[1].nodeValue)
                    }
                    request_fetch.send()
                };

            request.send();
    }*/
            window.open("https://www.ncbi.nlm.nih.gov/gene?term=("+ 
            node.data("v_name")+"[gene])%20AND%20(Homo%20sapiens[orgn])");
        }
        })

    cy.on("tap", "edge", function(evt) {
        document.getElementById('confidenceValues').innerHTML = ''
        var edge = evt.target
        var hg = edge.data("e_hg")
        if (hg != undefined) {
            document.getElementById('confidenceValues').innerHTML += 
                'hg: ' + hg + '\n'
        } 
        var tp = edge.data('e_tp')
        if (tp){
            document.getElementById('confidenceValues').innerHTML += 
            '\ntp: ' + tp + '\n'
        }
        var pr = edge.data('e_pr')
        if (pr) {
            document.getElementById('confidenceValues').innerHTML +=
            '\npr: ' + pr + '\n'
        }
    })

}

document.addEventListener("DOMContentLoaded", function() {
    // FIRST: check wether we are in the index page or in the tronco_visualization page
    if (document.getElementById("graphstr") != null) {
        // Visualize the result of the TRONCO computation just finished
        var graphstr = document.getElementById("graphstr").textContent;
        graphstr = graphstr.replace(/<data /g,
            "<data type = \"data\" ");
        loadgraphml(graphstr)

    } //else {
    function handleFileSelect(evt) {
        var files        
        if(evt.type === 'drop') {
            // case 1: the event is triggered by the drop_zone
            evt.stopPropagation();
            evt.preventDefault();
            files = evt.dataTransfer.files;
        } else {
            // case 2: the event is triggered by the element with ID = files
            files = evt.target.files; // FileList object
        }        
        var output = [];
        var graphstr = "";

        for (var i = 0, f; f = files[i]; i++) {
        
            var fr = new FileReader();
            fr.onload = function (e) {
                
                graphstr = fr.result; 
                // Il codice si aspetta che per gni attributo del nodo ci sia <data type = "data" key=....> invece nei grafi esportati ho solo <data key = ...
                // quindi con il replace cerco di sistemare questo problema:
                // TODO: sistemare questo codice aggiungendo un controllo per l'eventuale presenza di type = 
                graphstr = graphstr.replace(/<data /g, "<data type = \"data\" ");
                loadgraphml(graphstr)
            };
            //The FileReader object is used to read the file's content into memory.
            //When the load finishes, the reader's onload event is fired and its result 
            //attribute can be used to access the file data.
            fr.readAsText(f);
        }
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }
    
    document.getElementById('files').addEventListener('change', 
        handleFileSelect, false);

    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
    //}

});

  