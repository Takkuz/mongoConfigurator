# mongoConfigurator
I've written this configurator because I often change DB during development and I don't want to reconfigure it from scratch every time.

This is a simple script that I run before launching my projects.

It takes care of create db and collections following the guidelines in config.js.

Exposes a promise that will be resolved after the DB initialization and add the `$db` property at the `mongo` object that refers to the DB instance and the object itself is a function that recall db.collection with the
collection name as parameter.

## Installation

After cloning git repository run `npm i` to install dependences

## Configuration

Modify `config.js` according to your needs:
- **forceUpdate** forces to drop existing index and recreate it
- **forceDelete** delete an existing index 

## Running

Running `node .` will run a standalone configuration but adding those files to your project wrapping your app initialization with mongoConfigurator promise will let you to forget about your db configuration.
