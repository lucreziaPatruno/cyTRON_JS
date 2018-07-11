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

input = load(json
$model)
model_caprese = tronco.caprese(input)
dir = json$directory

save(model_caprese, file = paste0(dir, '/model_caprese.Rdata'))

output <- list(result = 'no_errors'))
print(toJSON(output));