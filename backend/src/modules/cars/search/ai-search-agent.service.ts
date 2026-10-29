import OpenAI from "openai";
import { env } from "../../../config/env.js";
import type { CarsRepository } from "../cars.repository.js";
import type { SearchFilters } from "../cars.schema.js";
import { z } from "zod";

const TOOL_NAME = "buscar_carros";

const toolArgsSchema = z.object({
	marca: z.string().trim().min(1).optional(),
	nome: z.string().trim().min(1).optional(),
	versao: z.string().trim().min(1).optional(),
});

const BUSCAR_CARROS_TOOL = {
	type: "function" as const,
	function: {
		name: TOOL_NAME,
		description:
			'Consulta o catálogo por critérios. Preencha tudo o que a pergunta deixar claro. `marca` = fabricante (BMW, Fiat). `nome` = modelo (Gol, T-Cross). `versao` = motor/trim (1.4, Comfortline). `ano` = ano-modelo exato (use só um: `ano` OU `ano_min`/`ano_max`, não misture). `ano_min`/`ano_max` = faixa ("de 2018 a 2020", "a partir de 2019"). `km_min`/`km_max` = quilometragem em km inteiros ("50 mil km" → km_max: 50000; "acima de 100 mil" → km_min: 100000). Ex.: {"marca":"BMW"}; {"nome":"Gol","versao":"1.4"}; {"ano":2020}; {"ano_min":2018,"ano_max":2020}; {"km_max":50000}. Use {} só para pedidos genéricos sem marca, modelo, versão, ano nem km (ex.: "mostre tudo").',
		parameters: {
			type: "object",
			additionalProperties: false,
			properties: {
				marca: {
					type: "string",
					description:
						"Fabricante quanto citado, inclusive sozinho, (ex: 'tem bmw?' -> BMW)",
				},
				nome: {
					type: "string",
					description: "Modelo (ex.: Gol, T-Cross, 320i)",
				},
				versao: {
					type: "string",
					description:
						"Versão ou motor quando citado (ex.: 1.4, 1.0 TSI, Comfortline)",
				},
			},
		},
	},
} satisfies OpenAI.ChatCompletionTool;

export class AiSearchAgentService {
	private readonly client = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
	});

	constructor(private readonly repository: CarsRepository) {}

	async run(userMessage: string) {
		const completion = await this.client.chat.completions.create({
			model: env.OPENAI_MODEL as string,
			temperature: 0,
			messages: [
				{
					role: "system",
					content:
						"Assistente de catálogo de veículos (português). Chame buscar_carros exatamente uma vez. Preencha `marca` se citar fabricante; `nome` para modelo; `versao` para motor/trim; `ano` para um ano-modelo exato (não misture com ano_min/ano_max); `ano_min` e/ou `ano_max` para intervalos de ano; `km_min` e/ou `km_max` para quilometragem em km inteiros (ex.: 50 mil → 50000). Combine campos quando fizer sentido. Só use argumentos vazios {} se a mensagem for genérica (listar tudo) sem nenhum desses critérios.",
				},
				{
					role: "user",
					content: userMessage,
				},
			],
			tools: [BUSCAR_CARROS_TOOL],
			tool_choice: "required",
		});

		const toolCalls = completion.choices[0]?.message.tool_calls ?? [];
		const call = toolCalls.find(
			(c): c is OpenAI.ChatCompletionMessageFunctionToolCall =>
				c.type === "function" && c.function.name === TOOL_NAME,
		);

		const filters: SearchFilters = {};
		if (call) {
			let parsed: unknown = {};
			try {
				parsed = JSON.parse(call.function.arguments || "{}");
			} catch {
				parsed = {};
			}
			const parsedArgs = toolArgsSchema.safeParse(parsed);
			if (parsedArgs.success) {
				const a = parsedArgs.data;
				if (a.marca) filters.brand = a.marca;
				if (a.nome) filters.model = a.nome;
				if (a.versao) filters.version = a.versao;
			}
		}

		return this.repository.searchCars(filters);
	}
}
