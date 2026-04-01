import { ParticipantBalance, SettlementTransfer } from "@/lib/types/expense";
import { formatAmount, formatSignedAmount } from "@/lib/utils/format";

type ExportSettlementPdfOptions = {
  balances: ParticipantBalance[];
  headline: string;
  share: number;
  splitCount: number;
  settlements: SettlementTransfer[];
  total: number;
};

// A4 portrait page size in PDF points.
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
// Outer page padding around the bordered layout frame.
const PAGE_MARGIN = 40;
// Usable content width inside the page margins.
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
const BORDER_COLOR: RgbColor = [0.07, 0.07, 0.07];
const MUTED_COLOR: RgbColor = [0.38, 0.35, 0.3];
const LIGHT_BORDER: RgbColor = [0.9, 0.9, 0.9];
// Bottom offset for the bordered frame.
const FRAME_Y = 56;
// Total height of the bordered frame on each page.
const FRAME_HEIGHT = 700;
// Height of the top stats section inside the frame.
const HERO_HEIGHT = 110;
// Height of the footer strip inside the frame.
const FOOTER_HEIGHT = 36;
// Per-row height for the settlement transfer list.
const SETTLEMENT_ROW_HEIGHT = 36;
// Per-row height for the balances table.
const BALANCE_ROW_HEIGHT = 28;
// Reserved vertical space for the settlement section title and headline.
const SETTLEMENT_HEADER_OFFSET = 74;
// Reserved vertical space for the balances section title and column labels.
const BALANCE_HEADER_OFFSET = 52;

type RgbColor = [number, number, number];

function sanitizePdfText(value: string) {
  return value.replace(/[^\x20-\x7E]/g, "");
}

function escapePdfText(value: string) {
  return sanitizePdfText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function toPdfNumber(value: number) {
  return Number(value.toFixed(2)).toString();
}

function pdfText(
  x: number,
  y: number,
  text: string,
  options?: {
    size?: number;
    font?: "F1" | "F2";
    color?: RgbColor;
  },
) {
  const size = options?.size ?? 11;
  const font = options?.font ?? "F1";
  const color = options?.color ?? [0.11, 0.12, 0.16];

  return [
    "BT",
    `/${font} ${size} Tf`,
    `${toPdfNumber(color[0])} ${toPdfNumber(color[1])} ${toPdfNumber(color[2])} rg`,
    `1 0 0 1 ${toPdfNumber(x)} ${toPdfNumber(y)} Tm`,
    `(${escapePdfText(text)}) Tj`,
    "ET",
  ].join("\n");
}

function pdfRect(
  x: number,
  y: number,
  width: number,
  height: number,
  options?: {
    fill?: RgbColor;
    stroke?: RgbColor;
    lineWidth?: number;
  },
) {
  const commands: string[] = [];

  if (options?.lineWidth) {
    commands.push(`${toPdfNumber(options.lineWidth)} w`);
  }

  if (options?.fill) {
    commands.push(
      `${toPdfNumber(options.fill[0])} ${toPdfNumber(options.fill[1])} ${toPdfNumber(options.fill[2])} rg`,
    );
  }

  if (options?.stroke) {
    commands.push(
      `${toPdfNumber(options.stroke[0])} ${toPdfNumber(options.stroke[1])} ${toPdfNumber(options.stroke[2])} RG`,
    );
  }

  commands.push(
    `${toPdfNumber(x)} ${toPdfNumber(y)} ${toPdfNumber(width)} ${toPdfNumber(height)} re`,
  );

  if (options?.fill && options?.stroke) {
    commands.push("B");
  } else if (options?.fill) {
    commands.push("f");
  } else if (options?.stroke) {
    commands.push("S");
  }

  return commands.join("\n");
}

function pdfLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options?: {
    stroke?: RgbColor;
    lineWidth?: number;
  },
) {
  const stroke = options?.stroke ?? BORDER_COLOR;
  const lineWidth = options?.lineWidth ?? 1;

  return [
    `${toPdfNumber(lineWidth)} w`,
    `${toPdfNumber(stroke[0])} ${toPdfNumber(stroke[1])} ${toPdfNumber(stroke[2])} RG`,
    `${toPdfNumber(x1)} ${toPdfNumber(y1)} m`,
    `${toPdfNumber(x2)} ${toPdfNumber(y2)} l`,
    "S",
  ].join("\n");
}

function truncateText(value: string, maxLength: number) {
  const normalized = sanitizePdfText(value).trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  if (maxLength <= 3) {
    return normalized.slice(0, maxLength);
  }

  return `${normalized.slice(0, maxLength - 3)}...`;
}

