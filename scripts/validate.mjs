import { products } from '../src/data/products.js';
import { reviews } from '../src/data/reviews.js';
import { reviewStats } from '../src/data/reviewStats.js';

let allPassed = true;

function check(condition, message) {
  if (!condition) allPassed = false;
  console.log(condition ? 'PASS' : 'FAIL', message);
}

check(products.length === 7, `7 products (${products.length})`);

check(
  new Set(reviews.map((r) => r.review_id)).size === reviews.length,
  `unique review IDs (${reviews.length} reviews)`
);

check(
  reviews.every((r) => products.some((p) => p.id === r.product_id)),
  'every review links to a product'
);

check(
  reviews.every(
    (r) => typeof r.review_text === 'string' && r.rating >= 1 && r.rating <= 5
  ),
  'review_text is a string and rating is 1-5'
);

for (const p of products) {
  const count = reviews.filter((r) => r.product_id === p.id).length;
  const site = reviewStats[p.id];
  check(count >= 100 && count <= 150, `${p.id}: ${count} reviews (100-150) | site ${site.average} (${site.count})`);
}

process.exit(allPassed ? 0 : 1);
