import {getUserDetails} from "./api";
import * as fs from "fs";
import {
    commitFile,
    END_TOKEN,
    formatLanguagesTable,
    formatOverviewTable,
    INFO_LINE,
    setFailure,
    START_TOKEN
} from "./utils";
import {StreakData, UserDetailsResponse} from "./types";
import {getInput} from "@actions/core";

// Public parameters
export const ADVANCED_TOKEN_JWT = getInput('ADVANCED_TOKEN_JWT');
export const COMMIT_EMAIL = getInput('COMMIT_MSG');
export const COMMIT_MSG = getInput('COMMIT_MSG');
export const COMMIT_USERNAME = getInput('COMMIT_MSG');
export const DUOLINGO_USER_ID = getInput('DUOLINGO_USER_ID');
export const FILE_NAME = getInput('FILE_NAME');
export const IS_DEBUG = getInput('IS_DEBUG').toLowerCase() === 'true';
export const SHOW_ADVANCED_LEAGUE = getInput('SHOW_ADVANCED_LEAGUE').toLowerCase() === 'true';
export const SHOW_ADVANCED_XP_THIS_WEEK = getInput('SHOW_ADVANCED_XP_THIS_WEEK').toLowerCase() === 'true';
export const SHOW_LANGUAGES = getInput('SHOW_LANGUAGES').toLowerCase() === 'true';
export const SHOW_LANGUAGES_FROM_ENGLISH = getInput('SHOW_LANGUAGES_FROM_ENGLISH').toLowerCase() === 'true';
export const SHOW_STREAK_TIMEZONE = getInput('SHOW_STREAK_TIMEZONE').toLowerCase() === 'true';

(async () => {
    try {
        if (!DUOLINGO_USER_ID) {
            throw new Error('Duolingo user ID not provided!');
        }
        const content = await buildContent();
        updateFile(content);
        if (!IS_DEBUG) {
            await commitFile(FILE_NAME, COMMIT_MSG, COMMIT_USERNAME, COMMIT_EMAIL);
        }
        console.log('Successfully updated the README file!');
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'The action failed with an Unknown error';
        setFailure(errorMessage);
    }
})()

async function buildContent() {
    const content: string[] = [];

    const userDetails: UserDetailsResponse = await getUserDetails(DUOLINGO_USER_ID, ADVANCED_TOKEN_JWT);

    let streakStatus = calculateStreakStatus(userDetails.streakData)
    let xpThisWeek = (SHOW_ADVANCED_XP_THIS_WEEK && userDetails.xpGains != undefined) ? userDetails.xpGains : [];
    let leagueId = (SHOW_ADVANCED_LEAGUE && userDetails.trackingProperties && userDetails.trackingProperties.leaderboard_league != undefined)
        ? userDetails.trackingProperties.leaderboard_league : null
    let streakTimeZone = (SHOW_STREAK_TIMEZONE && userDetails.streakData && userDetails.streakData.updatedTimeZone != undefined) ? userDetails.streakData.updatedTimeZone : null;

    content.push(formatOverviewTable(
        userDetails.username,
        userDetails.streak,
        streakStatus,
        userDetails.totalXp,
        xpThisWeek,
        leagueId,
        streakTimeZone));

    if (SHOW_LANGUAGES) {
        if (userDetails.courses.length === 0) {
            throw new Error('No languages found!');
        }
        content.push(formatLanguagesTable(userDetails.courses));
    }

    return content;
}

function calculateStreakStatus(streakData: StreakData) {
    const timezone = streakData.updatedTimeZone;

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };
    const formatter = new Intl.DateTimeFormat('en-UK', options);
    const parts = formatter.formatToParts(now);

    const formattedToday = `${parts.find(p => p.type === 'year')!.value}-${parts.find(p => p.type === 'month')!.value}-${parts.find(p => p.type === 'day')!.value}`;

    // Parse the last extended date and the current date in the specified timezone
    const lastExtendedDate = new Date(streakData.currentStreak.lastExtendedDate);
    const currentDateInTimeZone = new Date(now.toLocaleString('en-US', {timeZone: timezone}));

    // Calculate the difference in time
    const timeDifference = currentDateInTimeZone.getTime() - lastExtendedDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    // Determine the streak status
    let streakStatus: boolean | null = null;
    if (daysDifference <= 2) {
        streakStatus = streakData.currentStreak.lastExtendedDate === formattedToday;
    } else {
        streakStatus = null; // Streak is frozen
    }

    return streakStatus;
}

function updateFile(content: string[]) {
    const readmeContent = fs.readFileSync('./' + FILE_NAME, 'utf-8')

    const startIndex = readmeContent.indexOf(START_TOKEN);
    if (startIndex === -1) {
        throw new Error(`Couldn't find the START_TOKEN ${START_TOKEN} - Exiting!`);
    }

    const endIndex = readmeContent.indexOf(END_TOKEN);
    if (endIndex === -1) {
        throw new Error(`Couldn't find the END_TOKEN ${END_TOKEN} - Exiting!`);
    }

    const oldPart = readmeContent.slice(startIndex, endIndex);
    const readmeSafeParts = readmeContent.split(oldPart);
    const newReadme = `${readmeSafeParts[0]}${START_TOKEN}\n${INFO_LINE}\n${content.join('\n')}\n${readmeSafeParts[1]}`;

    fs.writeFileSync('./' + FILE_NAME, newReadme);
}