# mbtech.github.io

Personal site of Muhammad Bilal: a desktop you can play with, in three styles.

| Style  | Page      | Code                      |
|--------|-----------|---------------------------|
| Modern | `/`       | `assets/styles/modern/`   |
| 2000s  | `/2000s/` | `assets/styles/2000s/`    |
| 90s    | `/90s/`   | `assets/styles/90s/`      |

Visitors switch styles from the menu in each style (or `style 90s` in the Terminal window).
The site remembers the last style a visitor used, and `/` sends them back to it.

## Updating the content

Everything the site says is in **`data/site.js`**: bio, current roles, services, timeline,
projects, papers, citation counts and the reading list. All three styles read from it, so edit it once.

- Add a paper: add an entry to `papers` (newest first). `older: true` hides it behind
  "show older papers". `url` can be a link or a PDF in `papers/`.
- Change a role: edit `roles`. Dates are decimal years (2021.5 is about July 2021);
  `null` as the end date means it is still going.
- Citations: update `scholar` and each paper's `cites` from Google Scholar.
- Currently reading: edit `books.reading`. It shows as a widget on the modern desktop; move a book
  to a shelf when you finish it.

## Links that open a window

`/?open=papers,reading` opens those windows directly. Window ids: `about`, `work`, `journey`, `projects`,
`papers`, `reading`, `links`, `terminal`, `bin`. The old `/reading` page redirects to the
reading list.

## Running it locally

It is plain HTML, CSS and JavaScript, with no build step (`.nojekyll` turns off Jekyll on GitHub Pages).

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Pages use absolute paths, so open them through a server,
not as files.
