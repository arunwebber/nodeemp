var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST


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
        .get(function(req, res, next) {
            //retrieve all blobs from Monogo
            mongoose.model('Employee').find({}, function (err, blobs) {
                  if (err) {
                      return console.error(err);
                  } else {
                      //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                      res.format({
                          //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                        html: function(){
                            res.render('employees/index', {
                                  title: 'Employees',
                                  "blobs" : blobs
                              });
                        },
                        //JSON response will show all blobs in JSON format
                        json: function(){
                            res.json(infophotos);
                        }
                    });
                  }
            });
        })
        //POST a new blob
        .post(function(req, res) {
            // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
            var name = req.body.name;
            var email = req.body.email;
            var phone = req.body.phone;
            var department = req.body.department;
            var state = req.body.state;
            var city = req.body.city;
            var zip = req.body.zip;
            var dob = req.body.dob;
            //call the create function for our database
            mongoose.model('Employee').create({
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
                      res.format({
                          //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                        html: function(){
                            // If it worked, set the header so the address bar doesn't still say /adduser
                            res.location("employees");
                            // And forward to success page
                            res.redirect("/employees");
                        },
                        //JSON response will show the newly created blob
                        json: function(){
                            res.json(blob);
                        }
                    });
                  }
            })
        });


/* GET New Blob page. */
router.get('/new', function(req, res) {
    res.render('employees/new', { title: 'Add New Blob' });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Employee').findById(req.params.id, function (err, blob) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + blob._id);
        var blobdob = blob.dob.toISOString();
        blobdob = blobdob.substring(0, blobdob.indexOf('T'))
        res.format({
          html: function(){
              res.render('employees/show', {
                "blobdob" : blobdob,
                "blob" : blob
              });
          },
          json: function(){
              res.json(blob);
          }
        });
      }
    });
  });

  //GET the individual blob by Mongo ID
router.get('/:id/edit', function(req, res) {
  //params: { id:
    console.log('id',req.params.id)
    //search for the blob within Mongo
    mongoose.model('Employee').findById(req.params.id, function (err, blob) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the blob
            console.log('GET Retrieving ID for edit: ' + blob);

            //format the date properly for the value to show correctly in our edit form
          var blobdob = blob.dob.toISOString();
          blobdob = blobdob.substring(0, blobdob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('employees/edit', {
                          title: 'Blob' + blob._id,
                        "blobdob" : blobdob,
                          "blob" : blob
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(blob);
                 }
            });
        }
    });
});

//PUT to update a blob by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var department = req.body.department;
    var state = req.body.state;
    var city = req.body.city;
    var zip = req.body.zip;
    var dob = req.body.dob;

   //find the document by ID
        mongoose.model('Employee').findById(req.params.id, function (err, blob) {
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
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/employees/" + blob._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(blob);
                         }
                      });
               }
            })
        });
});

//DELETE a Blob by ID
router.delete('/:id/edit', function (req, res){
    //find blob by ID
    mongoose.model('Employee').findById(req.params.id, function (err, blob) {
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
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/Employees");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : blob
                               });
                         }
                      });
                }
            });
        }
    });
});
module.exports = router;
