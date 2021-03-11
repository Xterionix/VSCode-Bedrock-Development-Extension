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
import { ValidationData } from "../../../validation/include";
import {
  Block,
  Boolean,
  Coordinate,
  Effect,
  Entity,
  Float,
  Functions,
  Gamemode,
  Integer,
  Item,
  Keyword,
  Objectives,
  Selector,
  Slot_id,
  Slot_type,
  Sound,
  String,
  Tag,
  Xp,
} from "../../general/include";
import { MCCommandParameter, MCCommandParameterType } from "./include";
import { CommandIntr } from "../interpertation/include";
import { DiagnosticsBuilder } from "../../../diagnostics/Builder";
import { LocationWord } from "bc-vscode-words";
import { command } from "../include";
import { particle } from "../../minecraft/resource/include";
import { Operation } from "../modes/include";

/**Diagnoses the single parameter
 * @param pattern
 * @param data
 * @param validation
 * @param builder
 */
export function DiagnoseParameter(pattern: MCCommandParameter, data: LocationWord, validation: ValidationData, builder: DiagnosticsBuilder, Command: CommandIntr): void {
  if (pattern === undefined || data === undefined) return;

  if (pattern.Options) {
    //If wildcard is allowed and the text is an wildcard, then skip diagnose
    if (pattern.Options.wildcard && pattern.Options.wildcard === true) {
      if (data.text === "*") return;
    }

    //If accepted values is filled in and the text is a match, then skip diagnose
    if (pattern.Options.acceptedValues) {
      if (pattern.Options.acceptedValues.includes(data.text)) {
        return;
      }
    }
  }

  switch (pattern.Type) {
    case MCCommandParameterType.block:
      return Block.ProvideDiagnose(data, builder);

    case MCCommandParameterType.boolean:
      return Boolean.ProvideDiagnose(data, builder);

    case MCCommandParameterType.command:
      return command.DiagnoseCommandParameter(data, builder);

    case MCCommandParameterType.coordinate:
      return Coordinate.ProvideDiagnose(data, builder);

    case MCCommandParameterType.effect:
      return Effect.ProvideDiagnose(data, builder);

    case MCCommandParameterType.entity:
      return Entity.ProvideDiagnose(data, builder);

    case MCCommandParameterType.event:
      return; //TODO

    case MCCommandParameterType.float:
      return Float.ProvideDiagnose(data, builder);

    case MCCommandParameterType.function:
      return Functions.ProvideDiagnose(data, builder);

    case MCCommandParameterType.gamemode:
      return Gamemode.ProvideDiagnose(data, builder);

    case MCCommandParameterType.integer:
      return Integer.ProvideDiagnose(data, builder);

    case MCCommandParameterType.item:
      return Item.ProvideDiagnose(data, builder);

    case MCCommandParameterType.jsonItem:
    case MCCommandParameterType.jsonRawText:
      //TODO
      return;

    case MCCommandParameterType.keyword:
      return Keyword.ProvideDiagnose(pattern, data, builder);

    case MCCommandParameterType.locateFeature:
      //TODO
      return;

    case MCCommandParameterType.objective:
      return Objectives.ProvideDiagnose(data, validation, builder);

    case MCCommandParameterType.operation:
      return Operation.ProvideDiagnose(data, Command, builder);

    case MCCommandParameterType.particle:
      return particle.ProvideDiagnose(data, builder);

    case MCCommandParameterType.replaceMode:
      //TODO
      return;

    case MCCommandParameterType.selector:
      return Selector.ProvideDiagnose(pattern, data, builder, validation);

    case MCCommandParameterType.slotID:
      return Slot_id.ProvideDiagnose(data, Command, builder);

    case MCCommandParameterType.slotType:
      return Slot_type.ProvideDiagnose(data, builder);

    case MCCommandParameterType.sound:
      return Sound.ProvideDiagnose(data, builder);

    case MCCommandParameterType.string:
      return String.ProvideDiagnose(data, builder);

    case MCCommandParameterType.tag:
      return Tag.ProvideDiagnose(data, validation, builder);

    case MCCommandParameterType.target:
      //TODO
      return;

    case MCCommandParameterType.tickingarea:
      return Block.ProvideDiagnose(data, builder);

    case MCCommandParameterType.unknown:
      //TODO
      return;

    case MCCommandParameterType.xp:
      Xp.ProvideDiagnose(data, builder);
      return;
  }
}
