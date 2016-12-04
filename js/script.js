
function loadData() {

    var streetkey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // Replace with your google street view api key
    var nytkey = "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"; // Replace with your the new york times api key

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    console.log(street);
    var city = $('#city').val();
    var location = street + ', '+ city;

    $greeting.text("So, you wanna live at " + location + "?");

    location = location.replace(/ /g,'%20');

    var streetviewURL = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + location + '&key=' + streetkey;
    console.log(streetviewURL);

    $body.append('<img class="bgimg" src=' + streetviewURL +'>');


    // the new york times
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

    url += '?' + $.param({
        'api-key': nytkey,
        'q': (city).replace(/ /g, ''),
        'sort': 'newest'
    });

    $.getJSON(url).done(function(data){
        console.log(data);
        $nytHeaderElem.text('New York Times Articles About ' + city);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++){
            var article = articles[i];
            if (article.snippet != null){
            $nytElem.append('<li class="article">'+
                '<a href=' + article.web_url + '>' +
                article.headline.main + '</a><p>' +
                article.snippet + '</p></li>');
        };
        };
    }).fail(function(err){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded!');
    });

    // wikipedia part

    var wikiUrl = "http://en.wikipedia.org/w/api.php";
    wikiUrl += '?' + $.param({
        'action': 'opensearch',
        'search': city,
        'format': 'json',
        'callback': 'wikiCallback'
    });

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Sorry! Failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        }).done(function(response){

            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++){
                var articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href=' + url + '>' + articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }

    );


    return false;
};

$('#form-container').submit(loadData);
