export const clip = (text: string, max = 4000) =>
  text.length <= max ? text : text.slice(0, max) + '\n…[truncated]';

export const replyMd = async (
  ctx: { reply: (t: string, o?: object) => Promise<unknown> },
  text: string,
) => {
  const content = clip(text);
  try {
    return await ctx.reply(content, { parse_mode: "Markdown" });
  } catch {
    return await ctx.reply(content);
  }
};

export function commandArg(fullText: string, name: string): string {
  return fullText.replace(new RegExp(`^/${name}\\s*`, 'i'), '').trim();
}
