# QuickyJade

### Rapid prototyping of Jade templates

`npm install quickyjade -g`

## Usage


### Basic usage
QuickyJade is super easy to work with, just run `$ quickyjade`. Then, in your browser navigate to `http://localhost:3000/yourjadefile.jade`. QuickyJade is also a static file server so any css , javascript or image files will be serverd as well.

### Using local JSON
QuickyJade will also pull in local JSON files to be interpreted by your jade file. To do so, simply add a query string to your URL with the `json` parameter being the location of the JSON file relative to the working directory. eg: `http://localhost:3000/yourjadefile.jade?json=jsonfile.json`. 

### Using local javascript files
QuickyJade will also work with javascript files formatted in the correct manner. To do so, place your data on the `exports` object of the file (see below). To do this, use a query string of `js=yourjsfile.js` with your URL. eg: `http://localhost:3000/yourjadefile.jade?js=jsfile.js`. 

````javascript
exports.users = [
	{
		"name":"Robb Schiller",
		"title": "Designer",
		"twitter": "robbschiller"
	},
	{
		"name":"TJ Krusinski",
		"title": "Developer",
		"twitter": "tjkrusinski"
	},
	{
		"name":"Chris Constable",
		"title": "Developer",
		"twitter": "mstrchrstphr"
	},
	{
		"name":"Peter Roquemore",
		"title": "Designer"
	},
	{
		"name":"Timmy Schiller",
		"title": "Intern",
		"twitter": "tmschl"
	}
];

````