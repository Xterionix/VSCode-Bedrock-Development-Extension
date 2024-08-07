import { CommandCompletionContext } from "../../builder/context";
import { CompletionBuilder } from "../../builder/builder";
import { GetPossibleEntityTypes } from '../../../../minecraft/commands';
import { IsEducationEnabled } from "../../../../project/attributes";
import { Kinds } from '../../../../constants/kinds';
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";

export function provideCompletion(context: CommandCompletionContext, type: string | undefined = undefined): void {
  context.projectData.BehaviorPacks.entities.forEach((entity) => {
    const generateDoc = (item: string) => `The entity family: ${item} from: ${entity.id}`;

    context.builder.generate(entity.families, generateDoc, Kinds.Completion.Family);
  });

  //Vanilla data
  context.builder.generate(MinecraftData.General.Entities.families, (item) => `The vanilla entity family: ${item}`, Kinds.Completion.Family);
}

export function provideCompletionTest(context: CommandCompletionContext): void {
  const builder = context.builder;

  const types = GetPossibleEntityTypes(context.command, context.parameterIndex);
  const edu = IsEducationEnabled(context.doc);

  if (types.length === 0) {
    context.projectData.BehaviorPacks.entities.forEach((entity) => convertTestEntity(entity, builder));

    MinecraftData.General.Entities.families.forEach((family) => {
      builder.add({ label:family, documentation: `Test for the vanilla family: ${family}`, kind: Kinds.Completion.Family});
      builder.add({ label:"!" + family, documentation: `Test not for the vanilla family: ${family}`, kind: Kinds.Completion.Family});
    });
  } else {
    types.forEach((type) => {
      const entity = context.projectData.BehaviorPacks.entities.get(type);
      if (entity) convertTestEntity(entity, builder);

      const vanilla_entity = MinecraftData.ResourcePack.getEntity(type, edu);
      if (vanilla_entity) convertTestEntity(vanilla_entity, builder);
    });
  }
}

function convertTestEntity(entity: { families?: string[]; id: string }, receiver: CompletionBuilder) {
  entity.families?.forEach((family) => {
    receiver.add({ label:family, documentation: `Test for the family: ${family}\n\dForm ${entity.id}`, kind: Kinds.Completion.Family});
    receiver.add({ label:"!" + family, documentation: `Test not for the family: ${family}\n\dForm ${entity.id}`, kind: Kinds.Completion.Family});
  });
}
