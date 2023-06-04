function scrapeReviews() {
    var reviewArticles = Array.from(document.querySelectorAll('article.-pvs.-hr._bet'));
    var reviews = [];

    reviewArticles.forEach(function(article) {
        var header = article.querySelector('h3.-m.-fs16.-pvs');
        var text = article.querySelector('p.-pvs');
        if (header && text) {
            var review = {
                header: header.textContent.trim(),
                text: text.textContent.trim()
            };
            reviews.push(review);
        }
    });

    return reviews;
}

var scrapedReviews = scrapeReviews();
chrome.runtime.sendMessage({ action: 'displayReviews', reviews: scrapedReviews });