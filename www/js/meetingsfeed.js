// Improved "document ready".  
// Ensures no collision with the $ symbol (other libraries use it), plus tighter, smaller 
jQuery(function($) {
     $.ajax({
        type: "GET",
        url: "http://dc711.net/api/get_category_posts/?category_id=8",
        dataType: 'jsonp',
        error: function(){
            alert( 'Unable to load feed, Incorrect path or invalid feed' );
        },
        success: function(data) {
            // light validation that there is data, and there are posts in the data
            if ( ! data || ! data.hasOwnProperty('posts') ) {
                alert("No posts or data!");
                return;
            }
            
            // Get the "set" div into a jQuery variable for convenience, readability
            var set = $('<div data-role="collapsible-set">');
            // Append the "set" div to the relevant newslist div
            $('#meetingslist').append(set);
            var html = '';
            // Get the actual number of posts returned
            var num = data.posts.length;
            // Ensure that even if there's more than 10, we only show 10
            num = Math.min(num, 10);
            // Loop over the number (either actual number, or 10, whichever is smaller)
            for ( var i = 0; i < num; i++ ) {
                // First, check if that post exists....
                if ( typeof data.posts[i] === 'undefined' ) {
                    continue;
                }
                // assign to a local variable for more convenient access
                var post = data.posts[i];
                html += '<div data-role="collapsible">';
                // defensive programming - ensure title exists before accessing
                if ( post.hasOwnProperty('title') ) {
                    html += '<h4 class="entry-title">' + post.title + '</h4>';
                }
                // defensive programming - ensure content exists before accessing
                if ( post.hasOwnProperty('content') ) {
                    html += '<div class="entry-content">' + post.content + '</div>';
                }
                html += '</div>';
            }
						
            // Append the html to the set directly
            set.append(html);
						
                // Because we already have "set" in a jQuery variable, just call collapsibleset directly on it
                set.collapsibleset();

        }
    });
});