"use strict";

import * as cheerio from 'cheerio';

export default async function parseContent(content, selector) {
    const $ = cheerio.load(content);
    return $(selector + ':first');
}