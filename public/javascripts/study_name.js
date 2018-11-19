document.addEventListener("DOMContentLoaded", function() {
    var visualize_div = document.getElementById('visualize_constructed_div')
    var visualize_btn = document.getElementById('visualize_constructed_btn')
    var visualize_selection = document.getElementById('private_selection')

    var analysis_div = document.getElementById('analysis_selection_div')
    var analysis_btn = document.getElementById('analysis_selection_btn')
    var analysis_selection = document.getElementById('analysis_selection')

    var start_div = document.getElementById('start_analysis_div')
    var start_btn = document.getElementById('start_analysis_btn')
    var input_name = document.getElementById('inputName')

    visualize_btn.disabled = true
    visualize_div.style.opacity = 0.7

    analysis_div.style.opacity = 0.7
    analysis_btn.disabled = true

    start_div.style.opacity = 0.7
    start_btn.disabled = true

    visualize_selection.addEventListener('change', function(){
        if (visualize_selection.value == '--Select graph--') {
            visualize_div.style.opacity = 0.7
            visualize_btn.disabled = true
        } else {
            visualize_div.style.opacity = 1
            visualize_btn.disabled = false
        }
    }) 

    analysis_selection.addEventListener('change', function() {
        if (analysis_selection.value == '--Select analysis--') {
            analysis_div.style.opacity = 0.7
            analysis_btn.disabled = true
        } else {
            analysis_div.style.opacity = 1
            analysis_btn.disabled = false
        }
    })

    input_name.addEventListener('keyup', function() {
        if (input_name.value.search(/\*|\\|\/|:|\?|"|<|>|\|/) != -1) {
            start_div.style.opacity = 0.7
            start_btn.disabled = true
            document.getElementById('type_error').innerText = 'Error, analysis name should not contain any of these characters: *, \\, /, :, ?, ", <, >, |'
        } else {
            document.getElementById('type_error').innerText = ''
            if (input_name.value == '') {
                start_div.style.opacity = 0.7
                start_btn.disabled = true
            } else {
                start_div.style.opacity = 1
                start_btn.disabled = false
            }
        }
        
    })
})