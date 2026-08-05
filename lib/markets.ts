import type { ElectionInfo, MarketConfig, MarketContent, NewsItem } from "./types";
import jdVance2028Raw from "@/data/markets/2028-us-presidential-election-winner/jd-vance.json";
import donaldTrump2028Raw from "@/data/markets/2028-us-presidential-election-winner/donald-trump.json";
import kamalaHarris2028Raw from "@/data/markets/2028-us-presidential-election-winner/kamala-harris.json";
import senateDemocrats2026Raw from "@/data/markets/2026-us-senate-control/democrats.json";
import lebronNextTeamRaw from "@/data/markets/lebron-james-next-team.json";
import grokOdysseyFilmRaw from "@/data/markets/grok-imagine-odyssey-film.json";
import oscarOdysseyBestPictureRaw from "@/data/markets/oscar-winner-2027/the-odyssey.json";
import starshipMarsRaw from "@/data/markets/starship-humans-to-mars-2030.json";
import kawhiNextTeamRaw from "@/data/markets/kawhi-leonard-next-team.json";
import bronnyNextTeamRaw from "@/data/markets/bronny-james-next-team.json";
import curryLeavesWarriorsRaw from "@/data/markets/steph-curry-leaves-warriors.json";
import netanyahuArrestedRaw from "@/data/markets/benjamin-netanyahu-arrested.json";
import tarikSkubalNextTeamRaw from "@/data/markets/tarik-skubal-next-team.json";
import kevinDurantNextTeamRaw from "@/data/markets/kevin-durant-next-team.json";
import bigBrother28WinnerRaw from "@/data/markets/big-brother-28-winner.json";
import bigBrother28Week4EvictionRaw from "@/data/markets/big-brother-28-week-4-eviction.json";
import billBelichickOutRaw from "@/data/markets/bill-belichick-out-before-september-2026.json";

// JSON imports infer string literal fields (e.g. "platform": "kalshi") as
// plain `string`, not the PlatformId union MarketContent actually needs --
// JSON has no way to express literal types. Cast once here rather than at
// every usage site; the underlying values are always valid, this just
// tells TypeScript what we already know to be true.
const jdVance2028 = jdVance2028Raw as MarketContent;
const donaldTrump2028 = donaldTrump2028Raw as MarketContent;
const kamalaHarris2028 = kamalaHarris2028Raw as MarketContent;
const senateDemocrats2026 = senateDemocrats2026Raw as MarketContent;
const lebronNextTeam = lebronNextTeamRaw as MarketContent;
const grokOdysseyFilm = grokOdysseyFilmRaw as MarketContent;
const oscarOdysseyBestPicture = oscarOdysseyBestPictureRaw as MarketContent;
const starshipMars = starshipMarsRaw as MarketContent;
const kawhiNextTeam = kawhiNextTeamRaw as MarketContent;
const bronnyNextTeam = bronnyNextTeamRaw as MarketContent;
const curryLeavesWarriors = curryLeavesWarriorsRaw as MarketContent;
const netanyahuArrested = netanyahuArrestedRaw as MarketContent;
const tarikSkubalNextTeam = tarikSkubalNextTeamRaw as MarketContent;
const kevinDurantNextTeam = kevinDurantNextTeamRaw as MarketContent;
const bigBrother28Winner = bigBrother28WinnerRaw as MarketContent;
const bigBrother28Week4Eviction = bigBrother28Week4EvictionRaw as MarketContent;
const billBelichickOut = billBelichickOutRaw as MarketContent;

