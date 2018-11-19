var express = require('express');
var router = express.Router();

var welcome_controller = require('../controllers/welcome_controller');
var tronco_controller = require('../controllers/tronco_plot_controller');
var widget = require('../controllers/tronco_widget_controller')
 
router.get('/tronco/troncoPlot', tronco_controller.plot_graph_get);

router.post('/tronco/troncoPlot', tronco_controller.plot_graph_post);

router.get('/', welcome_controller.start_widget_get)

// Funzione che dovrebbe gestire l'azione di login
router.post('/', welcome_controller.start_widget_post)

router.get('/visualization', welcome_controller.visualize_model)

router.get('/signup', welcome_controller.signup_get)

router.post('/signup', welcome_controller.signup_post)

router.post('/visualize_public', widget.visualize_public_post)

module.exports = router;