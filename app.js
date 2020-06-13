//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose'); //require mongoose for database.
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const user = process.env.USER;
const password = process.env.PASSWORD;

mongoose.connect(
	'mongodb+srv://' +
		user +
		':' +
		password +
		'@cluster0-6s1df.mongodb.net/todoListDB',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

const itemSchema = mongoose.Schema({
	thing: String,
});

const itemCollection = mongoose.model('item', itemSchema);

app.get('/', function (req, res) {
	const day = date.getDate();
	itemCollection.find(function (err, newItems) {
		res.render('list', { listTitle: day, newListItems: newItems });
	});
});

app.post('/', function (req, res) {
	const item = req.body.newItem;
	if (item === '') {
		res.redirect('/');
	} else {
		const Input = new itemCollection({
			thing: item,
		});
		Input.save();
		res.redirect('/');
	}
});

app.post('/delete', function (req, res) {
	itemCollection.deleteOne({ _id: req.body.deleted }, function (err, obj) {
		if (err) {
			console.log(err);
		} else console.log('successfully deleted the item');
	});
	res.redirect('/');
});

// app.get('/:userInput', function (req, res) {
// 	const userInput = req.params.userInput;

// 	itemCollection.find(function (err, newItems) {
// 		res.render('list', { listTitle: userInput, newListItems: newItems });
// 	});
// });

app.listen(process.env.PORT || 5500, function () {
	console.log('Server started on port 3000');
});