// Add a new market by appending an entry here (with its own content file
// under data/markets/) -- nothing else needs to change for it to get a
// page, API routes, and a homepage card. Most markets are binary and only
// need one entry in `outcomes`; a multi-outcome market like LeBron's next
// team tracks a handful of real contenders as separate outcome entries.
export const markets: MarketConfig[] = [
  {
    slug: ["2028-us-presidential-election-winner", "jd-vance"],
    category: "politics",
    shortDescription: "Live odds on JD Vance winning the 2028 presidential election.",
    outcomes: [
      {
        id: "jd-vance",
        label: "JD Vance",
        question: "Will JD Vance win?",
        kalshi: {
          ticker: "KXPRESPERSON-28-JVAN",
          seriesTicker: "KXPRESPERSON",
          url: "https://kalshi.com/markets/kxpresperson/kxpresperson-28?selectedMarketTicker=KXPRESPERSON-28-JVAN",
        },
        polymarket: {
          marketId: "561229",
          yesTokenId:
            "16040015440196279900485035793550429453516625694844857319147506590755961451627",
          url: "https://polymarket.com/event/presidential-election-winner-2028/will-jd-vance-win-the-2028-us-presidential-election",
        },
      },
    ],
    content: jdVance2028,
  },
  {
    slug: ["2028-us-presidential-election-winner", "donald-trump"],
    category: "politics",
    shortDescription: "Live odds on Donald Trump winning the 2028 presidential election.",
    outcomes: [
      {
        id: "donald-trump",
        label: "Donald Trump",
        question: "Will Donald Trump win?",
        kalshi: {
          ticker: "KXPRESPERSON-28-DTRU",
          seriesTicker: "KXPRESPERSON",
          url: "https://kalshi.com/markets/kxpresperson/kxpresperson-28?selectedMarketTicker=KXPRESPERSON-28-DTRU",
        },
        polymarket: {
          marketId: "561243",
          yesTokenId:
            "11807691644868166983390207408868795383945915035851758101409310535538572683733",
          url: "https://polymarket.com/event/presidential-election-winner-2028/will-donald-trump-win-the-2028-us-presidential-election",
        },
      },
    ],
    content: donaldTrump2028,
  },
  {
    slug: ["2028-us-presidential-election-winner", "kamala-harris"],
    category: "politics",
    shortDescription: "Live odds on Kamala Harris winning the 2028 presidential election.",
    outcomes: [
      {
        id: "kamala-harris",
        label: "Kamala Harris",
        question: "Will Kamala Harris win?",
        kalshi: {
          ticker: "KXPRESPERSON-28-KHAR",
          seriesTicker: "KXPRESPERSON",
          url: "https://kalshi.com/markets/kxpresperson/kxpresperson-28?selectedMarketTicker=KXPRESPERSON-28-KHAR",
        },
        polymarket: {
          marketId: "561239",
          yesTokenId:
            "70663352401606372246362604193214664065595751757222752105245221905399175050480",
          url: "https://polymarket.com/event/presidential-election-winner-2028/will-kamala-harris-win-the-2028-us-presidential-election",
        },
      },
    ],
    content: kamalaHarris2028,
  },
  {
    slug: ["2026-us-senate-control", "democrats"],
    category: "politics",
    shortDescription: "Live odds on Democrats winning control of the US Senate in 2026.",
    outcomes: [
      {
        id: "democrats",
        label: "Democrats",
        question: "Will Democrats win the Senate?",
        kalshi: {
          ticker: "CONTROLS-2026-D",
          seriesTicker: "CONTROLS",
          url: "https://kalshi.com/markets/controls/controls-2026?selectedMarketTicker=CONTROLS-2026-D",
        },
        polymarket: {
          marketId: "562793",
          yesTokenId:
            "113287701564209339913693347405685749986285999146352375265161592243948562084773",
          url: "https://polymarket.com/event/which-party-will-win-the-senate-in-2026/will-the-democratic-party-control-the-senate-after-the-2026-midterm-elections",
        },
      },
    ],
    content: senateDemocrats2026,
  },
  {
    slug: ["lebron-james-next-team"],
    category: "sports",
    shortDescription:
      "Settled: LeBron signed with Philadelphia. See how Heat vs. Cavaliers odds moved beforehand.",
    outcomes: [
      {
        id: "miami-heat",
        label: "Miami Heat",
        question: "Will LeBron sign with the Heat?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26LJAM-MIA",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26ljam?selectedMarketTicker=KXNEXTTEAMNBA-26LJAM-MIA",
        },
        polymarket: {
          marketId: "1931114",
          yesTokenId:
            "62429084067171308316390058541012087925567325563248051217584518806867987132248",
          url: "https://polymarket.com/event/nba-lebron-james-next-team/will-lebron-james-play-for-the-miami-heat-in-2026-27",
        },
      },
      {
        id: "cleveland-cavaliers",
        label: "Cleveland Cavaliers",
        question: "Will LeBron return to the Cavaliers?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26LJAM-CLE",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26ljam?selectedMarketTicker=KXNEXTTEAMNBA-26LJAM-CLE",
        },
        polymarket: {
          marketId: "1931104",
          yesTokenId:
            "67044318499994712064109988308237618254832029882233414790755517483383764496170",
          url: "https://polymarket.com/event/nba-lebron-james-next-team/will-lebron-james-play-for-the-cleveland-cavaliers-in-2026-27",
        },
      },
    ],
    content: lebronNextTeam,
  },
  {
    slug: ["grok-imagine-odyssey-film"],
    category: "culture",
    shortDescription:
      "Live odds on whether xAI's Grok Imagine releases a full-length Odyssey film by the end of 2026.",
    outcomes: [
      {
        id: "released-2026",
        label: "Grok Imagine's Odyssey Film",
        question: "Will the film release in 2026?",
        kalshi: {
          ticker: "KXMOVIERELEASEDATE-GRO-27JAN01",
          seriesTicker: "KXMOVIERELEASEDATE",
          url: "https://kalshi.com/markets/kxmoviereleasedate/when-will-movie-release/kxmoviereleasedate-gro?selectedMarketTicker=KXMOVIERELEASEDATE-GRO-27JAN01",
        },
        // Kalshi only -- no Polymarket market exists for this one.
      },
    ],
    content: grokOdysseyFilm,
  },
  {
    slug: ["oscar-winner-2027", "the-odyssey"],
    category: "culture",
    shortDescription: "Live odds on The Odyssey winning Best Picture at the 99th Academy Awards.",
    outcomes: [
      {
        id: "the-odyssey",
        label: "The Odyssey",
        question: "Will The Odyssey win Best Picture?",
        kalshi: {
          ticker: "KXOSCARPIC-27-ODY",
          seriesTicker: "KXOSCARPIC",
          url: "https://kalshi.com/markets/kxoscarpic/oscar-for-best-picture/kxoscarpic-27?selectedMarketTicker=KXOSCARPIC-27-ODY",
        },
        // Kalshi only -- Polymarket currently has just a Best Picture
        // NOMINATIONS market for The Odyssey, not a winner market.
      },
    ],
    content: oscarOdysseyBestPicture,
  },
  {
    slug: ["starship-humans-to-mars-2030"],
    category: "culture",
    shortDescription:
      "Live odds on SpaceX launching a manned Starship mission to Mars before 2030.",
    outcomes: [
      {
        id: "humans-to-mars",
        label: "Starship: Humans to Mars",
        question: "Will SpaceX launch a manned Starship mission to Mars before 2030?",
        kalshi: {
          ticker: "STARSHIPMARS-29DEC31",
          seriesTicker: "STARSHIPMARS",
          url: "https://kalshi.com/markets/kxstarshipmars/starship-launch-to-mars/starshipmars?selectedMarketTicker=STARSHIPMARS-29DEC31",
        },
        // Kalshi only -- no confirmed Polymarket market with matching
        // crewed-by-2030 resolution criteria. Don't confuse with Kalshi's
        // separate "will SpaceX land anything on Mars" market (uncrewed
        // included, prices notably higher) -- see resolutionNote.
      },
    ],
    content: starshipMars,
  },
  {
    slug: ["kawhi-leonard-next-team"],
    category: "sports",
    shortDescription: "Live odds on Kawhi Leonard's next team.",
    outcomes: [
      {
        id: "toronto-raptors",
        label: "Toronto Raptors",
        question: "Will Kawhi Leonard's next team be the Raptors?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26KLEONARD2-TOR",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26kleonard2?selectedMarketTicker=KXNEXTTEAMNBA-26KLEONARD2-TOR",
        },
        polymarket: {
          marketId: "2730704",
          yesTokenId:
            "71442248608680775392175387904764925142154791124955324705502495372378633558564",
          url: "https://polymarket.com/event/nba-kawhi-leonard-next-team-20260629144203996/will-kawhi-play-for-the-toronto-raptors-in-2026-27-20260629144043516",
        },
      },
      {
        id: "los-angeles-clippers",
        label: "Los Angeles Clippers",
        question: "Will Kawhi Leonard stay with the Clippers?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26KLEONARD2-LAC",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26kleonard2?selectedMarketTicker=KXNEXTTEAMNBA-26KLEONARD2-LAC",
        },
        polymarket: {
          marketId: "2730689",
          yesTokenId:
            "37336475921711580283973873539558313505893324704942938603043928250201423680809",
          url: "https://polymarket.com/event/nba-kawhi-leonard-next-team-20260629144203996/will-kawhi-play-for-the-los-angeles-clippers-in-2026-27-20260629144043501",
        },
      },
    ],
    content: kawhiNextTeam,
  },
  {
    slug: ["bronny-james-next-team"],
    category: "sports",
    shortDescription: "Live odds on Bronny James' next team.",
    outcomes: [
      {
        id: "los-angeles-lakers",
        label: "Los Angeles Lakers",
        question: "Will Bronny James stay with the Lakers?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26BJAMES9-LAL",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26bjames9?selectedMarketTicker=KXNEXTTEAMNBA-26BJAMES9-LAL",
        },
        // Kalshi only -- Polymarket has no matching "next team" market for
        // Bronny, just a differently-scoped "will he and LeBron play
        // together" question. See resolutionNote.
      },
      {
        id: "philadelphia-76ers",
        label: "Philadelphia 76ers",
        question: "Will Bronny James join the 76ers?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26BJAMES9-PHI",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26bjames9?selectedMarketTicker=KXNEXTTEAMNBA-26BJAMES9-PHI",
        },
      },
    ],
    content: bronnyNextTeam,
  },
  {
    slug: ["steph-curry-leaves-warriors"],
    category: "sports",
    shortDescription: "Live odds on whether Steph Curry stays with the Warriors.",
    outcomes: [
      {
        id: "golden-state-warriors",
        label: "Golden State Warriors",
        question: "Will Steph Curry stay with the Warriors?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26SCUR-GSW",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26scur?selectedMarketTicker=KXNEXTTEAMNBA-26SCUR-GSW",
        },
        // Not paired with Polymarket here: Polymarket's contract for this
        // question is a single binary priced on the inverse ("does Curry
        // leave"), and getPolymarketMarket() always reads outcomePrices[0]
        // ("Yes") -- there's no way to pull its complementary "stays" price
        // through the existing odds pipeline without it silently showing
        // the leave-side number under a "does he stay" question. Polymarket's
        // live number is instead quoted directly in the Market Brief. See
        // resolutionNote.
      },
      {
        id: "san-antonio-spurs",
        label: "San Antonio Spurs",
        question: "Will Steph Curry's next team be the Spurs?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26SCUR-SAS",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26scur?selectedMarketTicker=KXNEXTTEAMNBA-26SCUR-SAS",
        },
      },
      {
        id: "boston-celtics",
        label: "Boston Celtics",
        question: "Will Steph Curry's next team be the Celtics?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26SCUR-BOS",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26scur?selectedMarketTicker=KXNEXTTEAMNBA-26SCUR-BOS",
        },
      },
    ],
    content: curryLeavesWarriors,
  },
  {
    slug: ["benjamin-netanyahu-arrested"],
    category: "politics",
    shortDescription: "Live odds on whether Benjamin Netanyahu is arrested.",
    outcomes: [
      {
        id: "arrested",
        label: "Benjamin Netanyahu",
        question: "Will Benjamin Netanyahu be arrested?",
        kalshi: {
          ticker: "KXARRESTNETANYAHU-28JAN01-27JAN01",
          seriesTicker: "KXARRESTNETANYAHU",
          url: "https://kalshi.com/markets/kxarrestnetanyahu/will-netanyahu-be-arrested/kxarrestnetanyahu-28jan01?selectedMarketTicker=KXARRESTNETANYAHU-28JAN01-27JAN01",
        },
        polymarket: {
          marketId: "3005858",
          yesTokenId:
            "62161653759349855247273799232873441774010086528851126304754251694125509765134",
          url: "https://polymarket.com/event/netanyahu-arrested-by-20260720194516248/will-benjamin-netanyahu-be-arrested-by-december-31-20260720194516249-193",
        },
      },
    ],
    content: netanyahuArrested,
  },
  {
    slug: ["tarik-skubal-next-team"],
    category: "sports",
    shortDescription:
      "Settled: Skubal traded to the Dodgers. See how Dodgers vs. Brewers odds moved beforehand.",
    outcomes: [
      {
        id: "los-angeles-dodgers",
        label: "Los Angeles Dodgers",
        question: "Will Tarik Skubal's next team be the Dodgers?",
        kalshi: {
          ticker: "KXNEXTTEAMMLB-27TSKUBAL-LAD",
          seriesTicker: "KXNEXTTEAMMLB",
          url: "https://kalshi.com/markets/kxnextteammlb/mlb-player-next-team/kxnextteammlb-27tskubal?selectedMarketTicker=KXNEXTTEAMMLB-27TSKUBAL-LAD",
        },
        // Not paired with Polymarket here: Polymarket's version of this
        // question resolves by the Aug 3, 2026 trade deadline specifically
        // (defaulting to Detroit if no trade happens by then), while this
        // Kalshi contract runs until Mar 25, 2027 -- a materially different,
        // longer-horizon question. See resolutionNote.
      },
      {
        id: "milwaukee-brewers",
        label: "Milwaukee Brewers",
        question: "Will Tarik Skubal's next team be the Brewers?",
        kalshi: {
          ticker: "KXNEXTTEAMMLB-27TSKUBAL-MIL",
          seriesTicker: "KXNEXTTEAMMLB",
          url: "https://kalshi.com/markets/kxnextteammlb/mlb-player-next-team/kxnextteammlb-27tskubal?selectedMarketTicker=KXNEXTTEAMMLB-27TSKUBAL-MIL",
        },
      },
    ],
    content: tarikSkubalNextTeam,
  },
  {
    slug: ["kevin-durant-next-team"],
    category: "sports",
    shortDescription: "Live odds on Kevin Durant's next team, tracked on Kalshi.",
    outcomes: [
      {
        id: "houston-rockets",
        label: "Houston Rockets",
        question: "Will Kevin Durant stay with the Rockets?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26KDURANT7-HOU",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26kdurant7?selectedMarketTicker=KXNEXTTEAMNBA-26KDURANT7-HOU",
        },
        // No Polymarket pairing here -- no genuinely matching market was
        // found for this one. See resolutionNote.
      },
      {
        id: "cleveland-cavaliers",
        label: "Cleveland Cavaliers",
        question: "Will Kevin Durant's next team be the Cavaliers?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26KDURANT7-CLE",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26kdurant7?selectedMarketTicker=KXNEXTTEAMNBA-26KDURANT7-CLE",
        },
      },
    ],
    content: kevinDurantNextTeam,
  },
  {
    slug: ["big-brother-28-winner"],
    category: "culture",
    shortDescription: "Live odds on who wins Big Brother Season 28, tracked on Kalshi and Polymarket.",
    outcomes: [
      {
        id: "dee-valladares",
        label: "Dee Valladares",
        question: "Will Dee Valladares win Big Brother Season 28?",
        kalshi: {
          ticker: "KXBIGBROTHER-26DEC31-DEE",
          seriesTicker: "KXBIGBROTHER",
          url: "https://kalshi.com/markets/kxbigbrother/who-will-win-big-brother/kxbigbrother-26dec31?selectedMarketTicker=KXBIGBROTHER-26DEC31-DEE",
        },
        polymarket: {
          marketId: "2853714",
          yesTokenId: "60297022771468929928611714271172877412498438227247631047407809426306440990592",
          url: "https://polymarket.com/event/big-brother-season-28-winner-20260708173711844/will-dee-valladares-win-big-brother-season-28-20260712230326323",
        },
      },
      {
        id: "rick-devens",
        label: "Rick Devens",
        question: "Will Rick Devens win Big Brother Season 28?",
        kalshi: {
          ticker: "KXBIGBROTHER-26DEC31-RIC",
          seriesTicker: "KXBIGBROTHER",
          url: "https://kalshi.com/markets/kxbigbrother/who-will-win-big-brother/kxbigbrother-26dec31?selectedMarketTicker=KXBIGBROTHER-26DEC31-RIC",
        },
        polymarket: {
          marketId: "2853712",
          yesTokenId: "25320167385794782138980224015847904344553212040671323481469433356098629134324",
          url: "https://polymarket.com/event/big-brother-season-28-winner-20260708173711844/will-rick-devens-win-big-brother-season-28-20260712164630746",
        },
      },
      {
        id: "yash-patel",
        label: "Yash Patel",
        question: "Will Yash Patel win Big Brother Season 28?",
        kalshi: {
          ticker: "KXBIGBROTHER-26DEC31-YAS",
          seriesTicker: "KXBIGBROTHER",
          url: "https://kalshi.com/markets/kxbigbrother/who-will-win-big-brother/kxbigbrother-26dec31?selectedMarketTicker=KXBIGBROTHER-26DEC31-YAS",
        },
        polymarket: {
          marketId: "2853711",
          yesTokenId: "61365402036530721078642054122930811815876233850699691305244146155991701890770",
          url: "https://polymarket.com/event/big-brother-season-28-winner-20260708173711844/will-yash-patel-win-big-brother-season-28-20260708173711858",
        },
      },
      {
        id: "kamu-kirk",
        label: "Kamu Kirk",
        question: "Will Kamu Kirk win Big Brother Season 28?",
        kalshi: {
          ticker: "KXBIGBROTHER-26DEC31-KAM",
          seriesTicker: "KXBIGBROTHER",
          url: "https://kalshi.com/markets/kxbigbrother/who-will-win-big-brother/kxbigbrother-26dec31?selectedMarketTicker=KXBIGBROTHER-26DEC31-KAM",
        },
        polymarket: {
          marketId: "2853704",
          yesTokenId: "87127025679709563677036865537520674320857053471787925372408473185335450058857",
          url: "https://polymarket.com/event/big-brother-season-28-winner-20260708173711844/will-kamu-kirk-win-big-brother-season-28-20260708173711851",
        },
      },
      {
        id: "barrett-pfeiffer",
        label: "Barrett Pfeiffer",
        question: "Will Barrett Pfeiffer win Big Brother Season 28?",
        kalshi: {
          ticker: "KXBIGBROTHER-26DEC31-BAR",
          seriesTicker: "KXBIGBROTHER",
          url: "https://kalshi.com/markets/kxbigbrother/who-will-win-big-brother/kxbigbrother-26dec31?selectedMarketTicker=KXBIGBROTHER-26DEC31-BAR",
        },
        polymarket: {
          marketId: "2853699",
          yesTokenId: "83988718095388656526081743073924319969063555351913135581885749379752319955925",
          url: "https://polymarket.com/event/big-brother-season-28-winner-20260708173711844/will-barrett-pfeiffer-win-big-brother-season-28-20260708173711846",
        },
      },
    ],
    content: bigBrother28Winner,
  },
  {
    slug: ["big-brother-28-week-4-eviction"],
    category: "culture",
    shortDescription: "Live odds on who gets evicted from Big Brother this week, tracked on Kalshi.",
    outcomes: [
      {
        id: "drew-campbell",
        label: "Drew Campbell",
        question: "Will Drew Campbell be evicted this week?",
        kalshi: {
          ticker: "KXBIGBROTHERELIMINATION-26AUG06-DRE",
          seriesTicker: "KXBIGBROTHERELIMINATION",
          url: "https://kalshi.com/markets/kxbigbrotherelimination/who-will-be-eliminated-from-big-brother/kxbigbrotherelimination-26aug06?selectedMarketTicker=KXBIGBROTHERELIMINATION-26AUG06-DRE",
        },
        // Kalshi-only -- no matching single-week Polymarket contract. See resolutionNote.
      },
      {
        id: "melody-morris",
        label: "Melody Morris",
        question: "Will Melody Morris be evicted this week?",
        kalshi: {
          ticker: "KXBIGBROTHERELIMINATION-26AUG06-MEL",
          seriesTicker: "KXBIGBROTHERELIMINATION",
          url: "https://kalshi.com/markets/kxbigbrotherelimination/who-will-be-eliminated-from-big-brother/kxbigbrotherelimination-26aug06?selectedMarketTicker=KXBIGBROTHERELIMINATION-26AUG06-MEL",
        },
      },
      {
        id: "lyric-medeiros",
        label: "Lyric Medeiros",
        question: "Will Lyric Medeiros be evicted this week?",
        kalshi: {
          ticker: "KXBIGBROTHERELIMINATION-26AUG06-LYR",
          seriesTicker: "KXBIGBROTHERELIMINATION",
          url: "https://kalshi.com/markets/kxbigbrotherelimination/who-will-be-eliminated-from-big-brother/kxbigbrotherelimination-26aug06?selectedMarketTicker=KXBIGBROTHERELIMINATION-26AUG06-LYR",
        },
      },
    ],
    content: bigBrother28Week4Eviction,
  },
  {
    slug: ["bill-belichick-out-before-september-2026"],
    category: "sports",
    shortDescription: "Live odds on whether Bill Belichick is out as UNC's head coach before September 2026, tracked on Kalshi.",
    outcomes: [
      {
        id: "out-before-september-2026",
        label: "Bill Belichick",
        question: "Will Bill Belichick be out as UNC's head coach before September 2026?",
        kalshi: {
          ticker: "KXCOACHOUTNCAAFB-1-26-UNC",
          seriesTicker: "KXCOACHOUTNCAAFB",
          url: "https://kalshi.com/markets/kxcoachoutncaafb/ncaafb-coaches-out/kxcoachoutncaafb-1-26?selectedMarketTicker=KXCOACHOUTNCAAFB-1-26-UNC",
        },
        // Kalshi-only -- no current matching Polymarket market. See resolutionNote.
      },
    ],
    content: billBelichickOut,
  },
];

