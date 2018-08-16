# cyTRON/JS

cyTRON in an application for cancer progression analysis. It is an interface to the R library **TRONCO** and it supports both the visualization of already constructed models and the creation of new analysis. 

## Getting started
This application has been developed using NodeJS. In order to run it it is necessary to install the following:
* Node.js
* R
* Java: make sure that the enviroment variables are set properly ([MAC](https://www.ibm.com/support/knowledgecenter/en/SSPT3X_3.0.0/com.ibm.swg.im.infosphere.biginsights.install.doc/doc/install_install_r.html), [Windows](https://docs.oracle.com/javase/tutorial/essential/environment/paths.html))

### Installing

* Clone this repository in a folder in your local machine
* Open the command prompt and cd into the folder
* Run the command `npm install`
* Type the following: `npm start`
* For the time being, open the browser and navigate to http://localhost:3000/. 

Note: no additional R package is necessary, any missing package will be automatically installed on the application's first run.

### Google Summer of Code
cyTRON/JS was developed within the GSoC 2018 program, in collaboration with the NRNB organization.

During the program the following functionalities have been implemented:
 * Graph visualization and manipulation: this was accomplished using Cytoscape.js and its extensions.
 * Javascript-R communication: this was accomplished using the npm package `js-call-r`. In particular it is possible to: 
   * select input data in the formats suported by TRONCO (MAF, GISTIC and a custom boolean table)
   * Select an input file with driver mutations
   * Select a file with information about clusters into which the data needs to be splitted
   * Reconstruct the model using TRONCO's algorithms
   * Visualize the contructed model.

### Project structure
The web application was built using the Framework `Express`. The code is divided as follows:
* **Controller**: this is the folder where the functions to hadle the different HTTP requests are implemented. In particular it contains the R and JavaScript code necessary for the communication between cyTRON/JS and TRONCO.
* **View**: this is the folder which contains the interface.
* **Routes**: in this folder there is the code which maps each HTTP request to the corresponding function in the controller.
* **Public**: this is the folder which contains CSS and client-side JavaScript, which handles graph visualization.