function drawWrappedText(
  commands: string[],
  x: number,
  topY: number,
  text: string,
  maxChars: number,
  options?: {
    size?: number;
    font?: "F1" | "F2";
    color?: RgbColor;
    lineHeight?: number;
    maxLines?: number;
  },
) {
  const size = options?.size ?? 11;
  const lineHeight = options?.lineHeight ?? size + 4;
  const maxLines = options?.maxLines ?? 2;
  const words = sanitizePdfText(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxChars) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      lines.push(truncateText(word, maxChars));
      currentLine = "";
    }

    if (lines.length === maxLines) {
      break;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  if (words.length > 0 && lines.length === maxLines) {
    const consumed = lines.join(" ").length;
    if (sanitizePdfText(text).trim().length > consumed) {
      lines[maxLines - 1] = truncateText(lines[maxLines - 1], maxChars);
    }
  }

  lines.forEach((line, index) => {
    commands.push(
      pdfText(x, topY - size - index * lineHeight, line, {
        size,
        font: options?.font,
        color: options?.color,
      }),
    );
  });

  return lines.length * lineHeight;
}

function drawMonoLabel(commands: string[], x: number, y: number, text: string) {
  commands.push(
    pdfText(x, y, text.toUpperCase(), {
      size: 9,
      font: "F2",
      color: MUTED_COLOR,
    }),
  );
}

function drawSummaryStrip(
  commands: string[],
  x: number,
  y: number,
  width: number,
  height: number,
  items: Array<{ label: string; value: string; detail: string }>,
) {
  const columnWidth = width / items.length;

  items.forEach((item, index) => {
    const columnX = x + columnWidth * index;

    if (index > 0) {
      commands.push(
        pdfLine(columnX, y, columnX, y + height, { stroke: LIGHT_BORDER }),
      );
    }

    drawMonoLabel(commands, columnX + 14, y + height - 20, item.label);
    commands.push(
      pdfText(columnX + 14, y + height - 50, item.value, {
        size: 18,
        font: "F2",
        color: BORDER_COLOR,
      }),
    );
    commands.push(
      pdfText(columnX + 14, y + 14, item.detail, {
        size: 9,
        color: MUTED_COLOR,
      }),
    );
  });
}

function drawSectionHeader(
  commands: string[],
  x: number,
  yTop: number,
  width: number,
  label: string,
) {
  const headerHeight = 30;

  commands.push(
    pdfLine(x, yTop - headerHeight, x + width, yTop - headerHeight, {
      stroke: LIGHT_BORDER,
    }),
  );
  drawMonoLabel(commands, x + 14, yTop - 19, label);
}

function drawSettlementRows(
  commands: string[],
  x: number,
  yTop: number,
  width: number,
  settlements: SettlementTransfer[],
  startIndex = 0,
) {
  const rowTop = yTop - 30;

  if (settlements.length === 0) {
    commands.push(
      pdfText(x + 14, rowTop - 20, "Everyone is already balanced.", {
        size: 11,
        color: MUTED_COLOR,
      }),
    );
    return;
  }

  settlements.forEach((settlement, index) => {
    const top = rowTop - SETTLEMENT_ROW_HEIGHT * index;
    const bottom = top - SETTLEMENT_ROW_HEIGHT;

    if (index > 0) {
      commands.push(pdfLine(x, top, x + width, top, { stroke: LIGHT_BORDER }));
    }

    drawMonoLabel(
      commands,
      x + 14,
      top - 14,
      `Payment ${startIndex + index + 1}`,
    );
    commands.push(
      pdfText(
        x + 14,
        bottom + 10,
        `${truncateText(settlement.fromName, 14)} -> ${truncateText(settlement.toName, 14)}`,
        { size: 11, font: "F2", color: BORDER_COLOR },
      ),
    );
    commands.push(
      pdfText(x + width - 64, bottom + 10, formatAmount(settlement.amount), {
        size: 11,
        font: "F2",
        color: BORDER_COLOR,
      }),
    );
  });
}

