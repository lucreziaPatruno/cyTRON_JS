document.addEventListener("DOMContentLoaded", function() {
    var cluster_selection = document.getElementById('cluster_selection')
    var id_selection = document.getElementById('id_selection')
    document.getElementById('submit_button').disabled = true
    document.getElementById('submit_div').style.opacity = 0.7

    function disable_submit() {
        if (cluster_selection.value == '--Select column name--' || id_selection.value == '--Select column name--') {
            document.getElementById('submit_button').disabled = true
            document.getElementById('submit_div').style.opacity = 0.7
        } else {
            document.getElementById('submit_button').disabled = false
            document.getElementById('submit_div').style.opacity = 1
        }
        
    }

    cluster_selection.addEventListener('change', disable_submit, false)
    
    id_selection.addEventListener('change', disable_submit, false)

})