# Omelette.js v0.3.1

[![Build Status](https://travis-ci.org/f/omelette.png?branch=master)](https://travis-ci.org/f/omelette)

```bash
npm install omelette
```

Omelette is a simple, template based autocompletion tool for Node projects.

You just have to decide your program name and CLI fragments.

```coffeescript
omelette "githubber <module> <command> <suboption>"
```

And you are almost done!

![Example](https://raw.github.com/f/omelette/master/resources/omelette.gif)

A more detailed template spec:

```coffeescript
omelette "<programname>[|<shortname>|<short>|<...>] <module> [<command> <suboption> <...>]"
```

## Quickstart

Implementing omelette is very easy.

```coffeescript
#!/usr/bin/env coffee

omelette = require "omelette"
comp = omelette "programname|prgmnm|prgnm <firstargument>"

comp.on "firstargument", ->
  @reply ["hello", "cruel", "world"]

comp.init()
```

**You can add multiple names to programs**

### Code

It's based on a simple CLI template.

Let's think we have a executable file with the name **githubber**, *in a global path*.

And in our program, code will be:

```coffeescript
#!/usr/bin/env coffee

omelette = require "omelette"

# Write your CLI template.
complete = omelette "githubber|gh <action> <user> <repo>"

# Bind events for every template part.
complete.on "action", -> @reply ["clone", "update", "push"]

complete.on "user", (action)-> @reply fs.readdirSync "/Users/"

complete.on "repo", (user)->
  @reply [
    "http://github.com/#{user}/helloworld"
    "http://github.com/#{user}/blabla"
  ]

# Initialize the omelette.
complete.init()

# If you want to have a setup feature, you can use `omeletteInstance.setupShellInitFile()` function.
if ~process.argv.indexOf '--setup'
  complete.setupShellInitFile()

# Rest is yours
console.log "Your program's default workflow."
console.log process.argv
```

If you like oldschool:

```javascript
var fs = require("fs"),
    omelette = require("omelette");

// Write your CLI template.
var complete = omelette("githubber|gh <action> <user> <repo>");

complete.on("action", function() {
  this.reply(["clone", "update", "push"]);
});

complete.on("user", function(action) {
  this.reply(fs.readdirSync("/Users/"));
});

complete.on("repo", function(user) {
  this.reply([
    "http://github.com/" + user + "/helloworld",
    "http://github.com/" + user + "/blabla"
  ]);
});

// Initialize the omelette.
complete.init();

// If you want to have a setup feature, you can use `omeletteInstance.setupShellInitFile()` function.
if (~process.argv.indexOf '--setup') {
  complete.setupShellInitFile();
}

// Rest is yours.
console.log("Your program's default workflow.");
console.log(process.argv);
```

`complete.reply` is the completion replier. You should pass the options into that method.

### Install

#### Automated Install

Installing, and making your users install the autocompletion feature is very simple.

You can use simply use `setupShellInitFile` function.

```javascript
// If you want to write file,
complete.setupShellInitFile('~/.my_bash_profile');
```

If you use Bash, it will create a file at `~/.<program-name>/completion.sh` and
append a loader code to `~/.bash_profile` file.

If you use Zsh, it just append a loader code to `~/.zshrc` file.

*TL;DR: It does the Manual Install part, basically.*

#### Manual Install

*(You should add these instructions to your project's README)*

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

## Additions

There are some useful additions for omelette.

### Parameters

Callbacks have three parameters:

  - The number of fragment *just for global event*
  - The parent word.
  - The whole command line buffer allow you to parse and reply as you wish.

### Global Event

You also can be able to listen all fragments by "complete" event.

```coffeescript
complete.on "complete", (fragment, word, line)-> @reply ["hello", "world"]
```

### Numbered Arguments

You also can listen events by its order.

```coffeescript
complete.on "$1", (word, line)-> @reply ["hello", "world"]
```

### Short Names

You can set short name of an executable:

In this example, `githubber` is long and `gh` is shorter examples.

```coffeescript
omelette "githubber|gh <module> <command> <suboption>"
```

## Test

Now, you can try it in your shell.

```bash
git clone https://github.com/f/omelette
cd omelette/examples
alias githubber="./githubber" # The app should be global, completion will search it on global level.
./githubber --setup --debug # --setup is not provided by omelette, you should proxy it.
# (reload bash, or source ~/.bash_profile)
omelette-debug-githubber # See Debugging section
githubber<tab>
ghb<tab> # short alias
gh<tab> # short alias
```

### Debugging

`--debug` option generates a function called `omlette-debug-<programname>`.
(`omlette-debug-githubber` in this example).

When you run `omlette-debug-<programname>`, it will create aliases for your
application. (`githubber` and `gh` in this example).

Long name,

```bash
$ githubber<tab>
clone update push
```

Or short name:

```bash
$ gh<tab>
clone update push
```

Then you can start easily.

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

## Who uses?

**Windows Azure** uses Omelette to support autocompletion in [azure-cli](https://github.com/WindowsAzure/azure-sdk-tools-xplat).

## Contribute

I need your contributions to make that work better!

## License

This project licensed under MIT.

[![Build Status](https://www.codeship.io/projects/1ccaea50-8ffe-0131-9189-166ee657e7b4/status)](http://codeship.io/f/omelette)
