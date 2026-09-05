# How's Da Movie? — Movie Experience Tracker

A mobile-first movie-experience rating site modeled after the supplied How's Da Chow screenshots.

## Files

- `index.html` — page structure
- `styles.css` — dark/red responsive styling
- `app.js` — reviewers, experience dropdowns, search, filtering, accordions, stats, and local storage

## Run it

Open `index.html` in a browser.

## Put it on GitHub Pages

Create a GitHub repository, upload these three files to the repository root, then enable GitHub Pages from the repository's Pages settings.

## Important

The current version uses browser `localStorage`. That means a rating added on one phone/computer is not automatically visible to the other members of the group.

For a true shared tracker where everybody sees the same ratings, the next version should connect the form to a small hosted database such as Supabase or Firebase. The front end is already structured so that can be added without redesigning the site.
