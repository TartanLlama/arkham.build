# arkham.build

> [arkham.build](https://arkham.build) is a web-based deckbuilder for Arkham Horror: The Card Game™.

🗺️ [Roadmap](https://github.com/users/fspoettel/projects/5)

## Metadata additions

arkham.build extends the _arkhamdb deck schema_ with a few fields for additional functionality.

- `meta.extra_deck`: Parallel Jim's spirit deck. Format: comma-separated list of ids `"id1,id2,id3"`.
- `meta.attachments_{code}`: cards that are attached to a specific setup deck, for example _Joe Diamond_ or _Stick to the Plan_. Format: comma-separated list of ids `"id1,id2,id2,id3"`.
- `meta.card_pool`: packs that can be used for this deck. Used for limited pool deckbuilding such as #campaign-playalong. Format: `"<pack_code>,<pack_code>"`. For arkham.build, new format pack codes take precedence over old format.
- `meta.sealed_deck`: card ids that are pickable for this deck. Used for sealed deckbuilding. Format: comma-separated list of `id` / `quantity` pairs in the format `"id:2,id:1,..."`.
- `meta.sealed_deck_name`: name of the sealed deck definition used. format: string.
- `meta.transform_into`: code of the investigator that this deck's investigator has transformed into. I.e. `04244` for _Body of a Yithian_.

## File formats

### Sealed decks

The sealed deck feature expects a csv file in the format:

```csv
code,quantity
01039,2
01090,2
06197,2
07032,2
```

In this example, the sealed deck contains two copies of _Deduction_, _Perception_, _Practice Makes Perfect_ and _Promise of Power_, so users would only be able to add these cards to their deck in the deck builder.

## Development

1. Create an `.env` file from `.env.example`.
2. `npm install`
3. `npm run dev`

### API

The API is a separate, private git project hosted as a Cloudflare worker.

### Icons

Arkham-related SVG icons are sourced from ArkhamCards's [icomoon project](https://github.com/zzorba/ArkhamCards/blob/master/assets/icomoon/project.json) and loaded as webfonts. Additional icons are bundled as SVG via `vite-plugin-svgr` or imported from `lucide-react`.

<details>
  <summary><h2>Template readme</h2></summary>

# vite-react-ts-template

> extended version of [vite](https://vitejs.dev/)'s official `react-ts` template.

additional features:

- [biome](https://biomejs.dev/) for linting and code formatting.
- [lefthook](https://github.com/evilmartians/lefthook) for pre-commit checks.
- [vitest](https://vitest.dev/) for unit testing.
- [playwright](https://playwright.dev/) for end-to-end testing.
- [github actions](https://github.com/features/actions) for continuous integration.
- [browserslist](https://github.com/browserslist/browserslist) + [autoprefixer](https://github.com/postcss/autoprefixer).

## Install

```sh
# install dependencies.
npm i
```

## Develop

```sh
npm run dev
```

## Build

```sh
npm run build
```

## Test

```sh
npm test

# run vitest in watch mode.
npm run test:watch

# collect coverage.
npm run test:coverage
```

## Lint

```sh
npm run lint
```

## Format

```sh
npm run fmt
```

Prettier will be run automatically on commit via [lint-staged](https://github.com/okonet/lint-staged).

## Preview

Serves the content of `./dist` over a local http server.

```sh
npm run preview
```

</details>