export const CATEGORY_LABELS: Record<MarketConfig["category"], string> = {
  politics: "Politics",
  sports: "Sports",
  culture: "Culture",
};

export function findMarket(slug: string[]): MarketConfig | undefined {
  return markets.find(
    (m) => m.slug.length === slug.length && m.slug.every((s, i) => s === slug[i])
  );
}

// Metadata for each "race" that 2-segment candidate markets nest under.
// Add an entry here (matching the shared first slug segment) to get a hub
// page at /<electionSlug>/ listing every candidate market registered under
// it -- no page/route work needed, same "add an entry" pattern as markets.
export const ELECTIONS: ElectionInfo[] = [
  {
    slug: "2028-us-presidential-election-winner",
    title: "2028 U.S. Presidential Election Winner",
    resolutionDate: "2028-11-07",
    description:
      "Compare odds across candidates in the 2028 U.S. Presidential Election, tracked on Kalshi and Polymarket.",
  },
  {
    slug: "oscar-winner-2027",
    title: "Best Picture Winner — 99th Academy Awards",
    resolutionDate: "2027-03-14",
    description:
      "Compare odds on which film wins Best Picture at the 99th Academy Awards (nominations announced January 21, 2027; ceremony March 14, 2027), tracked on Kalshi.",
  },
];

