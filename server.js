const express = require('express');
const axios=  require('axios');
const app = express();
const wordpress = require('wordpress');
const fs = require('fs');
const request = require('request');
const strob = require('stringify-object');
const entities = require('entities');
app.use(express.static('public'));
var client = wordpress.createClient({
	url: 'localhost',
	username: 'admin',
	password: 'admin'
});

app.get('/runs',async (req,res)=>{
	axios.get('https://www.reddit.com/r/worldnews/new.json').then(re=>{
		let titles = [];
		let kids = re.data.data.children;
		kids.forEach(kid=>{
			//res.write(strob(kid.data));
			//res.write(kid.data.title);
			titles.push(kid.data.title);
		});
		return titles;
	}).then(async titles=>{
		//res.write(titles.toString());
		let pics = await axios.get('https://www.reddit.com/r/pics/new.json');
		pics = pics.data.data.children;
		let posts = [];
		pics.forEach(pic=>{
			let thumb = entities.decodeHTML(pic.data.thumbnail);
			let full = entities.decodeHTML(pic.data.preview.images[0].source.url);
			let post = '<div class=block style=background-image:url('+thumb+');><img src='+full+' /></div>';
			res.write('<!DOCTYPE html>');
			res.write('<html><head><link rel=stylesheet href=style.css /></head><body>');
			res.write(post);
		});
		res.write('</body></html>');
		res.end();
	});
});

app.get('/',(req,res)=>{
	axios.get('http://localhost/wp-json/lux/v1/getpics').then(re=>{
		let pairs = re.data;
		console.log(pairs);
		for (const item of pairs) {
			if(item.pic!=='null')
			var src = item.pic[0];
			if(item.thumb!=='null')
			var thumb = item.thumb[0];
			res.write('<img class=thumb src='+thumb+' />');
			//res.write(item.pic[0]);
		}
		console.log('sent');
		return pairs;
	}).then(re=>{
		console.log('end');
		res.end();
	});
});

app.listen(3000,() => console.log("ON"));
