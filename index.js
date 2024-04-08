"use strict";

import puppeteer from 'puppeteer';
import fs from 'fs';
import readPage from './src/readPage.js';

(async () => {
    try {
        //reading list.json and parse
        console.log('Reading list');
        const jsonText = fs.readFileSync('list.json', 'utf8');
        const movementList = JSON.parse(jsonText);
        console.log('Launching browser');
        //launch puppeteer
        const browser = await puppeteer.launch({
            headless: false
        });
        //make array of intervalID
        const intervalIdList = new Array();
        //close browser when exit
        process.on('exit', async (code) => {
            console.log('exit by code ' + code);
            for (let intervalId of intervalIdList) {
                clearInterval(intervalId);
            }
            await browser.close();
        });
        process.on('SIGINT', async (code) => {
            console.log('exit by code ' + code);
            await browser.close();
        });
        for (let organisation of movementList) {
            //check if list.json is valid
            if (!organisation.hasOwnProperty('name')
                || !organisation.hasOwnProperty('id')
                || !organisation.hasOwnProperty('page')
                || !organisation.hasOwnProperty('link')
                || !organisation.hasOwnProperty('title')
                || !organisation.hasOwnProperty('article')
                || !organisation.hasOwnProperty('latest')) {
                throw 'Invalid list';
            }

        }
        for (let organisation of movementList) {
            console.log('Starting to track ' + organisation.name);
            //load page and set interval function
            intervalIdList.push(await readPage(browser, organisation));
            console.log(organisation.name + ' is now tracked');
        }
    } catch (e) {
        console.log(e);
        process.exit();
    }
})();