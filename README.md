# Personal Blog

## Project Structure

```bash
/
├── public/
│   ├── assets/
│   ├── pagefind/          # auto-generated at build time
│   └── favicon.png
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   ├── data/
│   │   └── blog/
│   │       ├── en/        # English articles
│   │       └── fr/        # French articles
│   ├── i18n/              # Translations & i18n utilities
│   ├── layouts/
│   ├── pages/
│   │   ├── fr/            # French routes
│   │   └── ...            # English routes (default)
│   ├── scripts/
│   ├── styles/
│   ├── utils/
│   ├── config.ts
│   ├── constants.ts
│   └── content.config.ts
└── astro.config.ts
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                                        |
| :--------------------- | :------------------------------------------------------------ |
| `pnpm install`         | Install dependencies                                          |
| `pnpm run dev`         | Start local dev server at `localhost:4321`                    |
| `pnpm run build`       | Build the production site to `./dist/`                        |
| `pnpm run preview`     | Preview the build locally before deploying                    |

## License

The source code of this site (excluding article content) is distributed under the MIT License.

The editorial content of this blog, including articles and code snippets within those articles, is protected under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/).

This means you are free to share the content as-is, with proper attribution, but **any modification or commercial use is prohibited without prior written permission**.

## Acknowledgements

[AstroPaper](https://github.com/satnaing/astro-paper) is an Astro theme created by [Sat Naing](https://satnaing.dev).
