import { PackType } from "bc-minecraft-bedrock-project";
import { Data, Defined, MolangData } from "bc-minecraft-molang";
import { CompletionItemKind } from "vscode-languageserver-types";
import { SimpleContext } from "../../../../util/simple-context";
import { CompletionBuilder } from "../../builder/builder";
import { Database } from "../../../../database/database";

export function provideCompletion(context: SimpleContext<CompletionBuilder>): void {
  const packType = PackType.detect(context.doc.uri);

  switch (packType) {
    case PackType.behavior_pack:
      return;

    case PackType.resource_pack:
      Database.ProjectData.ResourcePacks.entities.forEach((entity) =>
        GenerateDU(entity.molang.textures, context.receiver, entity.id)
      );
  }
}

function Generate(
  data: Data,
  builder: CompletionBuilder,
  kinds: CompletionItemKind = CompletionItemKind.Reference
): void {
  builder.add({label: data.id, documentation: data.documentation ?? `The molang texture: ${data.id}`, kind: kinds});
}

function GenerateDU(
  data: Defined<string>,
  builder: CompletionBuilder,
  ownerid: string,
  kinds: CompletionItemKind = CompletionItemKind.Reference
): void {
  data.defined.forEach((item) => {
    builder.add({label: item, documentation: `The molang texture: ${item}\nDeclared by '${ownerid}'`, kind: kinds});
  });
}