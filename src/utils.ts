import {spawn} from "node:child_process";
import {setFailed} from "@actions/core";

export const START_TOKEN = '<!--START_SECTION:duolingoStats-->';
export const END_TOKEN = '<!--END_SECTION:duolingoStats-->';
export const INFO_LINE = '<!-- Automatically generated with https://github.com/centrumek/duolingo-readme-stats-->\n';

export const langsISO: { [key: string]: string } = {
    "en": "English",
    "ar": "Arabic",
    "bn": "Bangla",
    "hi": "Hindi",
    "te": "Telugu",
    "zh": "Chinese",
    "cs": "Czech",
    "nl": "Dutch",
    "fr": "French",
    "de": "German",
    "el": "Greek",
    "hu": "Hungarian",
    "id": "Indonesian",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "pl": "Polish",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "es": "Spanish",
    "tl": "Tagalog",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "vi": "Vietnamese",
};

export const courseFlags: { [key: string]: string } = {
	"Arabic": "arabic.svg",
    "Chinese": "chinese.svg",
    "Chinese (Cantonese)": "chinese.svg",
    "Czech": "czech.svg",
	"Danish": "danish.svg",
	"Dutch": "dutch.svg",
	"English": "english.svg", 
	"Esperanto": "esperanto.svg",
	"Finnish": "finnish.svg",
	"French": "french.svg",
	"German": "german.svg",
	"Greek": "greek.svg",
	"Guarani": "guarani.svg",
	"Haitian Creole": "haitian-creole.svg",
	"Hawaiian": "hawaiian.svg",
	"Hebrew": "hebrew.svg",
	"High Valyrian": "high-valyrian.svg",
	"Hindi": "hindi.svg",
	"Hungarian": "hungarian.svg",
    "Indonesian": "indonesian.svg",
    "Intermediate English": "english.svg", 
	"Irish": "irish.svg",
	"Italian": "italian.svg",
	"Japanese": "japanese.svg",
	"Klingon": "klingon.svg",
	"Korean": "korean.svg",
	"Latin": "latin.svg",
	"Navajo": "navajo.svg",
	"Norwegian (Bokmål)": "norwegian.svg",
	"Polish": "polish.svg",
	"Portuguese": "portuguese.svg",
	"Romanian": "romanian.svg",
	"Russian": "russian.svg",
	"Scottish Gaelic": "scottish-gaelic.svg",
	"Spanish": "spanish.svg", 
	"Swahili": "swahili.svg",
	"Swedish": "swedish.svg",
	"Turkish": "turkish.svg",
	"Ukrainian": "ukrainian.svg",
	"Vietnamese": "vietnamese.svg",
	"Welsh": "welsh.svg",
    "Yiddish": "yiddish.svg",
    "Zulu": "zulu.svg"
};

export function getEmoji(title: string) {
    return `<img src="https://raw.githubusercontent.com/centrumek/duolingo-readme-stats/main/assets/langs/${courseFlags[title]}" height="12">`;
}

export const commitFile = async (filename: string, message: string, username: string, email: string) => {
    await exec('git', [
        'config',
        '--global',
        'user.email',
        email
    ]);
    await exec('git', ['config', '--global', 'user.name', username]);
    await exec('git', ['add', filename]);
    await exec('git', ['commit', '-m', message]);
    await exec('git', ['push']);
};

const exec = (cmd: string, args: string[] = []) =>
    new Promise((resolve, reject) => {
        const childProcess = spawn(cmd, args, {stdio: 'pipe'});
        let stdout = '';
        childProcess.stdout.on('data', data => {
            stdout = data;
        });
        childProcess.on('close', code => {
            if (code !== 0 && !stdout.includes('nothing to commit')) {
                const err = new Error(`[CHILD PROCESS] Invalid status code: ${code}`);
                return reject(err);
            }
            return resolve(code);
        });
        childProcess.on('error', reject);
    });


export const setFailure = (error: string) => {
    console.error(error);
    setFailed(error);
};
