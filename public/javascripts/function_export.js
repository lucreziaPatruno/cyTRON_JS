function loadGraphml(graphstr) {
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

}
