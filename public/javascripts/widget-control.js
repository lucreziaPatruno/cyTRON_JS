document.addEventListener("DOMContentLoaded", function() {
    
    document.getElementById('MAF').onchange = function() {
        document.getElementById('MAFinput').disabled = !this.checked;
    };
    document.getElementById('gistic').onchange = function() {
        document.getElementById('GISTICinput').disabled = !this.checked;
    };

})