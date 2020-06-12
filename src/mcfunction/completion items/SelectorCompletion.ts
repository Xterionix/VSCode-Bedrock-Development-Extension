/*BSD 3-Clause License

Copyright (c) 2020, Blockception Ltd
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/

import * as vscode from "vscode";
import * as SF from "../selectors/functions"
import * as Functions from "../../general/include";
import { mcfunctionDatabase } from "../Database";

export class SelectorCompletionProvider implements vscode.CompletionItemProvider {

    public default: vscode.CompletionList;
    public letters: vscode.CompletionList;
    public firstitems: vscode.CompletionList;
    public items: vscode.CompletionList;
  
    constructor() {
      this.default = new vscode.CompletionList([
        Functions.createCompletionItem("@a", "All players", "Returns a selector that selects all players"),
        Functions.createCompletionItem("@e", "All entities", "Returns a selector that selects all entities"),
        Functions.createCompletionItem("@s", "Executing entity", "Returns a selector that selects the current executing entity"),
        Functions.createCompletionItem("@r", "Random player/entity", "Returns a selector that a random player, if type is specified then entities are included, use c to target more entities"),
        Functions.createCompletionItem("@p", "Nearest player", "Returns a selector that selects the nearest player from the execution location"),
        Functions.createCompletionItem("\"<entity name>\"", "all players", "Returns a example for an named entity")
      ]);
  
      this.letters = new vscode.CompletionList([
        Functions.createCompletionItem("a", "All players", "Returns a selector that selects all players"),
        Functions.createCompletionItem("e", "All entities", "Returns a selector that selects all entities"),
        Functions.createCompletionItem("s", "Executing entity", "Returns a selector that selects the current executing entity"),
        Functions.createCompletionItem("r", "Random player/entity", "Returns a selector that a random player, if type is specified then entities are included, use c to target more entities"),
        Functions.createCompletionItem("p", "Nearest player", "Returns a selector that selects the nearest player from the execution location")
      ]);
  
      this.items = new vscode.CompletionList([
        Functions.createCompletionItem(",tag=", "tag", "A tag test"),
        Functions.createCompletionItem(",x=", "x", "An X Coordinate test"),
        Functions.createCompletionItem(",y=", "y", "An Y Coordinate test"),
        Functions.createCompletionItem(",z=", "z", "An Z Coordinate test"),
        Functions.createCompletionItem(",dx=", "dx", "The length over X of the box to test"),
        Functions.createCompletionItem(",dy=", "dy", "The length over Y of the box to test"),
        Functions.createCompletionItem(",dz=", "dz", "The length over Z of the box to test"),
        Functions.createCompletionItem(",scores={<name>=}", "scores", "The scores to test, can only be one"),
        Functions.createCompletionItem(",type=", "type", "The type of entity to find"),
        Functions.createCompletionItem(",c=", "c", "The amount of entities to limit to, negative numbers result in the entites at the end of the list"),
        Functions.createCompletionItem(",m=", "m", "The gamemode test"),
        Functions.createCompletionItem(",r=", "r", "The minimum radius test, number included"),
        Functions.createCompletionItem(",rm=", "rm", "The maximumm radius test, number included"),
        Functions.createCompletionItem(",team=", "team", "The team test"),
        Functions.createCompletionItem(",l=", "l", "The minimum xp level test, number included"),
        Functions.createCompletionItem(",lm=", "lm", "The maximum xp level test, number included"),
        Functions.createCompletionItem(",name=", "name", "The name of the entity, be be specified between quotes"),
        Functions.createCompletionItem(",rx=", "rx", "The minimum rotation of the X axis, or up and down, number included"),
        Functions.createCompletionItem(",rxm=", "rxm", "The maximum rotation of the X axis, or up and down, number included"),
        Functions.createCompletionItem(",ry=", "ry", "The minimum rotation of the Y axis, or left and right, number included"),
        Functions.createCompletionItem(",rym=", "rym", "The maximum rotation of the Y axis, or left and right, number included"),
      ]);
  
      this.firstitems = new vscode.CompletionList([
        Functions.createCompletionItem("tag=", "tag", "A tag test"),
        Functions.createCompletionItem("x=", "x", "An X Coordinate test"),
        Functions.createCompletionItem("y=", "y", "An Y Coordinate test"),
        Functions.createCompletionItem("z=", "z", "An Z Coordinate test"),
        Functions.createCompletionItem("dx=", "dx", "The length over X of the box to test"),
        Functions.createCompletionItem("dy=", "dy", "The length over Y of the box to test"),
        Functions.createCompletionItem("dz=", "dz", "The length over Z of the box to test"),
        Functions.createCompletionItem("scores={<name>=}", "scores", "The scores to test, can only be one"),
        Functions.createCompletionItem("type=", "type", "The type of entity to find"),
        Functions.createCompletionItem("c=", "c", "The amount of entities to limit to, negative numbers result in the entites at the end of the list"),
        Functions.createCompletionItem("m=", "m", "The gamemode test"),
        Functions.createCompletionItem("r=", "r", "The minimum radius test, number included"),
        Functions.createCompletionItem("rm=", "rm", "The maximumm radius test, number included"),
        Functions.createCompletionItem("team=", "team", "The team test"),
        Functions.createCompletionItem("l=", "l", "The minimum xp level test, number included"),
        Functions.createCompletionItem("lm=", "lm", "The maximum xp level test, number included"),
        Functions.createCompletionItem("name=", "name", "The name of the entity, be be specified between quotes"),
        Functions.createCompletionItem("rx=", "rx", "The minimum rotation of the X axis, or up and down, number included"),
        Functions.createCompletionItem("rxm=", "rxm", "The maximum rotation of the X axis, or up and down, number included"),
        Functions.createCompletionItem("ry=", "ry", "The minimum rotation of the Y axis, or left and right, number included"),
        Functions.createCompletionItem("rym=", "rym", "The maximum rotation of the Y axis, or left and right, number included"),
      ]);
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        var Collector = new vscode.CompletionList();

        if (!SF.IsInSelector(document, position))
            return this.default;

        var InScore = SF.InScoreSection(document, position);

        if (InScore){
            return this.InofScore(document, position, context);
        }

        return this.OutofScore(document, position);
    }

    private OutofScore(document: vscode.TextDocument, position: vscode.Position) : vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        var Line = document.lineAt(position.line);
        var PreviousChar = Line.text.charAt(position.character  -1);

        switch (PreviousChar){
            case "{":

            case ",":
            case "[":
                return this.firstitems;

            case "@":
                return this.letters;

            case "=":
                var P = SF.GetParameterName(document, position);
                return this.SolveParameter(document, position, P);
        }

        PreviousChar = Line.text.charAt(position.character - 2);

        if (PreviousChar == "@") {
            var Out = new vscode.CompletionList();
            Out.items.push(Functions.createCompletionItem("[]", "[", "start the selector"));
            return Out;
        }

        return;
    }

    private InofScore(document: vscode.TextDocument, position: vscode.Position, context: vscode.CompletionContext) : vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        if (context.triggerCharacter == "{" || context.triggerCharacter == ",") {
            var Out = new vscode.CompletionList();
            
            mcfunctionDatabase.Scores.forEach(document => {
                document.Values.forEach(symbol => {
                    Out.items.push(new vscode.CompletionItem(symbol.name, vscode.CompletionItemKind.Variable));
                });
            });

            return Out;
        }

        return;
    }

    private SolveParameter(document: vscode.TextDocument, position: vscode.Position, parameter : string)  : vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        var Out = new vscode.CompletionList();
        var Data : Functions.DocumentDataCollection<vscode.SymbolInformation> | undefined;
        var Kind  = vscode.CompletionItemKind.Variable;

        switch(parameter) {
            case "tag":
                Data = mcfunctionDatabase.Tags;
                break;
            case "scores": 
                Out.items.push(new vscode.CompletionItem("{", vscode.CompletionItemKind.Snippet))

                return Out;
            case "type": 
                Data = mcfunctionDatabase.Entities;
                break;
        }

        if (Data != undefined){
            Data.forEach(document => {
                document.Values.forEach(symbol => {
                    Out.items.push(new vscode.CompletionItem(symbol.name, Kind));
                });
            });
        }

        return Out;
    }
}