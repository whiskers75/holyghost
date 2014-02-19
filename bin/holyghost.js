#!/usr/bin/env node

var jesus = require(".."),
    asciitable = require("asciitable"),
    vagueTime = require("vague-time");

var logStream = process.stdout;

var log = function (level, summary, info) {
    if (typeof info == "undefined") {
        info = {};
    }
    logStream.write(level.toUpperCase() + ': ' + summary + "\n");
};

["debug", "info", "warning", "error"].forEach(function (level) {
    log[level] = log.bind(null, level);
});

if (process.argv[2] === "daemon") {
    require("child_process").spawn("node", [process.argv[1], "listen"].concat(process.argv.slice(3)), {
        detached: true,
        cwd: process.cwd(),
        stdio: "ignore",
    }).unref();
}

if (process.argv[2] === "listen") {
    var server = jesus.createServer().listen();
    log.info("Listening")
    if (process.argv[3]) {
        logStream = require("fs").createWriteStream(process.argv[3]);
    }

    process.on("uncaughtException", function (err) {
        server.jesus.stopAll();

        log.error("exception", {
            message: err.message,
            stack: err.stack
        });

        console.warn(err);
        console.warn(err.stack);

        setImmediate(function () {
            process.exit(1);
        });
    });
    server.jesus.on("processStarted", function(info) {
        log.info('Process ' + info.id + ' started (PID: ' + info.pid + ')')
    });
    server.jesus.on("processExited", function(info) {
        log.info('Process ' + info.id + ' exited')
    });
    server.jesus.on("processError", function(info) {
        log.info('Process ' + info.id + ' error!')
    });
    server.jesus.on("processTerminated", function(info) {
        log.info('Process ' + info.id + ' terminated')
    });
}

if (process.argv[2] === "start") {
    jesus.connect().callRemote("start", process.argv.slice(4), {
        id: process.argv[3],
        cwd: process.cwd(),
    }, function (err, info) {
        if (err) {
            dump_error(err);
        }

        dump_processes([info]);
    });
}

if (process.argv[2] === "stop") {
    jesus.connect().callRemote("stop", process.argv[3], function (err, info) {
        if (err) {
            dump_error(err);
        }

        dump_processes([info]);
    });
}

if (process.argv[2] === "stopall") {
    jesus.connect().callRemote("stopAll", function (err, list) {
        if (err) {
            dump_error(err);
        }

        dump_processes(list);
    });
}

if (process.argv[2] === "restart") {
    jesus.connect().callRemote("restart", process.argv[3], function (err, info) {
        if (err) {
            dump_error(err);
        }

        dump_processes([info]);
    });
}

if (process.argv[2] === "check") {
    jesus.connect().callRemote("check", process.argv[3], function (err, info) {
        if (err) {
            dump_error(err);
        }

        dump_processes([info]);
    });
}

if (process.argv[2] === "restartall") {
    jesus.connect().callRemote("restartAll", function (err, list) {
        if (err) {
            dump_error(err);
        }

        dump_processes(list);
    });
}

if (process.argv[2] === "list") {
    jesus.connect().callRemote("list", function (err, list) {
        if (err) {
            dump_error(err);
        }

        dump_processes(list);
    });
}

function dump_error(err) {
    console.warn("");
    console.warn("Server returned error: " + err);
    console.warn("");

    process.exit(1);
}

function dump_processes(list) {
    var options = {
        columns: [
            {
                name: "ID",
                field: "id"
            },
            {
                name: "PID",
                field: "pid"
            },
            {
                name: "Restarts",
                field: "restarts"
            },
            {
                name: "Uptime",
                field: "uptime"
            },
            {
                name: "Command",
                field: "command"
            },
    ],
    };

    console.log(asciitable(options, list.sort(function (a, b) {
        return a.id === b.id ? 0 : a.id > b.id ? 1 : -1;
    }).map(function (e) {
        return {
            id: e.id,
            pid: e.pid.toString(10),
            restarts: e.started.length.toString(10),
            uptime: vagueTime.get({
                from: new Date(),
                to: new Date(e.started[e.started.length - 1])
            }).replace(/ ago$/, ""),
            command: e.args.join(" "),
        };
    })));

    process.exit(0);
}