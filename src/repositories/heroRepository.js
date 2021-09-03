const { readFile, writeFile } = require('fs/promises');

class HeroRepository {

    constructor({ file }) {
        this.file = file;
    }

    async create(data) {
        const currentFile = await this._currentFileContent();
        currentFile.push(data);

        await writeFile(this.file, JSON.stringify(currentFile));

        return data.id
    }

    async _currentFileContent() {
        return JSON.parse(await readFile(this.file));
    }

    async find(requestId) {
        const currentFile = await this._currentFileContent(); //recebe todo os dados de data.json
        if (!requestId) return currentFile;

        return currentFile.find(({ id }) => requestId === id);
    }
}

module.exports = HeroRepository;

// const heroRepository = new HeroRepository({
//     file: './../../database/data.json'
// });

// heroRepository.find(1).then(console.log).catch(err => console.log('error', err));
//heroRepository.find().then(console.log).catch(err => console.log('error', err));
// heroRepository
//     .create({ id: 3, name: 'Enemy3', damage: 10, power: 'Novice' })
//     .then(console.log)
//     .catch(error => console.log('error', error));