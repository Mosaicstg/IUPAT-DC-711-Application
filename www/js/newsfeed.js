var errorTimeout;

function updateNews( force ) {
  var newsKey = 'news:category7';
  if ( force || storage.isStale( newsKey, '2 hours' ) ) {
    $.ajax( {
      type: "GET",
      url: "http://dc711.net/api/get_category_posts/?category_id=7",
      dataType: 'jsonp',
      timeout: 5000,
      error: function ( x, t, m ) {
        connectError( x, t, m );
      },
      success: function ( data ) {
        clearTimeout( errorTimeout );
        storage.save( newsKey, data );
        outputNews( data );
      }
    } );
  } else {
    var data = storage.get( newsKey );
    outputNews( data );
  }
}

function connectError( x, t, m ) {
  if ( t == 'timeout' ) {
    $( '#newslist' ).find( 'div.error' ).remove();
    $( '#newslist' ).prepend( '<div class="error noconnection">Could not connect to get the news.  Are you connected to the internet?</div>' );
  }

}

function outputNewsError( err, eClass ) {
  $( '#newslist' ).html( '' ).append( '<div class="error ' + eClass + '">' + err + '</div>' );
}

function outputNews( data ) {
  var set = $( '<div data-role="collapsible-set">' );
  if ( !data || !data.hasOwnProperty( 'posts' ) ) {
    outputNewsError( 'No news events at this time.  Please check back soon.', 'nonews' );
    return;
  }

  $( '#newslist' ).html( '' ).append( set );
  var html = '';
  var num  = data.posts.length;
  num      = Math.min( num, 10 );
  for ( var i = 0; i < num; i++ ) {
    // First, check if that post exists....
    if ( typeof data.posts[ i ] === 'undefined' ) {
      continue;
    }

    var post = data.posts[ i ];
    html += '<div data-role="collapsible">';
    if ( post.hasOwnProperty( 'title' ) ) {
      html += '<h4 class="entry-title">' + post.title + '</h4>';
    }
    if ( post.hasOwnProperty( 'content' ) ) {
      html += '<div class="entry-content">' + post.content + '</div>';
    }
    html += '</div>';
  }

  set.append( html );
  set.collapsibleset();
}

(function ( $ ) {
  $( document ).on( 'click', 'a.refresh_news', function () {
    updateNews( true );
  } );

  updateNews();
})( jQuery );


