var Imap = require('imap'),
    inspect = require('util').inspect;

/*var imap = new Imap({
  user: 'isulyfahretdinova@gmail.com',
  password: 'literatyra18',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});
var imap = new Imap({
  user: 'isulyshka@mail.ru',
  password: 'literatyra',
  host: 'imap.mail.ru',
  port: 993,
  tls: true
});*/
var imap = new Imap({
  user: 'ebobo.ebobovich@yandex.com',
  password: 'literatyra18',
  host: 'imap.yandex.com',
  port: 993,
  tls: true
});


//ПАРСИНГ СООБЩЕНИЙ КОТОРЫЕ ОТПРАВЛЕНЫ ЧЕРЕЗ sendmail.js

//ПРИКРЕПЛЯТЬ И СЧИТЫВАТЬ ВЛОЖЕНИЯ
          var hm;
/*function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}*/

/*imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    var f = imap.seq.fetch('214', {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)','TEXT'],
      struct: true
    });
    f.on('message', function(msg, seqno) {
      //console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          //console.log('+++++++++++++++++'+buffer+'\r\n');
          var tmp = inspect(Imap.parseHeader(buffer));
         //  console.log('Message '+ prefix+'\r\n');
        //  console.log('Parsed header: ' + tmp+'\r\n');
         // var re = /(base64[^\>]*----ALT)/;
          //var lol = buffer.match(re);
         // console.log('+++++++++++++++++'+lol+'\r\n');
          var msgg;
          var rez='';
          var i = 10;
          var tmp2;
          if()
         /*if(lol!=null)
         {
          msgg=lol[0];
          while(msgg[i]!='-')
          {
          //console.log('************************'+msgg[i]);
          rez+=msgg[i];
          i++;
        }
        //console.log('************************'+rez);
        }*/
        //console.log('1************************'+rez);
        /*if(rez.length>5)
        {
            hm=rez;
          //  console.log('+++++++++++++++'+hm);
        }
        if(tmp.length<5)
          {}
        else
        {
         // console.log('Message '+ prefix+'\r\n');
          console.log('Parsed header: ' + tmp+'\r\n');
         var kek = Buffer.from(buffer, 'base64').toString('utf8');
          console.log('Message: '+ kek+'\r\n');
        }
        });
      });
      msg.once('attributes', function(attrs) {
       // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        //console.log(prefix + 'Finished');
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



//ЯНДЕКС 
//РАБОЗРАТЬ БУФФЕР РУКАМИ
//ВЫТАЩИТЬ ХЕДЕР И ТЕКСТ ПИСЬМА
//В ХЕДЕРЕ В ТЕМЕ ИСПОЛЬЗУЕТСЯ ТА ЖЕ КОДИРОВКА ЧТО И В СООБЩЕНИИ!!!!!!!


function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    console.log("You have messages in your INBOX: "+box.messages.total);
    var f = imap.seq.fetch('3:1', {
      bodies: ['HEADER','TEXT'],
      struct: true
    });
    f.on('message', function(msg, seqno) {
      //console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          //console.log('+++++++++++++++++'+buffer+'\r\n');
          var tmp = inspect(Imap.parseHeader(buffer));
          var re = /(base64[^\>]*----ALT)/;
          var lol = buffer.match(re);
          //console.log('+++++++++++++++++'+lol+'\r\n');
          var msgg;
          var rez='';
          var i = 10;
          if(tmp.toString().length>5)
          {
          console.log('Заголовок письма: '+'\r\n');
          console.log(inspect(Imap.parseHeader(buffer).from));
          console.log(inspect(Imap.parseHeader(buffer).to));
          console.log(inspect(Imap.parseHeader(buffer).subject)+'\r\n'+'\r\n');
          }
          else
          {
          if(lol!=null)
         {
          msgg=lol[0];
          while(msgg[i]!='-')
          {
          //console.log('************************'+msgg[i]);
          rez+=msgg[i];
          i++;
        }
        //console.log('************************'+rez);
        }
       // console.log('1************************'+rez);
        if(rez.length>5)
        {
            hm=rez;
         //console.log('+++++++++++++++'+hm);
        }
        var kek = Buffer.from(hm, 'base64').toString('utf8');
          console.log('Message: '+ kek+'\r\n');
          //console.log('+++++++++++++++++'+buffer+'\r\n');
          }
         
        });
      });
      msg.once('attributes', function(attrs) {
       // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        //console.log(prefix + 'Finished');
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

imap.connect();

