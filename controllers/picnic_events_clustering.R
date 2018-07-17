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
cluster_col = strtoi(json$cluster_column) + 1
reconstruction_dir = json$reconstruction_dir
id_column = strtoi(json$id_column) + 1
separator = json$separator

## Read the cluster file
file = read.delim(json$cluster_path, sep = separator)

## Remove blank lines
# TODO: tab = tab[tab[,tab$patient_column] != '',]
tab = file[file[,1] != '',]

## Get samples IDs and set them as row names
# PROVVISORIA:
rownames(tab) = substr(tab[, id_column], 1, 12)

# Filter samples based on one column condition
# -> TODO: chiedere la colonna su cui filtrare
# tab = tab[tab$sequenced == 1, ]
tab = tab[order(tab[, cluster_col]), ]

### Define the maps to split samples -- these are our clustering
### assignment.
gruppi = unique(tab[, cluster_col])
groups = c()
for (i in 1:length(gruppi)) {
  cluster_name = as.character(gruppi[i])
  current_group = tab[tab[,cluster_col] == cluster_name, , drop = F]
  # Before assignment replace non-alphanumeric charaters with '_'
  cluster_name = gsub("[^[:alnum:]]", "_", cluster_name)
  # groups = append(groups, list(current_group))
  # Get the samples included in this cluster
  samples = rownames(current_group)
  subset = trim(samples.selection(get(x), samples))
  subset = annotate.description(subset, paste(cluster_name, ' subtype'))
  # Save cluster files
  # N.B. Creare una cartella per i cluster
  save(subset, file = paste0(reconstruction_dir, '/', cluster_name, '.RData'))
}

output <- list(result = 'no_errors');
print(toJSON(output));