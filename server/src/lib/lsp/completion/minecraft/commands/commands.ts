import { CommandData, CommandInfo } from "bc-minecraft-bedrock-command";
import { CompletionBuilder } from "../../builder/builder";
import { IsEducationEnabled } from "../../../../project/attributes";
import { Kinds } from "../../../../constants/kinds";
import { SMap } from "bc-minecraft-bedrock-project";
import { SimpleContext } from "../../../../util";

/**
 *
 * @param receiver
 */
export function provideCompletion(context: SimpleContext<CompletionBuilder>): void {
  const edu = IsEducationEnabled(context.doc);

  SMap.forEach(CommandData.Vanilla, (data) => getCompletion(data, context.builder));
  if (edu) SMap.forEach(CommandData.Edu, (data) => getCompletion(data, context.builder));
}

export function provideExecuteSubcommandCompletion(context: SimpleContext<CompletionBuilder>): void {
  SMap.forEach(CommandData.ExecuteSubcommands, (data) => getCompletion(data, context.builder));
}

/**
 *
 * @param Data
 * @param receiver
 */
function getCompletion(Data: CommandInfo[], receiver: CompletionBuilder) {
  for (var I = 0; I < Data.length; I++) {
    const CInfo = Data[I];
    if (CInfo.obsolete) continue;

    const doc = `## ${CInfo.name}\n${CInfo.documentation}\n[documentation](https://learn.microsoft.com/en-us/minecraft/creator/commands/commands/${CInfo.name})`;

    receiver.add({ label:CInfo.name, documentation: doc, kind: Kinds.Completion.Command});
    break;
  }
}
