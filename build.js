const fs = require('fs');
const path = require('path');
const slugify = require('@sindresorhus/slugify');

const files = fs.readdirSync(path.join(__dirname, 'data'));
const citiesCsvFile = path.join(__dirname, 'cities.csv');
const provincesCsvFile = path.join(__dirname, 'provinces.csv');
const regionsCsvFile = path.join(__dirname, 'regions.csv');
const zipCodesCsvFile = path.join(__dirname, 'zip-codes.csv');

let cities = [];
let provinces = [];
let regions = [];

let citiesCsv = '';
let provincesCsv = '';
let regionsCsv = '';
let zipCodesCsv = '';

files.forEach(file => {
	const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file)));

	const cityCode = data.codice;
	const provinceCode = data.provincia.codice;
	const regionCode = data.regione.codice;
	const cityName = data.nome;
	const regionName = data.regione.nome;

	cities.push({
		provinceCode: provinceCode,
		code: cityCode,
		name: cityName,
		slug: slugify(cityName.split('/')[0])
	});
	
	if (provinces.length === 0 || !provinces.some(province => province.code === provinceCode)) {
		provinces.push({
			regionCode: regionCode,
			code: provinceCode,
			name: data.provincia.nome,
			acronym: data.sigla
		});
	}

	if (regions.length === 0 || !regions.some(region => region.code === regionCode)) {
		regions.push({
			code: regionCode,
			name: regionName,
			slug: slugify(regionName.split('/')[0])
		});
	}

	for (const zipCode of data.cap) {
		zipCodesCsv += `0,${cityCode},${zipCode}\n`;
	}
});

cities.sort((a, b) => a['name'].localeCompare(b['name']));
provinces.sort((a, b) => a['name'].localeCompare(b['name']));
regions.sort((a, b) => a['name'].localeCompare(b['name']));

cities.forEach(city => {
	citiesCsv += `0,${city.provinceCode},${city.code},${city.name},${city.slug}\n`;
});

provinces.forEach(province => {
	provincesCsv += `0,${province.regionCode},${province.code},${province.name},${province.acronym}\n`;
});

regions.forEach(region => {
	regionsCsv += `0,${region.code},${region.name},${region.slug}\n`;
});

fs.writeFileSync(citiesCsvFile, citiesCsv);
fs.writeFileSync(provincesCsvFile, provincesCsv);
fs.writeFileSync(regionsCsvFile, regionsCsv);
fs.writeFileSync(zipCodesCsvFile, zipCodesCsv);
