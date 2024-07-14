import { Identifiable } from "bc-minecraft-bedrock-types/lib/src/types/identifiable";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { SimpleContext } from "../../../Code/SimpleContext";
import { CompletionBuilder } from "../../builder/builder";
import { Database } from "../../../Database/Database";
import { IsEducationEnabled } from "../../../Project/Attributes";
import { Kinds } from "../../../Minecraft/General/Kinds";

export function provideCompletion(context: SimpleContext<CompletionBuilder>): void {
  const generateDoc = (item: Identifiable) => `The rp animation: ${item.id}`;

  context.receiver.generate(Database.ProjectData.ResourcePacks.animations, generateDoc, Kinds.Completion.Animation);
  context.receiver.generate(
    Database.ProjectData.ResourcePacks.animation_controllers,
    generateDoc,
    Kinds.Completion.Animation
  );

  Database.ProjectData.ResourcePacks.entities.forEach((entity) => {
    entity.animations.defined.forEach((item) => context.receiver.add(item, `The entity animation: ${item}`));
  });

  //Vanilla data
  context.receiver.generate(MinecraftData.vanilla.ResourcePack.animations, generateDoc, Kinds.Completion.Animation);
  context.receiver.generate(
    MinecraftData.vanilla.ResourcePack.animation_controllers,
    generateDoc,
    Kinds.Completion.Animation
  );
  MinecraftData.vanilla.ResourcePack.entities.forEach((entity) => {
    entity.animations.forEach((item) => context.receiver.add(item, `The vanilla entity animation: ${item}`));
  });

  //Education data
  if (IsEducationEnabled(context.doc)) {
    context.receiver.generate(MinecraftData.edu.ResourcePack.animations, generateDoc, Kinds.Completion.Animation);
    context.receiver.generate(
      MinecraftData.edu.ResourcePack.animation_controllers,
      generateDoc,
      Kinds.Completion.Animation
    );
    MinecraftData.edu.ResourcePack.entities.forEach((entity) => {
      entity.animations.forEach((item) => context.receiver.add(item, `The vanilla entity animation: ${item}`));
    });
  }
}
