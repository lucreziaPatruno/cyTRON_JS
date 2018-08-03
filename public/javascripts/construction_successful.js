document.addEventListener("DOMContentLoaded", function() {
    var cluster_selection = document.getElementById('cluster_selection')

    document.getElementById('submit').disabled = true
    document.getElementById('submit_div').style.opacity = 0.7

    function disable_submit() {
        if (cluster_selection.value == '--Select model name--') {
            document.getElementById('submit').disabled = true
            document.getElementById('submit_div').style.opacity = 0.7
        } else {
            document.getElementById('submit').disabled = false
            document.getElementById('submit_div').style.opacity = 1
        }
       
    }

    cluster_selection.addEventListener('change', disable_submit, false)
})