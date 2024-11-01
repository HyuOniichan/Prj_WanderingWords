const router = require('express').Router(); 
const blogController = require('../controllers/blogController');

router.get(`/:id`, blogController.showOne)
router.get(`/`, blogController.show)
router.post(`/`, blogController.create)

module.exports = router; 
