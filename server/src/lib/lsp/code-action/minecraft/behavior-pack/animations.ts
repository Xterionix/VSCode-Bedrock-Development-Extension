import { Diagnostic } from "vscode-languageserver";
import { CodeActionBuilder } from "../../builder";
import { Commands } from "@blockception/shared";

export function onCodeAction(builder: CodeActionBuilder, diag: Diagnostic) {
  switch (diag.code) {
    case "minecraft.animation.missing":
    case "behaviorpack.animation.missing":
    case "behaviorpack.anim_or_controller.missing":
      const id = builder.getId(diag.range);
      builder.Command(`Create bp animation: '${id}'`, Commands.Create.Behaviorpack.Animation, [id]);
      return;
  }
}
