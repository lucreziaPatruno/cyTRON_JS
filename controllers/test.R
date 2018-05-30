#install.packages('rjson', repos = "http://cran.us.r-project.org")
library('rjson')
library('TRONCO')

callTroncoPlot <- function(model, conf, dir) {
  #load(model)
  data(test_model)
  #TODO: create form field to specify the file name
  export.graphml("D:\\universita\\cytoscapeJS/modelliTRONCO/test5.graphml", scale.nodes = 0.6)
  return 'ciao'
}

args <- commandArgs(trailingOnly = TRUE)

json <- fromJSON(args)

# print(args);
# print(json);
# print(args[1]);
ret <- callTroncoPlot(json$model, as.numeric(json$conf), json$dir)

output <- list(result = ret);

print(toJSON(output));
# print(result);