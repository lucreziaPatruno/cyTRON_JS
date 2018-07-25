document.addEventListener("DOMContentLoaded", function() {
    
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
    
    document.getElementById('y_cluster').addEventListener('change', function() {
        
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


})