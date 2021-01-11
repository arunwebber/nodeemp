var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
    users = require('./users');
    jwt = require('jsonwebtoken');
    router.use(bodyParser.urlencoded({ extended: true }))
    router.use(methodOverride(function(req, res){
          if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method
            delete req.body._method
            return method
          }
    }))


    //build the REST operations at the base for blob
    router.route('/')
        //GET all blobs
        .get(verifyToken,function(req, res, next) {

            jwt.verify(req.token,'secretKey',(err,authData) =>{
              if(err){
                console.log(req.token)
                res.sendStatus(403);
              }else{
                //retrieve all blobs from Monogo
                mongoose.model('Company').find({}, function (err, blobs) {
                      if (err) {
                          return console.error(err);
                      } else {
                        res.send(JSON.stringify({
                           blobs
                        }));
                      }
                });
              }
            })


        });



/* GET New Blob page. */
router.post('/new',verifyToken, function(req, res) {
  jwt.verify(req.token,'secretKey',(err,authData) =>{
    if(err){
      res.sendStatus(403);
    }else{
      // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
      let name = req.body.name;
      let email = req.body.email;
      let phone = req.body.phone;
      let department = req.body.department;
      let state = req.body.state;
      let city = req.body.city;
      let zip = req.body.zip;
      let dob = req.body.dob;
      //call the create function for our database
      mongoose.model('Company').create({
          name : name,
          email :email,
          phone: phone,
          department: department,
          state: state,
          city: city,
          zip:zip,
          dob : dob,
      }, function (err, blob) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Blob has been created
                console.log('POST creating new blob: ' + blob);
                res.send(JSON.stringify({
                   status:"Success"
                }));
            }
      })
    }
  })


    //res.render('Companys/new', { title: 'Add New Blob' });
});


router.route('/:id')
  .get(verifyToken,function(req, res) {
    jwt.verify(req.token,'secretKey',(err,authData) =>{
      if(err){
        res.sendStatus(403);
      }else{
        mongoose.model('Company').findById(req.params.id, function (err, blob) {
          if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
          } else {
            //console.log('GET Retrieving ID: ' + blob._id);
            res.send(JSON.stringify({
               blob
            }));
          }
        });
      }
    })

  });


  //GET the individual blob by Mongo ID
router.get('/:id/edit',verifyToken, function(req, res) {
  jwt.verify(req.token,'secretKey',(err,authData) =>{
    if(err){
      res.sendStatus(403);
    }else{
      //params: { id:
        console.log('id',req.params.id)
        //search for the blob within Mongo
        mongoose.model('Company').findById(req.params.id, function (err, blob) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                //Return the blob
                console.log('GET Retrieving ID for edit: ' + blob);
            }
        });
    }
  })

});


//PUT to update a blob by ID
router.put('/:id/edit',verifyToken, function(req, res) {
  jwt.verify(req.token,'secretKey',(err,authData) =>{
    if(err){
      res.sendStatus(403);
    }else{
      console.log('Ok1');
      // Get our REST or form values. These rely on the "name" attributes
      let name = req.body.name;
      let email = req.body.email;
      let phone = req.body.phone;
      let department = req.body.department;
      let state = req.body.state;
      let city = req.body.city;
      let zip = req.body.zip;
      let dob = req.body.dob;
      console.log(req.body);
     //find the document by ID
          mongoose.model('Company').findById(req.params.id, function (err, blob) {
              //update it
              blob.update({
                name : name,
                email :email,
                phone: phone,
                department: department,
                state: state,
                city: city,
                zip:zip,
                dob : dob,
              }, function (err, blobID) {
                if (err) {
                    res.send("There was a problem updating the information to the database: " + err);
                }
                else {
                  res.send(JSON.stringify({
                     status:"Updated",
                  }));

                 }
              })
          });
    }
  })

});


//DELETE a Blob by ID
router.delete('/:id/edit',verifyToken, function (req, res){
  jwt.verify(req.token,'secretKey',(err,authData) =>{
    if(err){
      res.sendStatus(403);
    }else{
      //find blob by ID
      mongoose.model('Company').findById(req.params.id, function (err, blob) {
          if (err) {
              return console.error(err);
          } else {
              //remove it from Mongo
              blob.remove(function (err, blob) {
                  if (err) {
                      return console.error(err);
                  } else {
                      //Returning success messages saying it was deleted
                      console.log('DELETE removing ID: ' + blob._id);
                      res.send(JSON.stringify({
                         status:"Success",
                      }));
                  }
              });
          }
      });
    }
  })

});

function verifyToken(req,res,next){
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader!=='undefined'){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }else{
    res.sendStatus(403);
  }
}
module.exports = router;
