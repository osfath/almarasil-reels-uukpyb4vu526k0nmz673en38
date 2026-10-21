// chrome.js — يلقى كروم/إيدج على ويندوز وماك ولينكس (CHROME_PATH يغلب). الاستخدام: require(<هذا الملف>)()
const fs = require('fs'), path = require('path'), os = require('os');
module.exports = function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const LA = process.env.LOCALAPPDATA || '', PF = process.env.ProgramFiles || 'C:/Program Files', P86 = process.env['ProgramFiles(x86)'] || 'C:/Program Files (x86)';
  const cands = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    PF + '/Google/Chrome/Application/chrome.exe', P86 + '/Google/Chrome/Application/chrome.exe', LA + '/Google/Chrome/Application/chrome.exe',
    PF + '/Microsoft/Edge/Application/msedge.exe', P86 + '/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  const cache = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome');        // كروم اللي ينزّله install
  try { for (const v of fs.readdirSync(cache).sort().reverse()) for (const s of ['chrome-win64/chrome.exe', 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', 'chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', 'chrome-linux64/chrome']) cands.push(path.join(cache, v, s)); } catch (e) {}
  for (const c of cands) { try { if (c && fs.existsSync(c)) return c; } catch (e) {} }
  throw new Error('ما لقيت كروم ولا إيدج — ثبّت كروم أو حدّد CHROME_PATH');
};
if (require.main === module) console.log(module.exports());
