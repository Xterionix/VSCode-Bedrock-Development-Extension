import { Identifiable } from "bc-minecraft-bedrock-types/lib/src/types/identifiable";
import { SimpleContext } from "../../../../util/simple-context";
import { CompletionBuilder } from "../../builder/builder";
import { Kinds } from "../../../../constants/kinds";
import { JsonPathCompletion } from "../../builder";
import * as Animations from "./animations";

export function provideCompletion(context: SimpleContext<CompletionBuilder>): void {
  context.builder.generate(
    context.projectData.BehaviorPacks.animation_controllers,
    (item: Identifiable) => `The bp animation controller: ${item.id}`,
    Kinds.Completion.AnimationControllers
  );
}

export function provideJsonCompletion(context: SimpleContext<CompletionBuilder>): void {
  return acBPJsonCompletion.onCompletion(context);
}

const acBPJsonCompletion = new JsonPathCompletion({
  match: /animation_controllers\/(.*)\/states\/(.*)\/animations\/.*/gi,
  onCompletion: Animations.provideDefinedAnimationCompletion,
});
