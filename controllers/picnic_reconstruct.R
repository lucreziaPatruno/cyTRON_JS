library(devtools)
#library(pheatmap)
#library(gridExtra)
#library(vioplot)
#library(xlsx)
library(TRONCO)
library(rjson)
# Retrieve the arguments
args <- commandArgs(trailingOnly = TRUE)
json <- fromJSON(args)
method = json$method
input = load(json$model)
input = get(input)
dir = json$directory
name = json$name
min_freq = json$filter_freq

if (min_freq != '') {
    min_freq = strtoi(min_freq)
    input = events.selection(input, filter.freq = min_freq)
}
 
result_dir = json$result_dir

if (method == 'capri') {
    bic = json$bic
    aic = json$aic
    comm = json$command
    bootstrap = json$bootstrap
    
    if (bootstrap == 'yes') bootstrap = TRUE else bootstrap = FALSE
    reg = c(bic, aic)
    reg = reg[reg != '']
    if (length(reg) == 0) {
        reg = c('bic', 'aic')
    }
    mutex_path = json$mutex
     
    if (mutex_path != '') {
        mutex = import.mutex.groups(json$mutex)
        for (w in mutex) {
            input = hypothesis.add.group(input, 
                                        FUN = OR,  # formula type is "soft exclusivity" (OR)
                                        group = w, # the group
                                        dim.min = length(w) # only 1 group has maximal length  
                                        ) 
        }
    }
    model_capri = tronco.capri(input, command = comm, regularization = reg, do.boot = bootstrap)
    save(model_capri, file = paste0(result_dir, '/', name, '_capri.Rdata'))
    
}
if (method == 'caprese') {
    model_caprese = tronco.caprese(input)
    save(model_caprese, file = paste0(result_dir, '/', name, '_caprese.Rdata'))
}

# model_caprese = tronco.caprese(get(input))




output <- list(result = 'no_errors')
print(toJSON(output));