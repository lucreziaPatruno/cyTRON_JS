#install.packages('rjson', repos = "http://cran.us.r-project.org")
#install.packages('devtools', repos = "http://cran.us.r-project.org")
#The following steps are needed to install the TRONCO package
#library(devtools)
#source("https://bioconductor.org/biocLite.R")
#biocLite("BiocInstaller")
#install_github("BIMIB-DISCo/TRONCO")
library('rjson')
library(TRONCO)

args <- commandArgs(trailingOnly = TRUE)

json <- fromJSON(args)
#TODO: create form field to specify the file name
modelName = json$modelName
output = json$output_dir
hg = json$hg
tp = json$tp
pr = json$pr
conf = c(hg, tp, pr)
conf = conf[conf != '']

load(json$modelPath)
outputFile =  paste(output, '/', modelName, '.graphml', sep = '')

export.graphml(get(modelName), outputFile, confidence = conf, scale.nodes = 0.6)
# print(args);
# print(json);
# print(args[1]);
output <- list(result = outputFile);

print(toJSON(output));
# print(result);