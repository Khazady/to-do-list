// describe is "folder with tests" and it is a single test
describe('Task', () => {
    it('base example, visually looks correct', async () => {
        // standard Jest timeout of 5000 isn't enough to take screenshot??
        jest.setTimeout(30000);
        await page.goto('http://localhost:9009/iframe.html?id=task-stories--base-example&viewMode=story');
        // take screenshot from URL with embedded iframe.html
        // first screenshot is reference
        const image = await page.screenshot();

        // compare previous screenshot with new one
        expect(image).toMatchImageSnapshot();
    });
});
