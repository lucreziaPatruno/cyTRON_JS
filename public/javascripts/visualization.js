document.addEventListener("DOMContentLoaded", function() {
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

                                'target-arrow-fill' : 'filled'
                            }
                        },
                        {
                        selector: ':selected',
                        style: {
                        }
                    }

                    ],
                    /*    
                    ready: function () {               
                        this.graphml(graphstr);
                        // console.log(this.graphml());
                    }*/

                });

                // per il layout: breadthfirst per ora è il migliore
                var options = {
                    name : 'dagre'
                }
                
                cy.graphml(graphstr);
                cy.layout(options).run();
                cy.panzoom({});

                //cy.nodes().on("click", function(){})
                cy.on("tap", "node", function(evt) {
                    var node = evt.target;
                    console.log( 'tapped ' + node.data("v_name") );
                    window.open("https://www.ncbi.nlm.nih.gov/gene?term=("+node.data("v_name")+"[gene])%20AND%20(Homo%20sapiens[orgn])");
                })

                
            };
            //The FileReader object is used to read the file's content into memory.
            //When the load finishes, the reader's onload event is fired and its result 
            //attribute can be used to access the file data.
            fr.readAsText(f);
        }
        
        //document.getElementById('list').innerHTML = '<div>' + graphstr + '<div>';
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }
    
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
  });