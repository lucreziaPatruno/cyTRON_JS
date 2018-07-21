library(devtools)
library(pheatmap)
library(gridExtra)
library(vioplot)
library(xlsx)
library(TRONCO)
library(rjson)
# Retrieve the arguments
args <- commandArgs(trailingOnly = TRUE)
json <- fromJSON(args)
method = json$method
input = load(json$model)
dir = json$directory
name = json$name
bic = json$bic
aic = json$aic
comm = json$command
bootstrap = json$bootstrap
result_dir = json$result_dir

if (bootstrap == 'yes') bootstrap = TRUE else bootstrap = FALSE
reg = c(bic, aic)
reg = reg[reg != '']
if (length(reg) == 0) {
    reg = c('bic', 'aic')
}
if (method == 'capri') {
    model_capri = tronco.capri(get(input), command = comm, regularization = reg, do.boot = bootstrap)
    save(model_capri, file = paste0(result_dir, '/', name, '_capri.Rdata'))
    
}
if (method == 'caprese') {
    model_caprese = tronco.caprese(get(input))
    save(model_capri, file = paste0(result_dir, '/caprese_', name, '_caprese.Rdata'))
}

# model_caprese = tronco.caprese(get(input))




output <- list(result = 'no_errors')
print(toJSON(output));