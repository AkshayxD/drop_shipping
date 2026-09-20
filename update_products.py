import json
import re
import os

from google import genai
import math

# Configure Gemini (Make sure to set GEMINI_API_KEY environment variable)
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    client = genai.Client(api_key=api_key)
else:
    print("Warning: GEMINI_API_KEY environment variable not set. Will fallback to original description.")
    client = None

PRODUCTS_LIST_FILE = "products_list.txt"
PRODUCTS_JS_FILE = "products.js"

def get_product_id(url):
    # e.g., https://www.meesho.com/.../p/6m9m4l -> 6m9m4l
    match = re.search(r'/p/([^/?]+)', url)
    return match.group(1) if match else None

def load_existing_products():
    if not os.path.exists(PRODUCTS_JS_FILE):
        return []
    with open(PRODUCTS_JS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract JSON part from JS file
    match = re.search(r'const\s+products\s*=\s*(\[.*\]);', content, re.DOTALL)
    if match:
        try:
            json_str = match.group(1)
            # Basic fix for unquoted keys but ignore http(s):
            json_str = re.sub(r'(?m)^\s*(\w+)\s*:', r'"\1":', json_str)
            # Remove trailing commas
            json_str = re.sub(r',\s*}', '}', json_str)
            json_str = re.sub(r',\s*\]', ']', json_str)
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"Error parsing existing products.js: {e}")
            return []
    return []

def save_products(products):
    js_content = f"// Curated Products for Lumina Store\nconst products = {json.dumps(products, indent=4)};\n"
    with open(PRODUCTS_JS_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

def fetch_meesho_product(url):
    html_content = ""
    scraper_api_key = os.environ.get("SCRAPER_API_KEY")
    
    if not scraper_api_key:
        print("Error: SCRAPER_API_KEY environment variable not set.")
        return None

    try:
        import requests
        import time
        
        for attempt in range(3):
            payload = {'api_key': scraper_api_key, 'url': url, 'premium': 'true'}
            
            print(f"Fetching via ScraperAPI (Attempt {attempt+1}/3)...")
            r = requests.get('http://api.scraperapi.com', params=payload, timeout=60)
            
            if r.status_code == 200:
                html_content = r.text
                break
            else:
                print(f"ScraperAPI failed with status code {r.status_code}: {r.text}")
                if attempt < 2:
                    print("Retrying in 3 seconds...")
                    time.sleep(3)
                else:
                    return None
            
    except Exception as e:
        print(f"Failed to fetch {url} using ScraperAPI: {e}")
        return None

    if "Access Denied" in html_content or "sec-if-cpt-container" in html_content:
        print(f"Failed to fetch {url}: Blocked by Meesho's Akamai bot protection (CAPTCHA/Access Denied).")
        return None

    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>', html_content)
    if not match:
        print(f"Could not extract Product JSON from {url}")
        return None
        
    try:
        next_data = json.loads(match.group(1))
        product_data = next_data['props']['pageProps']['initialState']['product']['details']['data']
    except Exception as e:
        print(f"Error parsing product data from {url}: {e}")
        return None
        
    original_price = float(product_data.get('price', 0))
    markup_price = math.ceil(original_price * 1.8)
    
    # Psychological Pricing: Round to nearest 99
    markup_price = ((markup_price // 100) * 100) + 99
    if markup_price < math.ceil(original_price * 1.8):
        markup_price += 100
    
    original_desc = product_data.get('description', '')
    original_name = product_data.get('name', 'Premium Product')
    
    images = product_data.get('images', [])
    if isinstance(images, str):
        images = [images]

    # AI Enhancement
    category = "Decor"
    premium_desc = original_desc
    premium_name = original_name
    
    if client:
        try:
            prompt = f"""
            You are a luxury copywriter for a premium home decor brand called 'Lumina'. 
            Rewrite the following product description to sound luxurious, premium, and appealing (2-3 short sentences).
            Provide a short, premium, and elegant Product Title (maximum 4-5 words).
            Also, provide a single 1-2 word category for this product (e.g., 'Figurines', 'Showpieces', 'Lighting', 'Sculptures').
            
            Original Product Name: {original_name}
            Original Description: {original_desc}
            
            Output format MUST BE exactly:
            Title: [Your Premium Title]
            Category: [Your Category]
            Description: [Your Description]
            """
            result = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            text = result.text.strip()
            
            title_match = re.search(r'Title:\s*(.+)', text, re.IGNORECASE)
            cat_match = re.search(r'Category:\s*(.+)', text, re.IGNORECASE)
            desc_match = re.search(r'Description:\s*(.+)', text, re.IGNORECASE | re.DOTALL)
            
            if title_match: premium_name = title_match.group(1).strip()
            if cat_match: category = cat_match.group(1).strip()
            if desc_match: premium_desc = desc_match.group(1).strip()
            
        except Exception as e:
            print(f"AI Generation failed for {url}: {e}")

    return {
        "id": get_product_id(url),
        "name": premium_name,
        "category": category,
        "price": f"₹{markup_price}",
        "description": premium_desc,
        "image": images[0] if images else "",
        "images": images
    }

def main():
    if not os.path.exists(PRODUCTS_LIST_FILE):
        print(f"{PRODUCTS_LIST_FILE} not found.")
        return

    with open(PRODUCTS_LIST_FILE, 'r', encoding='utf-8') as f:
        urls = [line.strip() for line in f if line.strip()]

    target_ids = [get_product_id(url) for url in urls if get_product_id(url)]
    
    existing_products = load_existing_products()
    existing_dict = {str(p['id']): p for p in existing_products}
    
    new_products = []
    
    for url, pid in zip(urls, target_ids):
        if not pid:
            continue
            
        if pid in existing_dict:
            print(f"Skipping {pid} (Already exists)")
            new_products.append(existing_dict[pid])
        else:
            print(f"Fetching new product: {url}")
            prod_data = fetch_meesho_product(url)
            if prod_data:
                new_products.append(prod_data)
                
    save_products(new_products)
    print(f"\nDone! Updated {PRODUCTS_JS_FILE} with {len(new_products)} products.")

if __name__ == "__main__":
    main()
