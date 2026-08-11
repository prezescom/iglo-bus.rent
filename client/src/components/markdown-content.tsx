import { Fragment, ReactNode } from "react";
import { Link } from "wouter";

// Lekki, dedykowany renderer treści wpisów bloga (bez zewnętrznej biblioteki
// markdown) — obsługuje format generowany przez SORO: nagłówki ## / ###,
// akapity, listy punktowane (- ) oraz w liniach: **pogrubienie** i [tekst](url).
// Wystarcza do treści blogowych, nie jest to pełny parser Markdown.

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={`${keyPrefix}-t-${i}`}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b-${i}`}>{match[1]}</strong>);
    } else {
      const linkText = match[2];
      const href = match[3];
      const internalPath = href.replace(/^https?:\/\/(www\.)?iglo-bus\.rent/, "");
      const isInternal = internalPath.startsWith("/");
      nodes.push(
        isInternal ? (
          <Link key={`${keyPrefix}-a-${i}`} href={internalPath}>
            {linkText}
          </Link>
        ) : (
          <a key={`${keyPrefix}-a-${i}`} href={href} target="_blank" rel="noopener noreferrer">
            {linkText}
          </a>
        )
      );
    }
    lastIndex = regex.lastIndex;
    i++;
  }
  if (lastIndex < text.length) {
    nodes.push(<Fragment key={`${keyPrefix}-t-${i}`}>{text.slice(lastIndex)}</Fragment>);
  }
  return nodes;
}

export default function MarkdownContent({ markdown }: { markdown: string }) {
  const blocks = markdown
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n\s*\n/)
    .filter((b) => b.trim() !== "");

  return (
    <div className="prose prose-slate max-w-none prose-headings:text-brand-dark prose-a:text-brand-blue prose-a:font-medium prose-strong:text-brand-dark">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);

        if (lines.every((l) => /^[-*]\s+/.test(l))) {
          return (
            <ul key={idx}>
              {lines.map((l, i2) => (
                <li key={i2}>{renderInline(l.replace(/^[-*]\s+/, ""), `${idx}-${i2}`)}</li>
              ))}
            </ul>
          );
        }
        if (/^###\s+/.test(trimmed)) {
          return <h3 key={idx}>{renderInline(trimmed.replace(/^###\s+/, ""), `${idx}`)}</h3>;
        }
        if (/^##\s+/.test(trimmed)) {
          return <h2 key={idx}>{renderInline(trimmed.replace(/^##\s+/, ""), `${idx}`)}</h2>;
        }
        return <p key={idx}>{renderInline(lines.join(" "), `${idx}`)}</p>;
      })}
    </div>
  );
}
