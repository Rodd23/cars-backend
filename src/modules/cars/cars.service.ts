import { CarsRepository } from "./cars.repository.js";
import type { CreateCarInput, SearchCarsRequestInput } from "./cars.schema.js";
import { AiSearchAgentService } from "./search/ai-search-agent.service.js";

export class CarsService {
	private carsRepository: CarsRepository;
	private aiSearchAgent: AiSearchAgentService;

	constructor() {
		this.carsRepository = new CarsRepository();
		this.aiSearchAgent = new AiSearchAgentService(this.carsRepository);
	}

	async createCar(data: CreateCarInput) {
		try {
			return await this.carsRepository.createCar(data);
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to create car: ${error.message}`);
			}
			throw error;
		}
	}

	async searchCars(data: SearchCarsRequestInput) {
		try {
			return await this.aiSearchAgent.run(data.search);
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to search cars: ${error.message}`);
			}
			throw error;
		}
	}
}
