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

x = load(json$data)
min_freq = json$filter_freq
cluster_column = strtoi(json$cluster_column) + 1
reconstruction_dir = json$reconstruction_dir
id_column = strtoi(json$id_column) + 1
separator = json$separator

## Read the cluster file
file = read.delim(json$cluster_path, sep = separator)

## Remove blank lines
# TODO: tab = tab[tab[,tab$patient_column] != '',]
tab = file[file[,cluster_column] != '' & file[, id_column] != '' ,]

## Get samples IDs and set them as row names
# PROVVISORIA:
rownames(tab) = substr(tab[, id_column], 1, 12)

# Filter samples based on one column condition
# -> TODO: chiedere la colonna su cui filtrare
# tab = tab[tab$sequenced == 1, ]
tab = tab[order(tab[, cluster_column]), ]

### Define the maps to split samples -- these are our clustering
### assignment.
gruppi = unique(tab[, cluster_column])
assign('errors', c(), env=globalenv())
for (i in 1:length(gruppi)) {
  cluster_name = as.character(gruppi[i])
  current_group = tab[as.character(tab[,cluster_column]) == cluster_name, , drop = F]
  # Before assignment replace non-alphanumeric charaters with '_'
  cluster_name = gsub("[^[:alnum:]]", "_", cluster_name)
  # Get the samples included in this cluster
  samples = rownames(current_group)
  tryCatch({ 
    subset = trim(samples.selection(MAF.GISTIC, samples))
    subset = annotate.description(subset, paste(cluster_name, 'subtype'))
    # Save cluster files
    # N.B. Creare una cartella per i cluster
    save(subset, file = paste0(reconstruction_dir, '/', cluster_name, '.RData'))
    
  }, error = function(e) {assign('errors', append(errors, cluster_name), env = globalenv())}
  )}

if (length(errors) == 0) {
  output <- list(result = 'no_errors');
} else {
   output <- list(result = 'clusters_not_found', clusters = errors)
}
print(toJSON(output));