var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  //res.send('respond with a resource');
  const user = {
    id:1,
    username:'user1',
    password:'user123',
    type:'ADMIN'
  }
  jwt.sign({user},'secretKey',(err,token)=>{
      res.json({
        token
      });
  });
});

router.get('/view',verifyToken, function(req, res, next) {

  jwt.verify(req.token,'secretKey',(err,authData) =>{
    if(err){
      res.sendStatus(403);
    }else{
      console.log(req.token)
      res.send('respond with a resource');
      authData
    }
  })

});

function verifyToken(req,res,next){
  const bearerHeader = req.headers['authorization'];
  //console.log(bearerHeader);
  if(typeof bearerHeader!=='undefined'){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }else{
    res.sendStatus(403);
  }
}
//router.get('',function(req,res,next))
module.exports = router;
