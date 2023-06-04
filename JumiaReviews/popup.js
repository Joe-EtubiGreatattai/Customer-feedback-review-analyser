document.addEventListener('DOMContentLoaded', function() {
    var scrapeButton = document.getElementById('scrapeButton');
    scrapeButton.addEventListener('click', scrapeReviews);
});

function scrapeReviews() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var tab = tabs[0];
        if (tab.url.includes('jumia.com.ng')) {
            chrome.tabs.executeScript(tab.id, { file: 'content.js' }, function() {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                }
            });
        }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'displayReviews') {
        var reviewsList = document.getElementById('reviewsList');
        var reviews = request.reviews;

        if (reviews.length > 0) {
            for (var i = 0; i < reviews.length; i++) {
                var reviewItem = document.createElement('li');
                reviewItem.textContent = reviews[i].header + ': ' + reviews[i].text;
                reviewsList.appendChild(reviewItem);
            }
        } else {
            var noReviewsItem = document.createElement('li');
            noReviewsItem.textContent = 'No reviews found.';
            reviewsList.appendChild(noReviewsItem);
        }
    }
});