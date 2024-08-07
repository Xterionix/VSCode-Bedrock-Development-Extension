import { ConvertWords } from "../molang/main";
import { McfunctionLineTokens } from "../mcfunctions";
import { PackType } from "bc-minecraft-bedrock-project";
import { Range } from "vscode-languageserver-textdocument";
import { SemanticTokens } from "vscode-languageserver/node";
import { TextDocument } from "../../../documents/text-document";
import { JsonSemanticTokensBuilder, McfunctionSemanticTokensBuilder } from '../../builders';
import { IsMolang } from '../../../../minecraft/molang/functions';
import { CreateMolangWords } from '../../../../minecraft/molang/words';

export function provideJsonSemanticTokens(doc: TextDocument, range?: Range | undefined): SemanticTokens {
  const Type = PackType.detect(doc.uri);

  //Not related to minecraft
  if (Type == PackType.unknown) return { data: [] };

  const Builder = new JsonSemanticTokensBuilder(doc);
  const text = doc.getText(range);
  const offset = range ? doc.offsetAt(range.start) : 0;

  createTokens(text, offset, Builder);

  return Builder.Build();
}

/**
 *
 * @param text
 * @param offset
 * @param Builder
 */
function createTokens(text: string, offset: number, Builder: JsonSemanticTokensBuilder): void {
  let index = 0;

  while (index >= 0) {
    let startIndex = findNext(text, index);
    if (startIndex < 0) return;

    let endIndex = findNext(text, startIndex + 1);
    if (endIndex < 0) return;

    startIndex++;
    let property = text.substring(startIndex, endIndex);
    index = endIndex + 1;

    if (IsMolang(property)) {
      McfunctionLineTokens(property, offset + startIndex, McfunctionSemanticTokensBuilder.FromJson(Builder));
      const Words = CreateMolangWords(property, offset + startIndex);
      ConvertWords(Words, Builder);
    }
  }
}

function findNext(text: string, startIndex: number): number {
  while (startIndex > -1 && startIndex < text.length) {
    startIndex = text.indexOf('"', startIndex);
    if (startIndex < 0) break;

    if (text.charAt(startIndex - 1) === "\\" && text.charAt(startIndex - 2) !== "\\") {
      startIndex++;
      continue;
    }

    return startIndex;
  }

  return -1;
}
