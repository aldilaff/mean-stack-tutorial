var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Posts */
router.get('/posts', function(req, res, nex){
	Post.find(function(err, posts){
		if(err){return next(err); }

		res.json(posts);
	});
});

/* POST posts */
router.post('/posts', function(req, res, next){
	var post = new Post(req.body);

	post.save(function(err, post){
		if(err){ return next(err); }

		res.json(post);
	});
});

/* A route for preloading post objects */
router.param('post', function(req, res, next, id ){
	var query = Post.findById(id);

	query.exec(function(err, post){
		if (err) { return next(err); }
		if (!post) { return next(new Error('can\'t  find post')); }

		req.post = post;
		return next();

	});
});


/* GET Posts/post */
router.get('/posts/:post', function(req, res){
	req.post.populate('comments', function(err, post){
		if (err) {return next(err); }

		res.json(post);
	});
	res.json(req.post);
});

/* PUT Posts/post/upvote */
router.put('/posts/:post/upvote', function(req, res, next){
	req.post.upvote(function(err, post){
		if (err) {return next(err); }

		res.json(post);
	});
});

/* Create comments route for a particular post */
router.post('/posts/:post/comments', function(req, res, next){
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function(err, comment){
		if (err) {return next (err); }

		req.post.comments.push(comment);
		req.post.save(function(err, post){
			if(err) { return next(err); }

			res.json(comment);
		});
	});
});

/* A route for preloading comment objects */
router.param('comment', function(req, res, next, id ){
	var query = Comment.findById(id);

	query.exec(function(err, comment){
		if (err) { return next(err); }
		if (!comment) { return next(new Error('can\'t  find comment')); }

		req.post = comment;
		return next();

	});
});

/* PUT /posts/:post/comments/:comment/upvote */
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next){
	req.post.upvote(function(err, post){
		if (err) {return next(err); }

		res.json(post);
	});
});


module.exports = router;









