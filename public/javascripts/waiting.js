document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('btn_sub').addEventListener('click', function() {
        document.getElementById('waiting_area').innerHTML = 'ciao'
    })

    document.getElementById('y_cluster').addEventListener('change', function() {
        if (!this.checked) {
            document.getElementById('CLUSTERinput').disabled = true
        } else {
            document.getElementById('CLUSTERinput').disabled = false
        }
    })

})