
import { Database } from '../../../lsp/database/database';
import { GetCurrentString } from '../../../minecraft/json/functions';
import { Hover } from "vscode-languageserver";
import { HoverParams, Range } from "vscode-languageserver-protocol";
import { IsMolang } from '../../../minecraft/molang/functions';
import { TextDocument } from '../../documents/text-document';

import * as Molang from "./molang/main";

export function provideHover(doc: TextDocument, params: HoverParams): Hover | undefined {
  const cursor = doc.offsetAt(params.position);
  const text = doc.getText();
  let range = GetCurrentString(text, cursor);

  //If start has not been found or not a property
  if (range == undefined) return;
  range = range;

  //Prepare data to be fixed for json
  const currentText = text.substring(range.start, range.end);
  const R = Range.create(params.position, { character: params.position.character + currentText.length, line: params.position.line });

  if (IsMolang(currentText)) {
    return Molang.provideHoverAt(currentText, range, cursor, R);
  }

  //Check project data
  const reference = Database.ProjectData.find((item) => item.id === currentText);

  if (reference?.documentation) {
    return {
      contents: { kind: "markdown", value: reference.documentation, language: "en-gb" },
      range: R,
    };
  }

  return undefined;
}