function drawBalanceRows(
  commands: string[],
  x: number,
  yTop: number,
  width: number,
  balances: ParticipantBalance[],
) {
  const rowTop = yTop - 30;

  balances.forEach((participant, index) => {
    const top = rowTop - BALANCE_ROW_HEIGHT * index;
    const bottom = top - BALANCE_ROW_HEIGHT;

    if (index > 0) {
      commands.push(pdfLine(x, top, x + width, top, { stroke: LIGHT_BORDER }));
    }

    const name = participant.included
      ? participant.name
      : `${participant.name}*`;
    commands.push(
      pdfText(x + 14, bottom + 8, truncateText(name, 22), {
        size: 11,
        font: "F2",
      }),
    );
    commands.push(
      pdfText(
        x + width - 132,
        bottom + 8,
        truncateText(formatAmount(participant.paid), 8),
        { size: 10 },
      ),
    );
    commands.push(
      pdfText(
        x + width - 82,
        bottom + 8,
        truncateText(formatAmount(participant.share), 8),
        { size: 10 },
      ),
    );
    commands.push(
      pdfText(
        x + width - 42,
        bottom + 8,
        truncateText(formatSignedAmount(participant.balance), 8),
        {
          size: 10,
          color:
            participant.balance > 0
              ? [0.07, 0.49, 0.4]
              : participant.balance < 0
                ? [0.72, 0.29, 0.23]
                : BORDER_COLOR,
        },
      ),
    );
  });

  if (balances.length === 0) {
    commands.push(
      pdfText(x + 14, rowTop - 20, "No participant balances yet.", {
        size: 11,
        color: MUTED_COLOR,
      }),
    );
  }
}

function getFrameMetrics() {
  const frameX = PAGE_MARGIN;
  const frameY = FRAME_Y;
  const frameWidth = CONTENT_WIDTH;
  const frameTop = frameY + FRAME_HEIGHT;
  const heroBottom = frameTop - HERO_HEIGHT;
  const gridBottom = frameY + FOOTER_HEIGHT;
  const gridTop = heroBottom;
  const gridHeight = gridTop - gridBottom;
  const leftColWidth = 292;
  const rightColWidth = frameWidth - leftColWidth;

  return {
    frameX,
    frameY,
    frameWidth,
    frameTop,
    heroBottom,
    gridBottom,
    gridTop,
    gridHeight,
    leftColWidth,
    rightColWidth,
  };
}

function getSettlementCapacity(gridHeight: number, includeHeadline: boolean) {
  const reserved = includeHeadline ? SETTLEMENT_HEADER_OFFSET : 46;
  return Math.max(
    1,
    Math.floor((gridHeight - reserved) / SETTLEMENT_ROW_HEIGHT),
  );
}

function getBalanceCapacity(gridHeight: number) {
  return Math.max(
    1,
    Math.floor((gridHeight - BALANCE_HEADER_OFFSET) / BALANCE_ROW_HEIGHT),
  );
}

