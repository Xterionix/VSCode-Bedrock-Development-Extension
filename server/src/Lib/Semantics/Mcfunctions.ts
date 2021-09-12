import { Position, Range, SemanticTokens } from "vscode-languageserver";
import { TextDocument } from "../Types/Document/TextDocument";
import { McfunctionSemanticTokensBuilder } from "./Builders/McfunctionSemanticTokensBuilder";
import { CreateSelectorTokens } from "./include";
import { SemanticModifiersEnum, SemanticTokensEnum } from "./Legend";
import { Command } from "bc-minecraft-bedrock-command";
import { IsEducationEnabled } from "../Project/Attributes";

export function ProvideMcfunctionSemanticTokens(doc: TextDocument, range?: Range | undefined): SemanticTokens {
  const Builder = new McfunctionSemanticTokensBuilder(doc);
  let startindex = 0;
  let endindex = doc.lineCount;

  if (range) {
    startindex = range.start.line;
    endindex = range.end.line;
  }

  for (let I = startindex; I < endindex; I++) {
    const line = doc.getLine(I);
    const CommentIndex = line.indexOf("#");

    if (CommentIndex >= 0) {
      Builder.AddAt(I, CommentIndex, line.length - CommentIndex, SemanticTokensEnum.comment);
    }

    const P = Position.create(I, 0);
    const command = Command.parse(line, doc.offsetAt(P));
    CreateTokens(command, Builder);
  }

  return Builder.Build();
}

export function McfunctionLineTokens(line: string, cursor: number, offset: number, Builder: McfunctionSemanticTokensBuilder): void {
  if (line.startsWith("/")) {
    line = line.substring(1, line.length);
    offset++;
  }

  const command = Command.parse(line, offset);
  CreateTokens(command, Builder);
}

function CreateTokens(command: Command, Builder: McfunctionSemanticTokensBuilder): void {
  if (command.parameters.length == 0) return;

  const Edu = IsEducationEnabled(Builder.doc.getConfiguration());

  const First = command.parameters[0];
  Builder.AddWord(First, SemanticTokensEnum.class);
  const Matches = command.getCommandData(Edu);
  let Match;

  if (Matches.length == 0) return;

  Match = Matches[0];

  let Max = command.parameters.length;
  if (Match.command.parameters.length < Max) Max = Match.command.parameters.length;

  for (let I = 1; I < Max; I++) {
    const Data = Match.command.parameters[I];
    const Word = command.parameters[I];

    switch (Data.Type) {
      case ParameterType.command:
        let Sub = GetSubCommand(Command, Edu);
        if (Sub) {
          CreateTokens(Sub, Builder);
        }
        return;

      case ParameterType.boolean:
        Builder.AddWord(Word, SemanticTokensEnum.keyword);
        break;

      //Values
      case ParameterType.block:
      case ParameterType.entity:
      case ParameterType.item:
      case ParameterType.particle:
      case ParameterType.sound:
      case ParameterType.tickingarea:
        const Index = Word.text.indexOf(":");

        if (Index >= 0) {
          const Line = Word.location.range.start.line;
          const char = Word.location.range.start.character;

          Builder.AddAt(Line, char, Index, SemanticTokensEnum.namespace, SemanticModifiersEnum.static);
          Builder.AddAt(Line, char + Index + 1, Word.text.length - (Index + 1), SemanticTokensEnum.method, SemanticModifiersEnum.readonly);
        } else {
          Builder.AddWord(Word, SemanticTokensEnum.method, SemanticModifiersEnum.readonly);
        }

        break;

      case ParameterType.coordinate:
      case ParameterType.float:
      case ParameterType.integer:
      case ParameterType.xp:
        CreateRangeTokensWord(Word, Builder);

        break;

      case ParameterType.keyword:
        Builder.AddWord(Word, SemanticTokensEnum.method, SemanticModifiersEnum.defaultLibrary);
        break;

      case ParameterType.function:
      case ParameterType.string:
        Builder.AddWord(Word, SemanticTokensEnum.string);
        break;

      case ParameterType.objective:
        Builder.AddWord(Word, SemanticTokensEnum.variable);
        break;

      case ParameterType.tag:
        Builder.AddWord(Word, SemanticTokensEnum.regexp, SemanticModifiersEnum.readonly);
        break;

      case ParameterType.operation:
        Builder.AddWord(Word, SemanticTokensEnum.operator);
        break;

      //Modes
      case ParameterType.cameraShakeType:
      case ParameterType.cloneMode:
      case ParameterType.difficulty:
      case ParameterType.effect:
      case ParameterType.event:
      case ParameterType.fillMode:
      case ParameterType.gamemode:
      case ParameterType.locateFeature:
      case ParameterType.maskMode:
      case ParameterType.mirror:
      case ParameterType.musicRepeatMode:
      case ParameterType.replaceMode:
      case ParameterType.rideRules:
      case ParameterType.rotation:
      case ParameterType.saveMode:
      case ParameterType.slotType:
      case ParameterType.slotID:
      case ParameterType.structureAnimationMode:
      case ParameterType.teleportRules:
      case ParameterType.oldBlockMode:
        Builder.AddWord(Word, SemanticTokensEnum.enumMember);
        break;

      //json
      case ParameterType.blockStates:
      case ParameterType.jsonItem:
      case ParameterType.jsonRawText:
        break;

      //
      case ParameterType.selector:
        CreateSelectorTokens(Word, Builder);
        break;

      default:
        break;
    }
  }
}
