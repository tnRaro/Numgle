import { convertedCho, convertedCj, convertedEnglish, convertedHan, convertedJong, convertedJung, convertedNumber, convertedSpecial } from "./data";

enum LetterType {
  Empty,
  CompleteHangul,
  NotCompleteHangul,
  English,
  Number,
  SpecialLetter,
  Unknown,
}
type SeperatedHan = [number, number, number];
function getLetterType(letter: string): LetterType {
  const letterCode = letter.charCodeAt(0);
  if (/\s/.test(letter)) return LetterType.Empty;
  else if (letterCode >= 44032 && letterCode <= 55203) return LetterType.CompleteHangul;
  else if (letterCode >= 12593 && letterCode <= 12643) return LetterType.NotCompleteHangul;
  else if (letterCode >= 65 && letterCode <= 90) return LetterType.English;
  else if (letterCode >= 48 && letterCode <= 57) return LetterType.Number;
  else if (/[?!.^-]/.test(letter)) return LetterType.SpecialLetter;
  else return LetterType.Unknown;
}
function isInData(cho: number, jung: number, jong: number): boolean {
  if (jong == 0 || convertedJong[jong] != "") return true;
  else if (jung >= 8 && jung != 20) return convertedJung[jung - 8] != "";
  else return convertedCj[Math.min(8, jung)][cho] != "";
}
function seperateHan(han: number): SeperatedHan {
  return [(han - 44032) / 28 / 21 | 0, (han - 44032) / 28 % 21 | 0, (han - 44032) % 28];
}
export function convert(input: string) {
  return Array.from(input, (letter) => {
    const letterType = getLetterType(letter);
    const letterCode = letter.charCodeAt(0);
    switch (letterType) {
      case LetterType.Empty: {
        return "";
      }
      case LetterType.CompleteHangul: {
        const [cho, jung, jong] = seperateHan(letterCode);
        if (!isInData(cho, jung, jong)) {
          throw new Error("변환하지 못한 글자가 포함되어 있습니다.")
        } else if (jung >= 8 && jung != 20) {
          return convertedJong[jong] + convertedJung[jung - 8] + convertedCho[cho];
        }
        return convertedJong[jong]! + convertedCj[Math.min(8, jung)][cho];
      }
      case LetterType.NotCompleteHangul: {
        return convertedHan[letterCode - 12593];
      }
      case LetterType.English: {
        return convertedEnglish[letterCode - 65];
      }
      case LetterType.Number: {
        return convertedNumber[letterCode - 48];
      }
      case LetterType.SpecialLetter: {
        return convertedSpecial["?!.^-".indexOf(letter)];
      }
    }
    throw new Error("변환하지 못한 글자가 포함되어 있습니다.");
  }).join("\n")
}