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

function getProductInfo() {
    var productImage = document.querySelector('div.sldr._img._prod.-rad4.-oh.-mbs a.itm img');
    var productName = document.querySelector('div.-fs0.-pls.-prl h1.-fs20.-pts.-pbxs');

    var productInfo = {
        imageUrl: productImage ? productImage.src : '',
        productName: productName ? productName.textContent.trim() : ''
    };

    return productInfo;
}

function saveReviewsToFile(reviews, productName) {
    var textToSave = reviews.map(function(review) {
        return review.header + '\n' + review.text + '\n\n';
    }).join('');

    var blob = new Blob([textToSave], { type: 'text/plain' });
    var fileName = 'reviews/' + productName + '.txt';

    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

var scrapedReviews = scrapeReviews();
var productInfo = getProductInfo();

if (productInfo.productName === '') {
    chrome.runtime.sendMessage({ action: 'displayErrorMessage', message: 'Please provide a link to a Jumia product page.' });
} else if (scrapedReviews.length === 0) {
    chrome.runtime.sendMessage({ action: 'displayErrorMessage', message: 'No reviews found for this product.' });
} else {
    saveReviewsToFile(scrapedReviews, productInfo.productName);
    chrome.runtime.sendMessage({ action: 'displayReviews', reviews: scrapedReviews });
    chrome.runtime.sendMessage({ action: 'displayProductInfo', productName: productInfo.productName, imageUrl: productInfo.imageUrl });
}
