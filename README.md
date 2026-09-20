# Lumina Drop Shipping

Lumina is a premium, luxury-curated drop shipping website. The store automatically syncs products from a provided list of Meesho URLs, applies a psychological markup pricing strategy, and uses Google's Gemini AI to generate premium luxury descriptions for each item.

## Setup & Installation

### 1. Install Dependencies
Make sure you have Python installed, then install the required Python packages:

```bash
pip install -r requirements.txt
```

### 2. Install Playwright Browsers
The script uses a stealth browser to bypass Akamai bot protection. You need to install the Chromium binaries:

```bash
playwright install chromium
```

### 3. Get a Gemini API Key
To allow the script to automatically write luxury descriptions for your products, you need a Google Gemini API key:
1. Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)** and sign in.
2. Click **Create API Key**.
3. Set the key in your terminal before running the script:

**On Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

**On Mac/Linux:**
```bash
export GEMINI_API_KEY="your_api_key_here"
```

## How to Add New Products

1. Find the product you want to sell on Meesho.
2. Open `products_list.txt` and paste the URL on a new line.
3. Run the update script:
   ```bash
   python update_products.py
   ```
4. The script will stealthily fetch the product, apply an 80% markup rounded to the nearest `.99`, generate a premium description, and update your live `products.js` file automatically!
5. Refresh your `index.html` to see the newly added product.
