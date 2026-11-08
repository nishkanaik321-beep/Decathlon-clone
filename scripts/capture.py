import json
import re
import time
from playwright.sync_api import sync_playwright

PRODUCTS = {
    "P001": "https://www.decathlon.in/p/8733464/men-running-shoes-superior-grip-cushioned-upto-10km-week-jogflow100-black",
    "P002": "https://www.decathlon.in/p/864312/men-cotton-blend-gym-t-shirt-slim-fit-500-khaki-print",
    "P003": "https://www.decathlon.in/p/8018574/weight-training-20-kg-partly-recycled-cast-iron-dumbbells-set",
    "P004": "https://www.decathlon.in/p/8800516/gallon-water-bottle-2-2l-leak-proof-cap-multi-purpose-grey",
    "P005": "https://www.decathlon.in/p/8669830/adult-swimming-goggles-men-women-uv-protection-xbase-anti-fog-clear-lenses-black",
    "P006": "https://www.decathlon.in/p/8764674/sport-collection/hiking-backpack-10-l-nh-arpenaz-50",
    "P007": "https://www.decathlon.in/p/8789910/size-5-machine-stitched-football-training-ball-white",
}

def capture(pid, url):
    hits = []
    model_id_match = re.search(r"/p/(\d+)/", url)
    model_id = model_id_match.group(1) if model_id_match else None

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )

        def on_response(r):
            if "review" in r.url.lower() and "json" in r.headers.get("content-type", ""):
                try:
                    data = r.json()
                    if not any(h["url"] == r.url for h in hits):
                        hits.append({"url": r.url, "data": data})
                except Exception:
                    pass

        page.on("response", on_response)

        print(f"[{pid}] Loading {url}...")
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(2000)

        # Scroll to reviews section
        try:
            page.locator("#reviews").scroll_into_view_if_needed(timeout=5000)
        except Exception:
            page.mouse.wheel(0, 4000)
        time.sleep(2)

        # Retrieve review batches through active browser session
        if model_id:
            # Fetch 200 reviews per product to guarantee at least 100 unique English text reviews
            max_offsets = [0, 100]
            for offset in max_offsets:
                try:
                    res = page.evaluate(f"""async () => {{
                        try {{
                            const resp = await fetch('/services/be/reviews/api/v4/decathlon.product:{model_id}?range={offset}-{offset+99}', {{
                                headers: {{
                                    'application-name': 'decashop',
                                    'accept': 'application/json, text/plain, */*',
                                    'channel': 'WEB',
                                    'xd-key': 'GGHHyT5TGShTREbvGHKKdfERWTMplcsdTTe1aet',
                                    'tenant': 'b2c',
                                    'x-country': 'IN',
                                    'version': '1.0.0'
                                }}
                            }});
                            const data = await resp.json();
                            return {{ url: resp.url, data: data }};
                        }} catch (e) {{
                            return null;
                        }}
                    }}""")
                    if res and res.get("data"):
                        if not any(h["url"] == res["url"] for h in hits):
                            hits.append(res)
                except Exception as e:
                    print(f"[{pid}] Fetch offset {offset} notice: {e}")
                time.sleep(1)

        page.wait_for_timeout(1000)
        browser.close()

    filename = f"raw_{pid}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(hits, f, indent=2, ensure_ascii=False)

    total_reviews = sum(len(h.get("data", {}).get("reviews", [])) for h in hits)
    print(f"[{pid}] Saved {len(hits)} response hit(s) to {filename} ({total_reviews} reviews captured)")

if __name__ == "__main__":
    import sys
    target_pids = sys.argv[1:] if len(sys.argv) > 1 else list(PRODUCTS.keys())
    for pid in target_pids:
        if pid in PRODUCTS:
            capture(pid, PRODUCTS[pid])
            time.sleep(3)  # polite delay between products
