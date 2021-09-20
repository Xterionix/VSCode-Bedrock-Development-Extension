import { Character } from "../../Code/include";

const MolangRegexp = /(([Qq]uery|[Mm]ath|[Vv]ariable|[Tt]exture|[tT]emp|[Gg]eometry|[Mm]aterial|[Aa]rray|\bc|\bq|\bv|\bt)\.[A-Za-z_]+|->|\bthis\b)/;
const MolangCommandRegexp = /^\/[a-z]+ /;

/**
 *
 * @param text
 * @returns
 */
export function IsMolang(text: string): boolean {
  if (text.startsWith("@s")) return true;

  if (text.startsWith("/")) {
    if (MolangCommandRegexp.test(text)) return true;

    return false;
  }

  //general test
  return MolangRegexp.test(text);
}

/**
 *
 * @param text The text to retrieve the word from
 * @param cursor The cursor offset in the text
 * @returns
 */
export function GetPreviousWord(text: string, cursor: number): string {
  let endIndex = cursor;

  if (text.charAt(endIndex - 1) === ".") endIndex = cursor - 1;

  let Index;
  for (Index = endIndex - 1; Index > -1; Index--) {
    const c = text.charAt(Index);

    if (Character.IsLetter(c) || Character.IsNumber(c) || c === "_") continue;

    break;
  }

  return text.substring(Index + 1, endIndex);
}