var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');
var app = express();
var db = new sqlite3.Database('quotes.db');

// mount BodyParser as middleware - every request passes through it
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES

app.get('/quotes', function(req, res){
    if(req.query.year){
        db.all('SELECT * FROM quotes WHERE year = ?', [req.query.year], function(err, rows){
            console.log("Return a list of quotes from the year: " + req.query.year);
            res.json(rows);
        });
    }
    else{
        db.all('SELECT * FROM quotes', function processRows(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                for( var i = 0; i < rows.length; i++){
                    console.log(rows[i].quote);
                }
                res.json(rows);
            }
        });
    }
});

app.get('/quotes/:id', function(req, res){
    db.get('SELECT * FROM quotes WHERE rowid = ?', [req.params.id], function(err, row){
        if (err){
            console.log(err.message);
        }
        else{
            res.json(row);
        }
    });
});

app.post('/quotes', function(req, res){
    console.log("Insert new quote: " + req.body.quote);
    db.run('INSERT INTO quotes VALUES (?, ?, ?)', [req.body.quote, req.body.author, req.body.year], function(err){
        if(err){
            console.log(err.message);
        }
        else{
            res.send('Inserted quote with id: ' + this.lastID);
        }
    });
});

app.listen(3000, function(){
    console.log('Quotes-API listening on port: 3000');
});
