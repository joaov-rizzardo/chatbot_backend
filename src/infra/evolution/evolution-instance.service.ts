import { Injectable, Logger } from "@nestjs/common";
import { CreateInstanceResult, InstanceService } from "src/domain/services/instance/instance.service";
import { EvolutionApiService } from "./evolution-api.service";

@Injectable()
export class EvolutionInstanceService implements InstanceService {

    private readonly logger = new Logger(EvolutionInstanceService.name);

    constructor(
        private readonly api: EvolutionApiService
    ) { }

    async createInstance(instanceName: string): Promise<CreateInstanceResult> {
        const response = await this.api.fetch(`/instance/create`, {
            method: "POST",
            body: JSON.stringify({
                instanceName,
                integration: "WHATSAPP-BAILEYS",
                qrcode: true,
            }),
        });

        if (!response.ok) {
            const body = await response.text();
            this.logger.error(`Evolution API error: ${response.status} - ${body}`);
            throw new Error(`Failed to create instance on Evolution API: ${response.status}`);
        }

        const data = await response.json();

        return {
            instanceName: data.instance?.instanceName ?? instanceName,
            instanceId: data.instance?.instanceId ?? "",
            status: data.instance?.status ?? "created",
            qrCode: data.qrcode?.base64 ?? null,
        };
    }
}