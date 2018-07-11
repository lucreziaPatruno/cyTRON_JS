document.addEventListener("DOMContentLoaded", function() {
    var bic = document.getElementById('bic')
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
    })
})