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
model = load(json$modelPath)

prima_facie = json$pf

session = json$sess_id
outputFile =  paste(output, '/', modelName, '.graphml', sep = '')

export.graphml(get(model), file = outputFile, confidence = conf, scale.nodes = 0.6, pf = prima_facie)
# print(args);
# print(json);
# print(args[1]);
output <- list(result = outputFile, status = 'no_errors');

print(toJSON(output));
# print(result);