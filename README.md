V1
# nodeemp
Simple node emp using mongodb as the back end for linux boxes
Steps to install</br>
1)Make sure that your mongodb is running  on your local machine</br>
https://docs.mongodb.com/manual/administration/install-on-linux </br>
2)Make sure that the machine has node js</br>
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04

# Follow thease commands
</br>
sudo mkdir new</br>
cd new</br>
git init</br>
git remote add origin https://github.com/arunwebber/nodeemp.git</br>
git pull origin master</br>
[Wait till the download is completed]</br>
sudo npm install</br>
[Wait till the installation is completed]</br>
sudo node ./bin/www</br>
[In terminal it will show 'App startted Port: 3000']</br>

# Cheers

Once it is startted go to the browser and type
http://localhost:3000/employees/</br>

There you can add edit delete employees

V2
With api support
First create a jwt token from this url
http://localhost:3000/users/login You will get a jwt tokn with admin Now you can use that in following
To list all the employee
Reqest: GET:http://localhost:3000/employees/
To Update
Request: PUT:http://localhost:3000/employees/id/edit
To get employee details
GET:http://localhost:3000/employees/5c9f4766841e7062ad73c643
To delete employee details
DELETE http://localhost:3000/employees/5ffc183cfd4259501afb0f0a/edit
To create a new employee
POST:http://localhost:3000/employees/new
