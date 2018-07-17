var express = require('express');
var router = express.Router();
var widget = require('../controllers/tronco_widget_controller')

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

router.get('/', widget.tronco_widget_get)

router.post('/', widget.tronco_widget_post)

router.get('/user_options', widget.show_options_get)

router.post('/user_options', widget.show_options_post)

router.get('/files_loaded', widget.files_loaded_get)

router.post('/files_loaded/capri', widget.files_loaded_capri_post)

router.post('/files_loaded/caprese', widget.files_loaded_caprese_post)

router.get('/cluster_selection', widget.select_clusters_get)

router.post('/cluster_selection', widget.select_clusters_post)

module.exports = router;
