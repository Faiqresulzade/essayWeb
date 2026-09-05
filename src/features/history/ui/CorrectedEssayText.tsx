const BOLD_PATTERN = /(<b>[\s\S]*?<\/b>)/g;
const BOLD_CONTENT = /^<b>([\s\S]*?)<\/b>$/;

interface CorrectedEssayTextProps {
  readonly html: string;
}

/**
 * `correctedEssay` içindəki `<b>...</b>` işarələri vurğulanmış düzəlişlərdir.
 * `dangerouslySetInnerHTML` İŞLƏDİLMİR — mətn parçalanıb təhlükəsiz render olunur.
 */
export function CorrectedEssayText({ html }: CorrectedEssayTextProps) {
  const parts = html.split(BOLD_PATTERN).filter(Boolean);

  return (
    <p className="text-[15px] leading-7 whitespace-pre-wrap">
      {parts.map((part, index) => {
        const match = BOLD_CONTENT.exec(part);
        return match ? (
          <strong key={index} className="font-bold text-[var(--color-brand)]">
            {match[1]}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </p>
  );
}
