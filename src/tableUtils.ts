import {Course, XPGain} from "./types";
import {SHOW_LANGUAGES_FROM_ENGLISH, SHOW_STREAK_TIMEZONE} from "./main";
import {getEmoji, langsISO} from "./utils";

export const formatOverviewTable = (username: string, streak: number, streakExtendedToday: boolean | null, totalXp: number, xpThisWeek: XPGain[], leagueID: number | null, streakTimeZone: string | null): string => {
    const leagues = ["Bronze", "Silver", "Gold", "Sapphire", "Ruby", "Emerald", "Amethyst", "Pearl", "Obsidian", "Diamond"]
    const tableHeader = `| Username | Day Streak${SHOW_STREAK_TIMEZONE === true && streakTimeZone ? " (" + new Intl.DateTimeFormat('en-UK', { timeZone: streakTimeZone, timeZoneName: 'short' }).format(new Date()).split(", ")[1] + ")" : ""} | Total XP |${xpThisWeek.length === 0 ? "" : " XP This Week |"}${leagueID === null ? "" : " League |"}`;
    const tableSeparator =
        '|' + Array.from({length: 3 + (leagueID === null ? 0 : 1) + (xpThisWeek.length === 0 ? 0 : 1)}, () => ':---:|').join('');
    const data = [
        '<img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/duolingo.png" height="12"> ' + username ?? 'N/A',
        `<img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/streak${streakExtendedToday == true ? 'active' : streakExtendedToday == false ? 'inactive' : 'frozen'}.svg" height="12"> ` + streak ?? 'N/A',
        '<img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/xp.svg" height="12"> ' + totalXp ?? 'N/A'
    ];

    if (xpThisWeek.length !== 0) {
        const now = new Date();
        const lastReset = new Date(now);
        lastReset.setUTCHours(0, 0, 0, 0);
        const dayOfWeek = lastReset.getUTCDay();
        const daysSinceReset = (dayOfWeek + 6) % 7;
        lastReset.setUTCDate(now.getUTCDate() - daysSinceReset);
        const lastResetTimestamp = Math.floor(lastReset.getTime() / 1000);
        const recentXpGains = xpThisWeek.filter(gain => gain.time > lastResetTimestamp);
        const totalXpSinceReset = recentXpGains.reduce((total, gain) => total + gain.xp, 0);
        data.push('<img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/xp.svg" height="12"> ' + totalXpSinceReset ?? 'N/A');
    }

    if (leagueID !== null)
        data.push(`<img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/leagues/${leagues[leagueID].toLowerCase()}.png" height="12"> ` + leagues[leagueID] ?? 'N/A');

    const row = `| ${data.join(' | ')} |`;

    return `${tableHeader}\n${tableSeparator}\n${row}\n`;
};

export const formatLanguagesTable = (courses: Course[]): string => {
    courses.sort((a, b) => b.xp - a.xp);
    const tableHeader = `| Language | XP |`;
    const tableSeparator =
        '|' + Array.from({length: 2}, () => ':---:|').join('');

    const rows = courses.map(course => {
        const data = [
            getEmoji(course.title) + ' ' + course.title + (course.fromLanguage == "en" ? SHOW_LANGUAGES_FROM_ENGLISH ? ` (from ${getEmoji("English")} English)` : "" : ` (from ${getEmoji(langsISO[course.fromLanguage])} ${langsISO[course.fromLanguage]})`),
            '<img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/xp.svg" height="12"> ' + course.xp
        ];
        return `| ${data.join(' | ')} |`;
    }).join('\n');

    return `${tableHeader}\n${tableSeparator}\n${rows}\n`;
};
