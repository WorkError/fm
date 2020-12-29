//zmienne, stałe
var express = require("express");

var path = require("path")
var app = express()
const PORT = process.env.PORT || 3000
var hbs = require('express-handlebars');
app.use(express.static('static'))
var formidable = require('formidable');
const { dirname } = require("path");
const { networkInterfaces } = require("os");
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs',
    partialsDir: 'views/partials',
    extname: 'hbs',
 }));
app.set('view engine', 'hbs'); 

index = 1  
context = {
    uploaded: []
}

//nasłuch na określonym porcie
app.listen(PORT, function () { 
    console.log("start serwera na porcie " + PORT )
})
//------------------------------------------STANDARD PAGES---------------------------------------------
app.get("/", function (req, res) {
    res.render('home.hbs');
})
app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', context);
})

app.get("/info", function (req, res) {
    res.render('info.hbs');
})
//-------------------------------------------UPLOAD----------------------------------------------
app.get("/upload", function (req, res) {
    res.render('upload.hbs');
})
app.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'      // folder do zapisu zdjęcia
    form.keepExtensions = true                          // zapis z rozszerzeniem pliku
    form.multiples = true                              // zapis wielu plików                          
    form.parse(req, function (err, fields, files) { 
        if(!Array.isArray(files.imagetoupload)){
            files.imagetoupload = [files.imagetoupload]
        }
        files.imagetoupload.forEach(el => {
            context.uploaded.push({
                id: index,
                obraz: '',
                name: el.name,
                size: el.size,
                type: el.type,
                path: el.path,
                savedate: Date.now(),
                ext: extension(el.name)
            })
            index++;
            console.log(context.uploaded)
        });
        res.redirect('/filemanager')
    });
    
});
function extension(name){
    ext = name.split('.')[1]
    return ext
}
//-------------------------------------------USUWANIE-----------------------------------------
app.get('/delete/:id', function (req, res) {
    check = req.params.id
    context.uploaded.forEach(el => {
        if(el.id == check){
            num = context.uploaded.indexOf(el)
            context.uploaded.splice(num,1)
        }
    });
    res.redirect('/filemanager')
})
app.get("/delall", function (req, res) {
    
    context.uploaded = []
    index = 1
    res.render('filemanager.hbs', context);
})
//--------------------------------------------INFO----------------------------------------------
app.get("/info/:id", function (req, res) {
    check = req.params.id
    context.uploaded.forEach(el => {
        if(el.id == check){
            num = context.uploaded.indexOf(el)
        }
    });
    file = context.uploaded[num]
    res.render('info.hbs', file);
})
//------------------------------------------DOWNLOAD-------------------------------------------
app.get("/download/:id", function (req, res) {
    check = req.params.id
    context.uploaded.forEach(el => {
        if(el.id == check){
            filepath = el.path
        }
    });
    res.download(filepath)
})