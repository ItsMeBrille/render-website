from flask import Flask, render_template, redirect, url_for
import requests
from bs4 import BeautifulSoup
import datetime

def get_today_menu():
    response = requests.get("https://sky-net.no/meny/")
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        # Find today's date
        today = datetime.datetime.today().strftime('%a, %d')
        # Find the table entries for today's date
        today_entries = soup.find('td', text=today)
        if today_entries:
            # Extract main course and dessert
            main_course = today_entries.find_next_sibling('td').get_text(strip=True)
            dessert = today_entries.find_next_sibling('td').find_next_sibling('td').get_text(strip=True)
            return {
                "main_course": main_course,
                "dessert": dessert
            }
        else:
            print("Today's menu is not available.")
    else:
        print("Failed to fetch the webpage.")


def get_first_post_data():
    # Fetch the HTML content of the webpage
    response = requests.get("https://sky-net.no/posts/")
    
    # Check if the request was successful
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        first_post = soup.find('div', class_='infobox')
        if first_post:
            post_link = "https://sky-net.no/posts/" + first_post['onclick'].split("'")[1]
            return {
                "author": first_post.find(class_='meta author').text.strip(),
                "title": first_post.find('h2').text.strip(),
                "description": first_post.find(class_='introtext').p.text.strip(),
                "image": "https://sky-net.no"+first_post.find('img')['src'],
                "url": post_link
            }
        else:
            print("No post found on the page.")
    else:
        print("Failed to fetch the webpage.")


### Flask app
app = Flask(__name__)

# Return index.html
@app.route("/")
def index():
    # Call the function and print the result
    first_post_data = get_first_post_data()
    today_menu = get_today_menu()
    return render_template("index.html", data=[first_post_data, today_menu])


# Index redirect
@app.route("/index.html")
def redirect_to_index():
    return redirect(url_for("index"))

# Run app
if __name__ == "__main__":
    app.run(debug=True)