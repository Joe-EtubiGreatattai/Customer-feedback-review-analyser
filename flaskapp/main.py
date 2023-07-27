from flask import Flask, render_template
import os
import json
from textblob import TextBlob
import matplotlib.pyplot as plt
import numpy as np

app = Flask(__name__)

# Function to perform sentiment analysis on reviews
def perform_sentiment_analysis(reviews):
    sentiment_scores = []
    for review in reviews:
        text = review['text']
        blob = TextBlob(text)
        sentiment_scores.append(blob.sentiment.polarity)
    return sentiment_scores

# Function to display the bar chart and recommendations
def display_bar_chart(product_reviews):
    # Extract product names and sentiment scores from the reviews
    product_names = []
    sentiment_scores = []

    for product in product_reviews:
        product_names.append(product['product_name'])
        sentiment_scores.append(product['sentiment_score'])

    # Set up the figure and axes with larger size
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.barh(np.arange(len(product_names)), sentiment_scores, align='center', height=0.4, color=['#FF8C00' if score > 0 else '#4169E1' for score in sentiment_scores])
    ax.set_xlim(-1, 1)
    ax.set_yticks(np.arange(len(product_names)))
    ax.set_yticklabels(product_names, fontsize=8)
    ax.set_xlabel('Sentiment Score')
    ax.set_title('Sentiment Analysis Results')

    # Add data labels to the bars
    for i, score in enumerate(sentiment_scores):
        ax.text(score, i, f'{score:.2f}', ha='left', va='center')

    # Save the chart as a static image
    chart_path = 'static/overall_sentiment_chart.png'
    plt.savefig(chart_path)

    # Close the figure to free up resources
    plt.close(fig)

@app.route('/')
def display_marketing_info():
    # Read the reviews from the reviews folder
    reviews_folder = 'reviews'
    product_reviews = []

    for file_name in os.listdir(reviews_folder):
        file_path = os.path.join(reviews_folder, file_name)

        with open(file_path, 'r') as file:
            reviews = json.load(file)

            # Perform sentiment analysis on the reviews
            sentiment_scores = perform_sentiment_analysis(reviews)

            # Collect information for each product
            product_info = {
                'product_name': file_name.split('.')[0],
                'reviews': reviews,
                'sentiment_scores': sentiment_scores,
                'sentiment_score': sum(sentiment_scores) / len(sentiment_scores),
                'num_reviews': len(reviews),
                'num_positive_reviews': len([score for score in sentiment_scores if score > 0]),
                'num_negative_reviews': len([score for score in sentiment_scores if score < 0])
            }

            product_reviews.append(product_info)

    # Determine the best product based on sentiment score
    best_product_index = np.argmax([product['sentiment_score'] for product in product_reviews])
    best_product_name = product_reviews[best_product_index]['product_name']

    # Display the bar chart and recommendations
    display_bar_chart(product_reviews)

    return render_template('marketing.html', product_reviews=product_reviews, best_product_name=best_product_name)

if __name__ == '__main__':
    app.run()
