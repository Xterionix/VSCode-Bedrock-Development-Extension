import { Identifiable } from "bc-minecraft-bedrock-types/lib/src/types/identifiable";
import { SimpleContext } from "../../../../util/simple-context";
import { CompletionBuilder } from "../../builder/builder";
import { Database } from "../../../../lsp/database/database";
import { Kinds } from "../../../../constants/kinds";

export function provideCompletion(context: SimpleContext<CompletionBuilder>): void {
  const generateDoc = (item: Identifiable) => `The mcfunction: ${item.id}}`;

  //Project data
  context.receiver.generate(Database.ProjectData.BehaviorPacks.functions, generateDoc, Kinds.Completion.Functions);

  //No vanilla data
}
