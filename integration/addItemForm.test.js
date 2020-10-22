//describe - "папка с тестами", а it - 1 тест
describe('addItemForm', () => {
    it('base example, visually looks correct', async () => {
        await page.goto('http://localhost:9009/iframe.html?id=additemform-stories--add-item-form-base-example&viewMode=story');
        //делаем скриншот по урлу с вставленным iframe.html
        //1-ый скрин эталонный
        const image = await page.screenshot();

        //сравниваем прошлый скриншот с новым
        expect(image).toMatchImageSnapshot();
    });
});
