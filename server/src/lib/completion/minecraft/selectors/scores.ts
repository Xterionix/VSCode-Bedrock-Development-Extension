import { OffsetWord } from "bc-vscode-words";
import { CompletionItemKind } from "vscode-languageserver";
import { Offset, SimpleContext } from "../../../Code";
import { CompletionBuilder } from "../../builder/builder";
import * as Objectives from "../../general/objectives";

export function provideCompletion(context: SimpleContext<CompletionBuilder>, selector: OffsetWord, pos: number): void {
  const charBefore = Offset.charAt(selector, pos - 1);

  if (charBefore === "{") {
    return Objectives.provideCompletion(context);
  }

  if (Offset.IsWithin(selector, pos) || charBefore === "=") {
    return provideRange(context);
  }

  return Objectives.provideCompletion(context);
}

function provideRange(context: SimpleContext<CompletionBuilder>): void {
  const receiver = context.receiver;
  receiver.add("0", "test for the exact value of 0", CompletionItemKind.Value);
  receiver.add("!0", "test for the exact value of everything but 0", CompletionItemKind.Value);
  receiver.add("0..", "test for the everything equal to 0 or higher", CompletionItemKind.Value);
  receiver.add("..0", "test for the everything equal to 0 or lower", CompletionItemKind.Value);
  receiver.add("0..10", "test for the everything equal to 0 or 10 and everything in between", CompletionItemKind.Value);
  receiver.add(
    "!0..10",
    "test for the everything not equal to 0 or 10 and everything in between",
    CompletionItemKind.Value
  );
}
