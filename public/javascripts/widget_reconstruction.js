document.addEventListener("DOMContentLoaded", function() {
    /*var bic = document.getElementById('bic')
    var aic = document.getElementById('aic')

    // var hc = document.getElementById('hc').checked = "true"
    bic.addEventListener('change',  function() {
        if (bic.checked)
            aic.checked = "false"
        else
            aic.checked = "true"
    })

    aic.addEventListener('change',  function() {
        if (aic.checked)
            bic.checked = "false"
        else
            bic.checked = "true"
    })*/
    
    var select_cluster = document.getElementById('cluster_selection')
    document.getElementById('capri_submit').disabled = true
    document.getElementById('capri_submit_div').style.opacity = 0.7

    document.getElementById('capri_parameters').disabled = true
    document.getElementById('capri_parameters_div').style.opacity = 0.7
    
    document.getElementById('caprese_submit').disabled = true
    document.getElementById('caprese_submit_div').style.opacity = 0.7

    document.getElementById('MUTEXinput').disabled = true
    document.getElementById('file_mutex').style.opacity = 0.7

    document.getElementById('MUTEX').addEventListener('change', function() {
        if (!this.checked) {
            document.getElementById('file_mutex').style.opacity = 0.7
            document.getElementById('MUTEXinput').disabled = true
        } else {
            document.getElementById('file_mutex').style.opacity = 1
            document.getElementById('MUTEXinput').disabled = false
        }
    })
    
    select_cluster.addEventListener('change', function(){
        if (select_cluster.value == '--Select cluster--') {
            document.getElementById('capri_submit').disabled = true
            document.getElementById('capri_submit_div').style.opacity = 0.7

            document.getElementById('capri_parameters').disabled = true
            document.getElementById('capri_parameters_div').style.opacity = 0.7
            
            document.getElementById('caprese_submit').disabled = true
            document.getElementById('caprese_submit_div').style.opacity = 0.7

        } else {
            document.getElementById('capri_submit').disabled = false
            document.getElementById('capri_submit_div').style.opacity = 1

            document.getElementById('capri_parameters').disabled = false
            document.getElementById('capri_parameters_div').style.opacity = 1
            
            document.getElementById('caprese_submit').disabled = false
            document.getElementById('caprese_submit_div').style.opacity = 1
        }

    })
})