/** */
export interface TextRange {
  /** */
  start: number;

  /** */
  end: number;
}

/**
 * @param text
 * @param cursor
 * @returns
 */
export function GetCurrentElement(text: string, cursor: number): TextRange | undefined {
  let startIndex = -1;
  let inString = false;

  for (let index = cursor; index > -1; index--) {
    const c = text.charAt(index);

    if (c === '"') {
      if (text.charAt(index - 1) === "\\") {
        continue;
      }

      inString = true;
      startIndex = index + 1;
      break;
    } else if (c === "," || c === ":") {
      startIndex = index + 1;
      break;
    }
  }

  if (startIndex < 0) {
    return undefined;
  }

  let endIndex = -1;

  for (let index = startIndex; index < text.length; index++) {
    const c = text.charAt(index);

    if (c === '"') {
      if (text.charAt(index - 1) === "\\") {
        continue;
      }

      endIndex = index;
      break;
    } else if (inString == false && (c === "," || c === ":")) {
      endIndex = index;
      break;
    }
  }

  if (endIndex < 0) {
    return undefined;
  }

  return { start: startIndex, end: endIndex };
}

/**
 *
 * @param Text
 * @param cursor
 * @returns
 */
export function GetCurrentString(Text: string, cursor: number): TextRange | undefined {
  let startIndex = -1;

  for (let index = cursor - 1; index > -1; index--) {
    const c = Text.charAt(index);

    if (c === '"') {
      if (Text.charAt(index - 1) === "\\") {
        continue;
      }

      startIndex = index + 1;
      break;
    }
  }

  if (startIndex < 0) {
    return undefined;
  }

  let endIndex = -1;

  for (let index = startIndex; index < Text.length; index++) {
    const c = Text.charAt(index);

    if (c === '"') {
      if (Text.charAt(index - 1) === "\\") {
        continue;
      }

      endIndex = index;
      break;
    }
  }

  if (endIndex < 0) {
    return undefined;
  }

  return { start: startIndex, end: endIndex };
}

/**
 *
 * @param Text
 * @param cursor
 * @returns
 */
export function GetStartString(Text: string, cursor: number): number {
  for (let Index = cursor; Index > -1; Index--) {
    const c = Text.charAt(Index);

    if (c === '"') {
      if (Text.charAt(Index - 1) === "\\") {
        continue;
      }

      return Index;
    }
  }

  return -1;
}

/**
 *
 * @param Text
 * @param startIndex
 * @returns
 */
export function IsProperty(Text: string, startIndex: number): boolean {
  for (let Index = startIndex; Index > -1; Index--) {
    const c = Text.charAt(Index);

    if (c === ":") {
      return true;
    } else if (c.trim() === "") continue;
    else break;
  }

  return false;
}

