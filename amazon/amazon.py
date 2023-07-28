import tkinter as tk
from tkinter import messagebox
import json
import os
import re
import unicodedata
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By

# Path to your chromedriver executable
webdriver_service = Service('/path/to/chromedriver')

def fetch_reviews():
    url = url_entry.get()

    try:
        driver = webdriver.Chrome(service=webdriver_service)
        driver.get(url)

        # Fetching the product name
        product_name_element = driver.find_element(By.CSS_SELECTOR, 'h1.a-size-large.a-spacing-none span.a-size-large.product-title-word-break')
        product_name = product_name_element.text.strip()
        product_label.config(text="Product Name: " + product_name)

        # Remove invalid characters from the product name for the filename
        valid_chars = "-_()[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        truncated_product_name = ''.join(c for c in product_name if c in valid_chars)[:100].strip()

        # Fetching the reviews
        review_div_tags = driver.find_elements(By.CSS_SELECTOR, 'div.a-expander-content.reviewText.review-text-content.a-expander-partial-collapse-content')

        review_list = []
        for div_tag in review_div_tags:
            span_tags = div_tag.find_elements(By.TAG_NAME, 'span')
            review_text = " ".join([span.text.strip() for span in span_tags])
            review_text = unicodedata.normalize("NFKD", review_text)  # Remove special characters
            review_list.append({
                'header': '',
                'text': review_text
            })

        num_reviews = len(review_list)

        review_label.config(text="Number of Reviews: " + str(num_reviews))

        reviews_text.delete('1.0', tk.END)
        for i, review in enumerate(review_list, start=1):
            reviews_text.insert(tk.END, f"Review {i}:\n")
            reviews_text.insert(tk.END, review['text'] + "\n")
            reviews_text.insert(tk.END, '-' * 50 + "\n")

        driver.quit()

        # Save reviews to JSON file
        json_data = json.dumps(review_list, indent=2)

        file_name = re.sub(r'[^\w\s-]', '', truncated_product_name).strip() + ".json"
        file_path = os.path.join('flaskapp/reviews', file_name)

        reviews_dir = os.path.dirname(file_path)
        os.makedirs(reviews_dir, exist_ok=True)

        with open(file_path, 'w', encoding='utf-8') as json_file:
            json_file.write(json_data)

        messagebox.showinfo("Success", f"Reviews saved to {file_path}")

    except Exception as e:
        messagebox.showerror("Error", str(e))


# Create the main window
window = tk.Tk()
window.title("Amazon Review Scraper")
window.geometry("600x400")

# Create URL entry
url_label = tk.Label(window, text="URL:")
url_label.pack()
url_entry = tk.Entry(window, width=50)
url_entry.pack()

# Create Fetch button
fetch_button = tk.Button(window, text="Fetch Reviews", command=fetch_reviews)
fetch_button.pack()

# Create result labels
product_label = tk.Label(window, text="Product Name: ")
product_label.pack()
review_label = tk.Label(window, text="Number of Reviews: ")
review_label.pack()

# Create text area for reviews
reviews_text = tk.Text(window, height=15, width=70)
reviews_text.pack()

# Run the main window loop
window.mainloop()
