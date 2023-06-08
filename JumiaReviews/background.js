chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'saveReviewsToFile') {
        var filename = request.filename;
        var reviews = request.reviews;

        saveReviewsToFile(filename, reviews);
    }
});

function saveReviewsToFile(filename, reviews) {
    var blob = new Blob([reviews], { type: 'text/plain;charset=utf-8' });
    chrome.downloads.download({ url: URL.createObjectURL(blob), filename: filename });
}
