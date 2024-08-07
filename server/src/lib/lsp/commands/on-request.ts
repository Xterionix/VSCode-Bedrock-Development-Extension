import { add_all_items } from "./commands/language";
import { Commands } from "@blockception/shared";
import { Console } from "../../manager";
import { Create } from "./templates/create";
import { DiagnoseProjectCommand } from "./commands/diagnose-project";
import { ExecuteCommandParams } from "vscode-languageserver";
import { Files } from "./files";
import { HandleError } from "../../util/error";
import { ReScanProject } from "./commands/rescan";
import { StoreProject } from "./commands/store-project";
import { Workspace } from "../workspace/workspace";

/**
 *
 * @param params
 * @returns
 */
export function onCommandRequestAsync(params: ExecuteCommandParams): Promise<any> {
  return Console.request(`Command Execution [${params.command}]`, Promise.resolve(onCommandRequest(params)));
}

/**
 *
 * @param params
 * @returns
 */
function onCommandRequest(params: ExecuteCommandParams): any {
  let out = undefined;
  try {
    out = InternalCommandRequest(params);
  } catch (error) {
    HandleError(error);
  }

  return out;
}

function InternalCommandRequest(params: ExecuteCommandParams): any {
  if (params.command.startsWith(Commands.Create.Base)) {
    return Create(params);
  }

  switch (params.command) {
    case Commands.Files.Append:
      return Files.Append(params);

    case Commands.DiagnoseProject:
      return DiagnoseProjectCommand(params);

    case Commands.AddLanguageFile:
      return add_all_items(params);

    case Commands.MCProject.Create:
      return Workspace.CreateMCProject();

    case Commands.ScanProjects:
      return ReScanProject();

    case Commands.StoreProject:
      return StoreProject();
  }
}
