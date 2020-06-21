const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');

const TeamsController = require ('../controllers/teams');


router.get('/', TeamsController.teams_get_all);

router.post('/', checkAuth, TeamsController.teams_create);

router.get('/:teamId', TeamsController.get_team)

router.delete('/:teamId', checkAuth, TeamsController.delete_team)

router.patch('/:teamId', checkAuth, TeamsController.update_team);

module.exports = router;