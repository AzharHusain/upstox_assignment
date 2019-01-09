var http = require('http');
var fs = require('fs');
const url = require('url');
var ss = require('./search_store/search_store');

// define server object variable
let server;


// Create search handler object. 

let searchHandler = new ss.SearchStore();


/**
 * Prepare data set for search to work, init() will read data from csv file
 * and then index it to hash map using suffix keys for each name. If data processing is 
 * succesful then nodejs web server will start to serve our requests.
 */
searchHandler.init(function (err, data) {
    if (err) {
        console.log('Server could not be started due to error in data processing.');
        return;
    }

    //initialize a server object:
    server = http.createServer(function (req, res) {



        //define api routes

        //parse path using nodejs url module
        var path = url.parse(req.url);


        // Route to serve search request
        if (path.pathname === '/search') {

            // Get searchkey from request query parameters
            let searchKey = url.parse(req.url,true).query['term'];
            
            let response;

            // If search key is blank or less than three characters
            if(searchKey === undefined || searchKey === '' || searchKey.length < 3) {
                response = JSON.stringify({
                    type: 'error',
                    message: 'Minimum three characters are required to search.'
                }); //write a response
            }
            else {

                // Go and search for key using search handler searchInMap(method)
                let result = searchHandler.searchInMap(searchKey.replace(/\s/g, '').toLowerCase());
                
                // if result is null or undefined return no match found else return data
                if(!result) {
                    response = JSON.stringify({
                        type: 'error',
                        message: 'No match found.'
                    }); 
                }
                else {
                    response = JSON.stringify({
                        type: 'success',
                        data : result
                    })
                }
            }
            
            // write response as json for our request
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(response);
            res.end();
            
        }

        // Default route to serve html to view at browser
        else if (path.pathname === '/') {

            // Read index.html and send as response to browser
            fs.readFile('./view/index.html',function (err, data){
                res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
                res.write(data);
                res.end();
            });
        }
    });

    server.listen(3000, function () {
        //the server object listens on port 3000
        console.log(`Server start at port 3000 click http://localhost:3000 to start in browser.`); 
    });

});



