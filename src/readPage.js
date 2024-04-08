"use strict";

import parseContent from './parseContent.js';
import fs from 'fs';

export default async function readPage(browser, organisation) {
    return setInterval(async () => {
        //goto statement list page
        const page = await browser.newPage();
        await page.goto(organisation.page);
        const listContent = await page.content();
        const title = (await parseContent(listContent, organisation.title)).text().trim();
        if (title !== organisation.latest) {
            console.log('Found updated statement from ' + organisation.name);
            console.log('Title : ' + title);
            organisation.latest = title;
            console.log('Access to new page');
            await Promise.all([
                page.bringToFront(),
                page.click(organisation.link),
                page.waitForNavigation()
            ]);
            const articleContent = await page.content();
            const article = await parseContent(articleContent, organisation.article);

            console.log('New statement has been read');
            const html = `
<!DOCTYPE html>
<html>
<head>
<title>${title}</title>
</head>
<body>
${article.html()}
</body>
</html>`;
            fs.writeFileSync(`result/${organisation.id}.html`, html);
        }
        page.close();
    }, 30000);

}