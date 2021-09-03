class HeroService {
    constructor({ heroRepository }) {
        this.heroRepository = heroRepository;
    }

    async find(requestId) {
        return this.heroRepository.find(requestId);
    }

    async create(data) {
        return this.heroRepository.create(data);
    }
}

module.exports = HeroService;