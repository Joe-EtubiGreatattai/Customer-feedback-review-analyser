document.addEventListener('DOMContentLoaded', function() {
    var scrapeButton = document.getElementById('scrapeButton');
    scrapeButton.addEventListener('click', scrapeReviews);
});

function scrapeReviews() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        if (url.includes('jumia.com.ng')) {
            chrome.tabs.executeScript(tab.id, { file: 'content.js' }, function() {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                }
            });
        } else {
            displayErrorMessage('Please go to a Jumia product page to fetch reviews.');
        }
    });
}

function displayReviews(reviews) {
    var reviewsList = document.getElementById('reviewsList');
    var existingReviewsCount = reviewsList.getElementsByTagName('li').length;

    if (reviews.length > existingReviewsCount) {
        for (var i = existingReviewsCount; i < reviews.length; i++) {
            var reviewItem = document.createElement('li');
            reviewItem.innerHTML = "<b>" + reviews[i].header + "</b> " + '</br>' + reviews[i].text;
            reviewsList.appendChild(reviewItem);
        }
        displaySuccessMessage('New reviews have been added.');

        var totalReviews = document.getElementById('totalReviews');
        totalReviews.textContent = 'Total Reviews: ' + reviews.length;
    } else {
        displaySuccessMessage('No new reviews found.');
    }
}

function displayProductInfo(productName, imageUrl) {
    var productNameElement = document.getElementById('productName');
    var productImageElement = document.getElementById('productImage');
    var nxtensiontitle = document.getElementById('nxtensiontitle');
    productNameElement.textContent = productName;
    productImageElement.src = imageUrl;
    productImageElement.style.display = 'block';
    nxtensiontitle.style.display = 'none';
}

function displayErrorMessage(message) {
    var errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
}

function displaySuccessMessage(message) {
    var errorMessage = document.getElementById('errorMessage');
    errorMessage.style.color = '#008000';
    errorMessage.textContent = message;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'displayReviews') {
        displayReviews(request.reviews);
    } else if (request.action === 'displayProductInfo') {
        displayProductInfo(request.productName, request.imageUrl);
    } else if (request.action === 'displayErrorMessage') {
        displayErrorMessage(request.message);
    }
});
