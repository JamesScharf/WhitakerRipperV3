function ajaxWord(word)
{
    $.ajax({
       url: 'localhost:3700/getWord',
       data: {
          format: 'json'
       },
       error: function() {
          alert('<p>An error has occurred</p>');
       },
       dataType: 'jsonp',
       success: function(definition) {
           //console.log(definition);
           alert(definition);
       },
       type: 'GET'
    });
}