export function getElectionInfo(electionSlug: string): ElectionInfo | undefined {
  return ELECTIONS.find((e) => e.slug === electionSlug);
}

/** Every candidate market registered under a given election's slug. */
export function getElectionCandidates(electionSlug: string): MarketConfig[] {
  return markets.filter((m) => m.slug.length === 2 && m.slug[0] === electionSlug);
}

// The homepage's featured "Hot Market" slot -- manually set, no auto-ranking
// yet. Change this one value to feature a different market; update by hand
// whenever the hot market changes.
export const HOT_MARKET_SLUG = ["big-brother-28-winner"];

export function getHotMarket(): MarketConfig | undefined {
  return findMarket(HOT_MARKET_SLUG);
}

/**
 * The single most recent news item for a market, by actual date comparison
 * -- not just "whichever is first in the array" -- so this stays correct
 * even if a news list is ever appended to out of order.
 */
export function getMostRecentNews(market: MarketConfig): NewsItem | null {
  return market.content.news.reduce<NewsItem | null>(
    (newest, item) => (!newest || item.date > newest.date ? item : newest),
    null
  );
}

/**
 * One story per market (its most recent news item), newest first, skipping
 * settled markets entirely -- a resolved market is frozen in the Archive,
 * not live news anymore. Backs both the homepage's "Top News Stories" card
 * (sliced to its first few) and the full /news hub page.
 */
