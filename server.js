const express = require('express');
const axios=  require('axios');
const app = express();
const wordpress = require('wordpress');
const fs = require('fs');
const request = require('request');
var client = wordpress.createClient({
	url: 'localhost',
	username: 'admin',
	password: 'admin'
});

app.get('/runs',async (req,res)=>{
	var pic = await axios.get('https://www.reddit.com/r/pics/new.json');
	pic = pic.data.data.children[0].data.preview.images[0].source.url;
	var title = await axios.get('https://www.reddit.com/r/worldnews/new.json');
	title = title.data.data.children[0].data.title;

	let post = {
		title: title,
		status: "publish",
	}
	client.newPost(post,(err,id)=>{
		if(err)
			console.log(err);
		else {
			axios.post('http://localhost/wp-json/lux/v1/meta/'+id,{
				pic: pic
			}).then(re=>{
				console.log(re);
				res.send('done');
			});
		}
	});
});

app.get('/',(req,res)=>{
	axios.get('http://localhost/wp-json/lux/v1/getpics').then(re=>{
		res.send(re.data);
	});
});

app.listen(3000,() => console.log("ON"));
