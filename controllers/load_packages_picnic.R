if (!require('devtools'))
    install.packages('devtools', dependencies = T, repos = 'http://cran.us.r-project.org')

#if (!require('pheatmap'))
    #install.packages('pheatmap', dependencies = T, repos="http://cran.us.r-project.org")

#if (!require('gridExtra'))
    #install.packages('gridExtra', dependencies = T, repos = 'http://cran.us.r-project.org')

#if (!require('vioplot'))
    #install.packages('vioplot', dependencies = T, repos = 'http://cran.us.r-project.org')

#if (!require('xlsx'))
    #install.packages('xlsx', dependencies = T, repos = 'http://cran.us.r-project.org')

if(!require('rjson'))
    install.packages('rjson', dependencies = T, repos = 'http://cran.us.r-project.org')


if (!require('TRONCO')) {
    library(devtools)
    source("https://bioconductor.org/biocLite.R")
    biocLite("BiocInstaller", suppressUpdates = TRUE, ask = FALSE)
    install_github("BIMIB-DISCo/TRONCO")
}
    
### Make the packages usable in the session.
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

directory = json$working_directory

workdir = paste(directory,  "/TCGA-data/", sep = '')
# dir.create(workdir)

output <- list(result = workdir);

print(toJSON(output));