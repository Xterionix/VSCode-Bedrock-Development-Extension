import { Database } from "../../../lsp/database/database";
import { DefinitionParams, Location, Range, ReferenceParams } from "vscode-languageserver-protocol";
import { GetCurrentElement } from "../../../minecraft/json/functions";
import { IsMolang } from "../../../minecraft/molang/functions";
import { OffsetWord } from "bc-vscode-words";
import { ParameterType } from "bc-minecraft-bedrock-command";
import { References } from "../../../util/references";
import { TextDocument } from "../../documents/text-document";

import * as Command from "./commands";
import * as Molang from "./molang/main";

export function provideReferences(
  doc: TextDocument,
  params: DefinitionParams | ReferenceParams
): Location[] | undefined {
  const pos = params.position;

  const Text = doc.getText();
  const ElementRange = GetCurrentElement(Text, doc.offsetAt(pos));

  if (!ElementRange) return undefined;

  const value = new OffsetWord(Text.slice(ElementRange.start, ElementRange.end), ElementRange.start);
  const Out: Location[] = [];

  //Find references in document
  if (IsMolang(value.text)) {
    //Command
    if (value.text.startsWith("/")) {
      return Command.provideReferences(new OffsetWord(value.text.slice(1), value.offset + 1), params, doc);
    }
    //Event
    else if (value.text.startsWith("@")) {
      return References.ConvertLocation(Database.findReferences(value.text.slice(2).trim(), [ParameterType.event]));
    }
    //Molang
    else {
      return Molang.provideReferences(value, doc, params);
    }
  } else {
    ReferencesInDocument(value, doc, Out);

    const out = Database.findReference(value.text);

    if (out) {
      Out.push(...References.ConvertLocation([out]));
    }
  }

  return Out;
}

function ReferencesInDocument(value: OffsetWord, doc: TextDocument, receiver: Location[]) {
  const Text = doc.getText();
  let Index = value.offset;
  const start = value.offset;
  const length = value.text.length;
  const end = value.offset + length;

  while (Index > -1) {
    if (Index < start || Index > end) {
      receiver.push(Location.create(doc.uri, Range.create(doc.positionAt(Index), doc.positionAt(Index + length))));
    }

    Index = Text.indexOf(value.text, Index + length);
  }
}
