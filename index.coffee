fs = require "fs"
omelette = require "./omelette"

# Write your CLI template.
complete = omelette "github <action> <user> <repo>"

# Bind events for every template part.
complete.on "action", ->
  complete.reply [
    "clone"
    "update"
    "push"
  ]

complete.on "user", (action)->
  complete.reply fs.readdirSync "/Users/"

complete.on "repo", (user)->
  complete.reply [
    "http://github.com/#{user}/helloworld"
    "http://github.com/#{user}/blabla"
  ]

complete.init()