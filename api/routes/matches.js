const express = require('express');
const router = express.Router();
const checkAuth =require('../middleware/auth')


const MatchesController=require('../controllers/matches');


router.get('/',MatchesController.get_all_matches);

router.post('/', checkAuth,MatchesController.create_match );

router.get('/:matchId',MatchesController.get_match)

router.delete('/:matchId',checkAuth, MatchesController.delete_match)

router.patch('/:matchId', checkAuth, MatchesController.update_match);

module.exports = router;