export function getTopNewsItems(): { market: MarketConfig; news: NewsItem }[] {
  return markets
    .filter((market) => !market.content.settled)
    .map((market) => {
      const news = getMostRecentNews(market);
      return news ? { market, news } : null;
    })
    .filter((item): item is { market: MarketConfig; news: NewsItem } => item !== null)
    .sort((a, b) => (a.news.date < b.news.date ? 1 : -1));
}

/**
 * Other markets in the same category, for the "Related Markets" internal
 * link block on a market page -- live markets first (settled ones are
 * archived, less useful to route fresh traffic into), otherwise in the
 * same order they're declared in `markets` above.
 */
export function getRelatedMarkets(market: MarketConfig, limit = 4): MarketConfig[] {
  return markets
    .filter((m) => m.category === market.category && m.slug.join("/") !== market.slug.join("/"))
    .sort((a, b) => Number(Boolean(a.content.settled)) - Number(Boolean(b.content.settled)))
    .slice(0, limit);
}

/**
 * A representative thumbnail for the market page header -- not a
 * hand-curated hero image field, just the most recent news item that
 * happens to have one. Reuses an existing image rather than adding a new
 * one to source and maintain per market.
 */
export function getMarketThumbnail(market: MarketConfig): string | undefined {
  return [...market.content.news]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .find((item) => item.image)?.image;
}
