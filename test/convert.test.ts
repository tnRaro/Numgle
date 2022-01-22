import { assertEquals } from "https://Deno.land/std/testing/asserts.ts";
import { convert } from "../src/convertor.ts";

Deno.test("LetterType.Empty", () => {
  assertEquals(convert("  "), `\n`);
  assertEquals(convert("\n\n"), `\n`);
  assertEquals(convert("라\r\n로"), `「뉘\n\n\nㅏru`);
});
Deno.test("LetterType.CompleteHangul", () => {
  assertEquals(convert("라로"), `「뉘\nㅏru`);
  assertEquals(convert("하이"), `위-\n으`);
});
Deno.test("LetterType.NotCompleteHangul", () => {
  assertEquals(convert("ㄱㅣ"), `J\nㅡ`);
  assertEquals(convert("ㅁㄴㅇㄹ"), `ㅁ\nr\nㅇ\nru`);
  assertEquals(convert("ㅋㅋㅋ"), `ㅚ\nㅚ\nㅚ`);
});
Deno.test("LetterType.English", () => {
  assertEquals(convert("AZ"), `ᗆ\nN`);
})
Deno.test("LetterType.Number", () => {
  assertEquals(convert("09"), `o\n__0`);
})
Deno.test("LetterType.SpecialLetter", () => {
  assertEquals(convert("?!.^-"), `·-J\n·ㅡ\n.\n>\nㅣ`);
})