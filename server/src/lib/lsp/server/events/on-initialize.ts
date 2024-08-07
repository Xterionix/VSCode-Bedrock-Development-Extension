import { InitializeParams, InitializeResult, TextDocumentSyncKind } from "vscode-languageserver";
import { Manager } from "../../../manager/manager";
import { Console } from "../../../manager/console";
import { Version } from "../../../constants/version";
import { Commands, Languages } from "@blockception/shared";

const triggerCharacters = toArray(" abcdefghijklmnopqrstuvwxyz[]{}:.@=+-*/\\|!#$%^&*()<>?,'\"");

export function onInitialize(params: InitializeParams): InitializeResult {
  Console.Info(`Initializing minecraft server`);
  Console.Info(`- Version: ${Version}`);

  //process capabilities of the client
  const capabilities = params.capabilities;
  Manager.Capabilities.Parse(capabilities);

  const result: InitializeResult = {
    serverInfo: {
      name: "bc-minecraft-language-server",
      version: Version,
    },
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,

      // Tell the client that this server supports a couple commands
      executeCommandProvider: {
        commands: [
          Commands.DiagnoseProject,
          Commands.MCProject.Create,
          Commands.Files.Append,
          Commands.ScanProjects,
          Commands.StoreProject,
        ],
        workDoneProgress: true,
      },

      // Code Actions
      codeActionProvider: true,
      codeLensProvider: {
        resolveProvider: true,
        workDoneProgress: false,
      },

      // Tell the client that this server supports go to definitions
      definitionProvider: true,
      typeDefinitionProvider: true,

      // Tell the client that this server supports symbol provider
      documentSymbolProvider: true,
      workspaceSymbolProvider: true,

      // Tell the client that this server supports hover support
      hoverProvider: true,



      // Tell the client that this server supports go to references
      referencesProvider: {
        workDoneProgress: true,
      },

      // Tell the client that this server supports go to implementation
      implementationProvider: {
        documentSelector: [
          { scheme: "file", language: Languages.JsonCIdentifier },
          { scheme: "file",language: Languages.JsonIdentifier },
          { scheme: "file",language: Languages.McFunctionIdentifier },
          { scheme: "file",language: Languages.McLanguageIdentifier },
          { scheme: "file",language: Languages.McMolangIdentifier },
          { scheme: "file",language: Languages.McOtherIdentifier },
          { scheme: "file",language: Languages.McProjectIdentifier },
        ],
      },

      // Tell the client that this server supports signatures
      signatureHelpProvider: {
        triggerCharacters: triggerCharacters,
        retriggerCharacters: triggerCharacters,
        workDoneProgress: true,
      },

      //Workspace settings
      workspace: {
        workspaceFolders: {
          changeNotifications: true,
          supported: true,
        },
        fileOperations: {
          didCreate: { filters: [{ scheme: "file", pattern: { glob: "**​/*.{mcfunction,json}" } }] },
          didDelete: { filters: [{ scheme: "file", pattern: { glob: "**​/*.{mcfunction,json}" } }] },
          didRename: { filters: [{ scheme: "file", pattern: { glob: "**​/*.{mcfunction,json}" } }] },
        },
      },
    },
  };

  return result;
}


function toArray(value: string): string[] {
  const out : string[] = [];

  for (let i = 0; i < value.length; i++) {
    out.push(value[i]);
  }

  return out;
}
