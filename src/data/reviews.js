// All reviews in one list. Each product's reviews live in their own file in ./review/
// Extract text: reviews.filter((r) => r.product_id === id).map((r) => r.review_text)

import reviewsP001 from './review/P001.js';
import reviewsP002 from './review/P002.js';
import reviewsP003 from './review/P003.js';
import reviewsP004 from './review/P004.js';
import reviewsP005 from './review/P005.js';
import reviewsP006 from './review/P006.js';
import reviewsP007 from './review/P007.js';

export const reviews = [
  ...reviewsP001,
  ...reviewsP002,
  ...reviewsP003,
  ...reviewsP004,
  ...reviewsP005,
  ...reviewsP006,
  ...reviewsP007,
];
