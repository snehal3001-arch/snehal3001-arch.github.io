# Digital Universe of Snehal

A premium cosmic-inspired personal portfolio built with HTML5, CSS3 and vanilla JavaScript. It presents Snehal Chorge's introduction, education, technical skills, projects, certifications, resume and contact details.

## Live site

No public URL is configured yet. Add the GitHub Pages URL here after the first deployment.

## Project structure

```text
snehal-portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── icons/
│   │   ├── .gitkeep
│   │   └── favicon.svg
│   ├── images/
│   │   └── .gitkeep
│   └── Snehal_Chorge_Resume_Updated.pdf
└── README.md
```

The visual artwork is built with CSS and inline SVG; there are no stock images or third-party icon libraries.

## Requirements

- A modern browser (Chrome, Edge, Firefox or Safari).
- No build tools, package manager or framework are required.
- Internet access is optional: Google Fonts are used with system-font fallbacks.

## Run locally

Open `index.html` directly, or serve the folder statically:

```bash
cd snehal-portfolio
python -m http.server 8000
```

Then open <http://localhost:8000>.

If port 8000 is unavailable, use another port:

```bash
python -m http.server 8123
```

Then open <http://localhost:8123>.

## What is included

- Responsive glass navigation with seven section links and an SC monogram.
- Immersive hero with an animated canvas starfield and CSS orbital artwork.
- About, Education, Skills, Projects, Certifications, Resume and Contact sections.
- Interactive education timeline, skill filters and skill detail panel.
- Three project cards; no links are shown until real URLs are provided.
- Resume download using a relative path to `assets/Snehal_Chorge_Resume_Updated.pdf`.
- Contact form with client-side validation and a URL-encoded `mailto:` fallback. No backend is used.
- Reduced-motion support, keyboard-accessible controls, visible focus states and semantic landmarks.

## Assets and links

- All local asset paths are relative, so the site works from a repository subpath on GitHub Pages.
- The resume PDF is served from `assets/Snehal_Chorge_Resume_Updated.pdf` and downloaded with the `download` attribute.
- External links point only to the supplied LinkedIn and GitHub profiles, plus Google Fonts.
- No credentials, API keys or `.env` files are used. Do not add them to this repository.

## Deploy to GitHub Pages

1. Create a new repository on GitHub. For a user site, name it `<your-username>.github.io`. For a project site, use any repository name; the site will live under `/<repository-name>/`.
2. Initialise and push the project:

   ```bash
   cd snehal-portfolio
   git init
   git add .
   git commit -m "Initial portfolio deployment"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repository-name>.git
   git push -u origin main
   ```

3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, set:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Save, then wait for the deployment to finish.
6. Open the URL shown by GitHub Pages. For a project site it will be:

   ```text
   https://<your-username>.github.io/<repository-name>/
   ```

Because all paths are relative, no base URL changes are needed for a repository subpath.

## Updating the site

After making changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

GitHub Pages will rebuild automatically.

## Manual additions still pending

- Real GitHub and/or live-demo URLs for project cards, when available.
- Certificate view links, if certificate files or URLs are provided.
- The public GitHub Pages URL in the **Live site** section above after deployment.

## Metadata

The page title, meta description, favicon and Open Graph/Twitter sharing metadata are configured in `index.html`. Update them there if the site title or public URL changes.
