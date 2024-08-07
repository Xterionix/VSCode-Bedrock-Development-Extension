import { DocumentFormattingParams, DocumentRangeFormattingParams } from "vscode-languageserver";
import { TextEdit } from "vscode-languageserver-textdocument";
import { TrimStartFromLine } from '../util/text-edit';
import { TextDocument } from "../lsp/documents/text-document";

export function formatLangauge(doc: TextDocument, params: DocumentFormattingParams): TextEdit[] {
  let Out: TextEdit[] = [];

  for (let index = 0; index < doc.lineCount; index++) {
    formatline(index, doc, Out);
  }

  return Out;
}

export function formatLangaugeRange(doc: TextDocument, params: DocumentRangeFormattingParams): TextEdit[] {
  let Out: TextEdit[] = [];
  let StartIndex = params.range.start.line;
  let EndIndex = params.range.end.line;

  for (let index = StartIndex; index < EndIndex; index++) {
    formatline(index, doc, Out);
  }

  return Out;
}

//formatts the specified line
function formatline(index: number, document: TextDocument, Out: TextEdit[]) {
  let Line = document.getLine(index);

  TrimStartFromLine(Line, index, Out, [" ", "\t"]);
}
