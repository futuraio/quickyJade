# QuickyJade

### Rapid prototyping of Jade templates

`npm install quickyjade -g`

## Usage


### Basic usage
QuickyJade is super easy to work with, just run `$ quickyjade`. Then, in your browser navigate to `http://localhost:3000/yourjadefile.jade`. QuickyJade is also a static file server so any css , javascript or image files will be serverd as well.

### Using external JSON
QuickyJade will also pull in local JSON files to be interpreted by your jade file. To do so, simply add a query string to your URL with the `json` parameter being the location of the JSON file relative to the working directory. eg: `http://localhost:3000/yourjadefile.jade?json=jsonfile.json`. 

