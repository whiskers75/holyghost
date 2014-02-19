Holy Ghost
=====
*(a fork of [Jesus](https://github.com/deoxxa/jesus) by deoxxa)*

Resurrect processes if they die.

Overview
--------

Holy Ghost is a simple-ish process management tool. It's designed to be very light,
while still providing functions enough to be automated if necessary. To that
end, it only runs a single process to monitor all your stuff. It can be exposed
via a unix socket (default) or an actual network interface for automation.

Installation
------------

Available via [npm](http://npmjs.org/package/holyghost):

> $ npm install holyghost -g

Or via git:

> $ npm install git://github.com/whiskers75/holyghost.git -g

Usage
-----
_To start a monitoring server_

`❯ holyghost listen [log]`

Where `log` is a file location for logging. If not supplied, logging will go to
stdout by default. Note that `listen` does not daemonise the process. You should
use `daemon` in place of `listen` to do that.

_Example:_

`❯ holyghost listen`

OR

`❯ holyghost listen ~/.jesus/jesus.log`

OR

`❯ holyghost daemon ~/.jesus/jesus.log`

_To start a process_

`❯ holyghost start <id> <command> [arguments]`

`id` is a string. It tells Jesus how to identify your process to you. The
`command` and `argument` bits are basically just the rest of your command.

_Example:_

`❯ holyghost start nc.1 nc -l -p 8001`

_To stop a process_

`❯ holyghost stop <id>`

Pretty simple. Does what it says on the tin.

_To stop all processes_

`❯ holyghost stopall`

Stops everything that's running.

_To restart a process_

`❯ holyghost restart <id>`

Same as `stop` for the most part. Self-explanatory.

_To restart all processes_

`❯ holyghost restartall`

Much the same as `stopall`, but does a restart instead.

_To list processes_

`❯ holyghost list`

This'll give you a nice list of processes that are running, and some limited
statistics.

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([whiskers75](http://github.com/whiskers75))
* Twitter ([@whiskers75](http://twitter.com/whiskers75))
* Website ([whiskers75.co.uk](http://whiskers75.co.uk)
* Email ([whiskers75@whiskers75.co.uk](mailto:whiskers75@whiskers75.co.uk))
