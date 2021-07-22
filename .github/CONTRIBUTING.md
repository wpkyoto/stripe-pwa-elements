# Contributing Guide

The project uses Yarn for running development scripts.
If you haven't already done so, please [install yarn](https://yarnpkg.com/en/docs/install).

## Environment

- Node.js >= 12.0.0
- [Yarn](https://yarnpkg.com/en/docs/install)

## Setup

You can fork the project onto your GitHub account.
After forking this, you can clone the project on your PC.

```bash
git clone git@github.com:YOUR_USERNAME/stripe-elements.git
cd stripe-elements
```
## Bootstrap

First, you should install all dependencies by following:

```bash
# In project root
yarn install
```

And you can start the demo app by running the `yarn start ` command.

## How to contribute?

Basic Pull Request steps:

- 1. Fork it!
- 2. Create your feature branch: `git checkout -b my-new-feature`
- 3. Commit your changes: `git commit -am 'Add some feature'`
- 4. Push to the branch: `git push origin my-new-feature`
- 5. Submit a pull request :D

### Unit testing

You can run unit test by `yarn test` command.


## How to write git commit message?

The project has adopted [Conventional Commits](https://conventionalcommits.org/ "Conventional Commits")

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

```
                       component        commit title
        commit type       /                /      
                \        |                |
                 feat(rule-context): add template url parameter to events

        body ->  The 'src` (i.e. the url of the template to load) is now provided to the
                 `$includeContentRequested`, `$includeContentLoaded` and `$includeContentError`
                 events.

 referenced  ->  Closes #8453
 issues          Closes #8454
```

- `commit type`:
    - `BREAKING CHANGE`: breaking change(major update)
    - `feat`: add new feature(minor update)
    - `fix`: fix a bug(patch update)
    - `style`: format style(patch update)
    - `refactor`: refactoring(patch update)
    - `perf`: it is related performance(patch update)
    - `test`: update tests(patch update)
    - `docs`: update documents(patch update)
    - `chore`: the other(patch update)


### Example: commit message

#### Example: Add new feature – This is minor update

```bash
feat: add new feature

Describe in details.

fix #42
```

#### Example: Fix a bug

```bash
fix: `tryUpdateState` should be called before finished 

Describe in details.

fix #42
```

#### Example: BREAKING CHANGE

```bash
feat: Change default StoreGroup

BREAKING CHANGE: make `StoreGroup` as default store

fix #42
```
