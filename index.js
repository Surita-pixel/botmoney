const puppeteer = require('puppeteer');
const csvtojson = require('csvtojson')
let listaNumeros = []

const processData = async () => {
    try {
        const jsonObj = await csvtojson().fromFile('./export.csv');

        const filteredList = jsonObj.filter(item => item.NUMBER); // Filter items with non-null or non-undefined 'NUMBER' properties
        filteredList.forEach(item => {
            item.NUMBER = item.NUMBER.replace(/^591/, ''); // Replace the string starting with '227'
        });
         listaNumeros = jsonObj.map(item => item.NUMBER);

        const jsonString = JSON.stringify(listaNumeros);
        console.log(jsonString);
    } catch (error) {
        console.error('Error:', error);
    }
};

const runBot = async (numero) => {
    await processData()
    const browser = await puppeteer.launch({ headless: false, args: ['--incognito'] });

    try {
        for (numero of listaNumeros) {
            const page = await browser.newPage();
            page.setDefaultTimeout(0)
            await page.goto('https://members.tajhotels.com/v2/?clientId=IHCL-WEB-APP&redirectURL=https%3A%2F%2Ftaj-dev65-02.adobecqms.net%2Fen-in%2Ftajinnercircle%2F');

            const inputPais = await page.$('.down-icon');
            await inputPais.click();

            await page.waitForTimeout(3000)
            const inputPaiscodigodiv = await page.$('.country-search')
            const inputPaiscodigo = await inputPaiscodigodiv.$('input')
            await inputPaiscodigo.type('bolivia')
            await page.waitForTimeout(3000)
            const paises = await page.$$('.single-country')
            let codigo;

            for (let i = 0; i < paises.length; i++) {
                const html = await page.evaluate(element => element.innerHTML, paises[i]);

                if (html.includes('Bolivia')) {
                    codigo = paises[i];

                }
            }
            if (codigo) {
                await codigo.click()
            }

            await page.waitForTimeout(3000)
            const inputNumero = await page.$('#phoneInputLogin-phone'); // Fix the selector here

            await inputNumero.type(numero);
            const marck = await page.$('.checkmark')
            await marck.click()
            await page.waitForTimeout(2000)
            const btnfinal =  await page.$('.confirmButton')
            await btnfinal.click()
        }


    } catch (error) {
        console.error('Error:', error);
    }
};

runBot()