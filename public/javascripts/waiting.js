document.addEventListener("DOMContentLoaded", function() {

    document.getElementById('helpIcon').addEventListener('click', function() {
        document.getElementById('info_div').style.display = 'block'
    })

    document.getElementById('close_info').addEventListener('click', function() {
        document.getElementById('info_div').style.display = 'none'
    })
    
    document.getElementById('MAFinput').disabled = true
    document.getElementById('file_maf').style.opacity = 0.7

    document.getElementById('maf_separator_selection').disabled = true
    document.getElementById('sep_maf').style.opacity = 0.7

    document.getElementById('GISTICinput').disabled = true
    document.getElementById('file_gistic').style.opacity = 0.7

    document.getElementById('gistic_separator_selection').disabled = true
    document.getElementById('sep_gistic').style.opacity = 0.7

    document.getElementById('BOOLEANinput').disabled = true
    document.getElementById('file_boolean').style.opacity = 0.7

    document.getElementById('boolean_separator_selection').disabled = true
    document.getElementById('sep_boolean').style.opacity = 0.7

    document.getElementById('CLUSTERinput').disabled = true
    document.getElementById('file_cluster').style.opacity = 0.7

    document.getElementById('cl_separator_selection').disabled = true
    document.getElementById('sep_cluster').style.opacity = 0.7

    document.getElementById('INTERESTinput').disabled = true
    document.getElementById('file_interest').style.opacity = 0.7
    
    document.getElementById('cluster').addEventListener('change', function() {
        
        if (!this.checked) {
            document.getElementById('CLUSTERinput').disabled = true
            document.getElementById('cl_separator_selection').disabled = true
            document.getElementById('file_cluster').style.opacity = 0.7
            document.getElementById('sep_cluster').style.opacity = 0.7
           
        } else {
            document.getElementById('CLUSTERinput').disabled = false
            document.getElementById('cl_separator_selection').disabled = false
            document.getElementById('file_cluster').style.opacity = 1
            document.getElementById('sep_cluster').style.opacity = 1

        }
    })
    document.getElementById('interest').addEventListener('change', function() {
        if (!this.checked) {
            document.getElementById('file_interest').style.opacity = 0.7
            document.getElementById('INTERESTinput').disabled = true
        } else {
            document.getElementById('file_interest').style.opacity = 1
            document.getElementById('INTERESTinput').disabled = false
        }
    })
    document.getElementById('MAF').addEventListener('change', function() {
        
        if (!this.checked) {
            document.getElementById('MAFinput').disabled = true
            document.getElementById('maf_separator_selection').disabled = true
            document.getElementById('file_maf').style.opacity = 0.7
            document.getElementById('sep_maf').style.opacity = 0.7
           
        } else {
            document.getElementById('MAFinput').disabled = false
            document.getElementById('maf_separator_selection').disabled = false
            document.getElementById('file_maf').style.opacity = 1
            document.getElementById('sep_maf').style.opacity = 1

        }
    })
    document.getElementById('gistic').addEventListener('change', function() {
        
        if (!this.checked) {
            document.getElementById('GISTICinput').disabled = true
            document.getElementById('gistic_separator_selection').disabled = true
            document.getElementById('file_gistic').style.opacity = 0.7
            document.getElementById('sep_gistic').style.opacity = 0.7
           
        } else {
            document.getElementById('GISTICinput').disabled = false
            document.getElementById('gistic_separator_selection').disabled = false
            document.getElementById('file_gistic').style.opacity = 1
            document.getElementById('sep_gistic').style.opacity = 1

        }
    })
    document.getElementById('boolean').addEventListener('change', function() {
        
        if (!this.checked) {
            document.getElementById('BOOLEANinput').disabled = true
            document.getElementById('boolean_separator_selection').disabled = true
            document.getElementById('file_boolean').style.opacity = 0.7
            document.getElementById('sep_boolean').style.opacity = 0.7
           
        } else {
            document.getElementById('BOOLEANinput').disabled = false
            document.getElementById('boolean_separator_selection').disabled = false
            document.getElementById('file_boolean').style.opacity = 1
            document.getElementById('sep_boolean').style.opacity = 1

        }
    })

    var maf_input = document.getElementById('MAFinput'); /* finds the input */

    function changeLabelText() {
        var maf_value = maf_input.value; /* gets the filepath and filename from the input */
        
        var fileNameStart = maf_value.includes('\\') ? maf_value.lastIndexOf('\\') : maf_value.lastIndexOf('/') /* finds the end of the filepath */
        maf_value = maf_value.substr(fileNameStart + 1); /* isolates the filename */
        var maf_label = document.getElementById('MAFlabel'); /* finds the label text */
        console.log(maf_value)
        if (maf_value !== '') {
            maf_label.textContent = maf_value; /* changes the label text */
        }
    }

    maf_input.addEventListener('change',changeLabelText,false); /* runs the function whenever the filename in the input is changed */

    var gistic_input = document.getElementById('GISTICinput'); /* finds the input */

    gistic_input.addEventListener('change', function() {
        var gistic_value = gistic_input.value; /* gets the filepath and filename from the input */
        var fileNameStart = gistic_value.includes('\\') ? gistic_value.lastIndexOf('\\') : gistic_value.lastIndexOf('/'); /* finds the end of the filepath */
        gistic_value = gistic_value.substr(fileNameStart + 1); /* isolates the filename */
        var gistic_label = document.getElementById('GISTIClabel') /* finds the label text */
        if (gistic_value !== '') {
            gistic_label.textContent = gistic_value; /* changes the label text */
        }
    })

    var boolean_input = document.getElementById('BOOLEANinput'); /* finds the input */
    boolean_input.addEventListener('change', function() {
        var boolean_value = boolean_input.value; /* gets the filepath and filename from the input */
        var fileNameStart = boolean_value.includes('\\') ? boolean_value.lastIndexOf('\\') : boolean_value.lastIndexOf('/'); /* finds the end of the filepath */
        boolean_value = boolean_value.substr(fileNameStart + 1); /* isolates the filename */
        var boolean_label = document.getElementById('BOOLEANlabel') /* finds the label text */
        if (boolean_value !== '') {
            boolean_label.textContent = boolean_value; /* changes the label text */
        }
    })

    var interest_input = document.getElementById('INTERESTinput'); /* finds the input */
    interest_input.addEventListener('change', function() {
        var interest_value = interest_input.value; /* gets the filepath and filename from the input */
        var fileNameStart = interest_value.includes('\\') ? interest_value.lastIndexOf('\\') : interest_value.lastIndexOf('/'); /* finds the end of the filepath */
        interest_value = interest_value.substr(fileNameStart + 1); /* isolates the filename */
        var interest_label = document.getElementById('INTERESTlabel') /* finds the label text */
        if (interest_value !== '') {
            interest_label.textContent = interest_value; /* changes the label text */
        }
    })

    var cluster_input = document.getElementById('CLUSTERinput'); /* finds the input */
    cluster_input.addEventListener('change', function() {
        var cluster_value = cluster_input.value; /* gets the filepath and filename from the input */
        var fileNameStart = cluster_value.includes('\\') ? cluster_value.lastIndexOf('\\') : cluster_value.lastIndexOf('/'); /* finds the end of the filepath */
        cluster_value = cluster_value.substr(fileNameStart + 1); /* isolates the filename */
        var cluster_label = document.getElementById('CLUSTERlabel') /* finds the label text */
        if (cluster_value !== '') {
            cluster_label.textContent = cluster_value; /* changes the label text */
        }
    })

    function carouselNormalization() {
        var items = $('#myCarousel'), //grab all slides
            heights = [], //create empty array to store height values
            tallest; //create variable to make note of the tallest slide
        console.log('!!!!!!' + items.length)
        if (items.length) {
            function normalizeHeights() {
                items.each(function() { //add heights to array
                    heights.push($(this).height()); 
                });
                console.log(heights)
                tallest = Math.max.apply(null, heights); //cache largest value
                items.each(function() {
                    $(this).css('min-height',tallest + 'px');
                });
            };
            normalizeHeights();
        
            $(window).on('resize orientationchange', function () {
                tallest = 0, heights.length = 0; //reset vars
                items.each(function() {
                    $(this).css('min-height','0'); //reset min-height
                }); 
                normalizeHeights(); //run it again 
            });
        }
        }
    carouselNormalization()
})