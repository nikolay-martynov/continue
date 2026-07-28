import { Tool, ToolCallState } from "core";
import Mustache from "mustache";
import { getStatusIntro } from "./utils";
import { FilePathActions } from "./FilePathActions";

interface ToolCallStatusMessageProps {
  tool: Tool | undefined;
  toolCallState: ToolCallState;
}

// Truncate long string values in parsedArgs so no single field dominates
// the status line and all fields remain visible within the line clamp.
const MAX_ARG_PREVIEW_LENGTH = 80;

function truncateArgsForDisplay(
  args: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!args) return args;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(args)) {
    if (typeof value === "string" && value.length > MAX_ARG_PREVIEW_LENGTH) {
      result[key] = value.slice(0, MAX_ARG_PREVIEW_LENGTH) + "\u2026";
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function ToolCallStatusMessage({
  tool,
  toolCallState,
}: ToolCallStatusMessageProps) {
  if (!tool) return "Agent tool use";

  const toolName = tool.displayTitle ?? tool.function.name;
  const defaultToolDescription = `${toolName} tool`;

  // Truncate long field values so all template fields are visible in the
  // status line, not just the first long one.
  const displayArgs = truncateArgsForDisplay(toolCallState.parsedArgs);

  const futureMessage: string = tool.wouldLikeTo
    ? Mustache.render(tool.wouldLikeTo, displayArgs)
    : `use the ${defaultToolDescription}`;
  // TODO go back and replace arg string values and tool names with <code> tags
  // to make them more readable

  let intro = getStatusIntro(toolCallState.status, tool.isInstant);
  let message = "";

  // Handle the special case for "done" status or instant tools that are calling
  if (
    toolCallState.status === "done" ||
    (tool.isInstant && toolCallState.status === "calling")
  ) {
    message = tool.hasAlready
      ? Mustache.render(tool.hasAlready, displayArgs)
      : `used the ${defaultToolDescription}`;
  } else {
    switch (toolCallState.status) {
      case "generating":
      case "generated":
      case "canceled":
      case "errored":
        message = futureMessage;
        break;
      case "calling":
        message = tool.isCurrently
          ? Mustache.render(tool.isCurrently, displayArgs)
          : `calling the ${defaultToolDescription}`;
        break;
      default:
        message = defaultToolDescription;
    }
  }

  // Extract file path if filePathArg is configured and the arg is present
  const filePath =
    tool.filePathArg && toolCallState.parsedArgs?.[tool.filePathArg]
      ? String(toolCallState.parsedArgs[tool.filePathArg])
      : undefined;

  return (
    <div
      className="text-description flex min-w-0 flex-row items-center gap-1"
      data-testid="tool-call-title"
    >
      <div className="line-clamp-4 min-w-0 break-words">
        {`Continue ${intro} ${message}`}
      </div>
      {filePath && <FilePathActions filePath={filePath} />}
    </div>
  );
}