function buildPdfContentStreams({
  balances,
  headline,
  share,
  splitCount,
  settlements,
  total,
}: ExportSettlementPdfOptions) {
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const {
    frameX,
    frameY,
    frameWidth,
    frameTop,
    heroBottom,
    gridBottom,
    gridTop,
    gridHeight,
    leftColWidth,
    rightColWidth,
  } = getFrameMetrics();
  const firstSettlementCapacity = getSettlementCapacity(gridHeight, true);
  const nextSettlementCapacity = getSettlementCapacity(gridHeight, false);
  const balanceCapacity = getBalanceCapacity(gridHeight);
  const totalPages = Math.max(
    1,
    Math.ceil(
      Math.max(settlements.length - firstSettlementCapacity, 0) /
        nextSettlementCapacity,
    ) + 1,
    Math.ceil(balances.length / balanceCapacity),
  );
  const streams: string[] = [];

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    const commands: string[] = [];
    const isFirstPage = pageIndex === 0;
    const settlementStart = isFirstPage
      ? 0
      : firstSettlementCapacity + (pageIndex - 1) * nextSettlementCapacity;
    const settlementCount = isFirstPage
      ? firstSettlementCapacity
      : nextSettlementCapacity;
    const settlementSlice = settlements.slice(
      settlementStart,
      settlementStart + settlementCount,
    );
    const balanceStart = pageIndex * balanceCapacity;
    const balanceSlice = balances.slice(
      balanceStart,
      balanceStart + balanceCapacity,
    );

    commands.push(
      pdfRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, { fill: [0.98, 0.98, 0.98] }),
    );
    commands.push(
      pdfRect(frameX, frameY, frameWidth, FRAME_HEIGHT, {
        stroke: LIGHT_BORDER,
        lineWidth: 1,
      }),
    );
    commands.push(
      pdfLine(frameX, heroBottom, frameX + frameWidth, heroBottom, {
        stroke: LIGHT_BORDER,
      }),
    );
    commands.push(
      pdfLine(frameX, gridBottom, frameX + frameWidth, gridBottom, {
        stroke: LIGHT_BORDER,
      }),
    );
    commands.push(
      pdfLine(
        frameX + leftColWidth,
        gridBottom,
        frameX + leftColWidth,
        gridTop,
        { stroke: LIGHT_BORDER },
      ),
    );

    commands.push(
      pdfText(frameX, frameTop + 20, "SplitTogether", {
        size: 26,
        font: "F2",
        color: BORDER_COLOR,
      }),
    );
    commands.push(
      pdfText(frameX + frameWidth - 96, frameTop + 20, generatedDate, {
        size: 10,
        color: MUTED_COLOR,
      }),
    );

    drawSectionHeader(commands, frameX, frameTop, frameWidth, "Result.preview");
    drawSummaryStrip(
      commands,
      frameX,
      heroBottom,
      frameWidth,
      HERO_HEIGHT - 30,
      [
        { label: "Total", value: formatAmount(total), detail: "All payments" },
        { label: "People", value: String(splitCount), detail: "In this split" },
        { label: "Share", value: formatAmount(share), detail: "Per person" },
      ],
    );

    drawSectionHeader(
      commands,
      frameX,
      gridTop,
      leftColWidth,
      "Who Should Pay Whom",
    );
    if (isFirstPage) {
      drawWrappedText(commands, frameX + 14, gridTop - 34, headline, 36, {
        size: 9,
        color: MUTED_COLOR,
        lineHeight: 11,
        maxLines: 2,
      });
      drawSettlementRows(
        commands,
        frameX,
        gridTop - 44,
        leftColWidth,
        settlementSlice,
        settlementStart,
      );
    } else {
      commands.push(
        pdfText(
          frameX + 14,
          gridTop - 46,
          `Continued on page ${pageIndex + 1}`,
          { size: 9, color: MUTED_COLOR },
        ),
      );
      drawSettlementRows(
        commands,
        frameX,
        gridTop - 56,
        leftColWidth,
        settlementSlice,
        settlementStart,
      );
    }

    drawSectionHeader(
      commands,
      frameX + leftColWidth,
      gridTop,
      rightColWidth,
      "Balances",
    );
    commands.push(
      pdfText(frameX + leftColWidth + 14, gridTop - 46, "Name", {
        size: 9,
        font: "F2",
        color: MUTED_COLOR,
      }),
    );
    commands.push(
      pdfText(frameX + frameWidth - 132, gridTop - 46, "Paid", {
        size: 9,
        font: "F2",
        color: MUTED_COLOR,
      }),
    );
    commands.push(
      pdfText(frameX + frameWidth - 82, gridTop - 46, "Share", {
        size: 9,
        font: "F2",
        color: MUTED_COLOR,
      }),
    );
    commands.push(
      pdfText(frameX + frameWidth - 44, gridTop - 46, "Bal", {
        size: 9,
        font: "F2",
        color: MUTED_COLOR,
      }),
    );
    drawBalanceRows(
      commands,
      frameX + leftColWidth,
      gridTop - 52,
      rightColWidth,
      balanceSlice,
    );

    drawMonoLabel(
      commands,
      frameX + 14,
      frameY + 13,
      `© 2026 SplitTogether. All rights reserved. Page ${pageIndex + 1} of ${totalPages}.`,
    );

    streams.push(commands.join("\n"));
  }

  return streams;
}

function buildPdfBytes(contentStreams: string[]) {
  const fontRegularId = 3;
  const fontBoldId = 4;
  const firstPageObjectId = 5;
  const pageObjectIds = contentStreams.map(
    (_, index) => firstPageObjectId + index * 2,
  );
  const contentObjectIds = contentStreams.map(
    (_, index) => firstPageObjectId + index * 2 + 1,
  );
  const kids = pageObjectIds.map((id) => `${id} 0 R`).join(" ");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${kids}] /Count ${contentStreams.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  ];

  contentStreams.forEach((contentStream, index) => {
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentObjectIds[index]} 0 R >>`,
    );
    objects.push(
      `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`,
    );
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

function buildFilename() {
  const date = new Date().toISOString().slice(0, 10);
  return `split-together-settlement-${date}.pdf`;
}

export function exportSettlementPdf(options: ExportSettlementPdfOptions) {
  const contentStreams = buildPdfContentStreams(options);
  const pdfBytes = buildPdfBytes(contentStreams);
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = buildFilename();
  link.rel = "noopener";
  link.style.display = "none";

  document.body.append(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1_000);

  return true;
}
