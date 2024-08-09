import { BaseService } from "../services/base";
import { BulkRegistration, Connection } from "vscode-languageserver";
import { CapabilityBuilder } from "../services/capabilities";
import { ExtensionContext } from "../extension/context";
import { IExtendedLogger } from "../logger/logger";
import { IService } from "../services/service";
import { Languages } from "@blockception/shared";
import { SemanticModifiers, SemanticTokens } from "./constants";
import { provideJsonSemanticTokens } from "./minecraft/json";
import {
  InitializeParams,
  SemanticTokens as VSSemanticsTokens,
  SemanticTokensParams,
  SemanticTokensRangeParams,
  SemanticTokensRegistrationType,
  Range,
} from "vscode-languageserver-protocol";

import * as Mcfunction from "./minecraft/mcfunctions";
import { provideMolangSemanticTokens } from "./minecraft/molang";

export class SemanticsServer extends BaseService implements Partial<IService> {
  name: string = "definitions";

  constructor(logger: IExtendedLogger, extension: ExtensionContext) {
    super(logger.withPrefix("[definitions]"), extension);
  }

  onInitialize(capabilities: CapabilityBuilder, params: InitializeParams): void {
    capabilities.set("definitionProvider", {
      workDoneProgress: true,
    });
  }

  setupHandlers(connection: Connection): void {
    this.addDisposable(
      connection.languages.semanticTokens.on(this.onProvideSemanticRequest.bind(this)),
      connection.languages.semanticTokens.onRange(this.onProvideSemanticRequest.bind(this))
    );
  }

  dynamicRegister(register: BulkRegistration): void {
    register.add(SemanticTokensRegistrationType.type, {
      documentSelector: [
        { scheme: "file", language: Languages.JsonCIdentifier },
        { scheme: "file", language: Languages.JsonIdentifier },
        { scheme: "file", language: Languages.McFunctionIdentifier },
        { scheme: "file", language: Languages.McLanguageIdentifier },
        { scheme: "file", language: Languages.McOtherIdentifier },
        { scheme: "file", language: Languages.McMolangIdentifier },
      ],
      legend: {
        tokenModifiers: SemanticModifiers,
        tokenTypes: SemanticTokens,
      },
      range: true,
      full: true,
    });
  }

  private async onProvideSemanticRequest(
    params: SemanticTokensRangeParams | SemanticTokensParams
  ): Promise<VSSemanticsTokens> {
    const uri = params.textDocument.uri;
    if (!uri.startsWith("file://")) return { data: [] };

    const document = this.extension.documents.get(uri);
    if (!document) return { data: [] };

    let range: Range | undefined = undefined;

    if (IsSemanticTokensRangeParams(params)) {
      range = params.range;
    }

    switch (document.languageId) {
      case Languages.JsonCIdentifier:
      case Languages.JsonIdentifier:
        return provideJsonSemanticTokens(document, range);

      case Languages.McFunctionIdentifier:
        return Mcfunction.provideSemanticToken(document, range);

      case Languages.McMolangIdentifier:
        return provideMolangSemanticTokens(document, range);

      case Languages.McOtherIdentifier:
      case Languages.McLanguageIdentifier:
        break;
    }

    return { data: [] };
  }
}

function IsSemanticTokensRangeParams(
  value: SemanticTokensRangeParams | SemanticTokensParams
): value is SemanticTokensRangeParams {
  let temp: any = value;

  if (temp.range && Range.is(temp.range)) return true;

  return false;
}