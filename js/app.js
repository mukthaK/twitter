var userState = {};
//Get the tweet message and POST it
$('#tweetForm').submit(function (event) {
    event.preventDefault();

    const tweetText = $('.tweetMsg').val();
    if(tweetText === ''){
        $('.error').html("Please write something to tweet!");
    }
    $('.tweetMsg').val(``);

    let now = new Date().toLocaleString(undefined, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).replace(/,/g,'');

    $.ajax({
        url: 'http://mock.aphetech.com/feed',
        data: {
            name: userState.name,
            handle: userState.handle,
            tweet: tweetText,
            date: now
        },
        dataType: 'json',
        method: 'POST'
    }).done(function (data) {
        //display tweets
        displayRecentTweets();
    }).fail(function () {
        $('.error').html("Oops! Tweet failed. Try again");
    });
});

// Displaying the recent tweets
function displayRecentTweets() {
    $.ajax({
        url: 'http://mock.aphetech.com/feed',
        dataType: 'jsonp',
        method: 'GET'
    }).done(function (data) {
        // Append result to html
        if(data.length === 0){
            $('.error').html("No recent tweets to display");
        } else {
            let buildHtmlOutput = '';
            data.slice().reverse().forEach(function(item) {
                buildHtmlOutput += `<div>`;
                buildHtmlOutput += `<span>${item.name}</span>`;
                buildHtmlOutput += `<span>@${item.handle}</span>`;
                buildHtmlOutput += `<span>${item.date}</span>`;
                buildHtmlOutput += `<p>${item.tweet}</p>`;
                buildHtmlOutput += `</div>`;
            });
            $('#allTweets').html(buildHtmlOutput);
        }
    }).fail(function () {
        $('.error').html("Error getting recent tweets");
    });
}

// On load, user details are populated
$(document).ready(function () {
    $.ajax({
        url: 'http://mock.aphetech.com/profile',
        dataType: 'jsonp',
        method: 'GET'
    }).done(function (data) {
            // Set global variable to hold user data
            userState.name = data.name;
            userState.handle = data.handle;
            // Append result to html
            $('#userImage').attr('src', data.imageUrl);
            $('#userName').html(data.name);
            $('#tweets').html(`${data.tweets} tweets`);
            $('#followers').html(`${data.followers} followers`);
            $('#following').html(`${data.following} following`);
            //display tweets
            displayRecentTweets();

    }).fail(function () {
        $('.error').html("Error getting user information");
    });
});

