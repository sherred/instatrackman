$(document).ready(function() {
	run();
	$('#title a').click(function(e) {
	  e.preventDefault();
	  $('#song-meta').toggle();
	});
	
	$('#next').click(function(e) {
  		e.preventDefault();
  		$('#chapter-text').empty();
  		clearInterval(timer);
  		run();
	});
	
	chapter_timer = setInterval(run(),90000);
	
});

var chapter_timer;

var typewrite = function(element) {
            var ele = $(element), str = ele.text(), progress = 0;
            ele.text('');
            clearInterval(timer); 
            timer = setInterval(function() {
                ele.text(str.substring(0, progress++) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) clearInterval(timer);
            }, 100);
    };


function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

var s = Math.random,t,chapter,timer;

var run = function() {
  var key = Math.floor((21)*s()) + 1;
  if(key == 20) key = 21; //little hack for chapter nums
  chapter = getObjects(chapter_meta, 'chapter', key);
  $('#title a').text(chapter[0].chapter_name);
  $('#song-meta').text(chapter[0].song_meta);
  getPic(chapter[0].tag);
  populateChapterText(chapter[0].chapter);
  clearInterval(t);
  t = setInterval(function() {getPic(chapter[0].tag); },15000);	
};

$.YQL = function(query, callback) {
    if (!query || !callback) {
        throw new Error('$.YQL(): Parameters may be undefined');
    }
    var encodedQuery = encodeURIComponent(query.toLowerCase()),
        url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodedQuery + '&format=json&callback=?';
    $.getJSON(url, callback);
};
getPic = function(tag) {
  $.YQL("select * from rss where url='http://instagr.am/tags/"+tag +"/feed/recent.rss' limit 20", function(data) {
      var post = data.query.results.item[s() * 20 | 0];
      renderPic(post.link);
  });
}
renderPic = function(img) {
  $('html').css({
      'background-image': 'url(' + img + ')'
  });
};
populateChapterText = function(chapter) {
  paras = getObjects(chapters, 'chapter', chapter);
  var chaptertext = '';
  for(var i=0;i<paras.length;i++){
    chaptertext += '<p>'+paras[i].text+'</p>';
  }
  $('#chapter-text').html(chaptertext);
  typewrite($('#chapter-text'));
  
};