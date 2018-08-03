document.addEventListener("DOMContentLoaded", function() {
loadgraphml = function(graphstr) {
    // A new model has been chosen, so all the information about the previous one need to be deleted:
    document.getElementById('temporary_label').style.visibility = 'visible'
    document.getElementById('table_nodes').style.display = 'none'
    document.getElementById('table_logic').style.display = 'none'
    document.getElementById('hg_row').style.display = 'none'
    document.getElementById('tp_row').style.display = 'none'
    document.getElementById('pr_row').style.display = 'none'
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
    /*var one = document.getElementById('1')
    one.style.visibility = 'visible'
    document.getElementById('2').style.visibility = 'visible'
    document.getElementById('info').style.visibility = 'visible'
    document.getElementById('Official_Symbol').style.visibility = 'visible'*/
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
        var logic = ["AND", "OR", "NOT", "XOR", "*", "UPAND", "UPOR", "UPXOR"]
        var node = evt.target;
        name = node.data("v_name")
        //console.log( 'tapped ' + node.data("v_name") );
        if (logic.includes(name)) {
            // Case when the node clicked is a logic node
            // Reset visibility of the other tables
            document.getElementById('table_nodes').style.display = 'none'
            document.getElementById('temporary_label').style.visibility = 'hidden'
            document.getElementById('table_edges').style.display = 'none'

            document.getElementById('table_logic').style.display = 'table'
            document.getElementById('logic_description').innerText = 'Logic node representing a ' + name
        } else {
            // This is the case when the node clicked is a gene node
            // Reset visibility of the other tables
            document.getElementById('table_nodes').style.display = 'none'
            document.getElementById('table_logic').style.display = 'none'
            document.getElementById('temporary_label').style.visibility = 'hidden'
            document.getElementById('table_edges').style.display = 'none'
            document.getElementById('loading_button').style.display = 'flex'
            var request = new XMLHttpRequest();
            var url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=(' +
            node.data("v_name") + '%5Bgene%5D)+AND+(Homo+sapiens%5Borgn%5D)+AND+(alive%5Bprop%5D)+NOT+(newentry%5Bgene%5D)'
    
            request.open('GET', url);
            request.responseType = 'text';

            function convert_string_to_xml(to_convert) {
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
                    // This is the first query to get the gene ID
                    var gene_id = xmlDoc.getElementsByTagName("Id")[0].childNodes[0].nodeValue
                    var url_fetch = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=gene&id=' +
                    gene_id + '&retmode=xml'
                    var request_fetch = new XMLHttpRequest();
                    request_fetch.open('GET', url_fetch);
                    request_fetch.responseType = 'text';
                    request_fetch.onload = function() {
                        // Get the xml with all the information about the gene
                        var xml_fetch = convert_string_to_xml(request_fetch.response)
                        // Now get the tag containing information about gene symbol and full name
                        var commentaries = xml_fetch.getElementsByTagName("Gene-commentary_properties")[0]
                        // Get the tags inside commentaries
                        commentaries = commentaries.getElementsByTagName("Gene-commentary")
                        commentaries = Array.from(commentaries)
                        // There are two tags: one for the official simbol and the other for full name
                        // Get tag containing full name
                        var full_name = commentaries.filter(comment => 
                            comment.getElementsByTagName("Gene-commentary_label")[0].childNodes[0].nodeValue == 'Official Full Name')
                        full_name = full_name[0].getElementsByTagName("Gene-commentary_text")[0].childNodes[0].nodeValue
                        console.log(full_name)
                        document.getElementById('loading_button').style.display = 'none'
                        document.getElementById('table_nodes').style.display = 'table'
                        document.getElementById("official_name").innerText = full_name
                        // Get tag contaning official symbol
                        var symbol = commentaries.filter(comment => 
                            comment.getElementsByTagName("Gene-commentary_label")[0].childNodes[0].nodeValue == 'Official Symbol')
                        symbol = symbol[0].getElementsByTagName("Gene-commentary_text")[0].childNodes[0].nodeValue
                        document.getElementById("symbol").innerText = symbol
                        
                        // Now get the gene type
                        var type = xml_fetch.getElementsByTagName("Entrezgene_type")[0].getAttribute('value')
                        document.getElementById('type').innerText = type

                        // Get gene description
                        var desc = xml_fetch.getElementsByTagName("Entrezgene_summary")[0].childNodes[0].nodeValue
                        if (desc.length > 100) {
                            document.getElementById('description').innerHTML = 
                            desc.substring(0, 50) +
                            "...<a style='color:white' id = 'full_description' href=#>[see all]</a>"
                        } else {
                            document.getElementById('description').innerText = desc
                        }
                        document.getElementById('full_description').addEventListener('click', function(){
                            document.getElementById('description').innerHTML = 
                            desc + 
                            "<a style='color:white' id = 'reduce_description' href=#>[reduce]</a>"
                            document.getElementById('reduce_description').addEventListener('click', function(){
                                document.getElementById('description').innerHTML = 
                                desc.substring(0, 50) +
                                "...<a style='color:white' id = 'full_description' href=#>[see all]</a>"
                            })
                        })
                        
                            
                        
                        
                    }
                    request_fetch.send()
                };

            request.send();
        }
            //window.open("https://www.ncbi.nlm.nih.gov/gene?term=("+ 
            //node.data("v_name")+"[gene])%20AND%20(Homo%20sapiens[orgn])");
    })

    cy.on("tap", "edge", function(evt) {
        // Reset elements visibility
        document.getElementById('temporary_label').style.visibility = 'hidden'
        document.getElementById('table_nodes').style.display = 'none'
        document.getElementById('table_logic').style.display = 'none'
        document.getElementById('hg_row').style.display = 'none'
        document.getElementById('tp_row').style.display = 'none'
        document.getElementById('pr_row').style.display = 'none'
        document.getElementById('no_conf_row').style.display = 'none'
        // Make edge table visible
        document.getElementById('table_edges').style.display = 'table'
        var edge = evt.target
        var hg = edge.data("e_hg")
        if (hg) {
            document.getElementById('hg_row').style.display = 'table-row'
            document.getElementById('hg_value').innerText = hg
        } 
        var tp = edge.data('e_tp')
        if (tp){
            document.getElementById('tp_row').style.display = 'table-row'
            document.getElementById('tp_value').innerText = tp
        }
        var pr = edge.data('e_pr')
        if (pr) {
            document.getElementById('pr_row').style.display = 'table-row'
            document.getElementById('pr_value').innerText = pr
        }
        if (!(hg || tp || pr)) {
            document.getElementById('no_conf_row').style.display = 'table-row'
        }
    })

}

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

  