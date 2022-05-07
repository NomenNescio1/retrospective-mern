const express = require('express');
const mongo = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const cardSchema = new mongo.Schema({
	id: String,
	content: String,
	category: String,
	color: String,
	likes: { type: Number, default: 0 },
	comments: { type: mongo.Schema.Types.ObjectId, ref: 'Comment' }
});

const columnSchema = new mongo.Schema({
	name: String,
	color: String,
	items: [cardSchema]
});

const Card = mongo.model('Card', cardSchema);
const Column = mongo.model('Column', columnSchema)


// eslint-disable-next-line max-len
mongo.connect(process.env.NODE_ENV === 'development' ? process.env.MONGODB_URL_DEV : process.env.MONGODB_URL_PROD, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverSelectionTimeoutMS: 8000
});

app.get('/getcolumn/', cors(), async (req, res) => {
	let columnItem = await Column.find({}).catch(error => res.json({
		success: false,
		error
	}));

	columnItem && res.send(columnItem);

});

app.post('/createcolumn', (req, res) => {
	const newColumn = new Column({
		_id: new mongo.Types.ObjectId(),
		name: req.body.name,
		color: req.body.color
	});

	newColumn.save((err) => {
		err && res.json({
			success: false,
			error: err
		});

		return res.json({
			_id: newColumn._id
		});
	});

});

app.post('/createcard', cors(), async (req, res) => {
	const newCard = new Card({
		_id: new mongo.Types.ObjectId(),
		category: req.body.category,
		content: req.body.content,
		color: req.body.color,
		comments: req.body.comments
	});

	const currentColumn = await Column.findById({ _id: req.body.colId });
	currentColumn.items.push(newCard);

	currentColumn.save((err) => {
		err && res.json({
			success: false,
			error: err
		});

		return res.json({
			_id: newCard._id
		});
	});

});

app.options('/editcol', cors());
app.patch('/editcol', cors(), async (req, res) => {
	Column.findByIdAndUpdate({
		_id: req.body.colID
	}, {
		name: req.body.update
	}, {
		returnNewDocument: true
	}, (err, col) => {
		err && res.send(err);

		res.json(col)
	})
});

app.options('/editcard', cors());
app.patch('/editcard', cors(), async (req, res) => {
	Column.findOneAndUpdate(
		{
			_id: req.body.colID,
			'items._id': req.body.cardID
		},
		{
			"items.$.content": req.body.update
		},
		{
			returnNewDocument: true
		},
		(err, col) => {
			if (err) res.send(err)

			res.json(col)
		})
});

app.post('/updatelikes', cors(), async (req, res) => {
	Column.findOneAndUpdate(
		{
			_id: req.body.colID,
			"items._id": req.body.cardID
		},
		{
			$inc: {
				"items.$.likes": 1
			}
		},
		(err, col) => {
			if (err) res.send(err)

			res.json(col)
		})
});

app.delete('/deletecard', cors(), (req, res) => {
	Column.findOneAndUpdate(
		{
			_id: req.body.colID,
			'items._id': req.body.cardID
		},
		{
			'$pull':
			{
				items:
				{
					_id: req.body.cardID
				}
			}
		},
		(err, col) => {
			if (err) res.send(err)

			res.json(col)
		}
	)
});

app.listen(3001)
