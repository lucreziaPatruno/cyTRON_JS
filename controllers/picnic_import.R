### Make the packages usable in the session.
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

user_directory = json$user_directory
MAF.file = json$maf_path
GISTIC.file = json$gistic_path
BOOLEAN.file = json$boolean_path
genes_interest = json$genes_interest
custom_event = json$custom_event
# TODO: ------------------
# clinical.file = json$clinical_path
# GISTIC.file = json$gistic_path
# clusters.file = json$clusters_path 
# memo.file = json$memo_path
# -------------------------

if (genes_interest != '') {
    # NOTE: questa funzione dovrebbe essere standard così, in quanto una lista di geni di interesse non dovrebbe 
    # contenere un header e i valori non devono essere convertiti in fattori. L'unica cosa da controllare è il 
    # delimitatore sep =.....
    gene.list = read.table(genes_interest, header = FALSE, stringsAsFactors = FALSE)
    gene.list = gene.list[, 1]
    filter_function = function(x){ return(x['Hugo_Symbol'] %in% gene.list) }
} else {
    filter_function = NULL
    gene.list = c()
}
#TEMPORANEO
clinical.file = ''
    if (clinical.file != '') {
        clinical.data = TCGA.map.clinical.data(file = clinical.file,
                                        column.samples = 'patient',
                                        column.map = 'tumor_stage')
    } else {
        clinical.data = ''
    }  
# TODO: sistemare il delimitatore
# If one would like to have two distinct events in the dataset, i.e., APC Missense_Mutation and APC Nonsense_Mutation,
# parameter merge.mutation.types should be set to false
MAF = NA 
GISTIC = NA
MAF.GISTIC = NA
# instatiate a Vector to keep track of the different inputs submitted
inputs = c('', '', '')
if (MAF.file != '') {
    MAF =
    import.MAF(file = MAF.file, 
               is.TCGA = TRUE,
               # sep = ';',
               filter.fun = filter_function # filter
               # merge.mutation.types = FALSE
               )

    # Check for duplicate samples. If any, remove them
    multiple = TCGA.multiple.samples(MAF)
    if (!is.na(multiple)) {
        MAF = TCGA.remove.multiple.samples(MAF)
    }
    # Shorten barcodes
    MAF = TCGA.shorten.barcodes(MAF)
    # Annotate file (if a clinical file is given)
    # We can annotated clinical stage data for a TRONCO object. We need the TCGA map patient -> stage
    if (clinical.data != '') {
        MAF = annotate.stages(MAF, clinical.data)
    }

    save(MAF, file = paste0(user_directory, '/MAF.Rdata'))
    inputs[1] = 'MAF'
}

if (GISTIC.file != '') {

    GISTIC = import.GISTIC(x = GISTIC.file, filter.genes = gene.list)

    if (clinical.data != '')
        GISTIC = annotate.stages(GISTIC, clinical.data)
    GISTIC = TCGA.shorten.barcodes(GISTIC)
    #GISTIC = annotate.description(x = GISTIC,
    #                            label = "COADREAD CNA data for driver genes")
    GISTIC = delete.type(GISTIC, 'Heterozygous Loss') # Low-level deletions.
    GISTIC = delete.type(GISTIC, 'Low-level Gain')    # Low-level amplifications.
    GISTIC = rename.type(GISTIC, 'Homozygous Loss', 'Deletion')
    GISTIC = rename.type(GISTIC, 'High-level Gain', 'Amplification')

    if (clinical.data != '') {
        GISTIC = annotate.stages(GISTIC, clinical.data)
    }

    save(GISTIC, file = paste0(user_directory, '/GISTIC.Rdata')) 
    inputs[2] = 'GISTIC'

    if (!is.na(MAF)) {
        MAF.GISTIC = intersect.datasets(GISTIC, MAF, intersect.genomes = FALSE)
        ## We remove events which have no observations in the dataset, and
        ## annotate stages
        MAF.GISTIC = trim(MAF.GISTIC)

        if (clinical.data != '')
            MAF.GISTIC = annotate.stages(MAF.GISTIC, clinical.data)

        MAF.GISTIC = annotate.description(x = MAF.GISTIC,
                                label = "MAF/CNA data for driver genes")
        save(MAF.GISTIC, file = paste0(user_directory, '/MAF.GISTIC.Rdata'))
    }
}
if (BOOLEAN.file != '') {
    
    boolean.table = read.table(BOOLEAN.file, header=TRUE, stringsAsFactors=FALSE)
    BOOLEAN = import.genotypes(boolean.table, event.type= custom_event, color='darkorange2')
    BOOLEAN = TCGA.shorten.barcodes(BOOLEAN)
    BOOLEAN = annotate.description(x = BOOLEAN, label = paste0(custom_event, 'data'))
    save(BOOLEAN, file = paste0(user_directory, '/BOOLEAN.Rdata'))
    inputs[3] = 'BOOLEAN'
    if (!is.na(MAF.GISTIC)) {
        MAF.GISTIC.BOOLEAN = intersect.datasets(MAF.GISTIC, BOOLEAN, intersect.genomes = FALSE)
        save(MAF.GISTIC.BOOLEAN, file = paste0(user_directory, '/MAF.GISTIC.BOOLEAN.Rdata'))
    }
    else if (!is.na(MAF)) {
        MAF.BOOLEAN = intersect.datasets(MAF, BOOLEAN, instersect.genomes = FALSE)
        save(MAF.BOOLEAN, file = paste0(user_directory, '/MAF.BOOLEAN.Rdata'))
    }
    else if (!is.na(GISTIC)) {
        GISTIC.BOOLEAN = instersect.datasets(GISTIC, BOOLEAN, instersect.genomes = FALSE)
        save(GISTIC.BOOLEAN, file = paste0(user_directory, '/GISTIC.BOOLEAN.Rdata'))
    } 
        


}
inputs = inputs[inputs != '']
final_to_plot = paste(inputs, collapse = '.')
output <- list(result = 'no_errors', to_plot = paste(final_to_plot, 'RData', sep = '.'))
print(toJSON(output));
