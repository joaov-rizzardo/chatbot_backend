import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EvolutionApiService {

    private apiUrl: string = "";
    private apiKey: string = "";

    constructor(
        private readonly configService: ConfigService,
    ) { }

    onModuleInit() {
        this.apiUrl = this.configService.get<string>("EVOLUTION_API_URL") as string;
        this.apiKey = this.configService.get<string>("EVOLUTION_API_KEY") as string;
    }

    fetch(input: string | URL | Request, init?: RequestInit | undefined): Promise<Response> {
        return fetch(`${this.apiUrl}${input}`, {
            headers: {
                "Content-Type": "application/json",
                "apikey": this.apiKey,
                ...init?.headers
            },
            ...init
        })
    }


}
