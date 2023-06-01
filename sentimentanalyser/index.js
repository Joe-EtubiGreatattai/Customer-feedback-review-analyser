// Import the necessary modules from the Natural library
const { SentimentAnalyzer, PorterStemmer } = require('natural');

// Create a new instance of the SentimentAnalyzer
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var review = 'The product arrived in perfect condition, super well packed, with bubble bag. The quality of the product is very good, and they are very beautiful and elegant';

var tokreview = tokenizer.tokenize(review);

const result = analyzer.getSentiment(tokreview);
console.log('Result of Text:', result);

if (result >= 0.9) {
    console.log("Text sentiment: Excellent");
} else if (result >= 0.7) {
    console.log("Text sentiment: Very positive");
} else if (result >= 0.5) {
    console.log("Text sentiment: Positive");
} else if (result >= 0.3) {
    console.log("Text sentiment: Slightly positive");
} else if (result >= 0.1) {
    console.log("Text sentiment: Neutral");
} else if (result >= -0.1) {
    console.log("Text sentiment: Slightly negative");
} else if (result >= -0.3) {
    console.log("Text sentiment: Negative");
} else if (result >= -0.5) {
    console.log("Text sentiment: Very negative");
} else if (result >= -0.7) {
    console.log("Text sentiment: Extremely negative");
} else {
    console.log("Text sentiment: Unknown");
}