# <img src="./assets/duolingo.png" alt="lplp" width="20" height="20"> Duolingo README Stats <img src="./assets/duolingo.png" alt="lplp" width="20" height="20">

Automatically add and keep up to date your latest stats from [duolingo.com](https://www.duolingo.com/).

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/centrumek/duolingo-readme-stats/duolingo-test-noauth.yml?style=flat-square&label=Duolingo%20Stats%20-%20Unauthenticated)](https://github.com/centrumek/duolingo-readme-stats/blob/main/README-DEMO-NOAUTH.md)

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/centrumek/duolingo-readme-stats/duolingo-test-auth.yml?style=flat-square&label=Duolingo%20Stats%20-%20Authenticated)](https://github.com/centrumek/duolingo-readme-stats/blob/main/README-DEMO-AUTH.md)

## Example

|                                                           Username                                                           |                                                       Day Streak (WET)                                                       |                                                      Total XP                                                      |                                                  XP This Week                                                   |                                                             League                                                              |
|:----------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------:|
| <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/duolingo.png" height="12"> Centrumek | <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/streakinactive.svg" height="12"> 616 | <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/xp.svg" height="12"> 29590 | <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/xp.svg" height="12"> 13 | <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/leagues/silver.png" height="12"> Silver |

|                                                                                                                                  Language                                                                                                                                  |                                                         XP                                                         |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------:|
| <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/langs/ukrainian.svg" height="12"> Ukrainian (from <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/langs/english.svg" height="12"> English) | <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/xp.svg" height="12"> 13342 |
|   <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/langs/spanish.svg" height="12"> Spanish (from <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/langs/english.svg" height="12"> English)   | <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/xp.svg" height="12"> 10887 |
|  <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/langs/japanese.svg" height="12"> Japanese (from <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/langs/english.svg" height="12"> English)  | <img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/xp.svg" height="12"> 5354  |

## Usage

Add these two placeholders somewhere in your `README.md`, they will get replaced by the action.

```html
<!--START_SECTION:duolingoStats-->

<!--END_SECTION:duolingoStats-->
```

Create a GitHub Action in your repository, you can call it `duolingo-readme-stats.yml`.

```yaml
name: Duolingo README Stats Action

on:
  schedule:
    - cron: '0 0 * * *' # Runs at 00:00 UTC every day
  workflow_dispatch:

jobs:
  update-readme:
    name: Update readme with your duolingo stats
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v3
      - uses: centrumek/duolingo-readme-stats@v1.0.0
        with:
          DUOLINGO_USER_ID: <Your duolingo.com user ID>
          ADVANCED_TOKEN_JWT: <Your duolingo.com JWT token>
```

## Your duolingo.com variables placement

`DUOLINGO_USER_ID` variable can be found in browser DevTools [Fn + F12]

- `Application` > `Local Storage` > `https://www.duolingo.com/` >
  e.g. `duo.appLogo` > `{"730772122":{"canShowLogoDot":true}}`.
- `Network` > `Fetch/XHR` > e.g. `https://zombie.duolingo.com/22/web.json?user=730772122`.

`ADVANCED_TOKEN_JWT` variable can be found in browser DevTools [Fn + F12]

- `Application` > `Cookie` > `https://www.duolingo.com/` > `jwt_token` >
  `XYZjixuishudissuigfiu....`.

## Configuration

There are a few configuration options you can use in your GitHub Action.

|          Parameter          |                                                                                           Description                                                                                           |                        Default                        |        Required         |
|:---------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------:|:-----------------------:|
|     ADVANCED_TOKEN_JWT      |                                                  Your duolingo.com JWT token to get extra info. PLEASE, ONLY PASS VIA GITHUB REPO SECRETS <3.                                                   |                         none                          | *For certain functions* |
|        COMMIT_EMAIL         |                                                                            Email used while committing to the repo.                                                                             | 41898282+github-actions[bot]@users.noreply.github.com |           No            |
|         COMMIT_MSG          |                                                                        Commit message used while committing to the repo.                                                                        |      💬 Updated README with your duolingo stats       |           No            |
|       COMMIT_USERNAME       |                                                                           Username used while committing to the repo.                                                                           |                  duolingo-stats-bot                   |           No            |
|      DUOLINGO_USER_ID       |                                                                                   Your duolingo.com user ID.                                                                                    |                       730772122                       |         **Yes**         |
|          FILE_NAME          |                                                                              Define a specific file in your repo.                                                                               |                       README.md                       |           No            |
|    SHOW_ADVANCED_LEAGUE*    |                                                        Show the user's league in the overview table. *Requires **ADVANCED_TOKEN_JWT**.*                                                         |                         true                          |           No            |
| SHOW_ADVANCED_XP_THIS_WEEK* |                                                   Show the user's XP earned since last leaderboard reset. *Requires **ADVANCED_TOKEN_JWT**.*                                                    |                         true                          |           No            
|       SHOW_LANGUAGES        |                                                                                   Toggle the languages table.                                                                                   |                         true                          |           No            |
| SHOW_LANGUAGES_FROM_ENGLISH | Determines, whether "(from English)" should be appended to languages learnt from English, similarly to learning from other languages. This setting works only if **SHOW_LANGUAGES** is enabled. |                         false                         |           No            |
|    SHOW_STREAK_TIMEZONE     |                                                    Set, whether the 'Day Streak' section should include the timezone streak is measured in.                                                     |                         false                         |           No            |