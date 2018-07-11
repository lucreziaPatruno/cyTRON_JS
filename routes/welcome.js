var express = require('express');
var router = express.Router();

var welcome_controller = require('../controllers/welcome_controller');
var tronco_controller = require('../controllers/tronco_controller');
var widget = require('../controllers/tronco_widget_controller')
// GET catalog home page.
router.get('/', welcome_controller.index);
 
router.get('/tronco/troncoPlot', tronco_controller.plot_graph_get);

router.post('/tronco/troncoPlot', tronco_controller.plot_graph_post);

router.get('/start', widget.start_widget_get)

router.post('/start', widget.start_widget_post)



module.exports = router;