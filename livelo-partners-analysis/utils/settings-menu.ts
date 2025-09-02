import inquirer from "inquirer";
import { SettingsService } from "../src/db/settings";

export const openSettingsMenu = async () => {
  const service = new SettingsService();
  const current = service.getSettings();

  const answers = await inquirer.prompt([
    {
      type: "number",
      name: "pointsThreshold",
      message: "Informe o número de pontos para notificação dos favoritos:",
      default: current?.pointsThreshold ?? 100,
      validate: (value: number) => (value > 0 ? true : "Digite um número maior que 0"),
    },
    {
      type: "list",
      name: "comparisonMode",
      message: "Deseja comparar por qual campo?",
      choices: [
        { name: "Clube Livelo", value: "parityClub" },
        { name: "Padrão", value: "parity" },
      ],
      default: current?.comparisonMode ?? "parityClub",
    },
  ]);

  service.saveSettings({
    pointsThreshold: answers.pointsThreshold,
    comparisonMode: answers.comparisonMode,
  });

  console.log("✅ Configuração salva:", answers);
};
