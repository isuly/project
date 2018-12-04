/*# This example script opens an IMAP connection to the server and
# seeks unread messages sent by the user himself. It will then
# download those messages, parse them, and write their attachments
# to disk.

# Install node-imap with `npm install imap`*/
//imap = require('imap');
//# Install mailparser with `npm install mailparser`
////mailparser = require('mailparser');

//# You need a config file with your email settings
/*fs = require('fs');
config = JSON.parse(fs.readFileSync(process.cwd()+'\\config.json', 'utf-8'));

console.log(config.username);
console.log(config.password);
    var t = config.username;

var server = new imap.ImapConnection({
    username:config.username,
    password:config.password,
    host:config.imap.host,
    port:config.imap.port,
    secure:config.imap.secure
    });
*/

    /*console.log(config.username);
 
    server.connect(err) 
    exitOnErr(err) 
    if(err)
    server.openBox("INBOX", false, (err, box)) 
        exitOnErr(err) 
        if (err)
        console.log("You have #{box.messages.total} messages in your INBOX");*/

        /*server.search ["UNSEEN", ["SINCE", "Sep 18, 2011"], ["FROM", config.email]], (err, results) 
            exitOnErr(err) if (err)

            unless results.length
                console.log "No unread messages from #{config.email}"
                do server.logout
                return

            fetch = server.fetch results,
                request:
                    body: "full"
                    headers: false
            
            fetch.on "message", (message) ->
                fds = {}
                filenames = {}
                parser = new mailparser.MailParser

                parser.on "headers", (headers) ->
                    console.log "Message: #{headers.subject}"

                parser.on "astart", (id, headers) ->
                    filenames[id] = headers.filename
                    fds[id] = fs.openSync headers.filename, 'w'

                parser.on "astream", (id, buffer) ->
                    fs.writeSync fds[id], buffer, 0, buffer.length, null

                parser.on "aend", (id) ->
                    return unless fds[id]
                    fs.close fds[id], (err) ->
                        return console.error err if err
                        console.log "Writing #{filenames[id]} completed"

                message.on "data", (data) ->
                    parser.feed data.toString()

                message.on "end", ->
                    do parser.end

            fetch.on "end", ->
                do server.logout*/

                var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
  user: 'isulyfahretdinova@gmail.com',
  password: 'literatyra18',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

//function openInbox(cb) {
 // imap.openBox('INBOX', true, cb);
//}

/*
imap.once('ready', function() 
{
/////////////////////////////////////////
openInbox(function(err, box) {
  if (err) throw err;
  var f = imap.seq.fetch(box.messages.total + ':*', { bodies: ['TEXT'] });
  console.log('2');
 
  f.on('message', function(msg, seqno) {
    console.log('3');
    console.log('Message #%d', seqno);
    var prefix = '(#' + seqno + ') ';
    msg.on('body', function(stream, info) {
        console.log('4');
      if (info.which === 'TEXT')
        console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
      var buffer = '', count = 0;
      stream.on('data', function(chunk) {
        console.log('5');
        count += chunk.length;
        buffer += chunk.toString('utf8');
        if (info.which === 'TEXT')
          console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
      });
      stream.once('end', function() {
        console.log('6');
        if (info.which !== 'TEXT')
          console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
        else
          console.log(prefix + 'Body [%s] Finished', inspect(info.which));
      });
    });
    msg.once('attributes', function(attrs) {
        console.log('7');
      console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
    });
    msg.once('end', function() {
        console.log('8');
      console.log(prefix + 'Finished');
    });
  });
  f.once('error', function(err) {
    console.log('Fetch error: ' + err);
  });
  f.once('end', function() {
    console.log('Done fetching all messages!');
    imap.end();
  });
});
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});*/







function findTextPart(struct) {
  for (var i = 0, len = struct.length, r; i < len; ++i) {
    if (Array.isArray(struct[i])) {
      if (r = findTextPart(struct[i]))
        return r;
    } else if (struct[i].type === 'text'
               && (struct[i].subtype === 'plain'
                   || struct[i].subtype === 'html'))
      return [struct[i].partID, struct[i].type + '/' + struct[i].subtype];
  }
}

function getMsgByUID(uid, cb, partID) {
   var f = imap.seq.fetch('210:211',
            {
         bodies: ['HEADER.FIELDS (TO FROM SUBJECT)','TEXT',
                               /* partID[0]*/ ],
         struct: true
            }), hadErr = false;;
 /* var f = imap.seq.fetch(uid,
                         (partID
                          ? { bodies: [
                                'HEADER.FIELDS (TO FROM SUBJECT)','TEXT',
                                partID[0]
                              ] }
                          : { struct: true })),
      hadErr = false;*/

  if (partID)
    var msg = { header: undefined, body: '', attrs: undefined };

  f.on('error', function(err) {
    hadErr = true;
    cb(err);
  });

  if (!partID) {
    f.on('message', function(m) {
      m.on('attributes', function(attrs) {
        partID = findTextPart(attrs.struct);
      });
    });
    f.on('end', function() {
      if (hadErr)
        return;
      if (partID)
        getMsgByUID(uid, cb, partID);
      else
        cb(new Error('No text part found'));
    });
  } else {
    f.on('message', function(m) {
      m.on('body', function(stream, info) {
        var b = '';
        stream.on('data', function(d) {
          b += d;
        });
        stream.on('end', function() {
          if (/^header/i.test(info.which))
            msg.header = Imap.parseHeader(b);
          else
            msg.body = b;
        });
      });
      m.on('attributes', function(attrs) {
        msg.attrs = attrs;
        msg.contentType = partID[1];
      });
    });
    f.on('end', function() {
      if (hadErr)
        return;
      cb(undefined, msg);
    });
  }
}

imap.once('ready', function() {
  imap.openBox('INBOX', true, function(err, box) {
    if (err) throw err;
    getMsgByUID(box.messages.total + ':*', function(err, msg) {
      if (err) throw err;
      console.log(msg);
      imap.end();
    });
  });
});

imap.connect();

//imap.connect();


    ///////////////////////////////////
 /*openInbox(function(err, box) 
    {
    if (err) throw err;
         var f = imap.seq.fetch('210:210',
            {
         bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)','TEXT'],
         struct: true
            });

        f.on('message', function(msg, seqno) 
        {

            console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
             msg.on('body', function(stream, info) 
             {
                     var buffer = '';
                   stream.on('data', function(chunk) 
                  {
                     buffer += chunk.toString('utf8');
                  });
                    stream.once('end', function() 
                    {
                    console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                    });

             });
               msg.once('attributes', function(attrs) {
                  console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
               });
             msg.once('text', function(attrs) 
             {
               console.log(prefix + 'text: %s', inspect(attrs, false, 8));
             });

            msg.once('end', function() 
             {
            console.log(prefix + 'Finished');
             });
        });
         f.once('error', function(err) 
         {
          console.log('Fetch error: ' + err);
         });

         f.once('end', function() 
         {
          console.log('Done fetching all messages!');
         imap.end();
         });
    });
});
*/




//////////////////////////////////////
/*
var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
  user: 'isulyfahretdinova@gmail.com',
  password: 'literatyra18',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    var f = imap.seq.fetch('210:210', {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)','TEXT'],
      struct: true
    });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
        });
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

imap.connect();*/