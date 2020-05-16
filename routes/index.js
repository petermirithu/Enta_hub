var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
  var username=null;
  if (req.user){
    username=req.user.username
  }
  res.render('index',{ username:username });
  
});



module.exports = router;
