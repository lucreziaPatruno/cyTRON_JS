var express = require('express');
var router = express.Router();

var welcome_controller = require('../controllers/welcome_controller');
var tronco_controller = require('../controllers/tronco_controller');
// GET catalog home page.
router.get('/', welcome_controller.index);
 
router.get('/tronco/troncoPlot', tronco_controller.plot_graph_get);

router.post('/tronco/troncoPlot', tronco_controller.plot_graph_post);

module.exports = router;