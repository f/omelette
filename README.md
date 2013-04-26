# Omelette.js v0.0.1

Omelette is a simple, template based autocompletion tool for Node projects.

You just have to decide your program name and CLI fragments.

```coffeescript
omelette "githubber <module> <command> <suboption>"
```

And you are almost done!

![Example](https://raw.github.com/f/omelette/master/resources/omelette.gif)

## Quickstart

Implementing omelette is very easy:

Install it first from NPM:

```bash
npm install omelette
```

### Code

It's based on a simple CLI template.

Let's think we have a executable file with the name **githubber**, *in a global path*.

And in our program, code will be:

```coffeescript
#!/usr/bin/env coffee

omelette = require "omelette"

# Write your CLI template.
complete = omelette "githubber <action> <user> <repo>"

# Bind events for every template part.
complete.on "action", ->
  complete.reply ["clone", "update", "push"]

complete.on "user", (action)->
  complete.reply fs.readdirSync "/Users/"

complete.on "repo", (user)->
  complete.reply [
    "http://github.com/#{user}/helloworld"
    "http://github.com/#{user}/blabla"
  ]

# Initialize the omelette.
complete.init()

# Rest is yours
console.log "Your program's default workflow."
console.log process.argv
```

If you like oldschool:

```javascript
var fs = require("fs"), 
    omelette = require("omelette");

// Write your CLI template.
var complete = omelette("githubber <action> <user> <repo>");

complete.on("action", function() {
  return complete.reply(["clone", "update", "push"]);
});

complete.on("user", function(action) {
  return complete.reply(fs.readdirSync("/Users/"));
});

complete.on("repo", function(user) {
  return complete.reply([
    "http://github.com/" + user + "/helloworld", 
    "http://github.com/" + user + "/blabla"
  ]);
});

// Initialize the omelette.
complete.init();

// Rest is yours.
console.log("Your program's default workflow.");
console.log(process.argv);
```

`complete.reply` is the completion replier. You should pass the options into that method.

### Install

Installing, and making your users install the autocompletion feature is very simple.

In **zsh**, you can write these:

```bash
echo '. <(./githubber --completion)' >> .zshrc
```

In **bash**, you should write:

```bash
./githubber --completion >> ~/githubber.completion.sh
echo 'source ~/githubber.completion.sh' >> .bash_profile
```

That's all!

Now you have an autocompletion system for your CLI tool.

## Test

Now, you can try it in your shell.

```bash
$ ./githubber<tab>
clone update push
```

```bash
$ ./githubber cl<tab>
$ ./githubber clone<tab>
Guest fka
```

```bash
$ ./githubber clone fka<tab>
$ ./githubber clone fka http://github.com/fka/<tab>
http://github.com/fka/helloworld
http://github.com/fka/blabla
```

## Contribute

I need your contributions to make that work better!

## License

This project licensed under MIT.
