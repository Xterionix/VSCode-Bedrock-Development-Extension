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
import { Location, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { JsonDocument } from '../../../json/Json Document';
import { Database } from '../../Database';
import { Entity } from '../../types/include';

interface EntityDetect {
	format_version: string;
	'minecraft:entity': {
		description: {
			identifier: string;
			is_spawnable: boolean;
			is_summonable: boolean;
			is_experimental: boolean;
		};
		component_groups: any;
		components: any;
		events: any;
	}
}

export function Process(doc: TextDocument): void {
	let JDoc = new JsonDocument(doc);
	let Format = JDoc.CastTo<EntityDetect>();

	if (Format == undefined || Format == null) { return; }
	let mce = Format['minecraft:entity'];

	if (mce == undefined || mce == null) { return; }

	let entity = new Entity();

	if (!mce.description) { return;}

	let ID = mce.description.identifier;

	entity.Identifier = ID;
	entity.Documentation = { kind: 'markdown', value: 'The custom entity definition of: ' + ID };
	entity.Location = Location.create(doc.uri, Range.create(0, 0, 0, 0));

	if (mce.events) {
		let EventsNames = Object.getOwnPropertyNames(mce.events);
		entity.Events = EventsNames;
	}

	let Data = Database.Get(doc.uri);
	Data.Entities = [entity];
}